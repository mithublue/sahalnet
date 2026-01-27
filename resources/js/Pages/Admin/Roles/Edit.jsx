import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ role, permissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        permissions: role.permissions?.map(p => p.name) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    const togglePermission = (permissionName) => {
        setData('permissions',
            data.permissions.includes(permissionName)
                ? data.permissions.filter(p => p !== permissionName)
                : [...data.permissions, permissionName]
        );
    };

    const toggleGroup = (groupPermissions) => {
        const allSelected = groupPermissions.every(p => data.permissions.includes(p.name));
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !groupPermissions.find(gp => gp.name === p)));
        } else {
            const newPerms = [...data.permissions];
            groupPermissions.forEach(p => {
                if (!newPerms.includes(p.name)) {
                    newPerms.push(p.name);
                }
            });
            setData('permissions', newPerms);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Role: {role.name}
                </h2>
            }
        >
            <Head title={`Edit Role: ${role.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    disabled={['super_admin', 'admin'].includes(role.name)}
                                />
                                {['super_admin', 'admin'].includes(role.name) && (
                                    <p className="mt-1 text-sm text-gray-500">System roles cannot be renamed</p>
                                )}
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Permissions
                                </label>
                                <div className="space-y-4">
                                    {Object.entries(permissions).map(([group, groupPermissions]) => (
                                        <div key={group} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                                                    {group}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(groupPermissions)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                                >
                                                    {groupPermissions.every(p => data.permissions.includes(p.name)) ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {groupPermissions.map((permission) => (
                                                    <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(permission.name)}
                                                            onChange={() => togglePermission(permission.name)}
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {permission.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <a
                                    href={route('admin.roles.index')}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    Update Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
