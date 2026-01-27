<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Connection;
use App\Models\Customer;
use App\Models\Package;
use App\Models\MikroTikRouter;
use App\Services\MikroTikService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ConnectionController extends Controller
{
    protected $mikrotikService;

    public function __construct(MikroTikService $mikrotikService)
    {
        $this->mikrotikService = $mikrotikService;
    }
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
        $routers = MikroTikRouter::active()->get(['id', 'name', 'host']);

        return Inertia::render('Admin/Connections/Create', [
            'customers' => $customers,
            'packages' => $packages,
            'routers' => $routers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'package_id' => 'required|exists:packages,id',
            'mikrotik_router_id' => 'nullable|exists:mikrotik_routers,id',
            'pppoe_username' => 'nullable|string|max:255|unique:connections,pppoe_username',
            'pppoe_password' => 'nullable|string|max:255',
            'auto_sync' => 'boolean',
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

        // Sync to MikroTik if router is assigned and auto_sync is enabled
        if ($connection->mikrotik_router_id && $connection->auto_sync && $connection->pppoe_username) {
            $this->mikrotikService->syncConnection($connection);
        }

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
        $routers = MikroTikRouter::active()->get(['id', 'name', 'host']);

        return Inertia::render('Admin/Connections/Edit', [
            'connection' => $connection,
            'customers' => $customers,
            'packages' => $packages,
            'routers' => $routers,
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

    /**
     * Sync connection to MikroTik router
     */
    public function syncToMikroTik(Connection $connection)
    {
        if (!$connection->mikrotikRouter) {
            return back()->with('error', 'No MikroTik router assigned to this connection.');
        }

        $success = $this->mikrotikService->syncConnection($connection);

        return back()->with(
            $success ? 'success' : 'error',
            $success ? 'Connection synced to MikroTik successfully.' : 'Failed to sync connection to MikroTik.'
        );
    }

    /**
     * Disconnect user from MikroTik
     */
    public function disconnectFromMikroTik(Connection $connection)
    {
        if (!$connection->pppoe_username) {
            return back()->with('error', 'No PPPoE username configured for this connection.');
        }

        $this->mikrotikService->connect($connection->mikrotikRouter);
        $success = $this->mikrotikService->disconnectUser($connection->pppoe_username);
        $this->mikrotikService->disconnect();

        return back()->with(
            $success ? 'success' : 'error',
            $success ? 'User disconnected from MikroTik successfully.' : 'Failed to disconnect user from MikroTik.'
        );
    }
}
