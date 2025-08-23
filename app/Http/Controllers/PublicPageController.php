<?php

namespace App\Http\Controllers;

use App\Models\GlobalVariable;
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
}
