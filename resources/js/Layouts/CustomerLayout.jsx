import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function CustomerLayout({ header, children }) {
    const { customer } = usePage().props;

    const handleLogout = () => {
        router.post(route('customer.logout'));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href={route('customer.dashboard')} className="text-xl font-bold text-indigo-600">
                                ISP Portal
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex space-x-8">
                            <Link
                                href={route('customer.dashboard')}
                                className={`${route().current('customer.dashboard')
                                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Invoices
                            </Link>
                            <Link
                                href="#"
                                className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Payments
                            </Link>
                            <Link
                                href="#"
                                className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Connections
                            </Link>
                            <Link
                                href="#"
                                className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Support
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {customer?.name || 'Customer'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
