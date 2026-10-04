<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from client portal to login', function () {
    $response = $this->get(route('client.index'));

    $response->assertRedirect(route('login'));
});

test('customer can view client portal with profile, orders, and cart', function () {
    $user = User::factory()->customer()->create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'phone' => '081234567890',
        'address' => 'Jl. Pengayoman No. 12',
        'city' => 'Makassar',
        'postal_code' => '90222',
    ]);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $order = Order::create([
        'order_number' => 'MKN-20261003-0001',
        'user_id' => $user->id,
        'branch' => 'Panakkukang',
        'fulfillment_type' => 'pick_n_go',
        'status' => 'ready_for_pickup',
        'pickup_pin' => '739-102',
        'pickup_rack' => 'Rak B-02',
        'payment_method' => 'QRIS',
        'payment_status' => 'paid',
        'total_amount' => $product->price,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'sku' => $product->sku,
        'price' => $product->price,
        'quantity' => 1,
        'subtotal' => $product->price,
        'thumbnail' => $product->thumbnail,
    ]);

    CartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'branch' => 'Panakkukang',
    ]);

    $response = $this->actingAs($user)->get(route('client.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/index')
            ->has('user', fn (Assert $page) => $page
                ->where('id', $user->id)
                ->where('name', 'Budi Santoso')
                ->where('email', 'budi@example.com')
                ->where('phone', '081234567890')
                ->where('address', 'Jl. Pengayoman No. 12')
                ->where('city', 'Makassar')
                ->where('postal_code', '90222')
                ->where('role', 'customer')
                ->etc()
            )
            ->has('orders', 1)
            ->has('cartItems', 1)
            ->where('activeTab', 'profile')
            ->has('provinces')
        );
});

test('customer can switch tabs via query param', function () {
    $user = User::factory()->customer()->create();

    $response = $this->actingAs($user)->get(route('client.index', ['tab' => 'orders']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/index')
            ->where('activeTab', 'orders')
        );

    $cartResponse = $this->actingAs($user)->get(route('client.index', ['tab' => 'cart']));

    $cartResponse->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/index')
            ->where('activeTab', 'cart')
        );
});

test('customer can update their profile information', function () {
    $user = User::factory()->customer()->create([
        'name' => 'Old Name',
        'phone' => '081111111111',
    ]);

    $response = $this->actingAs($user)->put(route('client.profile.update'), [
        'name' => 'Ilham Makassar',
        'phone' => '081298765432',
        'address' => 'Jl. Boulevard No. 45',
        'city' => 'Makassar',
        'postal_code' => '90231',
    ]);

    $response->assertRedirect();
    $user->refresh();

    expect($user->name)->toBe('Ilham Makassar');
    expect($user->phone)->toBe('081298765432');
    expect($user->address)->toBe('Jl. Boulevard No. 45');
    expect($user->city)->toBe('Makassar');
    expect($user->postal_code)->toBe('90231');
});

test('customer can add products to cart', function () {
    $user = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->post(route('client.cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
        'branch' => 'Panakkukang',
    ]);

    $response->assertRedirect();

    $cartItem = CartItem::where('user_id', $user->id)->where('product_id', $product->id)->first();
    expect($cartItem)->not->toBeNull();
    expect($cartItem->quantity)->toBe(2);

    // Adding again increments quantity
    $this->actingAs($user)->post(route('client.cart.add'), [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $cartItem->refresh();
    expect($cartItem->quantity)->toBe(5);
});

test('customer can update cart item quantity', function () {
    $user = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $cartItem = CartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->patch(route('client.cart.update', $cartItem), [
        'quantity' => 4,
    ]);

    $response->assertRedirect();
    expect($cartItem->fresh()->quantity)->toBe(4);
});

test('customer can remove an item from cart', function () {
    $user = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $cartItem = CartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response = $this->actingAs($user)->delete(route('client.cart.remove', $cartItem));

    $response->assertRedirect();
    expect(CartItem::find($cartItem->id))->toBeNull();
});

test('customer can clear the entire cart', function () {
    $user = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $p1 = Product::factory()->create(['category_id' => $category->id]);
    $p2 = Product::factory()->create(['category_id' => $category->id]);

    CartItem::create(['user_id' => $user->id, 'product_id' => $p1->id, 'quantity' => 1]);
    CartItem::create(['user_id' => $user->id, 'product_id' => $p2->id, 'quantity' => 2]);

    $response = $this->actingAs($user)->delete(route('client.cart.clear'));

    $response->assertRedirect();
    expect(CartItem::where('user_id', $user->id)->count())->toBe(0);
});

test('customer is redirected from /dashboard to client portal', function () {
    $user = User::factory()->customer()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('client.index'));
});

test('admin can access dashboard directly', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('dashboard'));
});
