<?php

use App\Models\Category;
use App\Models\Product;
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

test('welcome page renders with products from database and excludes inactive products', function () {
    $category = Category::factory()->create(['name' => 'Elektronik']);

    $activeProduct = Product::factory()->create([
        'name' => 'Speaker Bluetooth Portable',
        'category_id' => $category->id,
        'is_active' => true,
        'price' => 150000,
    ]);

    $inactiveProduct = Product::factory()->create([
        'name' => 'Produk Nonaktif',
        'category_id' => $category->id,
        'is_active' => false,
        'price' => 50000,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('products', 1)
            ->where('products.0.name', 'Speaker Bluetooth Portable')
            ->has('flashSaleProducts')
        );
});

test('welcome page filters products by category parameter', function () {
    $catLaptop = Category::factory()->create(['name' => 'Laptop', 'slug' => 'laptop']);
    $catAudio = Category::factory()->create(['name' => 'Audio', 'slug' => 'audio']);

    $productLaptop = Product::factory()->create([
        'name' => 'Laptop Asus ROG',
        'category_id' => $catLaptop->id,
        'is_active' => true,
    ]);

    $productAudio = Product::factory()->create([
        'name' => 'Headphone Sony',
        'category_id' => $catAudio->id,
        'is_active' => true,
    ]);

    // Filter by slug
    $this->get(route('home', ['category' => 'laptop']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('products', 1)
            ->where('products.0.name', 'Laptop Asus ROG')
            ->where('selectedCategory', 'laptop')
        );

    // Filter by ID
    $this->get(route('home', ['category' => $catAudio->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('products', 1)
            ->where('products.0.name', 'Headphone Sony')
            ->where('selectedCategory', (string) $catAudio->id)
        );
});
