import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProfileEdit({ customer }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        secondary_phone: customer.secondary_phone || '',
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        patch: patchPassword,
        processing: processingPassword,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route('customer.profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        patchPassword(route('customer.profile.password'), {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <CustomerLayout
            header={
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Account Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Account Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    View your account details
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID</p>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                                        {customer.customer_id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="mt-1">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${customer.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </p>
                                </div>
                                {customer.address && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {customer.address}
                                            {customer.area && `, ${customer.area}`}
                                            {customer.city && `, ${customer.city}`}
                                            {customer.postal_code && ` - ${customer.postal_code}`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Update Profile Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Profile
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Update your contact information
                                </p>
                            </div>

                            <form onSubmit={submitProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <InputLabel htmlFor="name" value="Name *" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Email *" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone *" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    {/* Secondary Phone */}
                                    <div>
                                        <InputLabel htmlFor="secondary_phone" value="Secondary Phone" />
                                        <TextInput
                                            id="secondary_phone"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.secondary_phone}
                                            onChange={(e) => setData('secondary_phone', e.target.value)}
                                        />
                                        <InputError message={errors.secondary_phone} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Change Password
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Ensure your account is using a strong password
                                </p>
                            </div>

                            <form onSubmit={submitPassword} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <InputLabel htmlFor="current_password" value="Current Password *" />
                                    <TextInput
                                        id="current_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <InputError message={passwordErrors.current_password} className="mt-2" />
                                </div>

                                {/* New Password */}
                                <div>
                                    <InputLabel htmlFor="password" value="New Password *" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError message={passwordErrors.password} className="mt-2" />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Must be at least 8 characters
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password *" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError message={passwordErrors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processingPassword}>
                                        {processingPassword ? 'Changing...' : 'Change Password'}
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
