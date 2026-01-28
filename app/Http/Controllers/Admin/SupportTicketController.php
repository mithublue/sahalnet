<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = SupportTicket::with(['customer', 'assignedTo', 'replies']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('ticket_number', 'like', "%{$request->search}%")
                    ->orWhere('subject', 'like', "%{$request->search}%")
                    ->orWhereHas('customer', function ($q) use ($request) {
                        $q->where('name', 'like', "%{$request->search}%")
                            ->orWhere('email', 'like', "%{$request->search}%");
                    });
            });
        }

        $tickets = $query->latest()->paginate(15);

        return Inertia::render('Admin/SupportTickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }

    public function show(SupportTicket $supportTicket)
    {
        $supportTicket->load(['customer', 'assignedTo', 'replies.user', 'replies.customer']);

        $users = User::select('id', 'name')->get();

        return Inertia::render('Admin/SupportTickets/Show', [
            'ticket' => $supportTicket,
            'users' => $users,
        ]);
    }

    public function update(Request $request, SupportTicket $supportTicket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'priority' => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $supportTicket->update($validated);

        // Notify customer of status change
        $supportTicket->customer->createNotification('ticket_updated', [
            'ticket_id' => $supportTicket->id,
            'ticket_number' => $supportTicket->ticket_number,
            'subject' => $supportTicket->subject,
            'status' => $validated['status'],
            'message' => "Your ticket #{$supportTicket->ticket_number} status changed to {$validated['status']}"
        ]);

        return back()->with('success', 'Ticket updated successfully.');
    }

    public function reply(Request $request, SupportTicket $supportTicket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $validated['support_ticket_id'] = $supportTicket->id;
        $validated['user_id'] = Auth::id();

        SupportTicketReply::create($validated);

        // Auto-update ticket status to in_progress if it's open
        if ($supportTicket->status === 'open') {
            $supportTicket->update(['status' => 'in_progress']);
        }

        // Notify customer if not an internal note
        if (!($validated['is_internal'] ?? false)) {
            $supportTicket->customer->createNotification('ticket_replied', [
                'ticket_id' => $supportTicket->id,
                'ticket_number' => $supportTicket->ticket_number,
                'subject' => $supportTicket->subject,
                'replied_by' => Auth::user()->name,
                'message' => "Your ticket #{$supportTicket->ticket_number} has a new reply from " . Auth::user()->name
            ]);
        }

        return back()->with('success', 'Reply added successfully.');
    }

    public function assign(Request $request, SupportTicket $supportTicket)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $supportTicket->update($validated);

        return back()->with('success', 'Ticket assigned successfully.');
    }

    public function close(SupportTicket $supportTicket)
    {
        $supportTicket->update([
            'status' => 'closed',
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Ticket closed successfully.');
    }
}
