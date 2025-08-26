<?php

use App\Models\BusinessUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('displays more about cards when business unit has more_about data', function () {
    $businessUnit = BusinessUnit::factory()->create([
        'more_about' => [
            [
                'title' => 'Community Mission',
                'description' => 'To create an inclusive environment where members can learn, grow, and contribute to the collective success of our community.',
            ],
            [
                'title' => 'Our Vision',
                'description' => 'To be the leading platform that empowers communities through innovative solutions and sustainable growth.',
            ],
        ],
    ]);

    $response = $this->get(route('business-units.show', $businessUnit->slug));

    $response->assertInertia(
        fn ($page) => $page->component('public/business-units/show')
            ->has('businessUnit.more_about', 2)
            ->where('businessUnit.more_about.0.title', 'Community Mission')
            ->where('businessUnit.more_about.1.title', 'Our Vision')
    );
});

it('displays fallback content when business unit has no more_about data', function () {
    $businessUnit = BusinessUnit::factory()->create([
        'more_about' => [],
    ]);

    $response = $this->get(route('business-units.show', $businessUnit->slug));

    $response->assertInertia(
        fn ($page) => $page->component('public/business-units/show')
            ->has('businessUnit.more_about', 0)
    );
});

it('displays correct number of cards based on more_about data', function () {
    $moreAboutData = [
        [
            'title' => 'Mission',
            'description' => 'Our mission statement',
        ],
        [
            'title' => 'Vision',
            'description' => 'Our vision statement',
        ],
        [
            'title' => 'Values',
            'description' => 'Our core values',
        ],
    ];

    $businessUnit = BusinessUnit::factory()->create([
        'more_about' => $moreAboutData,
    ]);

    $response = $this->get(route('business-units.show', $businessUnit->slug));

    $response->assertInertia(
        fn ($page) => $page->component('public/business-units/show')
            ->has('businessUnit.more_about', 3)
            ->where('businessUnit.more_about.0.title', 'Mission')
            ->where('businessUnit.more_about.1.title', 'Vision')
            ->where('businessUnit.more_about.2.title', 'Values')
    );
});
