<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SubCategory>
 */
class SubCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Keyboard', 'Mouse', 'Cooling Pad', 'Webcam', 'USB Hub',
            'Kabel Charger', 'Power Bank', 'Screen Protector', 'Holder HP',
            'Bracket TV', 'Antena Digital', 'Android TV Box',
            'Kursi Lipat Camping', 'Tenda Camping', 'Kompor Portable',
            'Timbangan Digital', 'Dispenser Sabun', 'Lampu Meja LED',
            'Pompa Ban Elektrik', 'Lap Microfiber', 'Cover Jok Motor',
            'Rubik', 'Drone Camera', 'Action Figure',
            'Oximeter', 'Nebulizer', 'Kacamata Baca',
        ]);

        return [
            'category_id' => Category::inRandomOrder()->value('id') ?? Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'is_active' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }
}
