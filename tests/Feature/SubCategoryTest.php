<?php

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from sub-category index', function () {
    $this->get(route('admin.sub-categories.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view sub-category index with pagination and stats', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    SubCategory::factory()->count(15)->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->get(route('admin.sub-categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/sub-categories/index')
            ->has('subCategories.data', 10)
            ->where('subCategories.total', 15)
            ->where('stats.total', 15)
            ->has('categories')
            ->has('filters')
        );
});

test('authenticated users can search sub categories and filter by parent category', function () {
    $user = User::factory()->create();
    $catA = Category::factory()->create(['name' => 'Komputer']);
    $catB = Category::factory()->create(['name' => 'Handphone']);

    SubCategory::factory()->create([
        'category_id' => $catA->id,
        'name' => 'Mechanical Keyboard',
    ]);
    SubCategory::factory()->create([
        'category_id' => $catB->id,
        'name' => 'Kabel Charger',
    ]);

    // Search by name
    $this->actingAs($user)
        ->get(route('admin.sub-categories.index', ['search' => 'Keyboard']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('subCategories.data', 1)
            ->where('subCategories.data.0.name', 'Mechanical Keyboard')
        );

    // Filter by parent category_id
    $this->actingAs($user)
        ->get(route('admin.sub-categories.index', ['category_id' => $catB->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('subCategories.data', 1)
            ->where('subCategories.data.0.name', 'Kabel Charger')
        );
});

test('authenticated users can inline update sort order of a sub category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $sub = SubCategory::factory()->create(['category_id' => $category->id, 'sort_order' => 1]);

    $this->actingAs($user)
        ->patch(route('admin.sub-categories.update', $sub), [
            'sort_order' => 77,
        ])
        ->assertRedirect();

    expect($sub->fresh()->sort_order)->toBe(77);
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
