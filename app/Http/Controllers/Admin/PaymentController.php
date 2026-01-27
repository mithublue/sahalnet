<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with(['invoice', 'customer', 'receivedBy'])
            ->when($request->search, function ($query, $search) {
                $query->where('payment_number', 'like', "%{$search}%")
                    ->orWhere('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->payment_method, function ($query, $method) {
                $query->byMethod($method);
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

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'payment_method', 'customer_id', 'start_date', 'end_date']),
            'customers' => $customers,
        ]);
    }

    public function create(Request $request)
    {
        $invoice = null;
        if ($request->invoice_id) {
            $invoice = Invoice::with('customer')->findOrFail($request->invoice_id);
        }

        $invoices = Invoice::unpaid()->with('customer')->get();

        return Inertia::render('Admin/Payments/Create', [
            'invoice' => $invoice,
            'invoices' => $invoices,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_banking,card,online',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $invoice = Invoice::findOrFail($validated['invoice_id']);

        // Validate amount doesn't exceed balance due
        if ($validated['amount'] > $invoice->balance_due) {
            return back()->withErrors(['amount' => 'Payment amount cannot exceed balance due.']);
        }

        $validated['customer_id'] = $invoice->customer_id;
        $validated['received_by'] = auth()->id();

        Payment::create($validated);

        return redirect()->route('admin.invoices.show', $invoice->id)
            ->with('success', 'Payment recorded successfully.');
    }

    public function show(Payment $payment)
    {
        $payment->load(['invoice.customer', 'customer', 'receivedBy']);

        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment,
        ]);
    }

    public function destroy(Payment $payment)
    {
        // Only super_admin can delete payments
        if (!auth()->user()->hasRole('super_admin')) {
            return back()->with('error', 'Only super admin can delete payments.');
        }

        $payment->delete();

        return redirect()->route('admin.payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
