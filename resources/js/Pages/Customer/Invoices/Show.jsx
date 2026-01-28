import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function InvoiceShow({ invoice }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <CustomerLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Invoice Details
                    </h2>
                    <Link
                        href={route('customer.invoices.index')}
                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                        ← Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {invoice.invoice_number}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Due Date: {new Date(invoice.due_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Bill To:
                                </h3>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {invoice.customer?.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {invoice.customer?.email}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {invoice.customer?.phone}
                                </p>
                            </div>

                            {/* Invoice Items */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Invoice Items
                                </h3>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Description
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Qty
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Unit Price
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {invoice.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 text-right">
                                                    ৳{item.unit_price.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                    ৳{item.line_total.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Invoice Totals */}
                            <div className="flex justify-end mb-8">
                                <div className="w-64">
                                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                            ৳{invoice.subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    {invoice.discount > 0 && (
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                -৳{invoice.discount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    {invoice.tax_amount > 0 && (
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Tax ({invoice.tax_rate}%):
                                            </span>
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                ৳{invoice.tax_amount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-600">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            ৳{invoice.total_amount.toLocaleString()}
                                        </span>
                                    </div>
                                    {invoice.paid_amount > 0 && (
                                        <>
                                            <div className="flex justify-between py-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Paid:</span>
                                                <span className="text-sm text-green-600 dark:text-green-400">
                                                    -৳{invoice.paid_amount.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Balance:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ৳{invoice.balance.toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Payment History */}
                            {invoice.payments && invoice.payments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Payment History
                                    </h3>
                                    <div className="space-y-2">
                                        {invoice.payments.map((payment, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {payment.payment_number}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    ৳{payment.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-4">
                                <a
                                    href={route('customer.invoices.download', invoice.id)}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Download PDF
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
