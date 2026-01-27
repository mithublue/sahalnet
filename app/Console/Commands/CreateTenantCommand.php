<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Database\Models\Tenant;

class CreateTenantCommand extends Command
{
    protected $signature = 'tenant:create {name} {domain}';
    protected $description = 'Create a new tenant with database and domain';

    public function handle()
    {
        $name = $this->argument('name');
        $domain = $this->argument('domain');

        // Create tenant
        $tenant = Tenant::create(['id' => $domain]);
        
        // Create domain for tenant (use domain as-is, don't append .localhost)
        Domain::create([
            'domain' => $domain,
            'tenant_id' => $tenant->id,
        ]);

        $this->info("Tenant '{$name}' created successfully!");
        $this->info("Domain: {$domain}");
        $this->info("Tenant ID: {$tenant->id}");

        return 0;
    }
}
