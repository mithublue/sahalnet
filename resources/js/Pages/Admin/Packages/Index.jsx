import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ packages, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.packages.index'), { search, status }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleToggle = (pkg) => {
        if (confirm(`Are you sure you want to ${pkg.is_active ? 'deactivate' : 'activate'} this package?`)) {
            router.post(route('admin.packages.toggle', pkg.id));
        }
    };

    const handleDelete = (pkg) => {
        if (confirm(`Are you sure you want to delete ${pkg.name}?`)) {
            router.delete(route('admin.packages.destroy', pkg.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Package Management
                    </h2>
                    <Link
                        href={route('admin.packages.create')}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Create Package
                    </Link>
                </div>
            }
        >
            <Head title="Packages" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="mb-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Filter
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.data.map((pkg) => (
                            <div key={pkg.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {pkg.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {pkg.bandwidth_download} / {pkg.bandwidth_upload} Mbps
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${pkg.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ৳{pkg.price}
                                        <span className="text-sm font-normal text-gray-500">/month</span>
                                    </div>
                                    {pkg.setup_fee > 0 && (
                                        <p className="text-sm text-gray-500">
                                            Setup Fee: ৳{pkg.setup_fee}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Validity: {pkg.validity_days} days
                                    </p>
                                </div>

                                {pkg.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {pkg.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <span>{pkg.active_connections_count || 0} active connections</span>
                                    <span>{pkg.connections_count || 0} total</span>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={route('admin.packages.edit', pkg.id)}
                                        className="flex-1 text-center rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleToggle(pkg)}
                                        className="flex-1 rounded-md bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-500"
                                    >
                                        {pkg.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg)}
                                        className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
                                        disabled={pkg.active_connections_count > 0}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {packages.links.length > 3 && (
                        <div className="mt-6 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm sm:rounded-lg">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {packages.from} to {packages.to} of {packages.total} results
                                </div>
                                <div className="flex gap-2">
                                    {packages.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded ${link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
