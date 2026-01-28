<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerConnectionController extends Controller
{
    public function index()
    {
        $customer = Auth::guard('customer')->user();

        $connections = $customer->connections()
            ->with(['package'])
            ->latest()
            ->get();

        return Inertia::render('Customer/Connections/Index', [
            'connections' => $connections,
        ]);
    }
}
