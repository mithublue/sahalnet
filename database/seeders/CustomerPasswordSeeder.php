<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerPasswordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Set password for all customers without a password
        $customers = Customer::whereNull('password')->orWhere('password', '')->get();

        foreach ($customers as $customer) {
            $customer->update([
                'password' => 'password123', // Will be automatically hashed by the model
            ]);

            $this->command->info("Password set for customer: {$customer->email} (ID: {$customer->customer_id})");
        }

        if ($customers->count() === 0) {
            $this->command->info('No customers found without passwords.');
        } else {
            $this->command->info("\nTotal customers updated: {$customers->count()}");
            $this->command->info("Default password: password123");
        }
    }
}
