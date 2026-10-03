<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from product admin pages', function () {
    $this->get(route('admin.products.index'))->assertRedirect(route('login'));
    $this->get(route('admin.products.create'))->assertRedirect(route('login'));
});

test('authenticated users can view product index with pagination and stats', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id]);

    Product::factory()->count(15)->create([
        'category_id' => $category->id,
        'sub_category_id' => $subCategory->id,
    ]);

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->has('products.data', 10)
            ->where('products.total', 15)
            ->where('stats.total', 15)
            ->has('categories')
            ->has('filters')
        );
});

test('authenticated users can search products by name, sku, or brand', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Kotak Organizer Kabel Charger Kotak Penyimpanan Desktop Box - FT-400',
        'sku' => 'OMSCYTWH',
        'brand' => 'Lainnya',
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Keyboard Mechanical Gaming RGB',
        'sku' => 'KEYRGB01',
        'brand' => 'Logitech',
    ]);

    // Search by SKU
    $this->actingAs($user)
        ->get(route('admin.products.index', ['search' => 'OMSCYTWH']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.sku', 'OMSCYTWH')
        );

    // Search by Brand
    $this->actingAs($user)
        ->get(route('admin.products.index', ['search' => 'Logitech']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.brand', 'Logitech')
        );
});

test('authenticated users can filter products by category and active status', function () {
    $user = User::factory()->create();
    $categoryA = Category::factory()->create(['name' => 'Elektronik']);
    $categoryB = Category::factory()->create(['name' => 'Home & Living']);

    Product::factory()->create([
        'category_id' => $categoryA->id,
        'is_active' => true,
    ]);
    Product::factory()->create([
        'category_id' => $categoryB->id,
        'is_active' => false,
    ]);

    // Filter by Category
    $this->actingAs($user)
        ->get(route('admin.products.index', ['category_id' => $categoryA->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.category_id', $categoryA->id)
        );

    // Filter by Inactive Status
    $this->actingAs($user)
        ->get(route('admin.products.index', ['status' => 'inactive']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.is_active', false)
        );
});

test('authenticated users can sort products by price and stock', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Murah Banget',
        'price' => 10000,
        'stock' => 50,
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Mahal Sekali',
        'price' => 999000,
        'stock' => 5,
    ]);

    // Sort by price desc
    $this->actingAs($user)
        ->get(route('admin.products.index', ['sort' => 'price', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.name', 'Mahal Sekali')
        );

    // Sort by stock asc
    $this->actingAs($user)
        ->get(route('admin.products.index', ['sort' => 'stock', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.name', 'Mahal Sekali')
        );
});

test('authenticated users can view product create page', function () {
    $user = User::factory()->create();
    Category::factory()->count(3)->create(['is_active' => true]);

    $this->actingAs($user)
        ->get(route('admin.products.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/create')
            ->has('categories', 3)
            ->has('presetBrands')
            ->has('presetWarranties')
        );
});

test('authenticated users can store a new product with complete specs and features', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id]);

    $productData = [
        'category_id' => $category->id,
        'sub_category_id' => $subCategory->id,
        'name' => 'Kotak Organizer Kabel Charger Desktop Box - FT-400',
        'sku' => 'OMSCYTWH',
        'brand' => 'Lainnya',
        'color' => 'White',
        'price' => 43700,
        'original_price' => 75000,
        'stock' => 38,
        'weight_grams' => 1300,
        'warranty' => '7 Hari',
        'package_dimension' => '33 x 14 x 12 cm',
        'thumbnail' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop',
        'overview' => 'Kotak organizer kabel desktop ini hadir untuk merapikan meja kerja Anda dari kabel berantakan.',
        'description' => 'Solusi manajemen kabel rapi dan estetik.',
        'features' => [
            ['title' => 'Manajemen Kabel Rapi', 'description' => 'Menyembunyikan kabel colokan dan charger yang semrawut.'],
            ['title' => 'Bahan Plastik Tebal', 'description' => 'Awet dan tahan terhadap panas listrik.'],
        ],
        'specifications' => [
            ['key' => 'Material', 'value' => 'Plastik ABS'],
            ['key' => 'Dimensi', 'value' => '31 x 13.5 x 12.5 cm'],
        ],
        'whats_in_the_box' => [
            '1 x Kotak Organizer Kabel Charger Desktop Box - FT-400',
            '1 x Tutup Organizer Kayu Sintetis',
        ],
        'is_active' => true,
        'is_featured' => true,
    ];

    $response = $this->actingAs($user)
        ->post(route('admin.products.store'), $productData);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'sku' => 'OMSCYTWH',
        'name' => 'Kotak Organizer Kabel Charger Desktop Box - FT-400',
        'price' => 43700,
        'discount_percent' => 42,
    ]);

    $created = Product::where('sku', 'OMSCYTWH')->first();
    expect($created->features)->toHaveCount(2);
    expect($created->specifications)->toHaveCount(2);
    expect($created->whats_in_the_box)->toHaveCount(2);
});

test('authenticated users can view product show page with detail specs matching detail.png', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['name' => 'Storage & Organizer']);
    $subCategory = SubCategory::factory()->create(['category_id' => $category->id, 'name' => 'Kotak Penyimpanan']);

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'sub_category_id' => $subCategory->id,
        'sku' => 'OMSCYTWH',
        'name' => 'Kotak Organizer Kabel Charger Kotak Penyimpanan Desktop Box - FT-400',
        'color' => 'White',
        'price' => 43700,
        'original_price' => 75000,
        'discount_percent' => 42,
        'stock' => 38,
        'warranty' => '7 Hari',
    ]);

    $this->actingAs($user)
        ->get(route('admin.products.show', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/show')
            ->where('product.sku', 'OMSCYTWH')
            ->where('product.price', 43700)
            ->where('product.discount_percent', 42)
            ->where('product.warranty', '7 Hari')
            ->where('product.color', 'White')
        );
});

test('authenticated users can view edit product page', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['is_active' => true]);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->get(route('admin.products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/edit')
            ->where('product.id', $product->id)
            ->has('categories')
            ->has('presetBrands')
            ->has('presetWarranties')
        );
});

test('authenticated users can update a product', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)
        ->put(route('admin.products.update', $product), [
            'category_id' => $category->id,
            'name' => 'Updated Product Name',
            'sku' => $product->sku,
            'brand' => 'Updated Brand',
            'price' => 50000,
            'original_price' => 100000,
            'stock' => 100,
            'is_active' => false,
        ]);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product Name',
        'brand' => 'Updated Brand',
        'price' => 50000,
        'discount_percent' => 50,
        'is_active' => false,
    ]);
});

test('authenticated users can inline update product stock and status', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 10, 'is_active' => true]);

    $this->actingAs($user)
        ->from(route('admin.products.index'))
        ->put(route('admin.products.update', $product), [
            'stock' => 99,
        ])
        ->assertRedirect(route('admin.products.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'stock' => 99,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->from(route('admin.products.index'))
        ->put(route('admin.products.update', $product), [
            'is_active' => false,
        ])
        ->assertRedirect(route('admin.products.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'is_active' => false,
    ]);
});

test('authenticated users can delete a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)
        ->delete(route('admin.products.destroy', $product));

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertModelMissing($product);
});

test('authenticated users can store a product with uploaded thumbnail and gallery images', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $category = Category::factory()->create();

    $thumbnail = UploadedFile::fake()->image('main.jpg', 600, 600);
    $gallery1 = UploadedFile::fake()->image('gallery1.png', 800, 800);
    $gallery2 = UploadedFile::fake()->image('gallery2.webp', 800, 800);

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'category_id' => $category->id,
        'name' => 'Produk Tes Upload',
        'sku' => 'TESTUPLOAD1',
        'brand' => 'Taffware',
        'price' => 50000,
        'stock' => 10,
        'weight_grams' => 200,
        'warranty' => '7 Hari',
        'thumbnail' => $thumbnail,
        'images' => [$gallery1, $gallery2],
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $product = Product::where('sku', 'TESTUPLOAD1')->first();
    expect($product)->not->toBeNull();
    expect($product->thumbnail)->toStartWith('/storage/products/thumbnails/');
    expect($product->images)->toHaveCount(2);
    expect($product->images[0])->toStartWith('/storage/products/gallery/');
    expect($product->images[1])->toStartWith('/storage/products/gallery/');

    $thumbPath = str_replace('/storage/', '', $product->thumbnail);
    Storage::disk('public')->assertExists($thumbPath);

    $gal1Path = str_replace('/storage/', '', $product->images[0]);
    $gal2Path = str_replace('/storage/', '', $product->images[1]);
    Storage::disk('public')->assertExists($gal1Path);
    Storage::disk('public')->assertExists($gal2Path);
});

test('authenticated users can update a product with new uploaded images', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $product = Product::factory()->create();

    $newThumbnail = UploadedFile::fake()->image('new_thumb.jpg');
    $newGallery = UploadedFile::fake()->image('new_gal.jpg');

    $response = $this->actingAs($user)->put(route('admin.products.update', $product), [
        'name' => 'Updated Product Name',
        'price' => 60000,
        'thumbnail' => $newThumbnail,
        'images' => [$newGallery],
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product->refresh();
    expect($product->thumbnail)->toStartWith('/storage/products/thumbnails/');
    expect($product->images)->toHaveCount(1);
    expect($product->images[0])->toStartWith('/storage/products/gallery/');

    $thumbPath = str_replace('/storage/', '', $product->thumbnail);
    $galPath = str_replace('/storage/', '', $product->images[0]);
    Storage::disk('public')->assertExists($thumbPath);
    Storage::disk('public')->assertExists($galPath);
});

test('store and update sanitize rupiah with dots to integer for database', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'category_id' => $category->id,
        'name' => 'Produk Tes Sanitasi Rupiah',
        'sku' => 'TESTDOTS01',
        'brand' => 'Baseus',
        'price' => '1.250.000',
        'original_price' => '2.500.000',
        'stock' => 15,
        'weight_grams' => 500,
        'warranty' => '1 Bulan',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product = Product::where('sku', 'TESTDOTS01')->first();
    expect($product)->not->toBeNull();
    expect($product->price)->toBe(1250000);
    expect($product->original_price)->toBe(2500000);
    expect($product->discount_percent)->toBe(50);

    // Test update with dots
    $this->actingAs($user)->put(route('admin.products.update', $product), [
        'name' => 'Produk Tes Sanitasi Rupiah Updated',
        'price' => '999.000',
        'original_price' => '1.500.000',
    ])->assertRedirect(route('admin.products.index'));

    $product->refresh();
    expect($product->price)->toBe(999000);
    expect($product->original_price)->toBe(1500000);
});
