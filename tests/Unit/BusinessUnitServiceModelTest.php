<?php

namespace Tests\Unit;

use App\Models\BusinessUnit;
use App\Models\BusinessUnitService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessUnitServiceModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_field_validation_and_casting(): void
    {
        $service = BusinessUnitService::factory()->create([
            'features' => ['Feature 1', 'Feature 2', 'Feature 3'],
            'technologies' => ['Laravel', 'React', 'MySQL'],
            'process_steps' => [
                ['step' => 'Planning', 'description' => 'Initial planning phase', 'order' => 1],
                ['step' => 'Development', 'description' => 'Development phase', 'order' => 2],
            ],
        ]);

        $this->assertIsArray($service->features);
        $this->assertCount(3, $service->features);
        $this->assertIsArray($service->technologies);
        $this->assertCount(3, $service->technologies);
        $this->assertIsArray($service->process_steps);
        $this->assertCount(2, $service->process_steps);
    }

    public function test_features_json_field_handling(): void
    {
        $features = [
            'Responsive design',
            'SEO optimization',
            'Performance optimization',
            'Security implementation',
        ];

        $service = BusinessUnitService::factory()->create(['features' => $features]);

        $this->assertIsArray($service->features);
        $this->assertEquals($features, $service->features);

        // Test serialization/deserialization by refreshing from database
        $service->refresh();
        $this->assertEquals($features, $service->features);
    }

    public function test_technologies_json_field_handling(): void
    {
        $technologies = [
            'PHP',
            'Laravel',
            'Vue.js',
            'MySQL',
            'Redis',
        ];

        $service = BusinessUnitService::factory()->create(['technologies' => $technologies]);

        $this->assertIsArray($service->technologies);
        $this->assertEquals($technologies, $service->technologies);

        // Test serialization/deserialization by refreshing from database
        $service->refresh();
        $this->assertEquals($technologies, $service->technologies);
    }

    public function test_process_steps_json_field_handling(): void
    {
        $processSteps = [
            [
                'step' => 'Discovery',
                'description' => 'Understanding requirements',
                'order' => 1,
            ],
            [
                'step' => 'Design',
                'description' => 'Creating mockups and wireframes',
                'order' => 2,
            ],
            [
                'step' => 'Development',
                'description' => 'Building the solution',
                'order' => 3,
            ],
            [
                'step' => 'Testing',
                'description' => 'Quality assurance',
                'order' => 4,
            ],
        ];

        $service = BusinessUnitService::factory()->create(['process_steps' => $processSteps]);

        $this->assertIsArray($service->process_steps);
        $this->assertEquals($processSteps, $service->process_steps);

        // Test serialization/deserialization by refreshing from database
        $service->refresh();
        $this->assertEquals($processSteps, $service->process_steps);
    }

    public function test_business_unit_relationship(): void
    {
        $unit = BusinessUnit::factory()->create();
        $service = BusinessUnitService::factory()->create(['business_unit_id' => $unit->id]);

        $this->assertInstanceOf(BusinessUnit::class, $service->businessUnit);
        $this->assertEquals($unit->id, $service->businessUnit->id);
        $this->assertEquals($unit->name, $service->businessUnit->name);
    }

    public function test_model_factory_creation(): void
    {
        $service = BusinessUnitService::factory()->create();

        // Test that all required fields are properly set by factory
        $this->assertNotNull($service->business_unit_id);
        $this->assertIsInt($service->business_unit_id);

        $this->assertNotNull($service->title);
        $this->assertIsString($service->title);

        $this->assertNotNull($service->description);
        $this->assertIsString($service->description);

        $this->assertNotNull($service->image);
        $this->assertIsString($service->image);

        $this->assertNotNull($service->price_range);
        $this->assertIsString($service->price_range);

        $this->assertNotNull($service->duration);
        $this->assertIsString($service->duration);

        $this->assertNotNull($service->features);
        $this->assertIsArray($service->features);
        $this->assertNotEmpty($service->features);

        $this->assertNotNull($service->technologies);
        $this->assertIsArray($service->technologies);
        $this->assertNotEmpty($service->technologies);

        $this->assertNotNull($service->process_steps);
        $this->assertIsArray($service->process_steps);
        $this->assertNotEmpty($service->process_steps);
    }

    public function test_factory_premium_state(): void
    {
        $service = BusinessUnitService::factory()->premium()->create();

        $this->assertEquals('$5000+', $service->price_range);
        $this->assertEquals('3-6 months', $service->duration);
    }

    public function test_factory_basic_state(): void
    {
        $service = BusinessUnitService::factory()->basic()->create();

        $this->assertEquals('$100-500', $service->price_range);
        $this->assertEquals('1-2 weeks', $service->duration);
    }

    public function test_validation_rules(): void
    {
        $rules = BusinessUnitService::validationRules();

        // Test that validation rules exist for all fields
        $this->assertArrayHasKey('business_unit_id', $rules);
        $this->assertArrayHasKey('title', $rules);
        $this->assertArrayHasKey('description', $rules);
        $this->assertArrayHasKey('image', $rules);
        $this->assertArrayHasKey('price_range', $rules);
        $this->assertArrayHasKey('duration', $rules);
        $this->assertArrayHasKey('features', $rules);
        $this->assertArrayHasKey('features.*', $rules);
        $this->assertArrayHasKey('technologies', $rules);
        $this->assertArrayHasKey('technologies.*', $rules);
        $this->assertArrayHasKey('process_steps', $rules);
        $this->assertArrayHasKey('process_steps.*.step', $rules);
        $this->assertArrayHasKey('process_steps.*.description', $rules);
        $this->assertArrayHasKey('process_steps.*.order', $rules);

        // Test specific validation rules
        $this->assertStringContainsString('required', $rules['business_unit_id']);
        $this->assertStringContainsString('exists:business_units,id', $rules['business_unit_id']);
        $this->assertStringContainsString('required', $rules['title']);
        $this->assertStringContainsString('nullable', $rules['description']);
        $this->assertStringContainsString('nullable', $rules['price_range']);
        $this->assertStringContainsString('required', $rules['process_steps.*.step']);
        $this->assertStringContainsString('nullable', $rules['process_steps.*.description']);
        $this->assertStringContainsString('min:1', $rules['process_steps.*.order']);
    }

    public function test_fillable_fields(): void
    {
        $service = new BusinessUnitService;
        $fillable = $service->getFillable();

        $expectedFields = [
            'business_unit_id',
            'title',
            'description',
            'image',
            'price_range',
            'duration',
            'features',
            'technologies',
            'process_steps',
        ];

        foreach ($expectedFields as $field) {
            $this->assertContains($field, $fillable, "Field {$field} should be fillable");
        }
    }

    public function test_casts_configuration(): void
    {
        $service = new BusinessUnitService;
        $casts = $service->getCasts();

        $this->assertEquals('array', $casts['features']);
        $this->assertEquals('array', $casts['technologies']);
        $this->assertEquals('array', $casts['process_steps']);
    }

    public function test_mass_assignment_with_all_fields(): void
    {
        $unit = BusinessUnit::factory()->create();

        $data = [
            'business_unit_id' => $unit->id,
            'title' => 'Web Development Service',
            'description' => 'Complete web development solution',
            'image' => 'web-dev-service.jpg',
            'price_range' => '$2000-5000',
            'duration' => '2-4 months',
            'features' => ['Responsive Design', 'SEO Optimization', 'Performance Tuning'],
            'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Redis'],
            'process_steps' => [
                ['step' => 'Planning', 'description' => 'Project planning', 'order' => 1],
                ['step' => 'Development', 'description' => 'Code development', 'order' => 2],
                ['step' => 'Testing', 'description' => 'Quality testing', 'order' => 3],
            ],
        ];

        $service = BusinessUnitService::create($data);

        $this->assertEquals($data['title'], $service->title);
        $this->assertEquals($data['description'], $service->description);
        $this->assertEquals($data['image'], $service->image);
        $this->assertEquals($data['price_range'], $service->price_range);
        $this->assertEquals($data['duration'], $service->duration);
        $this->assertEquals($data['features'], $service->features);
        $this->assertEquals($data['technologies'], $service->technologies);
        $this->assertEquals($data['process_steps'], $service->process_steps);
    }

    public function test_belongs_to_business_unit_relationship_integrity(): void
    {
        $unit1 = BusinessUnit::factory()->create();
        $unit2 = BusinessUnit::factory()->create();

        $service = BusinessUnitService::factory()->create(['business_unit_id' => $unit1->id]);

        // Test that the service belongs to the correct unit
        $this->assertEquals($unit1->id, $service->businessUnit->id);
        $this->assertNotEquals($unit2->id, $service->businessUnit->id);

        // Test that the relationship is properly loaded
        $this->assertInstanceOf(BusinessUnit::class, $service->businessUnit);
        $this->assertEquals($unit1->name, $service->businessUnit->name);
    }

    public function test_json_field_empty_array_handling(): void
    {
        $service = BusinessUnitService::factory()->create([
            'features' => [],
            'technologies' => [],
            'process_steps' => [],
        ]);

        $this->assertIsArray($service->features);
        $this->assertEmpty($service->features);
        $this->assertIsArray($service->technologies);
        $this->assertEmpty($service->technologies);
        $this->assertIsArray($service->process_steps);
        $this->assertEmpty($service->process_steps);

        // Test after refresh from database
        $service->refresh();
        $this->assertIsArray($service->features);
        $this->assertEmpty($service->features);
        $this->assertIsArray($service->technologies);
        $this->assertEmpty($service->technologies);
        $this->assertIsArray($service->process_steps);
        $this->assertEmpty($service->process_steps);
    }

    public function test_optional_fields_can_be_null(): void
    {
        $unit = BusinessUnit::factory()->create();

        $service = BusinessUnitService::create([
            'business_unit_id' => $unit->id,
            'title' => 'Minimal Service',
            'description' => null,
            'image' => null,
            'price_range' => null,
            'duration' => null,
            'features' => null,
            'technologies' => null,
            'process_steps' => null,
        ]);

        $this->assertNull($service->description);
        $this->assertNull($service->image);
        $this->assertNull($service->price_range);
        $this->assertNull($service->duration);
        $this->assertNull($service->features);
        $this->assertNull($service->technologies);
        $this->assertNull($service->process_steps);
    }

    public function test_complex_process_steps_structure(): void
    {
        $complexProcessSteps = [
            [
                'step' => 'Discovery & Analysis',
                'description' => 'Comprehensive requirement analysis and stakeholder interviews',
                'order' => 1,
            ],
            [
                'step' => 'Architecture Design',
                'description' => 'System architecture and database design',
                'order' => 2,
            ],
            [
                'step' => 'UI/UX Design',
                'description' => 'User interface and experience design',
                'order' => 3,
            ],
            [
                'step' => 'Development Sprint 1',
                'description' => 'Core functionality development',
                'order' => 4,
            ],
            [
                'step' => 'Development Sprint 2',
                'description' => 'Advanced features implementation',
                'order' => 5,
            ],
            [
                'step' => 'Testing & QA',
                'description' => 'Comprehensive testing and quality assurance',
                'order' => 6,
            ],
            [
                'step' => 'Deployment',
                'description' => 'Production deployment and monitoring setup',
                'order' => 7,
            ],
        ];

        $service = BusinessUnitService::factory()->create(['process_steps' => $complexProcessSteps]);

        $this->assertIsArray($service->process_steps);
        $this->assertCount(7, $service->process_steps);
        $this->assertEquals($complexProcessSteps, $service->process_steps);

        // Test that each step has the required structure
        foreach ($service->process_steps as $step) {
            $this->assertArrayHasKey('step', $step);
            $this->assertArrayHasKey('description', $step);
            $this->assertArrayHasKey('order', $step);
            $this->assertIsString($step['step']);
            $this->assertIsString($step['description']);
            $this->assertIsInt($step['order']);
        }
    }
}
