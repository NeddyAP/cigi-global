<?php

namespace Database\Factories;

use App\Models\CommunityClub;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityClub>
 */
class CommunityClubFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = CommunityClub::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'slug' => fake()->slug(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement(['sports', 'arts', 'technology', 'business', 'social']),
            'activities' => fake()->sentence(),
            'image' => 'assets/community/'.fake()->image('public/assets/community', 400, 300, null, false),
            'contact_person' => fake()->name(),
            'contact_phone' => fake()->phoneNumber(),
            'contact_email' => fake()->safeEmail(),
            'meeting_schedule' => fake()->sentence(),
            'location' => fake()->address(),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }

    /**
     * Indicate that the community club is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the community club is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'sort_order' => fake()->numberBetween(1, 10),
        ]);
    }
}
