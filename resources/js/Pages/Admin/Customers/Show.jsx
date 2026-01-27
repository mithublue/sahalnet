import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ customer = {} }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Customer Details: {customer?.customer_id || 'Loading...'}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.customers.edit', customer?.id || 1)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                        >
                            Edit Customer
                        </Link>
                        <Link
                            href={route('admin.customers.index')}
                            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                        >
                            Back to Customers
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Customer: ${customer?.customer_id || 'Details'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.customer_id || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.name || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.email || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.phone || 'N/A'}
                                    </p>
                                </div>
                                {customer?.secondary_phone && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Phone</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.secondary_phone}
                                        </p>
                                    </div>
                                )}
                                {customer?.nid && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">NID Number</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.nid}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${customer?.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : customer?.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {customer?.status || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.address || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.area || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {customer?.city || 'N/A'}
                                    </p>
                                </div>
                                {customer?.postal_code && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Postal Code</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.postal_code}
                                        </p>
                                    </div>
                                )}
                                {customer?.latitude && customer?.longitude && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">GPS Coordinates</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.latitude}, {customer.longitude}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Connection & Billing Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Connection & Billing Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Connection Type</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                                        {customer?.connection_type || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Cycle</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                                        {customer?.billing_cycle || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Day</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        Day {customer?.billing_day || 'N/A'} of the month
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Connections */}
                    {customer?.connections && customer.connections.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Active Connections ({customer.connections.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Connection ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Package
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                    Installation Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {customer.connections.map((connection) => (
                                                <tr key={connection.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {connection.connection_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {connection.package?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${connection.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : connection.status === 'suspended'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {connection.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(connection.installation_date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Created By */}
                    {customer?.created_by && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.created_by?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {customer.created_at ? new Date(customer.created_at).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
