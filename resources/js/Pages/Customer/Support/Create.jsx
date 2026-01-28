import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function SupportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customer.support.store'));
    };

    return (
        <CustomerLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create Support Ticket
                    </h2>
                    <Link
                        href={route('customer.support.index')}
                        className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                        ← Back to Tickets
                    </Link>
                </div>
            }
        >
            <Head title="Create Support Ticket" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Subject */}
                                <div>
                                    <InputLabel htmlFor="subject" value="Subject *" />
                                    <TextInput
                                        id="subject"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                        autoFocus
                                        placeholder="Brief description of your issue"
                                    />
                                    <InputError message={errors.subject} className="mt-2" />
                                </div>

                                {/* Priority */}
                                <div>
                                    <InputLabel htmlFor="priority" value="Priority *" />
                                    <select
                                        id="priority"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="low">Low - General inquiry</option>
                                        <option value="medium">Medium - Issue affecting service</option>
                                        <option value="high">High - Service disruption</option>
                                        <option value="urgent">Urgent - Complete service outage</option>
                                    </select>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description *" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="6"
                                        required
                                        placeholder="Please provide detailed information about your issue..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Include any relevant details such as error messages, when the issue started, and steps to reproduce.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('customer.support.index')}
                                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Ticket'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
