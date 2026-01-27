import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ cycle }) {
    const handleGenerate = () => {
        if (confirm('Generate invoices for all active connections? This will create invoices based on their current packages.')) {
            router.post(route('admin.billing-cycles.generate', cycle.id));
        }
    };

    const handleClose = () => {
        if (confirm('Close this billing cycle? This action cannot be undone.')) {
            router.post(route('admin.billing-cycles.close', cycle.id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
            processing: 'bg-blue-100 text-blue-800',
        };
        return badges[status] || badges.active;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Billing Cycle: {cycle.name}
                    </h2>
                    <div className="flex gap-2">
                        {cycle.status === 'active' && cycle.total_invoices === 0 && (
                            <button
                                onClick={handleGenerate}
                                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                            >
                                Generate Invoices
                            </button>
                        )}
                        {cycle.status === 'active' && (
                            <button
                                onClick={handleClose}
                                className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                            >
                                Close Cycle
                            </button>
                        )}
                        <Link
                            href={route('admin.billing-cycles.index')}
                            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Billing Cycle: ${cycle.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Cycle Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Cycle Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Name</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {cycle.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(cycle.status)}`}>
                                        {cycle.status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Period</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Created By</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {cycle.created_by?.name || 'N/A'}
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <svg
                                        className="h-6 w-6 text-white"
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
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Invoices
                                        </dt>
                                        <dd className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                                            {cycle.total_invoices}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Amount
                                        </dt>
                                        <dd className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                                            ৳{parseFloat(cycle.total_amount).toFixed(2)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    {cycle.status === 'active' && cycle.total_invoices === 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                Ready to Generate Invoices
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                This billing cycle is active and ready to generate invoices. Click the "Generate Invoices" button to automatically create invoices for all active connections based on their current package prices.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                            >
                                Generate Invoices Now
                            </button>
                        </div>
                    )}

                    {cycle.total_invoices > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                                Invoices Generated
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                                {cycle.total_invoices} invoices have been generated for this billing cycle with a total amount of ৳{parseFloat(cycle.total_amount).toFixed(2)}.
                            </p>
                            <Link
                                href={route('admin.invoices.index')}
                                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                            >
                                View Invoices
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
