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
            'team_members' => [
                [
                    'name' => fake()->name(),
                    'role' => fake()->jobTitle(),
                    'bio' => fake()->paragraph(),
                    'image' => 'assets/team/'.fake()->uuid().'.jpg',
                    'social_links' => [
                        [
                            'platform' => 'LinkedIn',
                            'url' => fake()->url(),
                        ],
                    ],
                ],
            ],
            'client_testimonials' => [
                [
                    'name' => fake()->name(),
                    'company' => fake()->company(),
                    'content' => fake()->paragraph(),
                    'image' => 'assets/clients/'.fake()->uuid().'.jpg',
                    'rating' => fake()->numberBetween(4, 5),
                ],
            ],
            'portfolio_items' => [
                [
                    'title' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'image' => 'assets/portfolio/'.fake()->uuid().'.jpg',
                    'technologies' => ['Laravel', 'React', 'MySQL'],
                    'client' => fake()->company(),
                ],
            ],
            'certifications' => [
                [
                    'name' => fake()->sentence(),
                    'issuer' => fake()->company(),
                    'date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
                    'image' => 'assets/certifications/'.fake()->uuid().'.jpg',
                    'description' => fake()->sentence(),
                ],
            ],
            'company_stats' => [
                [
                    'label' => 'Years in Business',
                    'value' => fake()->numberBetween(1, 20).'+',
                    'icon' => 'calendar',
                ],
                [
                    'label' => 'Projects Completed',
                    'value' => fake()->numberBetween(50, 500).'+',
                    'icon' => 'check',
                ],
            ],
            'gallery_images' => [
                'assets/gallery/'.fake()->uuid().'.jpg',
                'assets/gallery/'.fake()->uuid().'.jpg',
            ],
            'achievements' => [
                [
                    'title' => fake()->sentence(),
                    'description' => fake()->paragraph(),
                    'date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
                    'image' => 'assets/achievements/'.fake()->uuid().'.jpg',
                ],
            ],
            'core_values' => [
                [
                    'title' => 'Innovation',
                    'description' => fake()->sentence(),
                    'icon' => 'lightbulb',
                ],
                [
                    'title' => 'Quality',
                    'description' => fake()->sentence(),
                    'icon' => 'star',
                ],
            ],
            'hero_subtitle' => fake()->sentence(),
            'hero_cta_text' => fake()->randomElement(['Get Quote', 'Contact Us', 'Learn More', 'Start Project']),
            'hero_cta_link' => fake()->url(),
        ];
    }
}
