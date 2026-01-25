<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'required|in:en,ar,bn',
        ]);

        session(['locale' => $validated['locale']]);
        app()->setLocale($validated['locale']);

        return back();
    }
}
