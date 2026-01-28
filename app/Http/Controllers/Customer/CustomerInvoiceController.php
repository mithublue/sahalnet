<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class CustomerInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $query = $customer->invoices()->with(['items', 'payments']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->latest()->paginate(10);

        return Inertia::render('Customer/Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Invoice $invoice)
    {
        $customer = Auth::guard('customer')->user();

        // Ensure customer can only view their own invoices
        if ($invoice->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to invoice.');
        }

        $invoice->load(['items', 'payments', 'customer']);

        return Inertia::render('Customer/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function download(Invoice $invoice)
    {
        $customer = Auth::guard('customer')->user();

        // Ensure customer can only download their own invoices
        if ($invoice->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to invoice.');
        }

        $invoice->load(['items', 'customer']);

        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $invoice]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }
}
