<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
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

        return Inertia::render('home', [
            'businessUnits' => $businessUnits,
            'communityClubs' => $communityClubs,
            'featuredNews' => $featuredNews,
            'latestNews' => $latestNews,
        ]);
    }
}
