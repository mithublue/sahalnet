<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::with(['createdBy', 'activeConnections.package'])
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->when($request->status, function ($query, $status) {
                $query->byStatus($status);
            })
            ->when($request->area, function ($query, $area) {
                $query->byArea($area);
            })
            ->when($request->connection_type, function ($query, $type) {
                $query->where('connection_type', $type);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $areas = Customer::distinct()->pluck('area');

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'area', 'connection_type']),
            'areas' => $areas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'nid' => 'nullable|string|max:50',
            'address' => 'required|string',
            'area' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'connection_type' => 'required|in:fiber,wireless,cable',
            'status' => 'required|in:active,inactive,suspended,pending',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'billing_day' => 'required|integer|min:1|max:28',
        ]);

        $validated['created_by'] = auth()->id();

        $customer = Customer::create($validated);

        return redirect()->route('admin.customers.index')
            ->with('success', "Customer {$customer->customer_id} created successfully.");
    }

    public function show(Customer $customer)
    {
        $customer->load(['connections.package', 'createdBy']);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'password' => 'nullable|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'nid' => 'nullable|string|max:50',
            'address' => 'required|string',
            'area' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'connection_type' => 'required|in:fiber,wireless,cable',
            'status' => 'required|in:active,inactive,suspended,pending',
            'billing_cycle' => 'required|in:monthly,quarterly,yearly',
            'billing_day' => 'required|integer|min:1|max:28',
        ]);

        // Remove password if not provided
        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $customer->update($validated);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        // Check if customer has active connections
        if ($customer->activeConnections()->count() > 0) {
            return back()->with('error', 'Cannot delete customer with active connections.');
        }

        $customer->delete();

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
