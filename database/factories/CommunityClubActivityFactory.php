<?php

namespace Database\Factories;

use App\Models\CommunityClub;
use App\Models\CommunityClubActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityClubActivity>
 */
class CommunityClubActivityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = CommunityClubActivity::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'community_club_id' => CommunityClub::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(2),
            'image' => 'assets/activities/'.fake()->uuid().'.jpg',
            'duration' => fake()->randomElement(['1 hour', '2 hours', '3 hours', 'Half day', 'Full day', 'Weekly']),
            'max_participants' => fake()->optional()->numberBetween(5, 50),
            'requirements' => fake()->optional()->sentence(),
            'benefits' => [
                fake()->sentence(4),
                fake()->sentence(3),
                fake()->sentence(5),
            ],
        ];
    }

    /**
     * Indicate that the activity has no participant limit.
     */
    public function unlimited(): static
    {
        return $this->state(fn (array $attributes) => [
            'max_participants' => null,
        ]);
    }

    /**
     * Indicate that the activity has specific requirements.
     */
    public function withRequirements(): static
    {
        return $this->state(fn (array $attributes) => [
            'requirements' => fake()->paragraph(),
        ]);
    }
}
