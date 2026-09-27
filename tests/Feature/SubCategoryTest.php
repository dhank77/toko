<?php

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\User;

test('guests are redirected from sub-category index', function () {
    $this->get(route('admin.sub-categories.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view sub-category index', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    SubCategory::factory()->count(3)->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->get(route('admin.sub-categories.index'))
        ->assertOk();
});

test('authenticated users can view create sub-category page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.sub-categories.create'))
        ->assertOk();
});

test('authenticated users can store a new sub-category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.sub-categories.store'), [
            'category_id' => $category->id,
            'name' => 'Mechanical Keyboard',
            'slug' => 'mechanical-keyboard',
            'description' => 'Keyboard mechanical RGB',
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect(route('admin.sub-categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('sub_categories', [
        'category_id' => $category->id,
        'name' => 'Mechanical Keyboard',
        'slug' => 'mechanical-keyboard',
    ]);
});

test('authenticated users can view edit sub-category page', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->get(route('admin.sub-categories.edit', $subCategory))
        ->assertOk();
});

test('authenticated users can update a sub-category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $subCategory = SubCategory::factory()->create([
        'category_id' => $category->id,
        'name' => 'Sub Lama',
    ]);

    $this->actingAs($user)
        ->put(route('admin.sub-categories.update', $subCategory), [
            'category_id' => $category->id,
            'name' => 'Sub Baru',
            'slug' => 'sub-baru',
            'description' => 'Deskripsi baru',
            'is_active' => true,
            'sort_order' => 5,
        ])
        ->assertRedirect(route('admin.sub-categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('sub_categories', [
        'id' => $subCategory->id,
        'name' => 'Sub Baru',
        'slug' => 'sub-baru',
    ]);
});

test('authenticated users can delete a sub-category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->delete(route('admin.sub-categories.destroy', $subCategory))
        ->assertRedirect(route('admin.sub-categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('sub_categories', [
        'id' => $subCategory->id,
    ]);
});
