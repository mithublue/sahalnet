import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SupportTicketShow({ ticket, users }) {
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const { data: replyData, setData: setReplyData, post: postReply, processing: processingReply, errors: replyErrors, reset: resetReply } = useForm({
        message: '',
        is_internal: false,
    });

    const { data: updateData, setData: setUpdateData, patch, processing: processingUpdate, errors: updateErrors } = useForm({
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to || '',
    });

    const submitReply = (e) => {
        e.preventDefault();
        postReply(route('admin.support-tickets.reply', ticket.id), {
            onSuccess: () => resetReply(),
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.support-tickets.update', ticket.id), {
            onSuccess: () => setShowUpdateForm(false),
        });
    };

    const closeTicket = () => {
        if (confirm('Are you sure you want to close this ticket?')) {
            router.post(route('admin.support-tickets.close', ticket.id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Support Ticket Details
                    </h2>
                    <Link
                        href={route('admin.support-tickets.index')}
                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                        ← Back to Tickets
                    </Link>
                </div>
            }
        >
            <Head title={`Ticket ${ticket.ticket_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Ticket Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {ticket.subject}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Ticket #{ticket.ticket_number}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{ticket.customer?.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.customer?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned To</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {ticket.assigned_to?.name || 'Unassigned'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(ticket.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    {showUpdateForm ? 'Cancel' : 'Update Ticket'}
                                </button>
                                {ticket.status !== 'closed' && (
                                    <button
                                        onClick={closeTicket}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Close Ticket
                                    </button>
                                )}
                            </div>

                            {/* Update Form */}
                            {showUpdateForm && (
                                <form onSubmit={submitUpdate} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={updateData.status}
                                                onChange={(e) => setUpdateData('status', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                            <InputError message={updateErrors.status} className="mt-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                value={updateData.priority}
                                                onChange={(e) => setUpdateData('priority', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                            <InputError message={updateErrors.priority} className="mt-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Assign To
                                            </label>
                                            <select
                                                value={updateData.assigned_to}
                                                onChange={(e) => setUpdateData('assigned_to', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={updateErrors.assigned_to} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <PrimaryButton disabled={processingUpdate}>
                                            {processingUpdate ? 'Updating...' : 'Save Changes'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Conversation */}
                    {ticket.replies && ticket.replies.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Conversation
                                </h3>
                                <div className="space-y-4">
                                    {ticket.replies.map((reply, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg ${reply.user_id
                                                ? reply.is_internal
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500'
                                                    : 'bg-blue-50 dark:bg-blue-900/20'
                                                : 'bg-gray-50 dark:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {reply.user_id ? reply.user.name : reply.customer?.name || 'Customer'}
                                                    </span>
                                                    {reply.user_id && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            Staff
                                                        </span>
                                                    )}
                                                    {reply.is_internal && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                            Internal Note
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {reply.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reply Form */}
                    {ticket.status !== 'closed' && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Add Reply
                                </h3>
                                <form onSubmit={submitReply}>
                                    <div>
                                        <textarea
                                            value={replyData.message}
                                            onChange={(e) => setReplyData('message', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            rows="4"
                                            placeholder="Type your reply here..."
                                            required
                                        />
                                        <InputError message={replyErrors.message} className="mt-2" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={replyData.is_internal}
                                                onChange={(e) => setReplyData('is_internal', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                Internal note (not visible to customer)
                                            </span>
                                        </label>
                                        <PrimaryButton disabled={processingReply}>
                                            {processingReply ? 'Sending...' : 'Send Reply'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
