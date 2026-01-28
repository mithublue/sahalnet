<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerProfileController extends Controller
{
    public function edit()
    {
        $customer = Auth::guard('customer')->user();

        return Inertia::render('Customer/Profile/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $customer->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $customer->update([
            'password' => $validated['password'],
        ]);

        return back()->with('success', 'Password changed successfully.');
    }
}
