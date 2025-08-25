<?php

namespace Database\Factories;

use App\Models\BusinessUnit;
use App\Models\BusinessUnitService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BusinessUnitService>
 */
class BusinessUnitServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = BusinessUnitService::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'business_unit_id' => BusinessUnit::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(2),
            'image' => 'assets/services/'.fake()->uuid().'.jpg',
            'price_range' => fake()->randomElement(['$100-500', '$500-1000', '$1000-5000', '$5000+', 'Contact for quote']),
            'duration' => fake()->randomElement(['1-2 weeks', '2-4 weeks', '1-3 months', '3-6 months', 'Ongoing']),
            'features' => [
                fake()->sentence(4),
                fake()->sentence(3),
                fake()->sentence(5),
                fake()->sentence(4),
            ],
            'technologies' => [
                fake()->randomElement(['PHP', 'Laravel', 'React', 'Vue.js', 'Node.js']),
                fake()->randomElement(['MySQL', 'PostgreSQL', 'MongoDB', 'Redis']),
                fake()->randomElement(['AWS', 'Docker', 'Git', 'CI/CD']),
            ],
            'process_steps' => [
                [
                    'step' => 'Discovery & Planning',
                    'description' => fake()->sentence(),
                    'order' => 1,
                ],
                [
                    'step' => 'Design & Development',
                    'description' => fake()->sentence(),
                    'order' => 2,
                ],
                [
                    'step' => 'Testing & Deployment',
                    'description' => fake()->sentence(),
                    'order' => 3,
                ],
            ],
        ];
    }

    /**
     * Indicate that the service is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'price_range' => '$5000+',
            'duration' => '3-6 months',
        ]);
    }

    /**
     * Indicate that the service is basic.
     */
    public function basic(): static
    {
        return $this->state(fn (array $attributes) => [
            'price_range' => '$100-500',
            'duration' => '1-2 weeks',
        ]);
    }
}
