<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Connection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::with(['customer', 'connection', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('customer_id', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($query, $status) {
                $query->byStatus($status);
            })
            ->when($request->payment_status, function ($query, $paymentStatus) {
                $query->byPaymentStatus($paymentStatus);
            })
            ->when($request->customer_id, function ($query, $customerId) {
                $query->byCustomer($customerId);
            })
            ->when($request->start_date && $request->end_date, function ($query) use ($request) {
                $query->dateRange($request->start_date, $request->end_date);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $customers = Customer::active()->get(['id', 'customer_id', 'name']);

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'payment_status', 'customer_id', 'start_date', 'end_date']),
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        $customers = Customer::active()->get(['id', 'customer_id', 'name']);
        $connections = Connection::active()->with(['customer', 'package'])->get();

        return Inertia::render('Admin/Invoices/Create', [
            'customers' => $customers,
            'connections' => $connections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'connection_id' => 'nullable|exists:connections,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['tax_amount'] = $validated['tax_amount'] ?? 0;
        $validated['discount_amount'] = $validated['discount_amount'] ?? 0;

        // Calculate subtotal from items
        $subtotal = 0;
        foreach ($request->items as $item) {
            $subtotal += $item['quantity'] * $item['unit_price'];
        }
        $validated['subtotal'] = $subtotal;

        $invoice = Invoice::create($validated);

        // Create invoice items
        foreach ($request->items as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('admin.invoices.index')
            ->with('success', "Invoice {$invoice->invoice_number} created successfully.");
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['customer', 'connection.package', 'items', 'payments.receivedBy', 'createdBy']);

        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        // Only allow editing draft invoices
        if ($invoice->status !== 'draft') {
            return back()->with('error', 'Only draft invoices can be edited.');
        }

        $invoice->load('items');
        $customers = Customer::active()->get(['id', 'customer_id', 'name']);
        $connections = Connection::active()->with(['customer', 'package'])->get();

        return Inertia::render('Admin/Invoices/Edit', [
            'invoice' => $invoice,
            'customers' => $customers,
            'connections' => $connections,
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        // Only allow updating draft invoices
        if ($invoice->status !== 'draft') {
            return back()->with('error', 'Only draft invoices can be updated.');
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'connection_id' => 'nullable|exists:connections,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $validated['tax_amount'] = $validated['tax_amount'] ?? 0;
        $validated['discount_amount'] = $validated['discount_amount'] ?? 0;

        // Calculate subtotal from items
        $subtotal = 0;
        foreach ($request->items as $item) {
            $subtotal += $item['quantity'] * $item['unit_price'];
        }
        $validated['subtotal'] = $subtotal;

        $invoice->update($validated);

        // Delete old items and create new ones
        $invoice->items()->delete();
        foreach ($request->items as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('admin.invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        // Only allow deleting draft invoices
        if ($invoice->status !== 'draft') {
            return back()->with('error', 'Only draft invoices can be deleted.');
        }

        $invoice->delete();

        return redirect()->route('admin.invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    public function send(Invoice $invoice)
    {
        $invoice->markAsSent();

        // TODO: Send email to customer

        return back()->with('success', 'Invoice marked as sent.');
    }

    public function markAsPaid(Invoice $invoice)
    {
        $invoice->markAsPaid();

        // Create payment record
        $invoice->payments()->create([
            'customer_id' => $invoice->customer_id,
            'amount' => $invoice->balance_due,
            'payment_date' => now(),
            'payment_method' => 'cash',
            'notes' => 'Marked as paid manually',
            'received_by' => auth()->id(),
        ]);

        return back()->with('success', 'Invoice marked as paid.');
    }

    public function downloadPdf(Invoice $invoice)
    {
        $invoice->load(['customer', 'connection.package', 'items']);

        $pdf = \PDF::loadView('invoices.pdf', compact('invoice'));
        
        return $pdf->download($invoice->invoice_number . '.pdf');
    }
}
