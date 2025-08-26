<?php

use App\Models\GlobalVariable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('displays global variables on home page', function () {
    // Create some global variables
    GlobalVariable::create([
        'key' => 'homepage_title',
        'value' => 'CIGI Global - Leading Innovation',
        'type' => 'text',
        'category' => 'homepage',
        'is_public' => true,
    ]);

    GlobalVariable::create([
        'key' => 'homepage_description',
        'value' => 'Membangun masa depan bersama melalui inovasi dan kolaborasi',
        'type' => 'text',
        'category' => 'homepage',
        'is_public' => true,
    ]);

    GlobalVariable::create([
        'key' => 'contact_email',
        'value' => 'info@cigi-global.com',
        'type' => 'text',
        'category' => 'contact',
        'is_public' => true,
    ]);

    $response = $this->get(route('home'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('home')
        ->has('globalVariables')
        ->where('globalVariables.homepage_title', 'CIGI Global - Leading Innovation')
        ->where('globalVariables.homepage_description', 'Membangun masa depan bersama melalui inovasi dan kolaborasi')
        ->where('globalVariables.contact_email', 'info@cigi-global.com')
    );
});

it('handles missing global variables gracefully', function () {
    $response = $this->get(route('home'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('home')
        ->has('globalVariables')
        ->where('globalVariables', [])
    );
});
