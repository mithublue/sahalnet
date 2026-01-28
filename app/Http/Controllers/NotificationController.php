<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            $user = Auth::guard('customer')->user();
        }

        if (!$user) {
            return response()->json(['notifications' => [], 'count' => 0]);
        }

        $notifications = $user->getUnreadNotifications();

        return response()->json([
            'notifications' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user() ?? Auth::guard('customer')->user();

        if ($user) {
            $user->markNotificationAsRead($id);
        }

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user() ?? Auth::guard('customer')->user();

        if ($user) {
            $user->markAllNotificationsAsRead();
        }

        return response()->json(['success' => true]);
    }
}
