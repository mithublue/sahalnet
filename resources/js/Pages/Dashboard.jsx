import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recent_customers, recent_connections }) {
    const statCards = [
        {
            title: 'Total Customers',
            value: stats.total_customers,
            subtitle: `${stats.active_customers} active`,
            color: 'bg-blue-500',
            icon: '👥',
        },
        {
            title: 'Total Packages',
            value: stats.total_packages,
            subtitle: `${stats.active_packages} active`,
            color: 'bg-green-500',
            icon: '📦',
        },
        {
            title: 'Total Connections',
            value: stats.total_connections,
            subtitle: `${stats.active_connections} active`,
            color: 'bg-purple-500',
            icon: '🔗',
        },
        {
            title: 'Expiring Soon',
            value: stats.expiring_soon,
            subtitle: 'Within 7 days',
            color: 'bg-orange-500',
            icon: '⚠️',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Customers */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Recent Customers
                                    </h3>
                                    <Link
                                        href={route('admin.customers.index')}
                                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {recent_customers.length > 0 ? (
                                        recent_customers.map((customer) => (
                                            <div
                                                key={customer.id}
                                                className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {customer.customer_id} • {customer.area}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${customer.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : customer.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {customer.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                            No customers yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Connections */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Recent Connections
                                    </h3>
                                    <Link
                                        href={route('admin.connections.index')}
                                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {recent_connections.length > 0 ? (
                                        recent_connections.map((connection) => (
                                            <div
                                                key={connection.id}
                                                className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {connection.connection_id}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {connection.customer?.name} • {connection.package?.name}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${connection.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : connection.status === 'suspended'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {connection.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                            No connections yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={route('admin.customers.create')}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
                                >
                                    <span className="text-2xl mb-2">👤</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Add Customer
                                    </span>
                                </Link>
                                <Link
                                    href={route('admin.packages.create')}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
                                >
                                    <span className="text-2xl mb-2">📦</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Add Package
                                    </span>
                                </Link>
                                <Link
                                    href={route('admin.connections.create')}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
                                >
                                    <span className="text-2xl mb-2">🔗</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Add Connection
                                    </span>
                                </Link>
                                <Link
                                    href={route('admin.users.create')}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
                                >
                                    <span className="text-2xl mb-2">👥</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Add User
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
