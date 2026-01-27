<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class InstallDummyData extends Command
{
    protected $signature = 'app:install-dummy-data {--tenant=}';
    protected $description = 'One-click installation of dummy data for testing';

    public function handle()
    {
        $tenant = $this->option('tenant');

        if (!$tenant) {
            $this->error('❌ Please specify a tenant using --tenant option');
            $this->info('Example: php artisan app:install-dummy-data --tenant=fresh');
            return 1;
        }

        $this->info('');
        $this->info('🚀 Starting One-Click Dummy Data Installation');
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('Tenant: ' . $tenant);
        $this->info('');

        // Step 1: Run migrations
        $this->info('📦 Step 1/3: Running migrations...');
        Artisan::call('tenants:migrate', [
            '--tenants' => $tenant,
        ]);
        $this->info('✅ Migrations completed');
        $this->info('');

        // Step 2: Seed roles and permissions
        $this->info('🔐 Step 2/3: Seeding roles and permissions...');
        Artisan::call('tenants:seed', [
            '--tenants' => $tenant,
            '--class' => 'RolesAndPermissionsSeeder',
        ]);
        $this->info('✅ Roles and permissions seeded');
        $this->info('');

        // Step 3: Seed dummy data
        $this->info('🌱 Step 3/3: Seeding dummy data...');
        Artisan::call('tenants:seed', [
            '--tenants' => $tenant,
            '--class' => 'DummyDataSeeder',
        ]);
        $this->info('');

        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('🎉 Installation completed successfully!');
        $this->info('');
        $this->info('📊 Your tenant now has:');
        $this->info('   ✓ 5 Internet Packages (5 Mbps to 100 Mbps)');
        $this->info('   ✓ 20 Customers with realistic data');
        $this->info('   ✓ 20 Active Connections');
        $this->info('   ✓ 1 MikroTik Router');
        $this->info('   ✓ 20 Invoices (various statuses)');
        $this->info('   ✓ Multiple Payments');
        $this->info('   ✓ 1 Active Billing Cycle');
        $this->info('');
        $this->info('🔑 Login Credentials:');
        $this->info('   Email: admin@example.com');
        $this->info('   Password: password');
        $this->info('');
        $this->info('🌐 Access your tenant at:');
        $this->info('   http://' . $tenant . '.localhost:8000');
        $this->info('');
        $this->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return 0;
    }
}
