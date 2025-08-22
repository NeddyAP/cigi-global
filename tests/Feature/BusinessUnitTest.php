<?php

use App\Models\BusinessUnit;
use App\Models\User;

test('home page displays business units', function () {
    BusinessUnit::factory(3)->create(['is_active' => true]);

    $response = $this->get(route('home'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('home')
        ->has('businessUnits', 3)
    );
});

test('business units index page displays active units', function () {
    BusinessUnit::factory(2)->create(['is_active' => true]);
    BusinessUnit::factory(1)->create(['is_active' => false]);

    $response = $this->get(route('business-units.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('business-units/index')
        ->has('businessUnits', 2)
    );
});

test('business unit show page displays unit details', function () {
    $businessUnit = BusinessUnit::factory()->create(['is_active' => true]);

    $response = $this->get(route('business-units.show', $businessUnit->slug));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('business-units/show')
        ->has('businessUnit')
        ->where('businessUnit.name', $businessUnit->name)
    );
});

test('inactive business unit returns 404', function () {
    $businessUnit = BusinessUnit::factory()->create(['is_active' => false]);

    $response = $this->get(route('business-units.show', $businessUnit->slug));

    $response->assertNotFound();
});

test('admin can create business unit', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.business-units.store'), [
        'name' => 'Test Business Unit',
        'description' => 'Test description',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.business-units.index'));
    $this->assertDatabaseHas('business_units', [
        'name' => 'Test Business Unit',
        'description' => 'Test description',
    ]);
});

test('admin can update business unit', function () {
    $user = User::factory()->create();
    $businessUnit = BusinessUnit::factory()->create();

    $response = $this->actingAs($user)->put(route('admin.business-units.update', $businessUnit), [
        'name' => 'Updated Business Unit',
        'description' => 'Updated description',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.business-units.index'));
    $this->assertDatabaseHas('business_units', [
        'id' => $businessUnit->id,
        'name' => 'Updated Business Unit',
        'description' => 'Updated description',
    ]);
});

test('admin can delete business unit', function () {
    $user = User::factory()->create();
    $businessUnit = BusinessUnit::factory()->create();

    $response = $this->actingAs($user)->delete(route('admin.business-units.destroy', $businessUnit));

    $response->assertRedirect(route('admin.business-units.index'));
    $this->assertDatabaseMissing('business_units', [
        'id' => $businessUnit->id,
    ]);
});
