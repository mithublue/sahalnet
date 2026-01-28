import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            console.log('Fetching notifications from:', route('notifications.index'));
            const response = await fetch(route('notifications.index'));
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Notifications data:', data);
            setNotifications(data.notifications || []);
            setCount(data.count || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        router.post(route('notifications.read', id), {}, {
            preserveScroll: true,
            onSuccess: () => fetchNotifications(),
            onError: (error) => console.error('Failed to mark notification as read:', error)
        });
    };

    const markAllAsRead = async () => {
        router.post(route('notifications.read-all'), {}, {
            preserveScroll: true,
            onSuccess: () => fetchNotifications(),
            onError: (error) => console.error('Failed to mark all as read:', error)
        });
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.data.ticket_id) {
            const routeName = notification.notifiable_type.includes('User')
                ? 'admin.support-tickets.show'
                : 'customer.support.show';
            router.visit(route(routeName, notification.data.ticket_id));
        }
    };

    return (
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {count > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {count}
                            </span>
                        )}
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content align="right" width="96">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            {count > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 cursor-pointer"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {notification.data.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No new notifications
                            </div>
                        )}
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
