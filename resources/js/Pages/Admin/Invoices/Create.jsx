import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ customers, connections }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        connection_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tax_amount: 0,
        discount_amount: 0,
        notes: '',
        items: [
            { description: '', quantity: 1, unit_price: 0 },
        ],
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const handleCustomerChange = (customerId) => {
        setData('customer_id', customerId);

        // Auto-fill from connection if available
        const connection = connections.find(c => c.customer_id == customerId);
        if (connection) {
            setData(prev => ({
                ...prev,
                customer_id: customerId,
                connection_id: connection.id,
                items: [{
                    description: `${connection.package.name} - Internet Service`,
                    quantity: 1,
                    unit_price: connection.package.price,
                }],
            }));
        }
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal + parseFloat(data.tax_amount || 0) - parseFloat(data.discount_amount || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.invoices.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Invoice
                    </h2>
                    <Link
                        href={route('admin.invoices.index')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    >
                        Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title="Create Invoice" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer & Connection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Customer *
                                    </label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) => handleCustomerChange(e.target.value)}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Connection (Optional)
                                    </label>
                                    <select
                                        value={data.connection_id}
                                        onChange={(e) => setData('connection_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    >
                                        <option value="">No Connection</option>
                                        {connections.filter(c => c.customer_id == data.customer_id).map((connection) => (
                                            <option key={connection.id} value={connection.id}>
                                                {connection.connection_id} - {connection.package.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Invoice Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.invoice_date}
                                        onChange={(e) => setData('invoice_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.invoice_date && <p className="mt-1 text-sm text-red-600">{errors.invoice_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    />
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Invoice Items *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        + Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                            <div className="col-span-5">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    placeholder="Description"
                                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    placeholder="Qty"
                                                    min="1"
                                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    placeholder="Price"
                                                    step="0.01"
                                                    min="0"
                                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-between">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    ৳{(item.quantity * item.unit_price).toFixed(2)}
                                                </span>
                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
                            </div>

                            {/* Totals */}
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tax Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={data.tax_amount}
                                                onChange={(e) => setData('tax_amount', parseFloat(e.target.value) || 0)}
                                                step="0.01"
                                                min="0"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Discount Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={data.discount_amount}
                                                onChange={(e) => setData('discount_amount', parseFloat(e.target.value) || 0)}
                                                step="0.01"
                                                min="0"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                                            <span className="text-sm font-medium">৳{calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                                            <span className="text-sm font-medium">৳{parseFloat(data.tax_amount || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                                            <span className="text-sm font-medium">-৳{parseFloat(data.discount_amount || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-lg font-bold">Total:</span>
                                            <span className="text-lg font-bold text-indigo-600">৳{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
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
                                    placeholder="Additional notes..."
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href={route('admin.invoices.index')}
                                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
