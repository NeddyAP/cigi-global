<?php

use App\Models\BusinessUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can display business unit create form with more_about fields', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.business-units.create'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page->component('admin/business-units/create')
    );
});

it('can create business unit with more_about data', function () {
    $admin = User::factory()->create();

    $moreAboutData = [
        [
            'title' => 'Misi Kami',
            'description' => 'Menyediakan layanan berkualitas tinggi',
        ],
        [
            'title' => 'Visi Kami',
            'description' => 'Menjadi pemimpin di industri',
        ],
    ];

    $response = $this->actingAs($admin)->post(route('admin.business-units.store'), [
        'name' => 'Test Business Unit Unique',
        'slug' => 'test-business-unit-unique',
        'description' => 'Test description',
        'more_about' => $moreAboutData,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.business-units.index'));

    $this->assertDatabaseHas('business_units', [
        'name' => 'Test Business Unit Unique',
        'slug' => 'test-business-unit-unique',
    ]);

    $businessUnit = \App\Models\BusinessUnit::where('slug', 'test-business-unit-unique')->first();
    expect($businessUnit->more_about)->toBe($moreAboutData);
});

it('can create business unit without more_about data', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.business-units.store'), [
        'name' => 'Test Business Unit 2 Unique',
        'slug' => 'test-business-unit-2-unique',
        'description' => 'Test description',
        'more_about' => [],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.business-units.index'));

    $this->assertDatabaseHas('business_units', [
        'name' => 'Test Business Unit 2 Unique',
        'slug' => 'test-business-unit-2-unique',
    ]);

    $businessUnit = \App\Models\BusinessUnit::where('slug', 'test-business-unit-2-unique')->first();
    expect($businessUnit->more_about)->toBe([]);
});

it('can save more_about directly to model', function () {
    $moreAboutData = [
        [
            'title' => 'Test Title',
            'description' => 'Test Description',
        ],
    ];

    $businessUnit = BusinessUnit::create([
        'name' => 'Direct Test Unit',
        'slug' => 'direct-test-unit',
        'description' => 'Test description',
        'more_about' => $moreAboutData,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    expect($businessUnit->more_about)->toBe($moreAboutData);

    // Refresh from database
    $businessUnit->refresh();
    expect($businessUnit->more_about)->toBe($moreAboutData);
});
