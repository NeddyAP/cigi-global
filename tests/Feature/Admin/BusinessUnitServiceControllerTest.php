<?php

namespace Tests\Feature\Admin;

use App\Models\BusinessUnit;
use App\Models\BusinessUnitService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BusinessUnitServiceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected BusinessUnit $businessUnit;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        $this->businessUnit = BusinessUnit::factory()->create();
        Storage::fake('public');
    }

    public function test_admin_can_view_services_index(): void
    {
        BusinessUnitService::factory()->count(3)->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.index'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/index')
            ->has('services')
        );
    }

    public function test_admin_can_view_create_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.create'));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/create')
            ->has('businessUnits')
        );
    }

    public function test_admin_can_create_service_with_basic_fields(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test service description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'features' => ['Feature 1', 'Feature 2'],
            'technologies' => ['React', 'Laravel'],
            'process_steps' => [
                [
                    'step' => 'Discovery',
                    'description' => 'Understand requirements',
                    'order' => 1,
                ],
                [
                    'step' => 'Development',
                    'description' => 'Build the solution',
                    'order' => 2,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertRedirect(route('admin.business-unit-services.index'));
        $this->assertDatabaseHas('business_unit_services', [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
        ]);
    }

    public function test_admin_can_create_service_with_image(): void
    {
        $file = UploadedFile::fake()->image('service-image.jpg');

        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Service with Image',
            'description' => 'Test service with image',
            'price_range' => '$200-800',
            'duration' => '1 month',
            'image' => $file,
            'features' => ['Professional design'],
            'technologies' => ['Figma', 'Adobe'],
            'process_steps' => [
                [
                    'step' => 'Design',
                    'description' => 'Create mockups',
                    'order' => 1,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertRedirect(route('admin.business-unit-services.index'));

        $service = BusinessUnitService::where('title', 'Service with Image')->first();
        $this->assertNotNull($service);
        $this->assertNotNull($service->image);
        Storage::disk('public')->assertExists($service->image);
    }

    public function test_admin_can_create_service_with_complex_features(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Complex Service',
            'description' => 'Service with complex features',
            'price_range' => '$1000-5000',
            'duration' => '3 months',
            'features' => [
                'Custom development',
                '24/7 support',
                'Performance optimization',
                'Security audit',
                'Documentation',
            ],
            'technologies' => [
                'React',
                'Node.js',
                'PostgreSQL',
                'Redis',
                'Docker',
            ],
            'process_steps' => [
                [
                    'step' => 'Planning',
                    'description' => 'Project planning and requirements gathering',
                    'order' => 1,
                ],
                [
                    'step' => 'Design',
                    'description' => 'UI/UX design and architecture',
                    'order' => 2,
                ],
                [
                    'step' => 'Development',
                    'description' => 'Agile development process',
                    'order' => 3,
                ],
                [
                    'step' => 'Testing',
                    'description' => 'Quality assurance and testing',
                    'order' => 4,
                ],
                [
                    'step' => 'Deployment',
                    'description' => 'Production deployment and monitoring',
                    'order' => 5,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertRedirect(route('admin.business-unit-services.index'));

        $service = BusinessUnitService::where('title', 'Complex Service')->first();
        $this->assertNotNull($service);
        $this->assertCount(5, $service->features);
        $this->assertCount(5, $service->technologies);
        $this->assertCount(5, $service->process_steps);
        $this->assertContains('Custom development', $service->features);
        $this->assertContains('Docker', $service->technologies);
        $this->assertEquals('Planning', $service->process_steps[0]['step']);
        $this->assertEquals('Deployment', $service->process_steps[4]['step']);
    }

    public function test_admin_can_view_edit_form(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.edit', $service->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/edit')
            ->has('service')
            ->where('service.title', $service->title)
        );
    }

    public function test_admin_can_update_service(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Original Title',
            'description' => 'Original description',
        ]);

        $updateData = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'price_range' => '$500-2000',
            'duration' => '6 weeks',
            'features' => ['Updated feature 1', 'Updated feature 2'],
            'technologies' => ['Vue.js', 'Laravel'],
            'process_steps' => [
                [
                    'step' => 'Updated Step 1',
                    'description' => 'Updated description 1',
                    'order' => 1,
                ],
                [
                    'step' => 'Updated Step 2',
                    'description' => 'Updated description 2',
                    'order' => 2,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.business-unit-services.update', $service->id), $updateData);

        $response->assertRedirect(route('admin.business-unit-services.index'));

        $service->refresh();
        $this->assertEquals('Updated Title', $service->title);
        $this->assertEquals('Updated description', $service->description);
        $this->assertEquals('$500-2000', $service->price_range);
        $this->assertEquals('6 weeks', $service->duration);
        $this->assertCount(2, $service->features);
        $this->assertCount(2, $service->technologies);
        $this->assertCount(2, $service->process_steps);
    }

    public function test_admin_can_update_service_image(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $file = UploadedFile::fake()->image('new-service-image.jpg');

        $updateData = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Updated Service',
            'description' => 'Updated description',
            'price_range' => '$300-1000',
            'duration' => '4 weeks',
            'image' => $file,
            'features' => ['Feature 1'],
            'technologies' => ['React'],
            'process_steps' => [
                [
                    'step' => 'Development',
                    'description' => 'Build the solution',
                    'order' => 1,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.business-unit-services.update', $service->id), $updateData);

        $response->assertRedirect(route('admin.business-unit-services.index'));

        $service->refresh();
        $this->assertNotNull($service->image);
        Storage::disk('public')->assertExists($service->image);
    }

    public function test_admin_can_delete_service(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.business-unit-services.destroy', $service->id));

        $response->assertRedirect(route('admin.business-unit-services.index'));
        $this->assertDatabaseMissing('business_unit_services', ['id' => $service->id]);
    }

    public function test_admin_can_view_service_show_page(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.show', $service->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/show')
            ->has('service')
            ->where('service.title', $service->title)
        );
    }

    public function test_validation_requires_business_unit_id(): void
    {
        $data = [
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['business_unit_id']);
    }

    public function test_validation_requires_valid_business_unit_id(): void
    {
        $data = [
            'business_unit_id' => 99999, // Non-existent ID
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['business_unit_id']);
    }

    public function test_validation_requires_title(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_validation_requires_valid_features_array(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'features' => 'not-an-array', // Invalid: must be array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['features']);
    }

    public function test_validation_accepts_empty_features_array(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'features' => [], // Valid: empty array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertRedirect(route('admin.business-unit-services.index'));
        $this->assertDatabaseHas('business_unit_services', [
            'title' => 'Test Service',
            'features' => '[]',
        ]);
    }

    public function test_validation_requires_valid_features_strings(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'features' => [
                'Valid feature',
                123, // Invalid: must be string
                'Another valid feature',
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['features.1']);
    }

    public function test_validation_limits_features_string_length(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'features' => [
                str_repeat('a', 256), // Too long: max 255
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['features.0']);
    }

    public function test_validation_requires_valid_technologies_array(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'technologies' => 'not-an-array', // Invalid: must be array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['technologies']);
    }

    public function test_validation_requires_valid_technologies_strings(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'technologies' => [
                'React',
                456, // Invalid: must be string
                'Laravel',
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['technologies.1']);
    }

    public function test_validation_limits_technologies_string_length(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'technologies' => [
                str_repeat('a', 101), // Too long: max 100
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['technologies.0']);
    }

    public function test_validation_requires_valid_process_steps_array(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'process_steps' => 'not-an-array', // Invalid: must be array
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['process_steps']);
    }

    public function test_validation_requires_valid_process_steps_structure(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'process_steps' => [
                [
                    'description' => 'Missing step field', // Missing required 'step' field
                    'order' => 1,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['process_steps.0.step']);
    }

    public function test_validation_requires_valid_process_step_order(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'process_steps' => [
                [
                    'step' => 'Step 1',
                    'description' => 'Description 1',
                    'order' => 0, // Invalid: must be at least 1
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertSessionHasErrors(['process_steps.0.order']);
    }

    public function test_validation_accepts_null_process_step_order(): void
    {
        $data = [
            'business_unit_id' => $this->businessUnit->id,
            'title' => 'Test Service',
            'description' => 'Test description',
            'price_range' => '$100-500',
            'duration' => '2 weeks',
            'process_steps' => [
                [
                    'step' => 'Step 1',
                    'description' => 'Description 1',
                    'order' => null, // Valid: optional field
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.business-unit-services.store'), $data);

        $response->assertRedirect(route('admin.business-unit-services.index'));
        $this->assertDatabaseHas('business_unit_services', [
            'title' => 'Test Service',
        ]);
    }

    public function test_service_relationship_with_business_unit(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.edit', $service->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/edit')
            ->has('service', fn (AssertableInertia $service) => $service
                ->where('business_unit_id', $this->businessUnit->id)
                ->etc()
            )
        );
    }

    public function test_inertia_response_structure(): void
    {
        $service = BusinessUnitService::factory()->create([
            'business_unit_id' => $this->businessUnit->id,
            'features' => ['Feature 1', 'Feature 2'],
            'technologies' => ['React', 'Laravel'],
            'process_steps' => [
                [
                    'step' => 'Step 1',
                    'description' => 'Description 1',
                    'order' => 1,
                ],
            ],
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.edit', $service->id));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/edit')
            ->has('service', fn (AssertableInertia $service) => $service
                ->has('features')
                ->has('technologies')
                ->has('process_steps')
                ->etc()
            )
        );
    }

    public function test_can_filter_services_by_business_unit(): void
    {
        $unit1 = BusinessUnit::factory()->create();
        $unit2 = BusinessUnit::factory()->create();

        BusinessUnitService::factory()->count(2)->create([
            'business_unit_id' => $unit1->id,
        ]);
        BusinessUnitService::factory()->count(3)->create([
            'business_unit_id' => $unit2->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.index', [
            'business_unit_id' => $unit1->id,
        ]));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/index')
            ->has('services')
        );
    }

    public function test_can_filter_services_by_status(): void
    {
        BusinessUnitService::factory()->count(2)->create([
            'business_unit_id' => $this->businessUnit->id,
            'active' => true,
        ]);
        BusinessUnitService::factory()->count(3)->create([
            'business_unit_id' => $this->businessUnit->id,
            'active' => false,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.index', [
            'status' => 'active',
        ]));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/index')
            ->has('services')
        );
    }

    public function test_can_filter_services_by_featured(): void
    {
        BusinessUnitService::factory()->count(2)->create([
            'business_unit_id' => $this->businessUnit->id,
            'featured' => true,
        ]);
        BusinessUnitService::factory()->count(3)->create([
            'business_unit_id' => $this->businessUnit->id,
            'featured' => false,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.business-unit-services.index', [
            'featured' => true,
        ]));

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/business-unit-services/index')
            ->has('services')
        );
    }
}
