<?php

namespace Tests\Feature\Admin;

use App\Models\CommunityClub;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CommunityClubControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        Storage::fake('public');
    }

    public function test_admin_can_view_community_clubs_index(): void
    {
        CommunityClub::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.community-clubs.index'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-clubs/index')
            ->has('communityClubs')
        );
    }

    public function test_admin_can_view_create_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.community-clubs.create'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-clubs/create')
        );
    }

    public function test_admin_can_create_community_club_with_basic_fields(): void
    {
        $data = [
            'name' => 'Test Community Club',
            'slug' => 'test-community-club',
            'description' => 'Test description',
            'type' => 'sports',
            'contact_person' => 'John Doe',
            'contact_phone' => '+1234567890',
            'contact_email' => 'test@example.com',
            'meeting_schedule' => 'Every Monday at 7 PM',
            'location' => 'Test Location',
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertRedirect(route('admin.community-clubs.index'));
        $this->assertDatabaseHas('community_clubs', [
            'name' => 'Test Community Club',
            'slug' => 'test-community-club',
            'type' => 'sports',
        ]);
    }

    public function test_admin_can_create_community_club_with_enhanced_fields(): void
    {
        $data = [
            'name' => 'Enhanced Community Club',
            'slug' => 'enhanced-community-club',
            'description' => 'Enhanced description',
            'type' => 'business',
            'founded_year' => 2020,
            'member_count' => 50,
            'hero_subtitle' => 'Join our amazing community',
            'hero_cta_text' => 'Join Now',
            'hero_cta_link' => '/join',
            'testimonials' => [
                [
                    'name' => 'John Doe',
                    'role' => 'Member',
                    'content' => 'Great community!',
                    'rating' => 5,
                ],
            ],
            'social_media_links' => [
                ['platform' => 'facebook', 'url' => 'https://facebook.com/test'],
                ['platform' => 'instagram', 'url' => 'https://instagram.com/test'],
            ],
            'upcoming_events' => [
                [
                    'title' => 'Annual Meeting',
                    'date' => '2024-12-01',
                    'description' => 'Annual community meeting',
                ],
            ],
            'achievements' => [
                [
                    'title' => 'Best Community Award',
                    'date' => '2024-01-01',
                    'description' => 'Won best community award',
                ],
            ],
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertRedirect(route('admin.community-clubs.index'));

        $club = CommunityClub::where('slug', 'enhanced-community-club')->first();
        $this->assertNotNull($club);
        $this->assertEquals(2020, $club->founded_year);
        $this->assertEquals(50, $club->member_count);
        $this->assertEquals('Join our amazing community', $club->hero_subtitle);
        $this->assertCount(1, $club->testimonials);
        $this->assertCount(2, $club->social_media_links);
        $this->assertCount(1, $club->upcoming_events);
        $this->assertCount(1, $club->achievements);
    }

    public function test_admin_can_upload_gallery_images(): void
    {
        $file1 = UploadedFile::fake()->image('gallery1.jpg');
        $file2 = UploadedFile::fake()->image('gallery2.jpg');

        $data = [
            'name' => 'Club with Gallery',
            'slug' => 'club-with-gallery',
            'description' => 'Test description',
            'type' => 'sports',
            'gallery_images' => [$file1, $file2],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertRedirect(route('admin.community-clubs.index'));

        $club = CommunityClub::where('slug', 'club-with-gallery')->first();
        $this->assertNotNull($club);
        $this->assertCount(2, $club->gallery_images);

        // Check that files were stored
        foreach ($club->gallery_images as $imagePath) {
            Storage::disk('public')->assertExists($imagePath);
        }
    }

    public function test_admin_can_upload_main_image(): void
    {
        $file = UploadedFile::fake()->image('main-image.jpg');

        $data = [
            'name' => 'Club with Main Image',
            'slug' => 'club-with-main-image',
            'description' => 'Test description',
            'type' => 'sports',
            'image' => $file,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertRedirect(route('admin.community-clubs.index'));

        $club = CommunityClub::where('slug', 'club-with-main-image')->first();
        $this->assertNotNull($club);
        $this->assertNotNull($club->image);
        Storage::disk('public')->assertExists($club->image);
    }

    public function test_admin_can_view_edit_form(): void
    {
        $club = CommunityClub::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.community-clubs.edit', $club->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-clubs/edit')
            ->has('communityClub')
            ->where('communityClub.name', $club->name)
        );
    }

    public function test_admin_can_update_community_club(): void
    {
        $club = CommunityClub::factory()->create([
            'name' => 'Original Name',
            'description' => 'Original description',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'founded_year' => 2021,
            'member_count' => 75,
            'hero_subtitle' => 'Updated subtitle',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.community-clubs.update', $club->slug), $updateData);

        $response->assertRedirect(route('admin.community-clubs.index'));

        $club->refresh();
        $this->assertEquals('Updated Name', $club->name);
        $this->assertEquals('Updated description', $club->description);
        $this->assertEquals(2021, $club->founded_year);
        $this->assertEquals(75, $club->member_count);
        $this->assertEquals('Updated subtitle', $club->hero_subtitle);
    }

    public function test_admin_can_update_with_json_fields(): void
    {
        $club = CommunityClub::factory()->create();

        $updateData = [
            'name' => 'Updated Club',
            'testimonials' => [
                [
                    'name' => 'Jane Doe',
                    'role' => 'Leader',
                    'content' => 'Amazing community!',
                    'rating' => 5,
                ],
            ],
            'achievements' => [
                [
                    'title' => 'Community Excellence Award',
                    'date' => '2024-06-01',
                    'description' => 'Recognition for excellence',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.community-clubs.update', $club->slug), $updateData);

        $response->assertRedirect(route('admin.community-clubs.index'));

        $club->refresh();
        $this->assertCount(1, $club->testimonials);
        $this->assertEquals('Jane Doe', $club->testimonials[0]['name']);
        $this->assertCount(1, $club->achievements);
        $this->assertEquals('Community Excellence Award', $club->achievements[0]['title']);
    }

    public function test_admin_can_delete_community_club(): void
    {
        $club = CommunityClub::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.community-clubs.destroy', $club->slug));

        $response->assertRedirect(route('admin.community-clubs.index'));
        $this->assertDatabaseMissing('community_clubs', ['id' => $club->id]);
    }

    public function test_admin_can_view_community_club_show_page(): void
    {
        $club = CommunityClub::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.community-clubs.show', $club->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-clubs/show')
            ->has('communityClub')
            ->where('communityClub.name', $club->name)
        );
    }

    public function test_validation_requires_name(): void
    {
        $data = [
            'description' => 'Test description',
            'type' => 'sports',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_validation_requires_valid_type(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'Invalid Type',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['type']);
    }

    public function test_validation_requires_valid_email(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'contact_email' => 'invalid-email',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['contact_email']);
    }

    public function test_validation_requires_valid_founded_year(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'founded_year' => 1799, // Too old (below minimum)
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['founded_year']);
    }

    public function test_validation_requires_valid_member_count(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'member_count' => -1, // Invalid
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['member_count']);
    }

    public function test_json_field_validation(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'testimonials' => [
                [
                    'name' => '', // Missing required name
                    'content' => 'Test content',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['testimonials.0.name']);
    }

    public function test_social_media_links_validation(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'social_media_links' => [
                [
                    'platform' => 'facebook',
                    'url' => 'not-a-valid-url',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['social_media_links.0.url']);
    }

    public function test_upcoming_events_validation(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'upcoming_events' => [
                [
                    'title' => '', // Missing required title
                    'date' => '2024-12-01',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['upcoming_events.0.title']);
    }

    public function test_achievements_validation(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'achievements' => [
                [
                    'title' => '', // Missing required title
                    'description' => 'Test achievement',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors(['achievements.0.title']);
    }

    public function test_hero_fields_validation(): void
    {
        $data = [
            'name' => 'Test Club',
            'type' => 'sports',
            'hero_subtitle' => str_repeat('a', 501), // Too long
            'hero_cta_text' => str_repeat('a', 101), // Too long
            'hero_cta_link' => str_repeat('a', 501), // Too long
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.community-clubs.store'), $data);

        $response->assertSessionHasErrors([
            'hero_subtitle',
            'hero_cta_text',
            'hero_cta_link',
        ]);
    }

    public function test_inertia_response_structure(): void
    {
        $club = CommunityClub::factory()->create([
            'gallery_images' => ['image1.jpg', 'image2.jpg'],
            'testimonials' => [
                [
                    'name' => 'John Doe',
                    'role' => 'Member',
                    'content' => 'Great community!',
                    'rating' => 5,
                ],
            ],
            'social_media_links' => [
                ['platform' => 'facebook', 'url' => 'https://facebook.com/test'],
            ],
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.community-clubs.edit', $club->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/community-clubs/edit')
            ->has('communityClub', fn (AssertableInertia $club) => $club
                ->has('gallery_images')
                ->has('testimonials')
                ->has('social_media_links')
                ->etc()
            )
        );
    }
}
