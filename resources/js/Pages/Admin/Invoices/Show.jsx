import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ invoice }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: invoice.balance_due || 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        transaction_id: '',
        notes: '',
    });

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(route('admin.payments.store', { invoice_id: invoice.id }), {
            onSuccess: () => {
                reset();
                setShowPaymentForm(false);
            },
        });
    };

    const handleMarkAsPaid = () => {
        if (confirm('Mark this invoice as paid?')) {
            router.post(route('admin.invoices.mark-paid', invoice.id));
        }
    };

    const handleSend = () => {
        if (confirm('Send this invoice to customer?')) {
            router.post(route('admin.invoices.send', invoice.id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            partial: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800',
        };
        return badges[status] || badges.draft;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Invoice: {invoice.invoice_number}
                    </h2>
                    <div className="flex gap-2">
                        {invoice.status === 'draft' && (
                            <>
                                <Link
                                    href={route('admin.invoices.edit', invoice.id)}
                                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleSend}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                                >
                                    Send
                                </button>
                            </>
                        )}
                        {invoice.payment_status !== 'paid' && (
                            <button
                                onClick={() => setShowPaymentForm(!showPaymentForm)}
                                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                            >
                                Record Payment
                            </button>
                        )}
                        <Link
                            href={route('admin.invoices.index')}
                            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Payment Form */}
                    {showPaymentForm && invoice.payment_status !== 'paid' && (
                        <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Record Payment
                            </h3>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                                            step="0.01"
                                            max={invoice.balance_due}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        />
                                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                        <p className="mt-1 text-xs text-gray-500">Balance Due: ৳{invoice.balance_due}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Payment Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Payment Method *
                                        </label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="mobile_banking">Mobile Banking</option>
                                            <option value="card">Card</option>
                                            <option value="online">Online</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        value={data.transaction_id}
                                        onChange={(e) => setData('transaction_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentForm(false)}
                                        className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:opacity-50"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Invoice Details */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Invoice Information
                                </h3>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{invoice.invoice_number}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
                                        <dd>
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Invoice Date</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(invoice.invoice_date).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Due Date</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Customer Information
                                </h3>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Customer</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {invoice.customer?.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Customer ID</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {invoice.customer?.customer_id}
                                        </dd>
                                    </div>
                                    {invoice.connection && (
                                        <div>
                                            <dt className="text-sm text-gray-500 dark:text-gray-400">Connection</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {invoice.connection?.connection_id} - {invoice.connection?.package?.name}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Invoice Items
                            </h3>
                            <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {invoice.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">{item.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">৳{parseFloat(item.unit_price).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">৳{parseFloat(item.amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="mt-6 flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                        <span className="font-medium">৳{parseFloat(invoice.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                                        <span className="font-medium">৳{parseFloat(invoice.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                                        <span className="font-medium">-৳{parseFloat(invoice.discount_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-indigo-600">৳{parseFloat(invoice.total_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                                        <span className="font-medium text-green-600">৳{parseFloat(invoice.paid_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="font-bold">Balance Due:</span>
                                        <span className="font-bold text-red-600">৳{parseFloat(invoice.balance_due).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payments */}
                        {invoice.payments && invoice.payments.length > 0 && (
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Payment History
                                </h3>
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment #</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Received By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {invoice.payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{payment.payment_number}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(payment.payment_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{payment.payment_method}</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                                                    ৳{parseFloat(payment.amount).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{payment.received_by?.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Notes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
