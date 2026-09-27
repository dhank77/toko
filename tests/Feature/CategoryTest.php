<?php

use App\Models\Category;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from category index', function () {
    $this->get(route('admin.categories.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view category index with pagination and stats', function () {
    $user = User::factory()->create();
    Category::factory()->count(15)->create();

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->has('categories.data', 10) // default 10 per page
            ->where('categories.total', 15)
            ->where('stats.total', 15)
            ->has('filters')
        );
});

test('authenticated users can search categories', function () {
    $user = User::factory()->create();
    Category::factory()->create(['name' => 'Elektronik Rumah', 'slug' => 'elektronik-rumah']);
    Category::factory()->create(['name' => 'Pakaian Pria', 'slug' => 'pakaian-pria']);

    $this->actingAs($user)
        ->get(route('admin.categories.index', ['search' => 'Elektronik']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->has('categories.data', 1)
            ->where('categories.data.0.name', 'Elektronik Rumah')
        );
});

test('authenticated users can sort categories', function () {
    $user = User::factory()->create();
    Category::factory()->create(['name' => 'Ayam Kategori', 'sort_order' => 10]);
    Category::factory()->create(['name' => 'Zebra Kategori', 'sort_order' => 1]);

    // Sort by name desc
    $this->actingAs($user)
        ->get(route('admin.categories.index', ['sort' => 'name', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('categories.data.0.name', 'Zebra Kategori')
        );

    // Sort by sort_order asc
    $this->actingAs($user)
        ->get(route('admin.categories.index', ['sort' => 'sort_order', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('categories.data.0.name', 'Zebra Kategori')
        );
});

test('authenticated users can inline update sort order of a category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['sort_order' => 1]);

    $this->actingAs($user)
        ->patch(route('admin.categories.update', $category), [
            'sort_order' => 99,
        ])
        ->assertRedirect();

    expect($category->fresh()->sort_order)->toBe(99);
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
