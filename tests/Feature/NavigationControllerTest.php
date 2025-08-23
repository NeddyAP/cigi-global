<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
use App\Models\CommunityClub;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class NavigationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_navigation_data_endpoint_returns_correct_structure(): void
    {
        // Create test data
        BusinessUnit::factory()->count(3)->create(['is_active' => true]);
        CommunityClub::factory()->count(2)->create(['is_active' => true, 'type' => 'Professional']);
        CommunityClub::factory()->count(2)->create(['is_active' => true, 'type' => 'Sports']);

        $response = $this->get(route('api.navigation-data'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'business_units' => [
                '*' => [
                    'id',
                    'name',
                    'slug',
                    'description',
                    'image',
                    'services_count',
                ],
            ],
            'community_clubs' => [
                '*' => [
                    'id',
                    'name',
                    'slug',
                    'description',
                    'type',
                    'image',
                    'activities_count',
                ],
            ],
            'club_types',
        ]);

        $data = $response->json();

        $this->assertCount(3, $data['business_units']);
        $this->assertCount(4, $data['community_clubs']);
        $this->assertContains('Professional', $data['club_types']);
        $this->assertContains('Sports', $data['club_types']);
    }

    public function test_navigation_data_respects_active_status(): void
    {
        // Create active and inactive items
        BusinessUnit::factory()->count(2)->create(['is_active' => true]);
        BusinessUnit::factory()->count(3)->create(['is_active' => false]);

        CommunityClub::factory()->count(2)->create(['is_active' => true]);
        CommunityClub::factory()->count(1)->create(['is_active' => false]);

        $response = $this->get(route('api.navigation-data'));

        $data = $response->json();

        // Should only return active items
        $this->assertCount(2, $data['business_units']);
        $this->assertCount(2, $data['community_clubs']);
    }

    public function test_navigation_data_respects_limits(): void
    {
        // Create more items than the limit
        BusinessUnit::factory()->count(10)->create(['is_active' => true]);
        CommunityClub::factory()->count(15)->create(['is_active' => true]);

        $response = $this->get(route('api.navigation-data'));

        $data = $response->json();

        // Should respect the limits (6 for business units, 8 for community clubs)
        $this->assertCount(6, $data['business_units']);
        $this->assertCount(8, $data['community_clubs']);
    }

    public function test_navigation_data_is_cached(): void
    {
        BusinessUnit::factory()->count(2)->create(['is_active' => true]);

        // Clear cache first
        Cache::forget('navigation_data');

        // First request should hit the database
        $response1 = $this->get(route('api.navigation-data'));
        $response1->assertStatus(200);

        // Verify data is cached
        $this->assertTrue(Cache::has('navigation_data'));

        // Second request should use cache
        $response2 = $this->get(route('api.navigation-data'));
        $response2->assertStatus(200);

        // Responses should be identical
        $this->assertEquals($response1->json(), $response2->json());
    }

    public function test_can_clear_navigation_cache(): void
    {
        // Set up cache
        Cache::put('navigation_data', ['test' => 'data'], 300);
        $this->assertTrue(Cache::has('navigation_data'));

        $response = $this->post(route('api.navigation-cache.clear'));

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Navigation cache cleared successfully']);
        $this->assertFalse(Cache::has('navigation_data'));
    }

    public function test_navigation_data_orders_items_correctly(): void
    {
        // Create items with specific sort orders
        BusinessUnit::factory()->create([
            'name' => 'Unit C',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        BusinessUnit::factory()->create([
            'name' => 'Unit A',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        BusinessUnit::factory()->create([
            'name' => 'Unit B',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $response = $this->get(route('api.navigation-data'));

        $data = $response->json();

        // Should be ordered by sort_order then name
        $this->assertEquals('Unit A', $data['business_units'][0]['name']);
        $this->assertEquals('Unit B', $data['business_units'][1]['name']);
        $this->assertEquals('Unit C', $data['business_units'][2]['name']);
    }
}
