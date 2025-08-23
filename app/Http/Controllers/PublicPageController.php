<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\GlobalVariable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Show the about page.
     */
    public function about(): Response
    {
        $globalVars = GlobalVariable::whereIn('key', [
            'company_name',
            'company_description',
            'company_vision',
            'company_mission',
            'company_values',
            'company_history',
            'contact_phone',
            'contact_email',
            'contact_address',
            'contact_whatsapp',
        ])
            ->where('is_public', true)
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('public/about', [
            'globalVars' => $globalVars,
        ]);
    }

    /**
     * Show the contact page.
     */
    public function contact(): Response
    {
        $globalVars = GlobalVariable::whereIn('key', [
            'company_name',
            'contact_phone',
            'contact_email',
            'contact_address',
            'contact_whatsapp',
            'contact_office_hours',
            'contact_social_facebook',
            'contact_social_instagram',
            'contact_social_twitter',
            'contact_social_linkedin',
        ])
            ->where('is_public', true)
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('public/contact', [
            'globalVars' => $globalVars,
        ]);
    }

    /**
     * Store a contact message.
     */
    public function storeContactMessage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Add additional metadata
        $validated['ip_address'] = $request->ip();
        $validated['user_agent'] = $request->userAgent();

        ContactMessage::create($validated);

        return redirect()->back()
            ->with('success', 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.');
    }
}
