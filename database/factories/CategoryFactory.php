<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Komputer & Laptop', 'Handphone & Tablet', 'TV & Elektronik',
            'Outdoor & Olahraga', 'Rumah Tangga & Dapur', 'Otomotif & Motor',
            'Hobi & Mainan', 'Kesehatan & Personal Care', 'Fashion & Aksesoris',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'icon' => fake()->randomElement(['💻', '📱', '📺', '🏕️', '🏠', '🏍️', '🎮', '💊', '👗']),
            'description' => fake()->optional()->sentence(),
            'is_active' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }
}
