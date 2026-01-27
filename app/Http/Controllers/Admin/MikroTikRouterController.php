<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MikroTikRouter;
use App\Services\MikroTikService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MikroTikRouterController extends Controller
{
    protected $mikrotikService;

    public function __construct(MikroTikService $mikrotikService)
    {
        $this->mikrotikService = $mikrotikService;
    }

    /**
     * Display a listing of MikroTik routers
     */
    public function index()
    {
        $routers = MikroTikRouter::withCount('activeConnections')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/MikroTik/Index', [
            'routers' => $routers,
        ]);
    }

    /**
     * Show the form for creating a new router
     */
    public function create()
    {
        return Inertia::render('Admin/MikroTik/Create');
    }

    /**
     * Store a newly created router
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'host' => 'required|string|max:255',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $router = MikroTikRouter::create($validated);

        // Test connection
        $testResult = $this->mikrotikService->testConnection($router);

        return redirect()->route('admin.mikrotik-routers.index')
            ->with('success', $testResult['success'] 
                ? 'Router added and connection test successful!' 
                : 'Router added but connection test failed: ' . $testResult['message']);
    }

    /**
     * Display the specified router
     */
    public function show(MikroTikRouter $mikrotikRouter)
    {
        $mikrotikRouter->load(['connections.customer', 'connections.package']);
        $mikrotikRouter->loadCount('activeConnections');

        return Inertia::render('Admin/MikroTik/Show', [
            'router' => $mikrotikRouter,
        ]);
    }

    /**
     * Show the form for editing the specified router
     */
    public function edit(MikroTikRouter $mikrotikRouter)
    {
        return Inertia::render('Admin/MikroTik/Edit', [
            'router' => $mikrotikRouter,
        ]);
    }

    /**
     * Update the specified router
     */
    public function update(Request $request, MikroTikRouter $mikrotikRouter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'host' => 'required|string|max:255',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Only update password if provided
        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $mikrotikRouter->update($validated);

        return redirect()->route('admin.mikrotik-routers.index')
            ->with('success', 'Router updated successfully!');
    }

    /**
     * Remove the specified router
     */
    public function destroy(MikroTikRouter $mikrotikRouter)
    {
        // Check if router has active connections
        if ($mikrotikRouter->activeConnections()->count() > 0) {
            return back()->with('error', 'Cannot delete router with active connections!');
        }

        $mikrotikRouter->delete();

        return redirect()->route('admin.mikrotik-routers.index')
            ->with('success', 'Router deleted successfully!');
    }

    /**
     * Test connection to router
     */
    public function testConnection(MikroTikRouter $mikrotikRouter)
    {
        $result = $this->mikrotikService->testConnection($mikrotikRouter);

        return response()->json($result);
    }

    /**
     * Sync all connections for this router
     */
    public function syncConnections(MikroTikRouter $mikrotikRouter)
    {
        $connections = $mikrotikRouter->activeConnections()->get();
        $synced = 0;
        $failed = 0;

        foreach ($connections as $connection) {
            if ($this->mikrotikService->syncConnection($connection)) {
                $synced++;
            } else {
                $failed++;
            }
        }

        return back()->with('success', "Synced {$synced} connections. Failed: {$failed}");
    }
}
