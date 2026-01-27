<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BillingCycle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BillingCycleController extends Controller
{
    public function index()
    {
        $cycles = BillingCycle::with('createdBy')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/BillingCycles/Index', [
            'cycles' => $cycles,
        ]);
    }

    public function create()
    {
        // Suggest current month as default
        $currentMonth = Carbon::now()->format('F Y');
        $startDate = Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = Carbon::now()->endOfMonth()->format('Y-m-d');

        return Inertia::render('Admin/BillingCycles/Create', [
            'suggestedName' => $currentMonth,
            'suggestedStartDate' => $startDate,
            'suggestedEndDate' => $endDate,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'active';

        $cycle = BillingCycle::create($validated);

        return redirect()->route('admin.billing-cycles.show', $cycle->id)
            ->with('success', 'Billing cycle created successfully.');
    }

    public function show(BillingCycle $billingCycle)
    {
        $billingCycle->load('createdBy');

        // Get invoices for this cycle (if any)
        // Note: We need to add billing_cycle_id to invoices table for this to work properly
        // For now, we'll show cycle details only

        return Inertia::render('Admin/BillingCycles/Show', [
            'cycle' => $billingCycle,
        ]);
    }

    public function generateInvoices(BillingCycle $billingCycle)
    {
        if ($billingCycle->status !== 'active') {
            return back()->with('error', 'Only active billing cycles can generate invoices.');
        }

        $billingCycle->status = 'processing';
        $billingCycle->save();

        try {
            $count = $billingCycle->generateInvoices();

            $billingCycle->status = 'active';
            $billingCycle->save();

            return back()->with('success', "Generated {$count} invoices successfully.");
        } catch (\Exception $e) {
            $billingCycle->status = 'active';
            $billingCycle->save();

            return back()->with('error', 'Failed to generate invoices: ' . $e->getMessage());
        }
    }

    public function close(BillingCycle $billingCycle)
    {
        if ($billingCycle->status === 'closed') {
            return back()->with('error', 'Billing cycle is already closed.');
        }

        $billingCycle->close();

        return back()->with('success', 'Billing cycle closed successfully.');
    }

    public function destroy(BillingCycle $billingCycle)
    {
        // Only allow deleting if no invoices generated
        if ($billingCycle->total_invoices > 0) {
            return back()->with('error', 'Cannot delete billing cycle with generated invoices.');
        }

        $billingCycle->delete();

        return redirect()->route('admin.billing-cycles.index')
            ->with('success', 'Billing cycle deleted successfully.');
    }
}
