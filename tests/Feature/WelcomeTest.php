<?php

use App\Models\Category;
use App\Models\SubCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('welcome page renders with dynamic active categories and sub categories', function () {
    $category = Category::factory()->create([
        'name' => 'Komputer & Laptop',
        'is_active' => true,
    ]);

    SubCategory::factory()->create([
        'category_id' => $category->id,
        'name' => 'Keyboard Mechanical',
        'is_active' => true,
    ]);

    // Inactive sub category should not appear
    SubCategory::factory()->create([
        'category_id' => $category->id,
        'name' => 'Inactive Sub',
        'is_active' => false,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('categories', 1)
            ->where('categories.0.name', 'Komputer & Laptop')
            ->where('categories.0.sub_categories.0.name', 'Keyboard Mechanical')
            ->has('categories.0.sub_categories', 1)
        );
});
