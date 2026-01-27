import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ invoices, filters, customers }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || '');

    const handleFilter = () => {
        router.get(route('admin.invoices.index'), {
            search,
            status,
            payment_status: paymentStatus,
        }, { preserveState: true });
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            partial: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return badges[status] || badges.draft;
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const badges = {
            unpaid: 'bg-red-100 text-red-800',
            partial: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
        };
        return badges[paymentStatus] || badges.unpaid;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Invoices
                    </h2>
                    <Link
                        href={route('admin.invoices.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                    >
                        Create Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Invoices" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search invoices..."
                                className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="overdue">Overdue</option>
                            </select>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                <option value="">All Payment Status</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                            </select>
                            <button
                                onClick={handleFilter}
                                className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                            >
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Invoice List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {invoices.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        No invoices
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Get started by creating a new invoice.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('admin.invoices.create')}
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                        >
                                            Create Invoice
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Invoice #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Due Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Payment
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {invoices.data.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        <Link
                                                            href={route('admin.invoices.show', invoice.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {invoice.invoice_number}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {invoice.customer?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(invoice.invoice_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(invoice.due_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        ৳{parseFloat(invoice.total_amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(
                                                                invoice.status
                                                            )}`}
                                                        >
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPaymentStatusBadge(
                                                                invoice.payment_status
                                                            )}`}
                                                        >
                                                            {invoice.payment_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('admin.invoices.show', invoice.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {invoice.status === 'draft' && (
                                                            <Link
                                                                href={route('admin.invoices.edit', invoice.id)}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {invoices.links && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing {invoices.from} to {invoices.to} of {invoices.total} results
                                            </div>
                                            <div className="flex gap-2">
                                                {invoices.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-3 py-1 rounded ${link.active
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
