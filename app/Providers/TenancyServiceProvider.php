<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class TenancyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->mapTenantRoutes();
    }

    protected function mapTenantRoutes(): void
    {
        if (file_exists(base_path('routes/tenant.php'))) {
            Route::middleware('web')
                ->group(base_path('routes/tenant.php'));
        }
    }
}
