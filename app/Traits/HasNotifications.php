<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait HasNotifications
{
    /**
     * Create a notification for the user/customer
     */
    public function createNotification(string $type, array $data): void
    {
        DB::table('notifications')->insert([
            'type' => $type,
            'notifiable_type' => get_class($this),
            'notifiable_id' => $this->id,
            'data' => json_encode($data),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Get unread notifications
     */
    public function getUnreadNotifications()
    {
        return DB::table('notifications')
            ->where('notifiable_type', get_class($this))
            ->where('notifiable_id', $this->id)
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                $notification->data = json_decode($notification->data, true);
                return $notification;
            });
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(int $notificationId): void
    {
        DB::table('notifications')
            ->where('id', $notificationId)
            ->where('notifiable_type', get_class($this))
            ->where('notifiable_id', $this->id)
            ->update(['read_at' => now()]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead(): void
    {
        DB::table('notifications')
            ->where('notifiable_type', get_class($this))
            ->where('notifiable_id', $this->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
