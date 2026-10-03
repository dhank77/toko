<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('public category page renders successfully with products', function () {
    $category = Category::factory()->create([
        'name' => 'Outdoor & Camping',
        'slug' => 'outdoor-camping',
        'is_active' => true,
    ]);

    $subCategory = SubCategory::factory()->create([
        'category_id' => $category->id,
        'name' => 'Tenda',
        'slug' => 'tenda',
        'is_active' => true,
    ]);

    $productInCat = Product::factory()->create([
        'category_id' => $category->id,
        'sub_category_id' => $subCategory->id,
        'name' => 'Tenda Dome Camping 4 Orang',
        'price' => 350000,
        'is_active' => true,
    ]);

    $otherCategory = Category::factory()->create(['name' => 'Lainnya', 'is_active' => true]);
    Product::factory()->create([
        'category_id' => $otherCategory->id,
        'name' => 'Produk Lain',
        'is_active' => true,
    ]);

    $this->get(route('categories.show', ['slug' => $category->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/show')
            ->where('category.name', 'Outdoor & Camping')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Tenda Dome Camping 4 Orang')
        );
});

test('public category page filters products by sub category and sorts properly', function () {
    $category = Category::factory()->create(['slug' => 'gadget', 'is_active' => true]);
    $subA = SubCategory::factory()->create(['category_id' => $category->id, 'slug' => 'kabel', 'is_active' => true]);
    $subB = SubCategory::factory()->create(['category_id' => $category->id, 'slug' => 'charger', 'is_active' => true]);

    $p1 = Product::factory()->create([
        'category_id' => $category->id,
        'sub_category_id' => $subA->id,
        'name' => 'Kabel USB-C',
        'price' => 20000,
        'is_active' => true,
    ]);

    $p2 = Product::factory()->create([
        'category_id' => $category->id,
        'sub_category_id' => $subB->id,
        'name' => 'Charger GaN 65W',
        'price' => 150000,
        'is_active' => true,
    ]);

    // Filter by sub_category
    $this->get(route('categories.show', ['slug' => 'gadget', 'sub_category' => 'kabel']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/show')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Kabel USB-C')
        );

    // Sort by price_high
    $this->get(route('categories.show', ['slug' => 'gadget', 'sort' => 'price_high']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('categories/show')
            ->has('products.data', 2)
            ->where('products.data.0.name', 'Charger GaN 65W')
            ->where('products.data.1.name', 'Kabel USB-C')
        );
});

test('public category page returns 404 for inactive or non-existent category', function () {
    $inactive = Category::factory()->create(['slug' => 'non-aktif', 'is_active' => false]);

    $this->get(route('categories.show', ['slug' => $inactive->slug]))
        ->assertNotFound();

    $this->get(route('categories.show', ['slug' => 'kategori-fiktif']))
        ->assertNotFound();
});
