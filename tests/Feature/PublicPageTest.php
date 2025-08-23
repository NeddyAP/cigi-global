<?php

use App\Models\GlobalVariable;

it('can view about page', function () {
    // Create some global variables for testing
    GlobalVariable::factory()->create([
        'key' => 'company_name',
        'value' => 'CIGI Global',
        'is_public' => true,
    ]);

    GlobalVariable::factory()->create([
        'key' => 'company_description',
        'value' => 'Test company description',
        'is_public' => true,
    ]);

    $response = $this->get(route('about'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('public/about')
            ->has('globalVars')
            ->where('globalVars.company_name', 'CIGI Global')
            ->where('globalVars.company_description', 'Test company description')
    );
});

it('can view contact page', function () {
    // Create some global variables for testing
    GlobalVariable::factory()->create([
        'key' => 'company_name',
        'value' => 'CIGI Global',
        'is_public' => true,
    ]);

    GlobalVariable::factory()->create([
        'key' => 'contact_email',
        'value' => 'contact@cigiglobal.com',
        'is_public' => true,
    ]);

    $response = $this->get(route('contact'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('public/contact')
            ->has('globalVars')
            ->where('globalVars.company_name', 'CIGI Global')
            ->where('globalVars.contact_email', 'contact@cigiglobal.com')
    );
});

it('about page shows correct metadata', function () {
    $response = $this->get(route('about'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('public/about')
    );
});

it('contact page shows correct metadata', function () {
    $response = $this->get(route('contact'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('public/contact')
    );
});
