<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        try {
            $notifications = $user->getUnreadNotifications();

            return response()->json([
                'notifications' => $notifications,
                'count' => $notifications->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Notification fetch error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'user_type' => get_class($user)
            ]);

            return response()->json([
                'notifications' => [],
                'count' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
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
