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
            'gallery_images' => [
                'assets/gallery/'.fake()->uuid().'.jpg',
                'assets/gallery/'.fake()->uuid().'.jpg',
                'assets/gallery/'.fake()->uuid().'.jpg',
            ],
            'testimonials' => [
                [
                    'name' => fake()->name(),
                    'content' => fake()->paragraph(),
                    'role' => fake()->jobTitle(),
                    'image' => 'assets/testimonials/'.fake()->uuid().'.jpg',
                ],
                [
                    'name' => fake()->name(),
                    'content' => fake()->paragraph(),
                    'role' => fake()->jobTitle(),
                    'image' => 'assets/testimonials/'.fake()->uuid().'.jpg',
                ],
            ],
            'social_media_links' => [
                [
                    'platform' => 'Facebook',
                    'url' => fake()->url(),
                ],
                [
                    'platform' => 'Instagram',
                    'url' => fake()->url(),
                ],
            ],
            'founded_year' => fake()->numberBetween(1990, 2020),
            'member_count' => fake()->numberBetween(10, 500),
            'upcoming_events' => [
                [
                    'title' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'date' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
                    'image' => 'assets/events/'.fake()->uuid().'.jpg',
                ],
            ],
            'achievements' => [
                [
                    'title' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
                    'image' => 'assets/achievements/'.fake()->uuid().'.jpg',
                ],
            ],
            'hero_subtitle' => fake()->sentence(),
            'hero_cta_text' => fake()->randomElement(['Join Us', 'Learn More', 'Get Started', 'Contact Us']),
            'hero_cta_link' => fake()->url(),
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
