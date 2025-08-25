<?php

namespace Tests\Unit;

use App\Models\BusinessUnit;
use App\Models\BusinessUnitService;
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
        BusinessUnit::factory()->create(['contact_phone' => null, 'contact_email' => 'admin@cigiglobal.com']);
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
        $unitWithEmail = BusinessUnit::factory()->create(['contact_email' => 'admin@cigiglobal.com']);
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
            'contact_email' => 'admin@cigiglobal.com',
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

    // Enhanced Fields Tests

    public function test_team_members_field_casting(): void
    {
        $teamMembers = [
            [
                'name' => 'John Doe',
                'role' => 'CEO',
                'bio' => 'Experienced leader',
                'image' => 'john.jpg',
                'social_links' => [
                    ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/in/johndoe'],
                ],
            ],
            [
                'name' => 'Jane Smith',
                'role' => 'CTO',
                'bio' => 'Tech expert',
                'image' => 'jane.jpg',
                'social_links' => [],
            ],
        ];
        $unit = BusinessUnit::factory()->create(['team_members' => $teamMembers]);

        $this->assertIsArray($unit->team_members);
        $this->assertEquals($teamMembers, $unit->team_members);
        $this->assertCount(2, $unit->team_members);
    }

    public function test_client_testimonials_field_casting(): void
    {
        $testimonials = [
            [
                'name' => 'Client One',
                'company' => 'ABC Corp',
                'content' => 'Excellent service!',
                'image' => 'client1.jpg',
                'rating' => 5,
            ],
            [
                'name' => 'Client Two',
                'company' => 'XYZ Ltd',
                'content' => 'Great experience!',
                'image' => 'client2.jpg',
                'rating' => 4,
            ],
        ];
        $unit = BusinessUnit::factory()->create(['client_testimonials' => $testimonials]);

        $this->assertIsArray($unit->client_testimonials);
        $this->assertEquals($testimonials, $unit->client_testimonials);
    }

    public function test_portfolio_items_field_casting(): void
    {
        $portfolioItems = [
            [
                'title' => 'E-commerce Platform',
                'description' => 'Full-featured online store',
                'image' => 'ecommerce.jpg',
                'technologies' => ['Laravel', 'Vue.js', 'MySQL'],
                'client' => 'Retail Company',
            ],
        ];
        $unit = BusinessUnit::factory()->create(['portfolio_items' => $portfolioItems]);

        $this->assertIsArray($unit->portfolio_items);
        $this->assertEquals($portfolioItems, $unit->portfolio_items);
    }

    public function test_certifications_field_casting(): void
    {
        $certifications = [
            [
                'name' => 'AWS Certified',
                'issuer' => 'Amazon Web Services',
                'date' => '2023-01-15',
                'image' => 'aws-cert.jpg',
                'description' => 'Cloud architecture certification',
            ],
        ];
        $unit = BusinessUnit::factory()->create(['certifications' => $certifications]);

        $this->assertIsArray($unit->certifications);
        $this->assertEquals($certifications, $unit->certifications);
    }

    public function test_company_stats_field_casting(): void
    {
        $companyStats = [
            [
                'label' => 'Years in Business',
                'value' => '10+',
                'icon' => 'calendar',
            ],
            [
                'label' => 'Projects Completed',
                'value' => '200+',
                'icon' => 'check',
            ],
        ];
        $unit = BusinessUnit::factory()->create(['company_stats' => $companyStats]);

        $this->assertIsArray($unit->company_stats);
        $this->assertEquals($companyStats, $unit->company_stats);
    }

    public function test_gallery_images_field_casting(): void
    {
        $images = ['office1.jpg', 'office2.jpg', 'team-photo.jpg'];
        $unit = BusinessUnit::factory()->create(['gallery_images' => $images]);

        $this->assertIsArray($unit->gallery_images);
        $this->assertEquals($images, $unit->gallery_images);
    }

    public function test_achievements_field_casting(): void
    {
        $achievements = [
            [
                'title' => 'Best Tech Company 2023',
                'description' => 'Awarded by Tech Magazine',
                'date' => '2023-12-01',
                'image' => 'award.jpg',
            ],
        ];
        $unit = BusinessUnit::factory()->create(['achievements' => $achievements]);

        $this->assertIsArray($unit->achievements);
        $this->assertEquals($achievements, $unit->achievements);
    }

    public function test_core_values_field_casting(): void
    {
        $coreValues = [
            [
                'title' => 'Innovation',
                'description' => 'We embrace new technologies',
                'icon' => 'lightbulb',
            ],
            [
                'title' => 'Quality',
                'description' => 'We deliver excellence',
                'icon' => 'star',
            ],
        ];
        $unit = BusinessUnit::factory()->create(['core_values' => $coreValues]);

        $this->assertIsArray($unit->core_values);
        $this->assertEquals($coreValues, $unit->core_values);
    }

    public function test_json_field_serialization_deserialization(): void
    {
        $originalData = [
            'team_members' => [
                [
                    'name' => 'Test User',
                    'role' => 'Developer',
                    'bio' => 'Skilled developer',
                    'image' => 'test.jpg',
                    'social_links' => [['platform' => 'GitHub', 'url' => 'https://github.com/test']],
                ],
            ],
            'client_testimonials' => [
                [
                    'name' => 'Happy Client',
                    'company' => 'Test Corp',
                    'content' => 'Amazing work!',
                    'image' => 'client.jpg',
                    'rating' => 5,
                ],
            ],
            'portfolio_items' => [
                [
                    'title' => 'Test Project',
                    'description' => 'A test project',
                    'image' => 'project.jpg',
                    'technologies' => ['PHP', 'Laravel'],
                    'client' => 'Test Client',
                ],
            ],
            'certifications' => [
                [
                    'name' => 'Test Certification',
                    'issuer' => 'Test Authority',
                    'date' => '2023-01-01',
                    'image' => 'cert.jpg',
                    'description' => 'Test description',
                ],
            ],
            'company_stats' => [
                ['label' => 'Test Stat', 'value' => '100+', 'icon' => 'test'],
            ],
            'gallery_images' => ['img1.jpg', 'img2.jpg'],
            'achievements' => [
                [
                    'title' => 'Test Achievement',
                    'description' => 'Test description',
                    'date' => '2023-01-01',
                    'image' => 'achievement.jpg',
                ],
            ],
            'core_values' => [
                ['title' => 'Test Value', 'description' => 'Test description', 'icon' => 'test'],
            ],
        ];

        $unit = BusinessUnit::factory()->create($originalData);

        // Refresh from database to test serialization/deserialization
        $unit->refresh();

        $this->assertEquals($originalData['team_members'], $unit->team_members);
        $this->assertEquals($originalData['client_testimonials'], $unit->client_testimonials);
        $this->assertEquals($originalData['portfolio_items'], $unit->portfolio_items);
        $this->assertEquals($originalData['certifications'], $unit->certifications);
        $this->assertEquals($originalData['company_stats'], $unit->company_stats);
        $this->assertEquals($originalData['gallery_images'], $unit->gallery_images);
        $this->assertEquals($originalData['achievements'], $unit->achievements);
        $this->assertEquals($originalData['core_values'], $unit->core_values);
    }

    public function test_unit_services_relationship(): void
    {
        $unit = BusinessUnit::factory()->create();
        $service1 = BusinessUnitService::factory()->create(['business_unit_id' => $unit->id]);
        $service2 = BusinessUnitService::factory()->create(['business_unit_id' => $unit->id]);

        // Create service for different unit to ensure proper filtering
        $otherUnit = BusinessUnit::factory()->create();
        BusinessUnitService::factory()->create(['business_unit_id' => $otherUnit->id]);

        $services = $unit->unitServices;

        $this->assertCount(2, $services);
        $this->assertTrue($services->contains($service1));
        $this->assertTrue($services->contains($service2));
    }

    public function test_model_factory_creation_with_new_fields(): void
    {
        $unit = BusinessUnit::factory()->create();

        // Test that all new fields are properly set by factory
        $this->assertNotNull($unit->team_members);
        $this->assertIsArray($unit->team_members);
        $this->assertNotEmpty($unit->team_members);

        $this->assertNotNull($unit->client_testimonials);
        $this->assertIsArray($unit->client_testimonials);
        $this->assertNotEmpty($unit->client_testimonials);

        $this->assertNotNull($unit->portfolio_items);
        $this->assertIsArray($unit->portfolio_items);
        $this->assertNotEmpty($unit->portfolio_items);

        $this->assertNotNull($unit->certifications);
        $this->assertIsArray($unit->certifications);
        $this->assertNotEmpty($unit->certifications);

        $this->assertNotNull($unit->company_stats);
        $this->assertIsArray($unit->company_stats);
        $this->assertNotEmpty($unit->company_stats);

        $this->assertNotNull($unit->gallery_images);
        $this->assertIsArray($unit->gallery_images);
        $this->assertNotEmpty($unit->gallery_images);

        $this->assertNotNull($unit->achievements);
        $this->assertIsArray($unit->achievements);
        $this->assertNotEmpty($unit->achievements);

        $this->assertNotNull($unit->core_values);
        $this->assertIsArray($unit->core_values);
        $this->assertNotEmpty($unit->core_values);

        $this->assertNotNull($unit->hero_subtitle);
        $this->assertIsString($unit->hero_subtitle);

        $this->assertNotNull($unit->hero_cta_text);
        $this->assertIsString($unit->hero_cta_text);

        $this->assertNotNull($unit->hero_cta_link);
        $this->assertIsString($unit->hero_cta_link);
    }

    public function test_validation_rules_include_new_fields(): void
    {
        $rules = BusinessUnit::validationRules();

        // Test that validation rules exist for new fields
        $this->assertArrayHasKey('team_members', $rules);
        $this->assertArrayHasKey('client_testimonials', $rules);
        $this->assertArrayHasKey('portfolio_items', $rules);
        $this->assertArrayHasKey('certifications', $rules);
        $this->assertArrayHasKey('company_stats', $rules);
        $this->assertArrayHasKey('gallery_images', $rules);
        $this->assertArrayHasKey('achievements', $rules);
        $this->assertArrayHasKey('core_values', $rules);
        $this->assertArrayHasKey('hero_subtitle', $rules);
        $this->assertArrayHasKey('hero_cta_text', $rules);
        $this->assertArrayHasKey('hero_cta_link', $rules);

        // Test nested validation rules
        $this->assertArrayHasKey('team_members.*.name', $rules);
        $this->assertArrayHasKey('team_members.*.role', $rules);
        $this->assertArrayHasKey('client_testimonials.*.name', $rules);
        $this->assertArrayHasKey('client_testimonials.*.content', $rules);
        $this->assertArrayHasKey('portfolio_items.*.title', $rules);
        $this->assertArrayHasKey('certifications.*.name', $rules);
        $this->assertArrayHasKey('company_stats.*.label', $rules);
        $this->assertArrayHasKey('achievements.*.title', $rules);
        $this->assertArrayHasKey('core_values.*.title', $rules);
    }

    public function test_fillable_fields_include_new_fields(): void
    {
        $unit = new BusinessUnit;
        $fillable = $unit->getFillable();

        $expectedNewFields = [
            'team_members',
            'client_testimonials',
            'portfolio_items',
            'certifications',
            'company_stats',
            'gallery_images',
            'achievements',
            'core_values',
            'hero_subtitle',
            'hero_cta_text',
            'hero_cta_link',
        ];

        foreach ($expectedNewFields as $field) {
            $this->assertContains($field, $fillable, "Field {$field} should be fillable");
        }
    }

    public function test_casts_configuration_for_new_fields(): void
    {
        $unit = new BusinessUnit;
        $casts = $unit->getCasts();

        $this->assertEquals('array', $casts['team_members']);
        $this->assertEquals('array', $casts['client_testimonials']);
        $this->assertEquals('array', $casts['portfolio_items']);
        $this->assertEquals('array', $casts['certifications']);
        $this->assertEquals('array', $casts['company_stats']);
        $this->assertEquals('array', $casts['gallery_images']);
        $this->assertEquals('array', $casts['achievements']);
        $this->assertEquals('array', $casts['core_values']);
    }
}
