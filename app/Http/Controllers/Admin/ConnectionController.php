<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Connection;
use App\Models\Customer;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ConnectionController extends Controller
{
    public function index(Request $request)
    {
        $connections = Connection::with(['customer', 'package', 'createdBy'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('customer', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('customer_id', 'like', "%{$search}%");
                })->orWhere('connection_id', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->byStatus($status);
            })
            ->when($request->customer_id, function ($query, $customerId) {
                $query->byCustomer($customerId);
            })
            ->when($request->package_id, function ($query, $packageId) {
                $query->byPackage($packageId);
            })
            ->when($request->expiring_soon, function ($query) {
                $query->expiringSoon();
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $customers = Customer::active()->get(['id', 'customer_id', 'name']);
        $packages = Package::active()->get(['id', 'name']);

        return Inertia::render('Admin/Connections/Index', [
            'connections' => $connections,
            'filters' => $request->only(['search', 'status', 'customer_id', 'package_id', 'expiring_soon']),
            'customers' => $customers,
            'packages' => $packages,
        ]);
    }

    public function create()
    {
        $customers = Customer::active()->get(['id', 'customer_id', 'name']);
        $packages = Package::active()->get(['id', 'name', 'price', 'validity_days', 'bandwidth_download', 'bandwidth_upload']);

        return Inertia::render('Admin/Connections/Create', [
            'customers' => $customers,
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'package_id' => 'required|exists:packages,id',
            'ip_address' => 'nullable|ip',
            'mac_address' => 'nullable|string|max:17',
            'installation_date' => 'required|date',
            'status' => 'required|in:active,inactive,suspended,expired',
            'mikrotik_profile' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        // Expiry date will be auto-calculated in the model's boot method

        $connection = Connection::create($validated);

        return redirect()->route('admin.connections.index')
            ->with('success', "Connection {$connection->connection_id} created successfully.");
    }

    public function show(Connection $connection)
    {
        $connection->load(['customer', 'package', 'createdBy']);

        return Inertia::render('Admin/Connections/Show', [
            'connection' => $connection,
        ]);
    }

    public function edit(Connection $connection)
    {
        $customers = Customer::active()->get(['id', 'customer_id', 'name']);
        $packages = Package::active()->get(['id', 'name', 'price', 'validity_days', 'bandwidth_download', 'bandwidth_upload']);

        return Inertia::render('Admin/Connections/Edit', [
            'connection' => $connection,
            'customers' => $customers,
            'packages' => $packages,
        ]);
    }

    public function update(Request $request, Connection $connection)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'package_id' => 'required|exists:packages,id',
            'ip_address' => 'nullable|ip',
            'mac_address' => 'nullable|string|max:17',
            'installation_date' => 'required|date',
            'expiry_date' => 'required|date',
            'status' => 'required|in:active,inactive,suspended,expired',
            'mikrotik_profile' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $connection->update($validated);

        return redirect()->route('admin.connections.index')
            ->with('success', 'Connection updated successfully.');
    }

    public function destroy(Connection $connection)
    {
        $connection->delete();

        return redirect()->route('admin.connections.index')
            ->with('success', 'Connection deleted successfully.');
    }

    public function suspend(Connection $connection)
    {
        $connection->update(['status' => 'suspended']);

        return back()->with('success', 'Connection suspended successfully.');
    }

    public function activate(Connection $connection)
    {
        $connection->update(['status' => 'active']);

        return back()->with('success', 'Connection activated successfully.');
    }

    public function renew(Request $request, Connection $connection)
    {
        $validated = $request->validate([
            'months' => 'required|integer|min:1|max:12',
        ]);

        $package = $connection->package;
        $daysToAdd = $package->validity_days * $validated['months'];

        // If connection is expired, renew from today, otherwise extend from current expiry
        $baseDate = $connection->is_expired ? Carbon::now() : Carbon::parse($connection->expiry_date);
        $newExpiryDate = $baseDate->addDays($daysToAdd);

        $connection->update([
            'expiry_date' => $newExpiryDate,
            'status' => 'active',
        ]);

        return back()->with('success', "Connection renewed for {$validated['months']} month(s). New expiry: {$newExpiryDate->format('Y-m-d')}");
    }
}
