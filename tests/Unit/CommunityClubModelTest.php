<?php

namespace Tests\Unit;

use App\Models\CommunityClub;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityClubModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_scope_filters_correctly(): void
    {
        CommunityClub::factory()->count(3)->create(['is_active' => true]);
        CommunityClub::factory()->count(2)->create(['is_active' => false]);

        $activeClubs = CommunityClub::active()->get();

        $this->assertCount(3, $activeClubs);
        $this->assertTrue($activeClubs->every(fn ($club) => $club->is_active));
    }

    public function test_by_type_scope_filters_correctly(): void
    {
        CommunityClub::factory()->count(2)->create(['type' => 'Professional']);
        CommunityClub::factory()->count(3)->create(['type' => 'Sports']);

        $professionalClubs = CommunityClub::byType('Professional')->get();

        $this->assertCount(2, $professionalClubs);
        $this->assertTrue($professionalClubs->every(fn ($club) => $club->type === 'Professional'));
    }

    public function test_with_activities_scope_filters_correctly(): void
    {
        CommunityClub::factory()->count(2)->create(['activities' => json_encode(['Reading', 'Writing'])]);
        CommunityClub::factory()->count(3)->create(['activities' => null]);

        $clubsWithActivities = CommunityClub::withActivities()->get();

        $this->assertCount(2, $clubsWithActivities);
        $this->assertTrue($clubsWithActivities->every(fn ($club) => ! is_null($club->activities)));
    }

    public function test_with_contact_scope_filters_correctly(): void
    {
        CommunityClub::factory()->create(['contact_person' => 'John Doe']);
        CommunityClub::factory()->create(['contact_phone' => '123456789']);
        CommunityClub::factory()->create(['contact_email' => 'test@example.com']);
        CommunityClub::factory()->create(['contact_person' => null, 'contact_phone' => null, 'contact_email' => null]);

        $clubsWithContact = CommunityClub::withContact()->get();

        $this->assertCount(3, $clubsWithContact);
    }

    public function test_with_meeting_info_scope_filters_correctly(): void
    {
        CommunityClub::factory()->create(['meeting_schedule' => 'Weekly', 'location' => 'Conference Room']);
        CommunityClub::factory()->create(['meeting_schedule' => 'Monthly', 'location' => null]);
        CommunityClub::factory()->create(['meeting_schedule' => null, 'location' => 'Office']);

        $clubsWithMeetingInfo = CommunityClub::withMeetingInfo()->get();

        $this->assertCount(1, $clubsWithMeetingInfo);
    }

    public function test_by_activity_scope_filters_correctly(): void
    {
        CommunityClub::factory()->create(['activities' => json_encode(['Reading', 'Writing'])]);
        CommunityClub::factory()->create(['activities' => json_encode(['Sports', 'Gaming'])]);
        CommunityClub::factory()->create(['activities' => 'Reading, Music']); // Test comma-separated format

        $readingClubs = CommunityClub::byActivity('Reading')->get();

        $this->assertCount(2, $readingClubs);
    }

    public function test_search_scope_searches_multiple_fields(): void
    {
        CommunityClub::factory()->create(['name' => 'Tech Club', 'description' => 'Technology enthusiasts']);
        CommunityClub::factory()->create(['name' => 'Sports Club', 'type' => 'Tech Activities']);
        CommunityClub::factory()->create(['name' => 'Book Club', 'activities' => json_encode(['Tech Reading'])]);

        $techClubs = CommunityClub::search('Tech')->get();

        $this->assertCount(3, $techClubs);
    }

    public function test_activities_array_accessor_with_json(): void
    {
        $club = CommunityClub::factory()->create(['activities' => json_encode(['Reading', 'Writing', 'Discussion'])]);

        $activities = $club->activities_array;

        $this->assertIsArray($activities);
        $this->assertCount(3, $activities);
        $this->assertContains('Reading', $activities);
        $this->assertContains('Writing', $activities);
        $this->assertContains('Discussion', $activities);
    }

    public function test_activities_array_accessor_with_comma_separated(): void
    {
        $club = CommunityClub::factory()->create(['activities' => 'Reading, Writing, Discussion']);

        $activities = $club->activities_array;

        $this->assertIsArray($activities);
        $this->assertCount(3, $activities);
        $this->assertContains('Reading', $activities);
        $this->assertContains('Writing', $activities);
        $this->assertContains('Discussion', $activities);
    }

    public function test_has_contact_accessor(): void
    {
        $clubWithPerson = CommunityClub::factory()->create(['contact_person' => 'John Doe']);
        $clubWithPhone = CommunityClub::factory()->create(['contact_phone' => '123456789']);
        $clubWithEmail = CommunityClub::factory()->create(['contact_email' => 'test@example.com']);
        $clubWithoutContact = CommunityClub::factory()->create(['contact_person' => null, 'contact_phone' => null, 'contact_email' => null]);

        $this->assertTrue($clubWithPerson->has_contact);
        $this->assertTrue($clubWithPhone->has_contact);
        $this->assertTrue($clubWithEmail->has_contact);
        $this->assertFalse($clubWithoutContact->has_contact);
    }

    public function test_has_meeting_info_accessor(): void
    {
        $clubWithMeetingInfo = CommunityClub::factory()->create(['meeting_schedule' => 'Weekly', 'location' => 'Conference Room']);
        $clubWithoutMeetingInfo = CommunityClub::factory()->create(['meeting_schedule' => null, 'location' => null]);

        $this->assertTrue($clubWithMeetingInfo->has_meeting_info);
        $this->assertFalse($clubWithoutMeetingInfo->has_meeting_info);
    }

    public function test_get_types_static_method(): void
    {
        CommunityClub::factory()->create(['is_active' => true, 'type' => 'Professional']);
        CommunityClub::factory()->create(['is_active' => true, 'type' => 'Sports']);
        CommunityClub::factory()->create(['is_active' => true, 'type' => 'Professional']); // Duplicate
        CommunityClub::factory()->create(['is_active' => false, 'type' => 'Inactive']); // Should be excluded

        $types = CommunityClub::getTypes();

        $this->assertCount(2, $types);
        $this->assertContains('Professional', $types);
        $this->assertContains('Sports', $types);
        $this->assertNotContains('Inactive', $types);
    }

    public function test_get_all_activities_static_method(): void
    {
        CommunityClub::factory()->create(['is_active' => true, 'activities' => json_encode(['Reading', 'Writing'])]);
        CommunityClub::factory()->create(['is_active' => true, 'activities' => json_encode(['Sports', 'Reading'])]);
        CommunityClub::factory()->create(['is_active' => false, 'activities' => json_encode(['Inactive Activity'])]);

        $activities = CommunityClub::getAllActivities();

        $this->assertCount(3, $activities); // Reading, Writing, Sports (unique)
        $this->assertContains('Reading', $activities);
        $this->assertContains('Writing', $activities);
        $this->assertContains('Sports', $activities);
        $this->assertNotContains('Inactive Activity', $activities);
    }

    public function test_get_featured_static_method(): void
    {
        CommunityClub::factory()->count(6)->create(['is_active' => true]);
        CommunityClub::factory()->count(2)->create(['is_active' => false]);

        $featured = CommunityClub::getFeatured(4);

        $this->assertCount(4, $featured);
        $this->assertTrue($featured->every(fn ($club) => $club->is_active));
    }

    public function test_get_activities_count_method(): void
    {
        $club = CommunityClub::factory()->create(['activities' => json_encode(['Reading', 'Writing', 'Discussion'])]);

        $this->assertEquals(3, $club->getActivitiesCount());
    }

    public function test_has_activity_method(): void
    {
        $club = CommunityClub::factory()->create(['activities' => json_encode(['Reading', 'Writing', 'Discussion'])]);

        $this->assertTrue($club->hasActivity('Reading'));
        $this->assertTrue($club->hasActivity('Writing'));
        $this->assertFalse($club->hasActivity('Sports'));
    }

    public function test_get_contact_methods(): void
    {
        $club = CommunityClub::factory()->create([
            'contact_person' => 'John Doe',
            'contact_phone' => '123456789',
            'contact_email' => 'test@example.com',
        ]);

        $methods = $club->getContactMethods();

        $this->assertContains('person', $methods);
        $this->assertContains('phone', $methods);
        $this->assertContains('email', $methods);
    }

    public function test_get_related_clubs_method(): void
    {
        $currentClub = CommunityClub::factory()->create(['type' => 'Professional']);

        // Create related clubs of the same type
        $relatedClubs = CommunityClub::factory()->count(5)->create(['is_active' => true, 'type' => 'Professional']);

        // Create clubs of different type
        CommunityClub::factory()->count(2)->create(['is_active' => true, 'type' => 'Sports']);

        $related = $currentClub->getRelatedClubs(3);

        $this->assertCount(3, $related);
        $this->assertTrue($related->every(fn ($club) => $club->type === 'Professional' && $club->id !== $currentClub->id));
    }

    public function test_to_navigation_array_method(): void
    {
        $club = CommunityClub::factory()->create([
            'name' => 'Test Club',
            'slug' => 'test-club',
            'description' => 'This is a long description that should be truncated when displayed in navigation',
            'type' => 'Professional',
            'activities' => json_encode(['Reading', 'Writing']),
        ]);

        $navArray = $club->toNavigationArray();

        $this->assertArrayHasKey('id', $navArray);
        $this->assertArrayHasKey('name', $navArray);
        $this->assertArrayHasKey('slug', $navArray);
        $this->assertArrayHasKey('description', $navArray);
        $this->assertArrayHasKey('type', $navArray);
        $this->assertArrayHasKey('image', $navArray);
        $this->assertArrayHasKey('activities_count', $navArray);

        $this->assertEquals('Test Club', $navArray['name']);
        $this->assertEquals('Professional', $navArray['type']);
        $this->assertEquals(2, $navArray['activities_count']);
        $this->assertLessThanOrEqual(100, strlen($navArray['description']));
    }
}
