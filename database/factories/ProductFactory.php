<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = Category::inRandomOrder()->first() ?? Category::factory()->create();
        $subCategory = SubCategory::where('category_id', $category->id)->inRandomOrder()->first();

        $name = fake()->words(4, true).' '.fake()->unique()->numberBetween(100, 999);
        $originalPrice = fake()->randomElement([50000, 75000, 100000, 150000, 250000, 500000]);
        $discount = fake()->randomElement([15, 25, 30, 42, 50, 60]);
        $price = (int) round($originalPrice * (1 - ($discount / 100)));

        return [
            'sku' => strtoupper(fake()->bothify('OM??##??')),
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 99999),
            'category_id' => $category->id,
            'sub_category_id' => $subCategory?->id,
            'brand' => fake()->randomElement(['Taffware', 'Lainnya', 'Baseus', 'Xiaomi', 'Orico', 'Ugreen', 'RoboTool']),
            'color' => fake()->randomElement(['White', 'Black', 'Gray', 'Blue', 'Silver']),
            'price' => $price,
            'original_price' => $originalPrice,
            'discount_percent' => $discount,
            'stock' => fake()->numberBetween(5, 100),
            'weight_grams' => fake()->randomElement([200, 500, 1000, 1300, 1500]),
            'warranty' => fake()->randomElement(['7 Hari', '1 Bulan', '3 Bulan', '1 Tahun']),
            'package_dimension' => '30 x 15 x 10 cm',
            'overview' => fake()->paragraph(),
            'description' => fake()->paragraphs(2, true),
            'features' => [
                [
                    'title' => 'Desain Ergonomis & Kompak',
                    'description' => 'Dirancang dengan material berkualitas tinggi untuk penggunaan sehari-hari yang nyaman dan awet.',
                ],
            ],
            'specifications' => [
                ['key' => 'Material', 'value' => 'Plastik ABS'],
                ['key' => 'Dimensi', 'value' => '30 x 15 x 10 cm'],
            ],
            'whats_in_the_box' => [
                '1 x '.ucfirst($name),
                '1 x Panduan Penggunaan',
            ],
            'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/3743d3/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpg',
            'images' => [
                'https://upload.jaknot.com/2026/07/images/products/3743d3/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpg',
            ],
            'rating' => 5.0,
            'review_count' => fake()->numberBetween(1, 50),
            'is_active' => true,
            'is_featured' => fake()->boolean(20),
        ];
    }
}
