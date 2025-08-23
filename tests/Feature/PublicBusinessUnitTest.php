<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicBusinessUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_business_units_index_page(): void
    {
        // Create test business units
        $activeUnits = BusinessUnit::factory()->count(3)->create([
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $inactiveUnit = BusinessUnit::factory()->create([
            'is_active' => false,
        ]);

        $response = $this->get(route('business-units.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('business-units/index')
            ->has('businessUnits', 3) // Should only show active units
            ->where('businessUnits.0.name', $activeUnits->first()->name)
        );
    }

    public function test_business_units_are_ordered_correctly(): void
    {
        $unit1 = BusinessUnit::factory()->create([
            'name' => 'Unit C',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        $unit2 = BusinessUnit::factory()->create([
            'name' => 'Unit A',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $unit3 = BusinessUnit::factory()->create([
            'name' => 'Unit B',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $response = $this->get(route('business-units.index'));

        $response->assertInertia(fn ($page) => $page->where('businessUnits.0.name', 'Unit A')
            ->where('businessUnits.1.name', 'Unit B')
            ->where('businessUnits.2.name', 'Unit C')
        );
    }

    public function test_can_view_business_unit_detail_page(): void
    {
        $businessUnit = BusinessUnit::factory()->create([
            'is_active' => true,
            'slug' => 'test-unit',
            'name' => 'Test Unit',
            'description' => 'Test description',
        ]);

        $response = $this->get(route('business-units.show', 'test-unit'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('business-units/show')
            ->where('businessUnit.name', 'Test Unit')
            ->where('businessUnit.description', 'Test description')
            ->has('relatedUnits')
        );
    }

    public function test_cannot_view_inactive_business_unit(): void
    {
        $businessUnit = BusinessUnit::factory()->create([
            'is_active' => false,
            'slug' => 'inactive-unit',
        ]);

        $response = $this->get(route('business-units.show', 'inactive-unit'));

        $response->assertStatus(404);
    }

    public function test_related_units_exclude_current_unit(): void
    {
        $currentUnit = BusinessUnit::factory()->create([
            'is_active' => true,
            'slug' => 'current-unit',
        ]);

        $relatedUnits = BusinessUnit::factory()->count(5)->create([
            'is_active' => true,
        ]);

        $response = $this->get(route('business-units.show', 'current-unit'));

        $response->assertInertia(fn ($page) => $page->has('relatedUnits')
            ->where('relatedUnits', function ($units) use ($currentUnit) {
                return collect($units)->doesntContain('id', $currentUnit->id);
            })
        );
    }
}
