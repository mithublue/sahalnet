import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';

export default function ConnectionsIndex({ connections }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <CustomerLayout
            header={
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Connections
                </h2>
            }
        >
            <Head title="Connections" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {connections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {connections.map((connection) => (
                                <div
                                    key={connection.id}
                                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
                                >
                                    <div className="p-6">
                                        {/* Connection Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {connection.connection_id}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {connection.package?.name || 'N/A'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(connection.status)}`}>
                                                {connection.status}
                                            </span>
                                        </div>

                                        {/* Package Details */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {connection.package?.speed || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    ৳{connection.package?.price?.toLocaleString() || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">IP Address:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {connection.ip_address || 'N/A'}
                                                </span>
                                            </div>
                                            {connection.installation_date && (
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Installed:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {new Date(connection.installation_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            {connection.expiry_date && (
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {new Date(connection.expiry_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Connection Info */}
                                        {connection.status === 'suspended' && (
                                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <p className="text-xs text-red-800 dark:text-red-200">
                                                    ⚠️ This connection is suspended. Please clear any pending payments to reactivate.
                                                </p>
                                            </div>
                                        )}

                                        {connection.status === 'active' && connection.expiry_date && (
                                            new Date(connection.expiry_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                                        ⏰ This connection will expire soon. Please renew to avoid service interruption.
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No connections found. Contact your ISP administrator for assistance.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
