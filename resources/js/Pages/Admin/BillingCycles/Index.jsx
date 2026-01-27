import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ cycles }) {
    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
            processing: 'bg-blue-100 text-blue-800',
        };
        return badges[status] || badges.active;
    };

    const handleGenerate = (cycleId) => {
        if (confirm('Generate invoices for all active connections in this billing cycle?')) {
            router.post(route('admin.billing-cycles.generate', cycleId));
        }
    };

    const handleClose = (cycleId) => {
        if (confirm('Close this billing cycle? This action cannot be undone.')) {
            router.post(route('admin.billing-cycles.close', cycleId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Billing Cycles
                    </h2>
                    <Link
                        href={route('admin.billing-cycles.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                    >
                        Create Billing Cycle
                    </Link>
                </div>
            }
        >
            <Head title="Billing Cycles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {cycles.data.length === 0 ? (
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
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        No billing cycles
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Get started by creating a new billing cycle.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('admin.billing-cycles.create')}
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                        >
                                            Create Billing Cycle
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Period
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Invoices
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Total Amount
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {cycles.data.map((cycle) => (
                                                <tr key={cycle.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        <Link
                                                            href={route('admin.billing-cycles.show', cycle.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {cycle.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(
                                                                cycle.status
                                                            )}`}
                                                        >
                                                            {cycle.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {cycle.total_invoices}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        ৳{parseFloat(cycle.total_amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('admin.billing-cycles.show', cycle.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {cycle.status === 'active' && cycle.total_invoices === 0 && (
                                                            <button
                                                                onClick={() => handleGenerate(cycle.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Generate
                                                            </button>
                                                        )}
                                                        {cycle.status === 'active' && (
                                                            <button
                                                                onClick={() => handleClose(cycle.id)}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Close
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {cycles.links && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing {cycles.from} to {cycles.to} of {cycles.total} results
                                            </div>
                                            <div className="flex gap-2">
                                                {cycles.links.map((link, index) => (
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
