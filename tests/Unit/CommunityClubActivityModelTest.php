<?php

namespace Tests\Unit;

use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityClubActivityModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_field_validation_and_casting(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'max_participants' => 25,
            'benefits' => ['Skill development', 'Networking', 'Fun activities'],
        ]);

        $this->assertIsInt($activity->max_participants);
        $this->assertEquals(25, $activity->max_participants);
        $this->assertIsArray($activity->benefits);
        $this->assertCount(3, $activity->benefits);
    }

    public function test_benefits_json_field_handling(): void
    {
        $benefits = [
            'Improve communication skills',
            'Build lasting friendships',
            'Learn new technologies',
            'Personal growth',
        ];

        $activity = CommunityClubActivity::factory()->create(['benefits' => $benefits]);

        $this->assertIsArray($activity->benefits);
        $this->assertEquals($benefits, $activity->benefits);

        // Test serialization/deserialization by refreshing from database
        $activity->refresh();
        $this->assertEquals($benefits, $activity->benefits);
    }

    public function test_community_club_relationship(): void
    {
        $club = CommunityClub::factory()->create();
        $activity = CommunityClubActivity::factory()->create(['community_club_id' => $club->id]);

        $this->assertInstanceOf(CommunityClub::class, $activity->communityClub);
        $this->assertEquals($club->id, $activity->communityClub->id);
        $this->assertEquals($club->name, $activity->communityClub->name);
    }

    public function test_model_factory_creation(): void
    {
        $activity = CommunityClubActivity::factory()->create();

        // Test that all required fields are properly set by factory
        $this->assertNotNull($activity->community_club_id);
        $this->assertIsInt($activity->community_club_id);

        $this->assertNotNull($activity->title);
        $this->assertIsString($activity->title);

        $this->assertNotNull($activity->description);
        $this->assertIsString($activity->description);

        $this->assertNotNull($activity->image);
        $this->assertIsString($activity->image);

        $this->assertNotNull($activity->duration);
        $this->assertIsString($activity->duration);

        $this->assertNotNull($activity->benefits);
        $this->assertIsArray($activity->benefits);
        $this->assertNotEmpty($activity->benefits);

        // Optional fields may be null
        if ($activity->max_participants !== null) {
            $this->assertIsInt($activity->max_participants);
            $this->assertGreaterThan(0, $activity->max_participants);
        }

        if ($activity->requirements !== null) {
            $this->assertIsString($activity->requirements);
        }
    }

    public function test_factory_unlimited_state(): void
    {
        $activity = CommunityClubActivity::factory()->unlimited()->create();

        $this->assertNull($activity->max_participants);
    }

    public function test_factory_with_requirements_state(): void
    {
        $activity = CommunityClubActivity::factory()->withRequirements()->create();

        $this->assertNotNull($activity->requirements);
        $this->assertIsString($activity->requirements);
    }

    public function test_validation_rules(): void
    {
        $rules = CommunityClubActivity::validationRules();

        // Test that validation rules exist for all fields
        $this->assertArrayHasKey('community_club_id', $rules);
        $this->assertArrayHasKey('title', $rules);
        $this->assertArrayHasKey('description', $rules);
        $this->assertArrayHasKey('image', $rules);
        $this->assertArrayHasKey('duration', $rules);
        $this->assertArrayHasKey('max_participants', $rules);
        $this->assertArrayHasKey('requirements', $rules);
        $this->assertArrayHasKey('benefits', $rules);
        $this->assertArrayHasKey('benefits.*', $rules);

        // Test specific validation rules
        $this->assertStringContainsString('required', $rules['community_club_id']);
        $this->assertStringContainsString('exists:community_clubs,id', $rules['community_club_id']);
        $this->assertStringContainsString('required', $rules['title']);
        $this->assertStringContainsString('nullable', $rules['description']);
        $this->assertStringContainsString('nullable', $rules['max_participants']);
        $this->assertStringContainsString('min:1', $rules['max_participants']);
    }

    public function test_fillable_fields(): void
    {
        $activity = new CommunityClubActivity;
        $fillable = $activity->getFillable();

        $expectedFields = [
            'community_club_id',
            'title',
            'description',
            'image',
            'duration',
            'max_participants',
            'requirements',
            'benefits',
        ];

        foreach ($expectedFields as $field) {
            $this->assertContains($field, $fillable, "Field {$field} should be fillable");
        }
    }

    public function test_casts_configuration(): void
    {
        $activity = new CommunityClubActivity;
        $casts = $activity->getCasts();

        $this->assertEquals('integer', $casts['community_club_id']);
        $this->assertEquals('integer', $casts['max_participants']);
        $this->assertEquals('array', $casts['benefits']);
    }

    public function test_mass_assignment_with_all_fields(): void
    {
        $club = CommunityClub::factory()->create();

        $data = [
            'community_club_id' => $club->id,
            'title' => 'Test Activity',
            'description' => 'This is a test activity description',
            'image' => 'test-activity.jpg',
            'duration' => '2 hours',
            'max_participants' => 20,
            'requirements' => 'Basic knowledge required',
            'benefits' => ['Learning', 'Networking', 'Fun'],
        ];

        $activity = CommunityClubActivity::create($data);

        $this->assertEquals($data['title'], $activity->title);
        $this->assertEquals($data['description'], $activity->description);
        $this->assertEquals($data['image'], $activity->image);
        $this->assertEquals($data['duration'], $activity->duration);
        $this->assertEquals($data['max_participants'], $activity->max_participants);
        $this->assertEquals($data['requirements'], $activity->requirements);
        $this->assertEquals($data['benefits'], $activity->benefits);
    }

    public function test_belongs_to_community_club_relationship_integrity(): void
    {
        $club1 = CommunityClub::factory()->create();
        $club2 = CommunityClub::factory()->create();

        $activity = CommunityClubActivity::factory()->create(['community_club_id' => $club1->id]);

        // Test that the activity belongs to the correct club
        $this->assertEquals($club1->id, $activity->communityClub->id);
        $this->assertNotEquals($club2->id, $activity->communityClub->id);

        // Test that the relationship is properly loaded
        $this->assertInstanceOf(CommunityClub::class, $activity->communityClub);
        $this->assertEquals($club1->name, $activity->communityClub->name);
    }

    public function test_json_field_empty_array_handling(): void
    {
        $activity = CommunityClubActivity::factory()->create(['benefits' => []]);

        $this->assertIsArray($activity->benefits);
        $this->assertEmpty($activity->benefits);

        // Test after refresh from database
        $activity->refresh();
        $this->assertIsArray($activity->benefits);
        $this->assertEmpty($activity->benefits);
    }

    public function test_optional_fields_can_be_null(): void
    {
        $club = CommunityClub::factory()->create();

        $activity = CommunityClubActivity::create([
            'community_club_id' => $club->id,
            'title' => 'Minimal Activity',
            'description' => null,
            'image' => null,
            'duration' => null,
            'max_participants' => null,
            'requirements' => null,
            'benefits' => null,
        ]);

        $this->assertNull($activity->description);
        $this->assertNull($activity->image);
        $this->assertNull($activity->duration);
        $this->assertNull($activity->max_participants);
        $this->assertNull($activity->requirements);
        $this->assertNull($activity->benefits);
    }
}
