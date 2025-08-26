<?php

use App\Models\CommunityClub;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can display community club create form with more_about fields', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.community-clubs.create'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page->component('admin/community-clubs/create')
    );
});

it('can create community club with more_about data', function () {
    $admin = User::factory()->create();

    $moreAboutData = [
        [
            'title' => 'Misi Komunitas',
            'description' => 'Menciptakan lingkungan yang inklusif',
        ],
        [
            'title' => 'Visi Komunitas',
            'description' => 'Menjadi komunitas terdepan',
        ],
    ];

    $response = $this->actingAs($admin)->post(route('admin.community-clubs.store'), [
        'name' => 'Test Community Club',
        'slug' => 'test-community-club',
        'description' => 'Test description',
        'type' => 'Olahraga',
        'activities' => '',
        'more_about' => $moreAboutData,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.community-clubs.index'));

    $this->assertDatabaseHas('community_clubs', [
        'name' => 'Test Community Club',
        'slug' => 'test-community-club',
    ]);

    $communityClub = \App\Models\CommunityClub::where('slug', 'test-community-club')->first();
    expect($communityClub->more_about)->toBe($moreAboutData);
});

it('can create community club without more_about data', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.community-clubs.store'), [
        'name' => 'Test Community Club 2',
        'slug' => 'test-community-club-2',
        'description' => 'Test description',
        'type' => 'Olahraga',
        'activities' => '',
        'more_about' => [],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.community-clubs.index'));

    $this->assertDatabaseHas('community_clubs', [
        'name' => 'Test Community Club 2',
        'slug' => 'test-community-club-2',
    ]);

    $communityClub = \App\Models\CommunityClub::where('slug', 'test-community-club-2')->first();
    expect($communityClub->more_about)->toBe([]);
});

it('can save more_about directly to model', function () {
    $moreAboutData = [
        [
            'title' => 'Test Title',
            'description' => 'Test Description',
        ],
    ];

    $communityClub = CommunityClub::create([
        'name' => 'Direct Test Club',
        'slug' => 'direct-test-club',
        'description' => 'Test description',
        'type' => 'Olahraga',
        'activities' => '',
        'more_about' => $moreAboutData,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    expect($communityClub->more_about)->toBe($moreAboutData);

    // Refresh from database
    $communityClub->refresh();
    expect($communityClub->more_about)->toBe($moreAboutData);
});
