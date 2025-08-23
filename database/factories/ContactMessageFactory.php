<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'subject' => fake()->sentence(4),
            'message' => fake()->paragraphs(3, true),
            // Let the model use its default status ('unread')
            'read_at' => null, // Default to null for unread messages
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }

    /**
     * Indicate that the message is unread.
     */
    public function unread(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'unread',
            'read_at' => null,
        ]);
    }

    /**
     * Indicate that the message is read.
     */
    public function read(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'read',
            'read_at' => fake()->dateTimeBetween($attributes['created_at'] ?? '-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the message is archived.
     */
    public function archived(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    /**
     * Indicate that the message is recent.
     */
    public function recent(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}
