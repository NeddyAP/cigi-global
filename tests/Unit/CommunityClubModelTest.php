<?php

namespace Tests\Unit;

use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
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
        CommunityClub::factory()->create(['contact_email' => 'admin@cigiglobal.com']);
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
        $clubWithEmail = CommunityClub::factory()->create(['contact_email' => 'admin@cigiglobal.com']);
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
            'contact_email' => 'admin@cigiglobal.com',
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

    // Enhanced Fields Tests

    public function test_gallery_images_field_casting(): void
    {
        $images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
        $club = CommunityClub::factory()->create(['gallery_images' => $images]);

        $this->assertIsArray($club->gallery_images);
        $this->assertEquals($images, $club->gallery_images);
    }

    public function test_testimonials_field_casting(): void
    {
        $testimonials = [
            [
                'name' => 'John Doe',
                'content' => 'Great community!',
                'role' => 'Member',
                'image' => 'john.jpg',
            ],
            [
                'name' => 'Jane Smith',
                'content' => 'Amazing experience!',
                'role' => 'Volunteer',
                'image' => 'jane.jpg',
            ],
        ];
        $club = CommunityClub::factory()->create(['testimonials' => $testimonials]);

        $this->assertIsArray($club->testimonials);
        $this->assertEquals($testimonials, $club->testimonials);
        $this->assertCount(2, $club->testimonials);
    }

    public function test_social_media_links_field_casting(): void
    {
        $socialLinks = [
            ['platform' => 'Facebook', 'url' => 'https://facebook.com/club'],
            ['platform' => 'Instagram', 'url' => 'https://instagram.com/club'],
        ];
        $club = CommunityClub::factory()->create(['social_media_links' => $socialLinks]);

        $this->assertIsArray($club->social_media_links);
        $this->assertEquals($socialLinks, $club->social_media_links);
    }

    public function test_upcoming_events_field_casting(): void
    {
        $events = [
            [
                'title' => 'Annual Meeting',
                'description' => 'Our yearly gathering',
                'date' => '2024-12-01',
                'image' => 'meeting.jpg',
            ],
        ];
        $club = CommunityClub::factory()->create(['upcoming_events' => $events]);

        $this->assertIsArray($club->upcoming_events);
        $this->assertEquals($events, $club->upcoming_events);
    }

    public function test_achievements_field_casting(): void
    {
        $achievements = [
            [
                'title' => 'Best Community Award',
                'description' => 'Awarded for excellence',
                'date' => '2023-06-15',
                'image' => 'award.jpg',
            ],
        ];
        $club = CommunityClub::factory()->create(['achievements' => $achievements]);

        $this->assertIsArray($club->achievements);
        $this->assertEquals($achievements, $club->achievements);
    }

    public function test_founded_year_field_casting(): void
    {
        $club = CommunityClub::factory()->create(['founded_year' => 2010]);

        $this->assertIsInt($club->founded_year);
        $this->assertEquals(2010, $club->founded_year);
    }

    public function test_member_count_field_casting(): void
    {
        $club = CommunityClub::factory()->create(['member_count' => 150]);

        $this->assertIsInt($club->member_count);
        $this->assertEquals(150, $club->member_count);
    }

    public function test_json_field_serialization_deserialization(): void
    {
        $originalData = [
            'gallery_images' => ['img1.jpg', 'img2.jpg'],
            'testimonials' => [
                ['name' => 'Test User', 'content' => 'Great!', 'role' => 'Member', 'image' => 'test.jpg'],
            ],
            'social_media_links' => [
                ['platform' => 'Twitter', 'url' => 'https://twitter.com/club'],
            ],
            'upcoming_events' => [
                ['title' => 'Event', 'description' => 'Description', 'date' => '2024-12-01', 'image' => 'event.jpg'],
            ],
            'achievements' => [
                ['title' => 'Achievement', 'description' => 'Description', 'date' => '2023-01-01', 'image' => 'achievement.jpg'],
            ],
        ];

        $club = CommunityClub::factory()->create($originalData);

        // Refresh from database to test serialization/deserialization
        $club->refresh();

        $this->assertEquals($originalData['gallery_images'], $club->gallery_images);
        $this->assertEquals($originalData['testimonials'], $club->testimonials);
        $this->assertEquals($originalData['social_media_links'], $club->social_media_links);
        $this->assertEquals($originalData['upcoming_events'], $club->upcoming_events);
        $this->assertEquals($originalData['achievements'], $club->achievements);
    }

    public function test_club_activities_relationship(): void
    {
        $club = CommunityClub::factory()->create();
        $activity1 = CommunityClubActivity::factory()->create(['community_club_id' => $club->id]);
        $activity2 = CommunityClubActivity::factory()->create(['community_club_id' => $club->id]);

        // Create activity for different club to ensure proper filtering
        $otherClub = CommunityClub::factory()->create();
        CommunityClubActivity::factory()->create(['community_club_id' => $otherClub->id]);

        $activities = $club->clubActivities;

        $this->assertCount(2, $activities);
        $this->assertTrue($activities->contains($activity1));
        $this->assertTrue($activities->contains($activity2));
    }

    public function test_model_factory_creation_with_new_fields(): void
    {
        $club = CommunityClub::factory()->create();

        // Test that all new fields are properly set by factory
        $this->assertNotNull($club->gallery_images);
        $this->assertIsArray($club->gallery_images);
        $this->assertNotEmpty($club->gallery_images);

        $this->assertNotNull($club->testimonials);
        $this->assertIsArray($club->testimonials);
        $this->assertNotEmpty($club->testimonials);

        $this->assertNotNull($club->social_media_links);
        $this->assertIsArray($club->social_media_links);

        $this->assertNotNull($club->founded_year);
        $this->assertIsInt($club->founded_year);

        $this->assertNotNull($club->member_count);
        $this->assertIsInt($club->member_count);

        $this->assertNotNull($club->upcoming_events);
        $this->assertIsArray($club->upcoming_events);

        $this->assertNotNull($club->achievements);
        $this->assertIsArray($club->achievements);

        $this->assertNotNull($club->hero_subtitle);
        $this->assertIsString($club->hero_subtitle);

        $this->assertNotNull($club->hero_cta_text);
        $this->assertIsString($club->hero_cta_text);

        $this->assertNotNull($club->hero_cta_link);
        $this->assertIsString($club->hero_cta_link);
    }

    public function test_validation_rules_include_new_fields(): void
    {
        $rules = CommunityClub::validationRules();

        // Test that validation rules exist for new fields
        $this->assertArrayHasKey('gallery_images', $rules);
        $this->assertArrayHasKey('testimonials', $rules);
        $this->assertArrayHasKey('social_media_links', $rules);
        $this->assertArrayHasKey('founded_year', $rules);
        $this->assertArrayHasKey('member_count', $rules);
        $this->assertArrayHasKey('upcoming_events', $rules);
        $this->assertArrayHasKey('achievements', $rules);
        $this->assertArrayHasKey('hero_subtitle', $rules);
        $this->assertArrayHasKey('hero_cta_text', $rules);
        $this->assertArrayHasKey('hero_cta_link', $rules);

        // Test nested validation rules
        $this->assertArrayHasKey('testimonials.*.name', $rules);
        $this->assertArrayHasKey('testimonials.*.content', $rules);
        $this->assertArrayHasKey('social_media_links.*.platform', $rules);
        $this->assertArrayHasKey('social_media_links.*.url', $rules);
        $this->assertArrayHasKey('upcoming_events.*.title', $rules);
        $this->assertArrayHasKey('achievements.*.title', $rules);
    }

    public function test_fillable_fields_include_new_fields(): void
    {
        $club = new CommunityClub;
        $fillable = $club->getFillable();

        $expectedNewFields = [
            'gallery_images',
            'testimonials',
            'social_media_links',
            'founded_year',
            'member_count',
            'upcoming_events',
            'achievements',
            'hero_subtitle',
            'hero_cta_text',
            'hero_cta_link',
        ];

        foreach ($expectedNewFields as $field) {
            $this->assertContains($field, $fillable, "Field {$field} should be fillable");
        }
    }

    public function test_casts_configuration_for_new_fields(): void
    {
        $club = new CommunityClub;
        $casts = $club->getCasts();

        $this->assertEquals('array', $casts['gallery_images']);
        $this->assertEquals('array', $casts['testimonials']);
        $this->assertEquals('array', $casts['social_media_links']);
        $this->assertEquals('array', $casts['upcoming_events']);
        $this->assertEquals('array', $casts['achievements']);
        $this->assertEquals('integer', $casts['founded_year']);
        $this->assertEquals('integer', $casts['member_count']);
    }
}
