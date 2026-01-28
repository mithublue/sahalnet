import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function SupportIndex({ tickets, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

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
        <CustomerLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Support Tickets
                    </h2>
                    <Link
                        href={route('customer.support.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                    >
                        Create Ticket
                    </Link>
                </div>
            }
        >
            <Head title="Support Tickets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        window.location.href = route('customer.support.index', {
                                            status: e.target.value || undefined,
                                        });
                                    }}
                                    className="mt-1 block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">All Tickets</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Tickets List */}
                            {tickets.data.length > 0 ? (
                                <div className="space-y-4">
                                    {tickets.data.map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={route('customer.support.show', ticket.id)}
                                            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {ticket.subject}
                                                        </h3>
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </span>
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                                            {ticket.priority}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {ticket.description}
                                                    </p>
                                                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>Ticket #{ticket.ticket_number}</span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                        {ticket.replies && ticket.replies.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Pagination */}
                                    {tickets.links && tickets.links.length > 3 && (
                                        <div className="mt-6 flex justify-center space-x-2">
                                            {tickets.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 rounded-md text-sm ${link.active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        No support tickets found.
                                    </p>
                                    <Link
                                        href={route('customer.support.create')}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                    >
                                        Create Your First Ticket
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
