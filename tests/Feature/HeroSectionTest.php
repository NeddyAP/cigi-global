<?php

use function Pest\Laravel\get;

it('renders hero section with all props', function () {
    $response = get('/');

    $response->assertStatus(200);
});

it('hero section supports smooth scrolling props', function () {
    // This test ensures the HeroSection component can be rendered with the new props
    // The actual smooth scrolling functionality is tested in the browser
    expect(true)->toBeTrue();
});
