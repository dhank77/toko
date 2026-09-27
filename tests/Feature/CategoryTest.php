<?php

use App\Models\Category;
use App\Models\User;

test('guests are redirected from category index', function () {
    $this->get(route('admin.categories.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view category index', function () {
    $user = User::factory()->create();
    Category::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertOk();
});

test('authenticated users can view create category page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.categories.create'))
        ->assertOk();
});

test('authenticated users can store a new category', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'Aksesoris Komputer',
            'slug' => 'aksesoris-komputer',
            'icon' => '💻',
            'description' => 'Aksesoris komputer dan laptop terlengkap',
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('categories', [
        'name' => 'Aksesoris Komputer',
        'slug' => 'aksesoris-komputer',
    ]);
});

test('authenticated users can view edit category page', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.categories.edit', $category))
        ->assertOk();
});

test('authenticated users can update a category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['name' => 'Nama Lama']);

    $this->actingAs($user)
        ->put(route('admin.categories.update', $category), [
            'name' => 'Nama Baru',
            'slug' => 'nama-baru',
            'icon' => '📦',
            'description' => 'Deskripsi baru',
            'is_active' => true,
            'sort_order' => 2,
        ])
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Nama Baru',
        'slug' => 'nama-baru',
    ]);
});

test('authenticated users can delete a category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('categories', [
        'id' => $category->id,
    ]);
});
