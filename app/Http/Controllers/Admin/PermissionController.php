<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::withCount('roles')->get()->groupBy(function ($permission) {
            // Group by first word (e.g., "view users" -> "users")
            $parts = explode(' ', $permission->name);
            return count($parts) > 1 ? $parts[1] : 'other';
        });

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Permissions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        Permission::create($validated);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return back()->with('error', 'Cannot delete permission assigned to roles.');
        }

        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
