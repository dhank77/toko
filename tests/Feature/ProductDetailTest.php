<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Inertia\Testing\AssertableInertia as Assert;

test('public product detail page renders successfully with active product', function () {
    $category = Category::factory()->create(['name' => 'Komputer & Laptop', 'is_active' => true]);
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id, 'name' => 'Keyboard', 'is_active' => true]);

    $product = Product::factory()->create([
        'name' => 'Mechanical Keyboard RGB Makassar',
        'slug' => 'mechanical-keyboard-rgb-makassar',
        'category_id' => $category->id,
        'sub_category_id' => $subCategory->id,
        'price' => 450000,
        'original_price' => 600000,
        'is_active' => true,
    ]);

    $related = Product::factory()->create([
        'name' => 'Mouse Gaming Wireless',
        'category_id' => $category->id,
        'is_active' => true,
    ]);

    $this->get(route('products.show', ['slug' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/show')
            ->where('product.name', 'Mechanical Keyboard RGB Makassar')
            ->where('product.price', 450000)
            ->has('relatedProducts')
            ->has('categories')
        );
});

test('public product detail returns 404 for inactive or non-existent product', function () {
    $inactiveProduct = Product::factory()->create([
        'name' => 'Produk Tersembunyi',
        'slug' => 'produk-tersembunyi',
        'is_active' => false,
    ]);

    $this->get(route('products.show', ['slug' => $inactiveProduct->slug]))
        ->assertNotFound();

    $this->get(route('products.show', ['slug' => 'slug-tidak-ada']))
        ->assertNotFound();
});
