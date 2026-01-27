<?php

declare(strict_types=1);

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded for each tenant with their own database.
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    
    // Welcome page for tenants
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'tenantId' => tenant('id'),
        ]);
    });

    // Dashboard (requires authentication)
    Route::get('/dashboard', function () {
        $stats = [
            'total_customers' => \App\Models\Customer::count(),
            'active_customers' => \App\Models\Customer::where('status', 'active')->count(),
            'total_packages' => \App\Models\Package::count(),
            'active_packages' => \App\Models\Package::where('is_active', true)->count(),
            'total_connections' => \App\Models\Connection::count(),
            'active_connections' => \App\Models\Connection::where('status', 'active')->count(),
            'suspended_connections' => \App\Models\Connection::where('status', 'suspended')->count(),
            'expiring_soon' => \App\Models\Connection::where('expiry_date', '<=', now()->addDays(7))
                ->where('status', 'active')
                ->count(),
        ];

        $recent_customers = \App\Models\Customer::latest()->take(5)->get();
        $recent_connections = \App\Models\Connection::with(['customer', 'package'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_customers' => $recent_customers,
            'recent_connections' => $recent_connections,
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');

    // Profile routes (requires authentication)
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Admin routes (requires authentication and admin role)
    Route::middleware(['auth', 'check_role:super_admin,admin'])->prefix('admin')->name('admin.')->group(function () {
        // Users
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        
        // Customers
        Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class);
        
        // Packages
        Route::resource('packages', \App\Http\Controllers\Admin\PackageController::class);
        Route::post('packages/{package}/toggle', [\App\Http\Controllers\Admin\PackageController::class, 'toggle'])->name('packages.toggle');
        
        // Connections
        Route::resource('connections', \App\Http\Controllers\Admin\ConnectionController::class);
        Route::post('connections/{connection}/suspend', [\App\Http\Controllers\Admin\ConnectionController::class, 'suspend'])->name('connections.suspend');
        Route::post('connections/{connection}/activate', [\App\Http\Controllers\Admin\ConnectionController::class, 'activate'])->name('connections.activate');
        Route::post('connections/{connection}/renew', [\App\Http\Controllers\Admin\ConnectionController::class, 'renew'])->name('connections.renew');
        Route::post('connections/{connection}/sync-mikrotik', [\App\Http\Controllers\Admin\ConnectionController::class, 'syncToMikroTik'])->name('connections.sync-mikrotik');
        Route::post('connections/{connection}/disconnect-mikrotik', [\App\Http\Controllers\Admin\ConnectionController::class, 'disconnectFromMikroTik'])->name('connections.disconnect-mikrotik');
        
        // MikroTik Routers
        Route::resource('mikrotik-routers', \App\Http\Controllers\Admin\MikroTikRouterController::class);
        Route::post('mikrotik-routers/{mikrotikRouter}/test', [\App\Http\Controllers\Admin\MikroTikRouterController::class, 'testConnection'])->name('mikrotik-routers.test');
        Route::post('mikrotik-routers/{mikrotikRouter}/sync', [\App\Http\Controllers\Admin\MikroTikRouterController::class, 'syncConnections'])->name('mikrotik-routers.sync');
        
        // Invoices
        Route::resource('invoices', \App\Http\Controllers\Admin\InvoiceController::class);
        Route::post('invoices/{invoice}/send', [\App\Http\Controllers\Admin\InvoiceController::class, 'send'])->name('invoices.send');
        Route::post('invoices/{invoice}/mark-paid', [\App\Http\Controllers\Admin\InvoiceController::class, 'markAsPaid'])->name('invoices.mark-paid');
        Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\Admin\InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
        
        // Payments
        Route::resource('payments', \App\Http\Controllers\Admin\PaymentController::class)->except(['edit', 'update']);
        
        // Billing Cycles
        Route::resource('billing-cycles', \App\Http\Controllers\Admin\BillingCycleController::class);
        Route::post('billing-cycles/{billingCycle}/generate', [\App\Http\Controllers\Admin\BillingCycleController::class, 'generateInvoices'])->name('billing-cycles.generate');
        Route::post('billing-cycles/{billingCycle}/close', [\App\Http\Controllers\Admin\BillingCycleController::class, 'close'])->name('billing-cycles.close');
    });

    // Include authentication routes
    require base_path('routes/auth.php');
});
