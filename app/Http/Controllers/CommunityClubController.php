<?php

namespace App\Http\Controllers;

use App\Models\CommunityClub;
use Inertia\Inertia;
use Inertia\Response;

class CommunityClubController extends Controller
{
    public function index(): Response
    {
        $communityClubs = CommunityClub::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        // Group by type for better organization
        $clubsByType = $communityClubs->groupBy('type');

        return Inertia::render('community-clubs/index', [
            'communityClubs' => $communityClubs,
            'clubsByType' => $clubsByType,
        ]);
    }

    public function show(CommunityClub $communityClub): Response
    {
        abort_unless($communityClub->is_active, 404);

        return Inertia::render('community-clubs/show', [
            'communityClub' => $communityClub,
        ]);
    }
}
