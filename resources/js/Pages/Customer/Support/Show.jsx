import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SupportShow({ ticket }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customer.support.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
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
        <CustomerLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Ticket Details
                    </h2>
                    <Link
                        href={route('customer.support.index')}
                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                        ← Back to Tickets
                    </Link>
                </div>
            }
        >
            <Head title={`Ticket ${ticket.ticket_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
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

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>Created on {new Date(ticket.created_at).toLocaleString()}</span>
                                {ticket.assigned_to && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span>Assigned to: {ticket.assigned_to.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Replies */}
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
                                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                                    : 'bg-gray-50 dark:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {reply.user_id ? reply.user.name : 'You'}
                                                    </span>
                                                    {reply.user_id && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            Support Staff
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
                                <form onSubmit={submit}>
                                    <div>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            rows="4"
                                            placeholder="Type your message here..."
                                            required
                                        />
                                        <InputError message={errors.message} className="mt-2" />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <PrimaryButton disabled={processing}>
                                            {processing ? 'Sending...' : 'Send Reply'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {ticket.status === 'closed' && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                This ticket is closed. If you need further assistance, please create a new ticket.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
