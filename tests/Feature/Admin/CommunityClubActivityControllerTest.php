<?php

namespace Tests\Feature\Admin;

use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CommunityClubActivityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected CommunityClub $communityClub;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        $this->communityClub = CommunityClub::factory()->create();
        Storage::fake('public');
    }

    public function test_admin_can_view_activities_index(): void
    {
        CommunityClubActivity::factory()->count(3)->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.index'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/index')
            ->has('activities')
        );
    }

    public function test_admin_can_view_create_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.create'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/create')
            ->has('communityClubs')
        );
    }

    public function test_admin_can_create_activity_with_basic_fields(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test activity description',
            'duration' => '2 hours',
            'max_participants' => 20,
            'requirements' => 'No experience needed',
            'benefits' => ['Learn new skills', 'Meet new people'],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertRedirect(route('admin.community-club-activities.index'));
        $this->assertDatabaseHas('community_club_activities', [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'duration' => '2 hours',
            'max_participants' => 20,
        ]);
    }

    public function test_admin_can_create_activity_with_image(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Activity with Image',
            'description' => 'Test activity with image',
            'duration' => '1 hour',
            'image' => 'https://example.com/activity-image.jpg',
            'benefits' => ['Fun experience'],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertRedirect(route('admin.community-club-activities.index'));

        $activity = CommunityClubActivity::where('title', 'Activity with Image')->first();
        $this->assertNotNull($activity);
        $this->assertEquals('https://example.com/activity-image.jpg', $activity->image);
    }

    public function test_admin_can_create_activity_with_complex_benefits(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Complex Activity',
            'description' => 'Activity with complex benefits',
            'duration' => '3 hours',
            'benefits' => [
                'Learn advanced techniques',
                'Build confidence',
                'Network with professionals',
                'Earn certification',
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertRedirect(route('admin.community-club-activities.index'));

        $activity = CommunityClubActivity::where('title', 'Complex Activity')->first();
        $this->assertNotNull($activity);
        $this->assertCount(4, $activity->benefits);
        $this->assertContains('Learn advanced techniques', $activity->benefits);
        $this->assertContains('Earn certification', $activity->benefits);
    }

    public function test_admin_can_view_edit_form(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.edit', $activity->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/edit')
            ->has('activity')
            ->where('activity.title', $activity->title)
        );
    }

    public function test_admin_can_update_activity(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
            'title' => 'Original Title',
            'description' => 'Original description',
        ]);

        $updateData = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'duration' => '4 hours',
            'max_participants' => 30,
            'requirements' => 'Some experience required',
            'benefits' => ['Updated benefit 1', 'Updated benefit 2'],
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.community-club-activities.update', $activity->id), $updateData);

        $response->assertRedirect(route('admin.community-club-activities.index'));

        $activity->refresh();
        $this->assertEquals('Updated Title', $activity->title);
        $this->assertEquals('Updated description', $activity->description);
        $this->assertEquals('4 hours', $activity->duration);
        $this->assertEquals(30, $activity->max_participants);
        $this->assertEquals('Some experience required', $activity->requirements);
        $this->assertCount(2, $activity->benefits);
    }

    public function test_admin_can_update_activity_image(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $updateData = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Updated Activity',
            'description' => 'Updated description',
            'duration' => '2 hours',
            'image' => 'https://example.com/new-activity-image.jpg',
            'benefits' => ['Benefit 1'],
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.community-club-activities.update', $activity->id), $updateData);

        $response->assertRedirect(route('admin.community-club-activities.index'));

        $activity->refresh();
        $this->assertEquals('https://example.com/new-activity-image.jpg', $activity->image);
    }

    public function test_admin_can_delete_activity(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.community-club-activities.destroy', $activity->id));

        $response->assertRedirect(route('admin.community-club-activities.index'));
        $this->assertDatabaseMissing('community_club_activities', ['id' => $activity->id]);
    }

    public function test_admin_can_view_activity_show_page(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.show', $activity->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/show')
            ->has('activity')
            ->where('activity.title', $activity->title)
        );
    }

    public function test_validation_requires_community_club_id(): void
    {
        $data = [
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['community_club_id']);
    }

    public function test_validation_requires_valid_community_club_id(): void
    {
        $data = [
            'community_club_id' => 99999, // Non-existent ID
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['community_club_id']);
    }

    public function test_validation_requires_title(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'description' => 'Test description',
            'duration' => '1 hour',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_validation_requires_valid_max_participants(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'max_participants' => 0, // Invalid: must be at least 1
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['max_participants']);
    }

    public function test_validation_accepts_null_max_participants(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'max_participants' => null, // Valid: optional field
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertRedirect(route('admin.community-club-activities.index'));
        $this->assertDatabaseHas('community_club_activities', [
            'title' => 'Test Activity',
            'max_participants' => null,
        ]);
    }

    public function test_validation_requires_valid_benefits_array(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'benefits' => 'not-an-array', // Invalid: must be array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['benefits']);
    }

    public function test_validation_accepts_empty_benefits_array(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'benefits' => [], // Valid: empty array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertRedirect(route('admin.community-club-activities.index'));
        $this->assertDatabaseHas('community_club_activities', [
            'title' => 'Test Activity',
            'benefits' => '[]',
        ]);
    }

    public function test_validation_requires_valid_benefits_strings(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'benefits' => [
                'Valid benefit',
                123, // Invalid: must be string
                'Another valid benefit',
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['benefits.1']);
    }

    public function test_validation_limits_benefits_string_length(): void
    {
        $data = [
            'community_club_id' => $this->communityClub->id,
            'title' => 'Test Activity',
            'description' => 'Test description',
            'duration' => '1 hour',
            'benefits' => [
                str_repeat('a', 256), // Too long: max 255
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-club-activities.store'), $data);

        $response->assertSessionHasErrors(['benefits.0']);
    }

    public function test_activity_relationship_with_community_club(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.edit', $activity->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/edit')
            ->has('activity', fn (AssertableInertia $activity) => $activity
                ->where('community_club_id', $this->communityClub->id)
                ->etc()
            )
        );
    }

    public function test_inertia_response_structure(): void
    {
        $activity = CommunityClubActivity::factory()->create([
            'community_club_id' => $this->communityClub->id,
            'benefits' => ['Benefit 1', 'Benefit 2'],
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.edit', $activity->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/edit')
            ->has('activity', fn (AssertableInertia $activity) => $activity
                ->has('benefits')
                ->etc()
            )
        );
    }

    public function test_can_filter_activities_by_community_club(): void
    {
        $club1 = CommunityClub::factory()->create();
        $club2 = CommunityClub::factory()->create();

        CommunityClubActivity::factory()->count(2)->create([
            'community_club_id' => $club1->id,
        ]);
        CommunityClubActivity::factory()->count(3)->create([
            'community_club_id' => $club2->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-club-activities.index', [
            'community_club_id' => $club1->id,
        ]));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-club-activities/index')
            ->has('activities')
        );
    }
}
