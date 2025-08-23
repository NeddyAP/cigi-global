<?php

namespace Tests\Unit;

use App\Models\BusinessUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessUnitModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_scope_filters_correctly(): void
    {
        BusinessUnit::factory()->count(3)->create(['is_active' => true]);
        BusinessUnit::factory()->count(2)->create(['is_active' => false]);

        $activeUnits = BusinessUnit::active()->get();

        $this->assertCount(3, $activeUnits);
        $this->assertTrue($activeUnits->every(fn ($unit) => $unit->is_active));
    }

    public function test_ordered_scope_sorts_correctly(): void
    {
        BusinessUnit::factory()->create(['name' => 'Unit C', 'sort_order' => 3]);
        BusinessUnit::factory()->create(['name' => 'Unit A', 'sort_order' => 1]);
        BusinessUnit::factory()->create(['name' => 'Unit B', 'sort_order' => 2]);

        $orderedUnits = BusinessUnit::ordered()->get();

        $this->assertEquals('Unit A', $orderedUnits->first()->name);
        $this->assertEquals('Unit C', $orderedUnits->last()->name);
    }

    public function test_with_media_scope_filters_correctly(): void
    {
        BusinessUnit::factory()->count(2)->create(['image' => 'test-image.jpg']);
        BusinessUnit::factory()->count(3)->create(['image' => null]);

        $unitsWithMedia = BusinessUnit::withMedia()->get();

        $this->assertCount(2, $unitsWithMedia);
        $this->assertTrue($unitsWithMedia->every(fn ($unit) => ! is_null($unit->image)));
    }

    public function test_with_contact_scope_filters_correctly(): void
    {
        BusinessUnit::factory()->create(['contact_phone' => '123456789', 'contact_email' => null]);
        BusinessUnit::factory()->create(['contact_phone' => null, 'contact_email' => 'test@example.com']);
        BusinessUnit::factory()->create(['contact_phone' => null, 'contact_email' => null]);

        $unitsWithContact = BusinessUnit::withContact()->get();

        $this->assertCount(2, $unitsWithContact);
    }

    public function test_by_service_scope_filters_correctly(): void
    {
        BusinessUnit::factory()->create(['services' => 'Web Development, Mobile Apps']);
        BusinessUnit::factory()->create(['services' => 'Consulting, Training']);
        BusinessUnit::factory()->create(['services' => 'Web Development, Consulting']);

        $webDevUnits = BusinessUnit::byService('Web Development')->get();

        $this->assertCount(2, $webDevUnits);
    }

    public function test_search_scope_searches_multiple_fields(): void
    {
        BusinessUnit::factory()->create(['name' => 'Tech Solutions', 'description' => 'Software company']);
        BusinessUnit::factory()->create(['name' => 'Business Corp', 'services' => 'Tech consulting']);
        BusinessUnit::factory()->create(['name' => 'Random Company', 'description' => 'Random services']);

        $techUnits = BusinessUnit::search('Tech')->get();

        $this->assertCount(2, $techUnits);
    }

    public function test_services_array_accessor(): void
    {
        $unit = BusinessUnit::factory()->create(['services' => 'Web Development, Mobile Apps, Consulting']);

        $services = $unit->services_array;

        $this->assertIsArray($services);
        $this->assertCount(3, $services);
        $this->assertContains('Web Development', $services);
        $this->assertContains('Mobile Apps', $services);
        $this->assertContains('Consulting', $services);
    }

    public function test_operating_hours_array_accessor(): void
    {
        $unit = BusinessUnit::factory()->create(['operating_hours' => 'Monday 9-5, Tuesday 9-5, Wednesday 9-5']);

        $hours = $unit->operating_hours_array;

        $this->assertIsArray($hours);
        $this->assertCount(3, $hours);
        $this->assertContains('Monday 9-5', $hours);
    }

    public function test_has_contact_accessor(): void
    {
        $unitWithPhone = BusinessUnit::factory()->create(['contact_phone' => '123456789']);
        $unitWithEmail = BusinessUnit::factory()->create(['contact_email' => 'test@example.com']);
        $unitWithoutContact = BusinessUnit::factory()->create(['contact_phone' => null, 'contact_email' => null]);

        $this->assertTrue($unitWithPhone->has_contact);
        $this->assertTrue($unitWithEmail->has_contact);
        $this->assertFalse($unitWithoutContact->has_contact);
    }

    public function test_display_image_accessor(): void
    {
        $unitWithImage = BusinessUnit::factory()->create(['image' => 'test-image.jpg']);
        $unitWithoutImage = BusinessUnit::factory()->create(['image' => null]);

        $this->assertEquals('test-image.jpg', $unitWithImage->display_image);
        $this->assertEquals('/images/default-business-unit.jpg', $unitWithoutImage->display_image);
    }

    public function test_get_all_services_static_method(): void
    {
        BusinessUnit::factory()->create(['is_active' => true, 'services' => 'Web Development, Mobile Apps']);
        BusinessUnit::factory()->create(['is_active' => true, 'services' => 'Consulting, Mobile Apps']);
        BusinessUnit::factory()->create(['is_active' => false, 'services' => 'Inactive Service']);

        $allServices = BusinessUnit::getAllServices();

        $this->assertCount(3, $allServices); // Web Development, Mobile Apps, Consulting
        $this->assertContains('Web Development', $allServices);
        $this->assertContains('Mobile Apps', $allServices);
        $this->assertContains('Consulting', $allServices);
        $this->assertNotContains('Inactive Service', $allServices);
    }

    public function test_get_featured_static_method(): void
    {
        BusinessUnit::factory()->count(6)->create(['is_active' => true, 'image' => 'test.jpg']);
        BusinessUnit::factory()->count(2)->create(['is_active' => false, 'image' => 'test.jpg']);

        $featured = BusinessUnit::getFeatured(4);

        $this->assertCount(4, $featured);
        $this->assertTrue($featured->every(fn ($unit) => $unit->is_active && ! is_null($unit->image)));
    }

    public function test_get_services_count_method(): void
    {
        $unit = BusinessUnit::factory()->create(['services' => 'Web Development, Mobile Apps, Consulting']);

        $this->assertEquals(3, $unit->getServicesCount());
    }

    public function test_has_service_method(): void
    {
        $unit = BusinessUnit::factory()->create(['services' => 'Web Development, Mobile Apps, Consulting']);

        $this->assertTrue($unit->hasService('Web Development'));
        $this->assertTrue($unit->hasService('Mobile Apps'));
        $this->assertFalse($unit->hasService('Training'));
    }

    public function test_get_contact_methods(): void
    {
        $unit = BusinessUnit::factory()->create([
            'contact_phone' => '123456789',
            'contact_email' => 'test@example.com',
            'website_url' => 'https://example.com',
        ]);

        $methods = $unit->getContactMethods();

        $this->assertContains('phone', $methods);
        $this->assertContains('email', $methods);
        $this->assertContains('website', $methods);
    }

    public function test_to_navigation_array_method(): void
    {
        $unit = BusinessUnit::factory()->create([
            'name' => 'Test Unit',
            'slug' => 'test-unit',
            'description' => 'This is a long description that should be truncated when displayed in navigation',
            'services' => 'Web Development, Mobile Apps',
        ]);

        $navArray = $unit->toNavigationArray();

        $this->assertArrayHasKey('id', $navArray);
        $this->assertArrayHasKey('name', $navArray);
        $this->assertArrayHasKey('slug', $navArray);
        $this->assertArrayHasKey('description', $navArray);
        $this->assertArrayHasKey('image', $navArray);
        $this->assertArrayHasKey('services_count', $navArray);

        $this->assertEquals('Test Unit', $navArray['name']);
        $this->assertEquals(2, $navArray['services_count']);
        $this->assertLessThanOrEqual(100, strlen($navArray['description']));
    }
}
