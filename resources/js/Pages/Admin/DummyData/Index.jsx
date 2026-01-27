import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const [installing, setInstalling] = useState(false);

    const handleInstall = () => {
        if (confirm('This will install dummy data including:\n\n• 5 Internet Packages\n• 20 Customers\n• 20 Connections\n• 20 Invoices\n• Payments\n• 1 Billing Cycle\n\nContinue?')) {
            setInstalling(true);
            router.post(route('admin.dummy-data.install'), {}, {
                onFinish: () => setInstalling(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dummy Data Installer
                </h2>
            }
        >
            <Head title="Dummy Data Installer" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>

                            <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Install Dummy Data
                            </h3>

                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Populate your database with sample data for testing
                            </p>

                            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-left">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                    What will be installed:
                                </h4>
                                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        5 Internet Packages (5 Mbps to 100 Mbps)
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        20 Customers with realistic data
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        20 Active Connections
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        20 Invoices (various statuses)
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Payments for paid invoices
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        1 Active Billing Cycle
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleInstall}
                                    disabled={installing}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {installing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Installing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Install Dummy Data
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Note: This feature is only available to Super Administrators
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
