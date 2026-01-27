import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ customer = {}, stats = {}, recentInvoices = [], activeConnections = [] }) {
    const statCards = [
        {
            title: 'Active Connections',
            value: stats.active_connections || 0,
            subtitle: `${stats.total_connections || 0} total`,
            color: 'bg-blue-500',
            icon: '🔗',
        },
        {
            title: 'Pending Invoices',
            value: stats.pending_invoices || 0,
            subtitle: `৳${(stats.total_due || 0).toLocaleString()}`,
            color: 'bg-orange-500',
            icon: '📄',
        },
        {
            title: 'Total Paid',
            value: `৳${(stats.total_paid || 0).toLocaleString()}`,
            subtitle: `${stats.total_invoices || 0} invoices`,
            color: 'bg-green-500',
            icon: '💰',
        },
    ];

    return (
        <CustomerLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {customer?.name || 'Customer'}!
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Customer ID: {customer?.customer_id || 'N/A'}
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statCards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {card.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                                                {card.value}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {card.subtitle}
                                            </p>
                                        </div>
                                        <div className={`${card.color} rounded-full p-3 text-2xl`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Connections */}
                    {activeConnections.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Active Connections
                                </h3>
                                <div className="space-y-3">
                                    {activeConnections.map((connection) => (
                                        <div
                                            key={connection.id}
                                            className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {connection.connection_id}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {connection.package?.name || 'N/A'} • {connection.package?.speed || 'N/A'}
                                                </p>
                                            </div>
                                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Invoices */}
                    {recentInvoices.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Recent Invoices
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Invoice #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {recentInvoices.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {invoice.invoice_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(invoice.invoice_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        ৳{invoice.total_amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${invoice.status === 'paid'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : invoice.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {activeConnections.length === 0 && recentInvoices.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No connections or invoices yet. Contact your ISP administrator for assistance.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
