<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Connection;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $customer = Auth::guard('customer')->user();

        $stats = [
            'total_connections' => $customer->connections()->count(),
            'active_connections' => $customer->activeConnections()->count(),
            'total_invoices' => $customer->invoices()->count(),
            'pending_invoices' => $customer->invoices()->where('status', 'pending')->count(),
            'total_paid' => $customer->invoices()->where('status', 'paid')->sum('total_amount'),
            'total_due' => $customer->invoices()->where('status', 'pending')->sum('total_amount'),
        ];

        $recentInvoices = $customer->invoices()
            ->latest()
            ->take(5)
            ->get();

        $activeConnections = $customer->activeConnections()
            ->with('package')
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'customer' => $customer,
            'stats' => $stats,
            'recentInvoices' => $recentInvoices,
            'activeConnections' => $activeConnections,
        ]);
    }
}
