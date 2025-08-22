<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BusinessUnit>
 */
class BusinessUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement(['Tech Solutions', 'Food & Beverage', 'Retail Store', 'Agriculture Farm']);

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name.'-'.fake()->unique()->numberBetween(1, 1000)),
            'description' => fake()->paragraph(3),
            'services' => implode("\n", fake()->words(5)),
            'image' => 'assets/business/'.fake()->randomElement(['cigi-net.jpg', 'cigi-mart.jpg', 'cigi-food.jpg', 'cigi-farm.jpg']),
            'contact_phone' => fake()->phoneNumber(),
            'contact_email' => fake()->email(),
            'address' => fake()->address(),
            'website_url' => fake()->url(),
            'operating_hours' => 'Senin - Jumat: 08:00 - 17:00',
            'is_active' => fake()->boolean(80),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
