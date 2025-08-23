<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'filename' => fake()->uuid().'.jpg',
            'original_name' => fake()->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(100000, 5000000),
            'path' => 'media/'.fake()->uuid().'.jpg',
            'thumbnail_path' => 'media/thumbnails/'.fake()->uuid().'.jpg',
            'alt_text' => fake()->sentence(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'folder_id' => null,
            'uploaded_by' => null,
            'metadata' => [],
        ];
    }

    /**
     * Indicate that the media is an image.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => fake()->randomElement(['image/jpeg', 'image/png', 'image/gif']),
            'filename' => fake()->uuid().'.'.fake()->randomElement(['jpg', 'png', 'gif']),
            'original_name' => fake()->word().'.'.fake()->randomElement(['jpg', 'png', 'gif']),
        ]);
    }

    /**
     * Indicate that the media is a document.
     */
    public function document(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => fake()->randomElement(['application/pdf', 'text/plain', 'application/msword']),
            'filename' => fake()->uuid().'.'.fake()->randomElement(['pdf', 'txt', 'doc']),
            'original_name' => fake()->word().'.'.fake()->randomElement(['pdf', 'txt', 'doc']),
        ]);
    }
}
