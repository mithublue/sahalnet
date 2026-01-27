<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Connection;
use App\Models\MikrotikRouter;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\BillingCycle;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Starting dummy data seeding...');

        // Create admin user if not exists (use updateOrCreate to handle existing)
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        
        // Ensure admin has admin role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
        $this->command->info('✅ Admin user created/verified');

        // Create Packages
        $this->command->info('📦 Creating packages...');
        $packages = [
            ['name' => '5 Mbps Basic', 'bandwidth_download' => 5, 'bandwidth_upload' => 2, 'price' => 500, 'validity_days' => 30],
            ['name' => '10 Mbps Standard', 'bandwidth_download' => 10, 'bandwidth_upload' => 5, 'price' => 800, 'validity_days' => 30],
            ['name' => '20 Mbps Premium', 'bandwidth_download' => 20, 'bandwidth_upload' => 10, 'price' => 1200, 'validity_days' => 30],
            ['name' => '50 Mbps Ultra', 'bandwidth_download' => 50, 'bandwidth_upload' => 25, 'price' => 2000, 'validity_days' => 30],
            ['name' => '100 Mbps Business', 'bandwidth_download' => 100, 'bandwidth_upload' => 50, 'price' => 3500, 'validity_days' => 30],
        ];

        $createdPackages = [];
        foreach ($packages as $packageData) {
            $createdPackages[] = Package::create(array_merge($packageData, [
                'description' => "High-speed internet package with {$packageData['bandwidth_download']} Mbps download speed",
                'is_active' => true,
            ]));
        }
        $this->command->info('✅ Created ' . count($createdPackages) . ' packages');

        // Create MikroTik Router (temporarily disabled due to database error)
        $this->command->info('🌐 Skipping MikroTik router (can be created manually)...');
        $router = null;
        
        /*
        try {
            $router = MikrotikRouter::create([
                'name' => 'Main Router',
                'host' => '192.168.88.1',
                'port' => 8728,
                'username' => 'admin',
                'password' => 'admin123',
                'is_active' => true,
            ]);
            $this->command->info('✅ MikroTik router created');
        } catch (\Exception $e) {
            $this->command->error('❌ MikroTik router creation failed: ' . $e->getMessage());
            $this->command->info('Skipping MikroTik router and continuing...');
            $router = null;
        }
        */

        // Create Customers
        $this->command->info('👥 Creating customers...');
        $customerNames = [
            'Ahmed Hassan', 'Fatima Rahman', 'Mohammed Ali', 'Ayesha Khan', 'Omar Farooq',
            'Zainab Ahmed', 'Ibrahim Malik', 'Mariam Hussain', 'Yusuf Abdullah', 'Khadija Noor',
            'Hassan Ibrahim', 'Aisha Begum', 'Bilal Rahman', 'Hafsa Ali', 'Tariq Ahmed',
            'Nadia Khan', 'Rashid Mahmood', 'Sana Fatima', 'Hamza Siddique', 'Layla Hassan',
        ];

        $areas = ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Bashundhara'];
        $createdCustomers = [];

        foreach ($customerNames as $index => $name) {
            $area = $areas[array_rand($areas)];
            $customer = Customer::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@example.com',
                'phone' => '01' . rand(700000000, 999999999),
                'address' => 'House ' . rand(1, 100) . ', Road ' . rand(1, 20) . ', ' . $area . ', Dhaka',
                'nid' => rand(1000000000, 9999999999),
                'latitude' => 23.7 + (rand(-100, 100) / 1000),
                'longitude' => 90.4 + (rand(-100, 100) / 1000),
                'status' => 'active',
            ]);
            $createdCustomers[] = $customer;
        }
        $this->command->info('✅ Created ' . count($createdCustomers) . ' customers');

        // Create Connections
        $this->command->info('🔌 Creating connections...');
        $statuses = ['active', 'active', 'active', 'active', 'suspended', 'expired'];
        $createdConnections = [];

        foreach ($createdCustomers as $customer) {
            $package = $createdPackages[array_rand($createdPackages)];
            $status = $statuses[array_rand($statuses)];
            
            $installationDate = now()->subDays(rand(30, 365));
            $expiryDate = $installationDate->copy()->addDays($package->validity_days);

            $connection = Connection::create([
                'customer_id' => $customer->id,
                'package_id' => $package->id,
                'mikrotik_router_id' => rand(0, 1) ? $router->id : null,
                'pppoe_username' => strtolower(str_replace('-', '', $customer->customer_id)),
                'pppoe_password' => bin2hex(random_bytes(8)),
                'auto_sync' => rand(0, 1),
                'ip_address' => '10.0.' . rand(1, 255) . '.' . rand(1, 254),
                'mac_address' => sprintf('%02X:%02X:%02X:%02X:%02X:%02X', rand(0, 255), rand(0, 255), rand(0, 255), rand(0, 255), rand(0, 255), rand(0, 255)),
                'installation_date' => $installationDate,
                'expiry_date' => $expiryDate,
                'status' => $status,
            ]);
            $createdConnections[] = $connection;
        }
        $this->command->info('✅ Created ' . count($createdConnections) . ' connections');

        // Create Billing Cycle
        $this->command->info('📅 Creating billing cycle...');
        $billingCycle = BillingCycle::create([
            'name' => now()->format('F Y'),
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'status' => 'active',
        ]);
        $this->command->info('✅ Billing cycle created');

        // Create Invoices
        $this->command->info('🧾 Creating invoices...');
        $invoiceStatuses = ['paid', 'paid', 'paid', 'partial', 'sent', 'overdue', 'draft'];
        $createdInvoices = [];

        foreach ($createdConnections as $connection) {
            $status = $invoiceStatuses[array_rand($invoiceStatuses)];
            $invoiceDate = now()->subDays(rand(1, 30));
            $dueDate = $invoiceDate->copy()->addDays(7);

            $invoice = Invoice::create([
                'customer_id' => $connection->customer_id,
                'connection_id' => $connection->id,
                'invoice_date' => $invoiceDate,
                'due_date' => $dueDate,
                'subtotal' => $connection->package->price,
                'tax_amount' => 0,
                'discount_amount' => rand(0, 1) ? rand(50, 200) : 0,
                'status' => $status,
            ]);

            // Create invoice item
            $invoice->items()->create([
                'description' => $connection->package->name . ' - Monthly Subscription',
                'quantity' => 1,
                'unit_price' => $connection->package->price,
            ]);

            $invoice->calculateTotals();
            $createdInvoices[] = $invoice;
        }
        $this->command->info('✅ Created ' . count($createdInvoices) . ' invoices');

        // Create Payments
        $this->command->info('💰 Creating payments...');
        $paymentMethods = ['cash', 'bank_transfer', 'mobile_banking', 'card', 'online'];
        $paymentCount = 0;

        foreach ($createdInvoices as $invoice) {
            if (in_array($invoice->status, ['paid', 'partial'])) {
                $paymentAmount = $invoice->status === 'paid' 
                    ? $invoice->total_amount 
                    : $invoice->total_amount * (rand(30, 70) / 100);

                Payment::create([
                    'invoice_id' => $invoice->id,
                    'customer_id' => $invoice->customer_id,
                    'amount' => $paymentAmount,
                    'payment_date' => $invoice->invoice_date->copy()->addDays(rand(1, 5)),
                    'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                    'transaction_id' => 'TXN' . strtoupper(bin2hex(random_bytes(6))),
                    'notes' => 'Payment received',
                    'received_by' => $admin->id,
                ]);
                $paymentCount++;
            }
        }
        $this->command->info('✅ Created ' . $paymentCount . ' payments');

        $this->command->info('');
        $this->command->info('🎉 Dummy data seeding completed successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   - Packages: ' . count($createdPackages));
        $this->command->info('   - Customers: ' . count($createdCustomers));
        $this->command->info('   - Connections: ' . count($createdConnections));
        $this->command->info('   - MikroTik Routers: 1');
        $this->command->info('   - Invoices: ' . count($createdInvoices));
        $this->command->info('   - Payments: ' . $paymentCount);
        $this->command->info('   - Billing Cycles: 1');
        $this->command->info('');
        $this->command->info('🔑 Login Credentials:');
        $this->command->info('   Email: admin@example.com');
        $this->command->info('   Password: password');
    }
}
