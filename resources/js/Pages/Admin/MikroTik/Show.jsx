import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ router: mikrotikRouter }) {
    const handleSync = () => {
        if (confirm('Sync all connections for this router?')) {
            router.post(route('admin.mikrotik-routers.sync', mikrotikRouter.id));
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this router?')) {
            router.delete(route('admin.mikrotik-routers.destroy', mikrotikRouter.id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            connected: 'bg-green-100 text-green-800',
            disconnected: 'bg-gray-100 text-gray-800',
            error: 'bg-red-100 text-red-800',
        };
        return badges[status] || badges.disconnected;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Router: {mikrotikRouter.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.mikrotik-routers.edit', mikrotikRouter.id)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('admin.mikrotik-routers.index')}
                            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={mikrotikRouter.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Router Details */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Router Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {mikrotikRouter.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Host</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {mikrotikRouter.host}:{mikrotikRouter.port}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {mikrotikRouter.username}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Connection Status</p>
                                    <span
                                        className={`mt-1 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(
                                            mikrotikRouter.connection_status
                                        )}`}
                                    >
                                        {mikrotikRouter.connection_status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Connections</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {mikrotikRouter.active_connections_count || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Connected</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {mikrotikRouter.last_connected_at
                                            ? new Date(mikrotikRouter.last_connected_at).toLocaleString()
                                            : 'Never'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={handleSync}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                                >
                                    Sync All Connections
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                                >
                                    Delete Router
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Connections List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Connections ({mikrotikRouter.connections?.length || 0})
                            </h3>
                            {mikrotikRouter.connections && mikrotikRouter.connections.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Connection ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Package
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    PPPoE Username
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {mikrotikRouter.connections.map((connection) => (
                                                <tr key={connection.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        <Link
                                                            href={route('admin.connections.show', connection.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {connection.connection_id}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {connection.customer?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {connection.package?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${connection.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {connection.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {connection.pppoe_username || 'Not set'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    No connections assigned to this router yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
