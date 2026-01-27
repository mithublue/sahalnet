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

        // Create permissions
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
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo([
            'view users', 'create users', 'edit users',
            'view customers', 'create customers', 'edit customers', 'delete customers',
            'view packages', 'create packages', 'edit packages', 'delete packages',
            'view connections', 'create connections', 'edit connections', 'delete connections',
            'view mikrotik routers', 'create mikrotik routers', 'edit mikrotik routers', 'delete mikrotik routers',
            'test mikrotik connection', 'sync mikrotik connections',
            'view invoices', 'create invoices', 'edit invoices', 'process payments',
            'view reports',
        ]);

        $manager = Role::create(['name' => 'manager']);
        $manager->givePermissionTo([
            'view customers', 'create customers', 'edit customers',
            'view connections', 'create connections', 'edit connections',
            'view invoices', 'create invoices',
            'view reports',
        ]);

        $staff = Role::create(['name' => 'staff']);
        $staff->givePermissionTo([
            'view customers',
            'view connections',
            'view invoices',
        ]);

        $customer = Role::create(['name' => 'customer']);
        // Customers have no admin permissions
    }
}
