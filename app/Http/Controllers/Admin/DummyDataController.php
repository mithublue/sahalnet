<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class DummyDataController extends Controller
{
    public function index()
    {
        // Only super_admin can access
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Admin/DummyData/Index');
    }

    public function install(Request $request)
    {
        // Only super_admin can install
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Run the DummyDataSeeder
            Artisan::call('db:seed', [
                '--class' => 'DummyDataSeeder',
            ]);

            return back()->with('success', 'Dummy data installed successfully! Check your dashboard for new data.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to install dummy data: ' . $e->getMessage());
        }
    }
}
