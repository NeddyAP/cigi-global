<?php

namespace Tests\Feature;

use App\Models\CommunityClub;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCommunityClubTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_community_clubs_index_page(): void
    {
        // Create test community clubs
        $activeClubs = CommunityClub::factory()->count(3)->create([
            'is_active' => true,
            'type' => 'Professional',
            'sort_order' => 1,
        ]);

        $inactiveClub = CommunityClub::factory()->create([
            'is_active' => false,
        ]);

        $response = $this->get(route('community-clubs.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('community-clubs/index')
            ->has('communityClubs', 3) // Should only show active clubs
            ->has('clubsByType')
            ->where('communityClubs', function ($clubs) use ($activeClubs) {
                $clubNames = collect($clubs)->pluck('name')->toArray();
                $expectedNames = $activeClubs->pluck('name')->toArray();

                return count(array_intersect($clubNames, $expectedNames)) === 3;
            })
        );
    }

    public function test_clubs_are_grouped_by_type(): void
    {
        CommunityClub::factory()->count(2)->create([
            'is_active' => true,
            'type' => 'Professional',
        ]);

        CommunityClub::factory()->count(3)->create([
            'is_active' => true,
            'type' => 'Sports',
        ]);

        $response = $this->get(route('community-clubs.index'));

        $response->assertInertia(fn ($page) => $page->where('clubsByType.Professional', function ($clubs) {
            return count($clubs) === 2;
        })
            ->where('clubsByType.Sports', function ($clubs) {
                return count($clubs) === 3;
            })
        );
    }

    public function test_can_view_community_club_detail_page(): void
    {
        $communityClub = CommunityClub::factory()->create([
            'is_active' => true,
            'slug' => 'test-club',
            'name' => 'Test Club',
            'description' => 'Test description',
            'type' => 'Professional',
        ]);

        $response = $this->get(route('community-clubs.show', 'test-club'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('community-clubs/show')
            ->where('communityClub.name', 'Test Club')
            ->where('communityClub.description', 'Test description')
            ->where('communityClub.type', 'Professional')
            ->has('relatedClubs')
        );
    }

    public function test_cannot_view_inactive_community_club(): void
    {
        $communityClub = CommunityClub::factory()->create([
            'is_active' => false,
            'slug' => 'inactive-club',
        ]);

        $response = $this->get(route('community-clubs.show', 'inactive-club'));

        $response->assertStatus(404);
    }

    public function test_related_clubs_are_same_type(): void
    {
        $currentClub = CommunityClub::factory()->create([
            'is_active' => true,
            'slug' => 'current-club',
            'type' => 'Professional',
        ]);

        // Create clubs of the same type
        $sameTypeClubs = CommunityClub::factory()->count(3)->create([
            'is_active' => true,
            'type' => 'Professional',
        ]);

        // Create clubs of different type
        $differentTypeClubs = CommunityClub::factory()->count(2)->create([
            'is_active' => true,
            'type' => 'Sports',
        ]);

        $response = $this->get(route('community-clubs.show', 'current-club'));

        $response->assertInertia(fn ($page) => $page->has('relatedClubs')
            ->where('relatedClubs', function ($clubs) use ($currentClub) {
                $clubsCollection = collect($clubs);

                // Should not contain current club
                $containsCurrent = $clubsCollection->contains('id', $currentClub->id);

                // Should only contain clubs of the same type
                $allSameType = $clubsCollection->every(fn ($club) => $club['type'] === 'Professional');

                return ! $containsCurrent && $allSameType;
            })
        );
    }
}
