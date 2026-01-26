import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ package: pkg }) {
    const { data, setData, put, processing, errors } = useForm({
        name: pkg.name || '',
        bandwidth_download: pkg.bandwidth_download || '',
        bandwidth_upload: pkg.bandwidth_upload || '',
        price: pkg.price || '',
        setup_fee: pkg.setup_fee || 0,
        validity_days: pkg.validity_days || 30,
        description: pkg.description || '',
        is_active: pkg.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.packages.update', pkg.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Package: {pkg.name}
                    </h2>
                    <Link
                        href={route('admin.packages.index')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    >
                        Back to Packages
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${pkg.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Package Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Bandwidth */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Download Speed (Mbps) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.bandwidth_download}
                                        onChange={(e) => setData('bandwidth_download', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.bandwidth_download && <p className="mt-1 text-sm text-red-600">{errors.bandwidth_download}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Upload Speed (Mbps) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.bandwidth_upload}
                                        onChange={(e) => setData('bandwidth_upload', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.bandwidth_upload && <p className="mt-1 text-sm text-red-600">{errors.bandwidth_upload}</p>}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Monthly Price (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Setup Fee (৳)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.setup_fee}
                                        onChange={(e) => setData('setup_fee', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.setup_fee && <p className="mt-1 text-sm text-red-600">{errors.setup_fee}</p>}
                                </div>
                            </div>

                            {/* Validity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Validity (Days) *
                                </label>
                                <input
                                    type="number"
                                    value={data.validity_days}
                                    onChange={(e) => setData('validity_days', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.validity_days && <p className="mt-1 text-sm text-red-600">{errors.validity_days}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-indigo-600"
                                />
                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Active (Available for new connections)
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('admin.packages.index')}
                                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    Update Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
