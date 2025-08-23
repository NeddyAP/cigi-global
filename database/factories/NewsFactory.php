<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'slug' => fake()->slug(),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'featured_image' => 'assets/news/'.fake()->image('public/assets/news', 800, 600, null, false),
            'category' => fake()->randomElement(['business', 'technology', 'community', 'events', 'announcements']),
            'is_featured' => false,
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'author_id' => User::factory(),
            'views_count' => fake()->numberBetween(0, 1000),
            'tags' => fake()->words(3),
        ];
    }

    /**
     * Indicate that the news is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the news is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
