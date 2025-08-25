<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
use App\Models\GlobalVariable;
use App\Models\Media;
use App\Models\News;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Use enhanced model methods
        $businessUnits = BusinessUnit::getFeatured(6);
        $communityClubs = CommunityClub::getFeatured(8);

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
                'home_gallery_ids',
            ])
            ->pluck('value', 'key');

        // Get gallery media
        $galleryMediaIds = $globalVars['home_gallery_ids'] ?? null;
        $galleryMedia = collect();

        if ($galleryMediaIds) {
            $mediaIds = json_decode($galleryMediaIds, true);
            if (is_array($mediaIds)) {
                $galleryMedia = Media::whereIn('id', $mediaIds)
                    ->orderBy('created_at', 'desc')
                    ->limit(8)
                    ->get();
            }
        }

        return Inertia::render('home', [
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
            'featuredNews' => $featuredNews,
            'latestNews' => $latestNews,
            'globalVars' => $globalVars,
            'galleryMedia' => $galleryMedia,
        ]);
    }

    public function landingDemo(): Response
    {
        return Inertia::render('landing-demo');
    }
}
