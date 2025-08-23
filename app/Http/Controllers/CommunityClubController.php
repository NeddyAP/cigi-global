<?php

namespace App\Http\Controllers;

use App\Models\CommunityClub;
use Inertia\Inertia;
use Inertia\Response;

class CommunityClubController extends Controller
{
    public function index(): Response
    {
        $communityClubs = CommunityClub::active()
            ->ordered()
            ->get();

        // Group by type for better organization
        $clubsByType = $communityClubs->groupBy('type');

        return Inertia::render('public/community-clubs/index', [
            'communityClubs' => $communityClubs,
            'clubsByType' => $clubsByType,
        ]);
    }

    public function show(CommunityClub $communityClub): Response
    {
        abort_unless($communityClub->is_active, 404);

        // Get related clubs of the same type
        $relatedClubs = $communityClub->getRelatedClubs(3);

        return Inertia::render('public/community-clubs/show', [
            'communityClub' => $communityClub,
            'relatedClubs' => $relatedClubs,
        ]);
    }
}
