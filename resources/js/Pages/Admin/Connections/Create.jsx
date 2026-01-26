import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ customers, packages }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        package_id: '',
        ip_address: '',
        mac_address: '',
        installation_date: new Date().toISOString().split('T')[0],
        status: 'active',
        mikrotik_profile: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.connections.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Connection
                    </h2>
                    <Link
                        href={route('admin.connections.index')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    >
                        Back to Connections
                    </Link>
                </div>
            }
        >
            <Head title="Create Connection" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Customer *
                                </label>
                                <select
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.customer_id} - {customer.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.customer_id && <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>}
                            </div>

                            {/* Package Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Package *
                                </label>
                                <select
                                    value={data.package_id}
                                    onChange={(e) => setData('package_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="">Select Package</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} - {pkg.bandwidth_download}/{pkg.bandwidth_upload} Mbps - ৳{pkg.price}
                                        </option>
                                    ))}
                                </select>
                                {errors.package_id && <p className="mt-1 text-sm text-red-600">{errors.package_id}</p>}
                            </div>

                            {/* Network Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        IP Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ip_address}
                                        onChange={(e) => setData('ip_address', e.target.value)}
                                        placeholder="192.168.1.100"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.ip_address && <p className="mt-1 text-sm text-red-600">{errors.ip_address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        MAC Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mac_address}
                                        onChange={(e) => setData('mac_address', e.target.value)}
                                        placeholder="00:11:22:33:44:55"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.mac_address && <p className="mt-1 text-sm text-red-600">{errors.mac_address}</p>}
                                </div>
                            </div>

                            {/* Installation Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Installation Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.installation_date}
                                    onChange={(e) => setData('installation_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.installation_date && <p className="mt-1 text-sm text-red-600">{errors.installation_date}</p>}
                                <p className="mt-1 text-sm text-gray-500">Expiry date will be auto-calculated based on package validity</p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>

                            {/* MikroTik Profile */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    MikroTik Profile
                                </label>
                                <input
                                    type="text"
                                    value={data.mikrotik_profile}
                                    onChange={(e) => setData('mikrotik_profile', e.target.value)}
                                    placeholder="Profile name in MikroTik"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    placeholder="Additional notes about this connection..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('admin.connections.index')}
                                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    Create Connection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
