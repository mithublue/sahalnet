import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ suggestedName, suggestedStartDate, suggestedEndDate }) {
    const { data, setData, post, processing, errors } = useForm({
        name: suggestedName || '',
        start_date: suggestedStartDate || '',
        end_date: suggestedEndDate || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.billing-cycles.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Billing Cycle
                    </h2>
                    <Link
                        href={route('admin.billing-cycles.index')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    >
                        Back to Billing Cycles
                    </Link>
                </div>
            }
        >
            <Head title="Create Billing Cycle" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Billing Cycle Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., January 2026"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                <p className="mt-1 text-sm text-gray-500">
                                    Suggested: {suggestedName}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    What happens next?
                                </h3>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• Billing cycle will be created with "active" status</li>
                                    <li>• You can generate invoices for all active connections</li>
                                    <li>• Invoices will be created automatically based on package prices</li>
                                    <li>• Close the cycle when billing period ends</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('admin.billing-cycles.index')}
                                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    Create Billing Cycle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
