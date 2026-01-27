<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions (use firstOrCreate to avoid duplicates)
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Customer Management
            'view customers',
            'create customers',
            'edit customers',
            'delete customers',
            
            // Package Management
            'view packages',
            'create packages',
            'edit packages',
            'delete packages',
            
            // Connection Management
            'view connections',
            'create connections',
            'edit connections',
            'delete connections',
            
            // MikroTik Routers
            'view mikrotik routers',
            'create mikrotik routers',
            'edit mikrotik routers',
            'delete mikrotik routers',
            'test mikrotik connection',
            'sync mikrotik connections',
            
            // Billing
            'view invoices',
            'create invoices',
            'edit invoices',
            'delete invoices',
            'process payments',
            
            // Reports
            'view reports',
            'export reports',
            
            // Settings
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions (use firstOrCreate to avoid duplicates)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions([
            'view users', 'create users', 'edit users',
            'view customers', 'create customers', 'edit customers', 'delete customers',
            'view packages', 'create packages', 'edit packages', 'delete packages',
            'view connections', 'create connections', 'edit connections', 'delete connections',
            'view mikrotik routers', 'create mikrotik routers', 'edit mikrotik routers', 'delete mikrotik routers',
            'test mikrotik connection', 'sync mikrotik connections',
            'view invoices', 'create invoices', 'edit invoices', 'delete invoices', 'process payments',
            'view reports',
        ]);

        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'view customers', 'create customers', 'edit customers',
            'view connections', 'create connections', 'edit connections',
            'view invoices', 'create invoices',
            'view reports',
        ]);

        $support = Role::firstOrCreate(['name' => 'support', 'guard_name' => 'web']);
        $support->syncPermissions([
            'view customers',
            'view connections',
            'view invoices',
        ]);

        $accountant = Role::firstOrCreate(['name' => 'accountant', 'guard_name' => 'web']);
        $accountant->syncPermissions([
            'view customers',
            'view invoices', 'create invoices', 'edit invoices',
            'process payments',
            'view reports', 'export reports',
        ]);
    }
}
