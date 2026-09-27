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
        $base = fake()->randomElement([
            'Komputer & Laptop', 'Handphone & Tablet', 'TV & Elektronik',
            'Outdoor & Olahraga', 'Rumah Tangga & Dapur', 'Otomotif & Motor',
            'Hobi & Mainan', 'Kesehatan & Personal Care', 'Fashion & Aksesoris',
            'Kamera & Audio', 'Smart Home & Security', 'Gaming Gear',
        ]);
        $name = $base.' '.fake()->unique()->numberBetween(1, 999999);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'icon' => fake()->randomElement(['💻', '📱', '📺', '🏕️', '🏠', '🏍️', '🎮', '💊', '👗', '📷', '🔒']),
            'description' => fake()->optional()->sentence(),
            'is_active' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }
}
