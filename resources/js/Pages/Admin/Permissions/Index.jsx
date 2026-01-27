import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ permissions }) {
    const handleDelete = (permission) => {
        if (confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
            router.delete(route('admin.permissions.destroy', permission.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Permissions Management
                    </h2>
                    <Link
                        href={route('admin.permissions.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                    >
                        Create Permission
                    </Link>
                </div>
            }
        >
            <Head title="Permissions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            {Object.entries(permissions).map(([group, groupPermissions]) => (
                                <div key={group} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize mb-4">
                                        {group} ({groupPermissions.length})
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Permission Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Assigned to Roles
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {groupPermissions.map((permission) => (
                                                    <tr key={permission.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {permission.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {permission.roles_count} roles
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {permission.roles_count === 0 && (
                                                                <button
                                                                    onClick={() => handleDelete(permission)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                            {permission.roles_count > 0 && (
                                                                <span className="text-gray-400">
                                                                    In use
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
