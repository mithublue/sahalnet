<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerSupportController extends Controller
{
    public function index(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $query = $customer->supportTickets()->with(['assignedTo', 'replies']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tickets = $query->latest()->paginate(10);

        return Inertia::render('Customer/Support/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customer/Support/Create');
    }

    public function store(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $validated['customer_id'] = $customer->id;

        $ticket = SupportTicket::create($validated);

        // Notify all admin users
        $admins = \App\Models\User::role('super_admin')->get();
        foreach ($admins as $admin) {
            $admin->createNotification('ticket_created', [
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'subject' => $ticket->subject,
                'customer_name' => $customer->name,
                'priority' => $ticket->priority,
                'message' => "New support ticket #{$ticket->ticket_number} from {$customer->name}"
            ]);
        }

        return redirect()->route('customer.support.show', $ticket)
            ->with('success', 'Support ticket created successfully.');
    }

    public function show(SupportTicket $supportTicket)
    {
        $customer = Auth::guard('customer')->user();

        // Ensure customer can only view their own tickets
        if ($supportTicket->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to ticket.');
        }

        $supportTicket->load(['replies.user', 'replies.customer', 'assignedTo']);

        return Inertia::render('Customer/Support/Show', [
            'ticket' => $supportTicket,
        ]);
    }

    public function reply(Request $request, SupportTicket $supportTicket)
    {
        $customer = Auth::guard('customer')->user();

        // Ensure customer can only reply to their own tickets
        if ($supportTicket->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to ticket.');
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $validated['support_ticket_id'] = $supportTicket->id;
        $validated['customer_id'] = $customer->id;

        SupportTicketReply::create($validated);

        return back()->with('success', 'Reply added successfully.');
    }
}
