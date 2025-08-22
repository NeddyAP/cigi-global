<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
use App\Models\GlobalVariable;
use App\Models\News;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $businessUnits = BusinessUnit::where('is_active', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        $communityClubs = CommunityClub::where('is_active', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        $featuredNews = News::published()
            ->featured()
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->take(3)
            ->get();

        $latestNews = News::published()
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->take(6)
            ->get();

        // Get global variables for homepage
        $globalVars = GlobalVariable::public()
            ->whereIn('key', [
                'company_name',
                'company_tagline',
                'company_description',
                'contact_phone',
                'contact_email',
                'contact_whatsapp',
            ])
            ->pluck('value', 'key');

        return Inertia::render('home', [
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
            'featuredNews' => $featuredNews,
            'latestNews' => $latestNews,
            'globalVars' => $globalVars,
        ]);
    }
}
