<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class NavigationController extends Controller
{
    /**
     * Get navigation data for header dropdowns
     */
    public function data(): JsonResponse
    {
        $data = Cache::remember('navigation_data', 300, function () {
            // Get featured business units for navigation (limit to 6 for performance)
            $businessUnits = BusinessUnit::active()
                ->ordered()
                ->limit(6)
                ->get()
                ->map(function ($unit) {
                    return $unit->toNavigationArray();
                });

            // Get community clubs grouped by type for navigation (limit to 8 for performance)
            $communityClubs = CommunityClub::active()
                ->ordered()
                ->limit(8)
                ->get()
                ->map(function ($club) {
                    return $club->toNavigationArray();
                });

            // Get unique club types
            $clubTypes = CommunityClub::getTypes()->toArray();

            return [
                'business_units' => $businessUnits,
                'community_clubs' => $communityClubs,
                'club_types' => $clubTypes,
            ];
        });

        return response()->json($data);
    }

    /**
     * Clear navigation cache
     */
    public function clearCache(): JsonResponse
    {
        Cache::forget('navigation_data');

        return response()->json([
            'message' => 'Navigation cache cleared successfully',
        ]);
    }
}
