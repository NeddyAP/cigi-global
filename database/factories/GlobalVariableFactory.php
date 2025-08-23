<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GlobalVariable>
 */
class GlobalVariableFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->word(),
            'value' => fake()->sentence(),
            'type' => fake()->randomElement(['string', 'text', 'number', 'boolean', 'json']),
            'category' => fake()->randomElement(['company', 'contact', 'social', 'seo', 'other']),
            'description' => fake()->sentence(),
            'is_public' => fake()->boolean(),
        ];
    }

    /**
     * Indicate that the global variable is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the global variable is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    /**
     * Indicate that the global variable is a company setting.
     */
    public function company(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'company',
        ]);
    }
}
