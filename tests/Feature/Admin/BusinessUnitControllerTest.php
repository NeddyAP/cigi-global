<?php

namespace Tests\Feature\Admin;

use App\Models\BusinessUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BusinessUnitControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        Storage::fake('public');
    }

    public function test_admin_can_view_business_units_index(): void
    {
        BusinessUnit::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.business-units.index'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/index')
            ->has('businessUnits')
        );
    }

    public function test_admin_can_view_create_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.business-units.create'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/create')
        );
    }

    public function test_admin_can_create_business_unit_with_basic_fields(): void
    {
        $data = [
            'name' => 'Test Business Unit',
            'slug' => 'test-business-unit',
            'description' => 'Test description',
            'services' => 'Service 1\nService 2',
            'contact_phone' => '+1234567890',
            'contact_email' => 'test@example.com',
            'address' => 'Test Address',
            'website_url' => 'https://example.com',
            'operating_hours' => '9 AM - 5 PM',
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));
        $this->assertDatabaseHas('business_units', [
            'name' => 'Test Business Unit',
            'slug' => 'test-business-unit',
            'services' => 'Service 1\nService 2',
        ]);
    }

    public function test_admin_can_create_business_unit_with_enhanced_fields(): void
    {
        $data = [
            'name' => 'Enhanced Business Unit',
            'slug' => 'enhanced-business-unit',
            'description' => 'Enhanced description',
            'services' => 'Enhanced Service 1\nEnhanced Service 2',
            'hero_subtitle' => 'Leading technology solutions',
            'hero_cta_text' => 'Get Started',
            'hero_cta_link' => '/contact',
            'team_members' => [
                [
                    'name' => 'John Doe',
                    'role' => 'CEO',
                    'bio' => 'Experienced leader',
                    'social_links' => [
                        ['platform' => 'linkedin', 'url' => 'https://linkedin.com/johndoe'],
                    ],
                ],
            ],
            'client_testimonials' => [
                [
                    'name' => 'Jane Smith',
                    'company' => 'Tech Corp',
                    'content' => 'Excellent service!',
                    'rating' => 5,
                ],
            ],
            'portfolio_items' => [
                [
                    'title' => 'E-commerce Platform',
                    'description' => 'Modern e-commerce solution',
                    'technologies' => ['React', 'Laravel', 'MySQL'],
                    'client' => 'Retail Store',
                ],
            ],
            'certifications' => [
                [
                    'name' => 'ISO 9001:2015',
                    'issuer' => 'International Standards Organization',
                    'date' => '2024-01-01',
                    'description' => 'Quality management system',
                ],
            ],
            'company_stats' => [
                [
                    'label' => 'Years in Business',
                    'value' => '10',
                    'icon' => '📅',
                ],
                [
                    'label' => 'Projects Completed',
                    'value' => '100',
                    'icon' => '✅',
                ],
                [
                    'label' => 'Clients Served',
                    'value' => '50',
                    'icon' => '👥',
                ],
                [
                    'label' => 'Team Size',
                    'value' => '25',
                    'icon' => '👨‍💼',
                ],
            ],

            'achievements' => [
                [
                    'title' => 'Best Tech Company 2024',
                    'date' => '2024-01-01',
                    'description' => 'Industry recognition',
                ],
            ],
            'core_values' => [
                [
                    'title' => 'Innovation',
                    'description' => 'Always pushing boundaries',
                    'icon' => '🚀',
                ],
            ],
            'is_active' => true,
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'enhanced-business-unit')->first();
        $this->assertNotNull($unit);
        $this->assertEquals('Leading technology solutions', $unit->hero_subtitle);
        $this->assertEquals('Get Started', $unit->hero_cta_text);
        $this->assertEquals('/contact', $unit->hero_cta_link);
        $this->assertCount(1, $unit->team_members);
        $this->assertCount(1, $unit->client_testimonials);
        $this->assertCount(1, $unit->portfolio_items);
        $this->assertCount(1, $unit->certifications);
        $this->assertEquals('10', $unit->company_stats[0]['value']);
        $this->assertCount(1, $unit->achievements);
        $this->assertCount(1, $unit->core_values);
    }

    public function test_admin_can_upload_gallery_images(): void
    {
        $file1 = UploadedFile::fake()->image('gallery1.jpg');
        $file2 = UploadedFile::fake()->image('gallery2.jpg');

        $data = [
            'name' => 'Unit with Gallery',
            'slug' => 'unit-with-gallery',
            'description' => 'Test description',
            'services' => 'Test service',
            'gallery_images' => [$file1, $file2],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'unit-with-gallery')->first();
        $this->assertNotNull($unit);
        $this->assertCount(2, $unit->gallery_images);

        // Check that files were stored
        foreach ($unit->gallery_images as $imagePath) {
            Storage::disk('public')->assertExists($imagePath);
        }
    }

    public function test_admin_can_upload_main_image(): void
    {
        $file = UploadedFile::fake()->image('main-image.jpg');

        $data = [
            'name' => 'Unit with Main Image',
            'slug' => 'unit-with-main-image',
            'description' => 'Test description',
            'services' => 'Test service',
            'image' => $file,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'unit-with-main-image')->first();
        $this->assertNotNull($unit);
        $this->assertNotNull($unit->image);
        Storage::disk('public')->assertExists($unit->image);
    }

    public function test_admin_can_upload_team_member_images(): void
    {
        $file = UploadedFile::fake()->image('team-member.jpg');

        $data = [
            'name' => 'Unit with Team Images',
            'slug' => 'unit-with-team-images',
            'description' => 'Test description',
            'services' => 'Test service',
            'team_members' => [
                [
                    'name' => 'John Doe',
                    'role' => 'Developer',
                    'bio' => 'Experienced developer',
                ],
            ],
            'team_member_images' => [
                0 => $file,
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'unit-with-team-images')->first();
        $this->assertNotNull($unit);
        $this->assertCount(1, $unit->team_members);
        $this->assertNotNull($unit->team_members[0]['image']);
        Storage::disk('public')->assertExists($unit->team_members[0]['image']);
    }

    public function test_admin_can_upload_testimonial_images(): void
    {
        $file = UploadedFile::fake()->image('testimonial.jpg');

        $data = [
            'name' => 'Unit with Testimonial Images',
            'slug' => 'unit-with-testimonial-images',
            'description' => 'Test description',
            'services' => 'Test service',
            'client_testimonials' => [
                [
                    'name' => 'Jane Smith',
                    'company' => 'Tech Corp',
                    'content' => 'Great service!',
                    'rating' => 5,
                ],
            ],
            'testimonial_images' => [
                0 => $file,
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'unit-with-testimonial-images')->first();
        $this->assertNotNull($unit);
        $this->assertCount(1, $unit->client_testimonials);
        $this->assertNotNull($unit->client_testimonials[0]['image']);
        Storage::disk('public')->assertExists($unit->client_testimonials[0]['image']);
    }

    public function test_admin_can_upload_portfolio_images(): void
    {
        $file = UploadedFile::fake()->image('portfolio.jpg');

        $data = [
            'name' => 'Unit with Portfolio Images',
            'slug' => 'unit-with-portfolio-images',
            'description' => 'Test description',
            'services' => 'Test service',
            'portfolio_items' => [
                [
                    'title' => 'Web App',
                    'description' => 'Modern web application',
                    'technologies' => ['React', 'Laravel'],
                    'client' => 'Client Corp',
                ],
            ],
            'portfolio_images' => [
                0 => $file,
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit = BusinessUnit::where('slug', 'unit-with-portfolio-images')->first();
        $this->assertNotNull($unit);
        $this->assertCount(1, $unit->portfolio_items);
        $this->assertNotNull($unit->portfolio_items[0]['image']);
        Storage::disk('public')->assertExists($unit->portfolio_items[0]['image']);
    }

    public function test_admin_can_view_edit_form(): void
    {
        $unit = BusinessUnit::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.business-units.edit', $unit->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/edit')
            ->has('businessUnit')
            ->where('businessUnit.name', $unit->name)
        );
    }

    public function test_admin_can_update_business_unit(): void
    {
        $unit = BusinessUnit::factory()->create([
            'name' => 'Original Name',
            'description' => 'Original description',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'hero_subtitle' => 'Updated subtitle',
            'company_stats' => [
                [
                    'label' => 'Years in Business',
                    'value' => '15',
                    'icon' => '📅',
                ],
                [
                    'label' => 'Projects Completed',
                    'value' => '150',
                    'icon' => '✅',
                ],
                [
                    'label' => 'Clients Served',
                    'value' => '75',
                    'icon' => '👥',
                ],
                [
                    'label' => 'Team Size',
                    'value' => '35',
                    'icon' => '👨‍💼',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.business-units.update', $unit->slug), $updateData);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit->refresh();
        $this->assertEquals('Updated Name', $unit->name);
        $this->assertEquals('Updated description', $unit->description);
        $this->assertEquals('Updated subtitle', $unit->hero_subtitle);
        $this->assertEquals('15', $unit->company_stats[0]['value']);
        $this->assertEquals('150', $unit->company_stats[1]['value']);
    }

    public function test_admin_can_update_with_json_fields(): void
    {
        $unit = BusinessUnit::factory()->create();

        $updateData = [
            'name' => 'Updated Unit',
            'team_members' => [
                [
                    'name' => 'Jane Doe',
                    'role' => 'CTO',
                    'bio' => 'Technology leader',
                ],
            ],
            'achievements' => [
                [
                    'title' => 'Innovation Award 2024',
                    'date' => '2024-06-01',
                    'description' => 'Recognition for innovation',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.business-units.update', $unit->slug), $updateData);

        $response->assertRedirect(route('admin.business-units.index'));

        $unit->refresh();
        $this->assertCount(1, $unit->team_members);
        $this->assertEquals('Jane Doe', $unit->team_members[0]['name']);
        $this->assertCount(1, $unit->achievements);
        $this->assertEquals('Innovation Award 2024', $unit->achievements[0]['title']);
    }

    public function test_admin_can_delete_business_unit(): void
    {
        $unit = BusinessUnit::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.business-units.destroy', $unit->slug));

        $response->assertRedirect(route('admin.business-units.index'));
        $this->assertDatabaseMissing('business_units', ['id' => $unit->id]);
    }

    public function test_admin_can_view_business_unit_show_page(): void
    {
        $unit = BusinessUnit::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.business-units.show', $unit->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/show')
            ->has('businessUnit')
            ->where('businessUnit.name', $unit->name)
        );
    }

    public function test_validation_requires_name(): void
    {
        $data = [
            'description' => 'Test description',
            'services' => 'Test service',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_validation_requires_valid_email(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'contact_email' => 'invalid-email',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['contact_email']);
    }

    public function test_validation_requires_valid_website_url(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'website_url' => 'not-a-valid-url',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['website_url']);
    }

    public function test_validation_requires_valid_company_stats(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'company_stats' => [
                [
                    'label' => 'Years in Business',
                    'value' => '', // Missing required value
                    'icon' => '📅',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['company_stats.0.value']);
    }

    public function test_json_field_validation(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'team_members' => [
                [
                    'name' => '', // Missing required name
                    'role' => 'Developer',
                    'bio' => 'Experienced developer',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['team_members.0.name']);
    }

    public function test_team_member_social_links_validation(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'team_members' => [
                [
                    'name' => 'John Doe',
                    'role' => 'Developer',
                    'bio' => 'Experienced developer',
                    'social_links' => [
                        [
                            'platform' => 'linkedin',
                            'url' => 'not-a-valid-url',
                        ],
                    ],
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['team_members.0.social_links.0.url']);
    }

    public function test_portfolio_technologies_validation(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'portfolio_items' => [
                [
                    'title' => 'Web App',
                    'description' => 'Modern web application',
                    'technologies' => [
                        'React',
                        123, // Invalid: must be string
                        'Laravel',
                    ],
                    'client' => 'Client Corp',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['portfolio_items.0.technologies.1']);
    }

    public function test_certification_date_validation(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'certifications' => [
                [
                    'name' => 'ISO 9001',
                    'issuer' => 'ISO',
                    'date' => 'invalid-date', // Invalid date format
                    'description' => 'Quality management',
                ],
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors(['certifications.0.date']);
    }

    public function test_hero_fields_validation(): void
    {
        $data = [
            'name' => 'Test Unit',
            'services' => 'Test service',
            'hero_subtitle' => str_repeat('a', 501), // Too long: max 500
            'hero_cta_text' => str_repeat('a', 101), // Too long: max 100
            'hero_cta_link' => str_repeat('a', 501), // Too long: max 500
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-units.store'), $data);

        $response->assertSessionHasErrors([
            'hero_subtitle',
            'hero_cta_text',
            'hero_cta_link',
        ]);
    }

    public function test_inertia_response_structure(): void
    {
        $unit = BusinessUnit::factory()->create([
            'team_members' => [
                [
                    'name' => 'John Doe',
                    'role' => 'Developer',
                    'bio' => 'Experienced developer',
                ],
            ],
            'client_testimonials' => [
                [
                    'name' => 'Jane Smith',
                    'company' => 'Tech Corp',
                    'content' => 'Great service!',
                    'rating' => 5,
                ],
            ],
            'gallery_images' => ['image1.jpg', 'image2.jpg'],
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-units.edit', $unit->slug));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/edit')
            ->has('businessUnit', fn (AssertableInertia $unit) => $unit
                ->has('team_members')
                ->has('client_testimonials')
                ->has('gallery_images')
                ->etc()
            )
        );
    }

    public function test_can_filter_business_units_by_status(): void
    {
        BusinessUnit::factory()->count(2)->create(['is_active' => true]);
        BusinessUnit::factory()->count(3)->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-units.index', [
            'status' => 'active',
        ]));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-units/index')
            ->has('businessUnits')
        );
    }
}
