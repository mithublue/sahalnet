<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerPaymentController extends Controller
{
    public function index(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $payments = $customer->payments()
            ->with(['invoice'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Payments/Index', [
            'payments' => $payments,
        ]);
    }
}
