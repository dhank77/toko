<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'services.doku.client_id' => 'BRN-TEST',
        'services.doku.secret_key' => 'secret-test',
        'services.doku.base_url' => 'https://api-sandbox.doku.com',
    ]);
});

function fakeDokuCheckout(): void
{
    Http::fake([
        'api-sandbox.doku.com/checkout/v1/payment' => Http::response([
            'response' => ['payment' => ['url' => 'https://checkout-sandbox.doku.com/orders/v1/abc']],
        ]),
    ]);
}

function signedDokuNotification(array $payload): array
{
    $body = json_encode($payload);
    $requestId = 'req-1';
    $timestamp = gmdate('Y-m-d\TH:i:s\Z');
    $digest = base64_encode(hash('sha256', $body, true));
    $stringToSign = "Client-Id:BRN-TEST\nRequest-Id:{$requestId}\nRequest-Timestamp:{$timestamp}\nRequest-Target:/api/webhooks/doku\nDigest:{$digest}";

    return [$body, [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_Client-Id' => 'BRN-TEST',
        'HTTP_Request-Id' => $requestId,
        'HTTP_Request-Timestamp' => $timestamp,
        'HTTP_Signature' => 'HMACSHA256='.base64_encode(hash_hmac('sha256', $stringToSign, 'secret-test', true)),
    ]];
}

test('guests cannot start a checkout', function () {
    $this->post(route('checkout.buy-now'), ['product_id' => 1])->assertRedirect(route('login'));
    $this->post(route('checkout.cart'))->assertRedirect(route('login'));
});

test('buy now creates a pending order and redirects to doku', function () {
    fakeDokuCheckout();
    $user = User::factory()->customer()->create();
    $product = Product::factory()->create(['category_id' => Category::factory()->create()->id, 'price' => 150000]);

    $response = $this->actingAs($user)->withHeader('X-Inertia', 'true')->post(route('checkout.buy-now'), [
        'product_id' => $product->id,
        'quantity' => 2,
        'branch' => 'Panakkukang',
    ]);

    $response->assertStatus(409)->assertHeader('X-Inertia-Location', 'https://checkout-sandbox.doku.com/orders/v1/abc');

    $order = Order::where('user_id', $user->id)->firstOrFail();
    expect($order->total_amount)->toBe(300000)
        ->and($order->payment_status)->toBe('unpaid')
        ->and($order->status)->toBe('pending_payment')
        ->and($order->payment_url)->toBe('https://checkout-sandbox.doku.com/orders/v1/abc');
    expect(Payment::where('order_id', $order->id)->where('status', 'pending')->exists())->toBeTrue();

    Http::assertSent(fn ($request) => $request->hasHeader('Signature')
        && $request['order']['amount'] === 300000);
});

test('cart checkout creates one order from all items and clears the cart', function () {
    fakeDokuCheckout();
    $user = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $p1 = Product::factory()->create(['category_id' => $category->id, 'price' => 100000]);
    $p2 = Product::factory()->create(['category_id' => $category->id, 'price' => 50000]);
    CartItem::create(['user_id' => $user->id, 'product_id' => $p1->id, 'quantity' => 1, 'branch' => 'Panakkukang']);
    CartItem::create(['user_id' => $user->id, 'product_id' => $p2->id, 'quantity' => 2, 'branch' => 'Panakkukang']);

    $this->actingAs($user)->withHeader('X-Inertia', 'true')->post(route('checkout.cart'))->assertStatus(409);

    $order = Order::where('user_id', $user->id)->firstOrFail();
    expect($order->total_amount)->toBe(200000)
        ->and($order->items)->toHaveCount(2)
        ->and(CartItem::where('user_id', $user->id)->count())->toBe(0);
});

test('cart is kept and order cancelled when doku fails', function () {
    Http::fake(['api-sandbox.doku.com/*' => Http::response(['error' => 'x'], 500)]);
    $user = User::factory()->customer()->create();
    $product = Product::factory()->create(['category_id' => Category::factory()->create()->id]);
    CartItem::create(['user_id' => $user->id, 'product_id' => $product->id, 'quantity' => 1]);

    $this->actingAs($user)->post(route('checkout.cart'))->assertSessionHasErrors('checkout');

    expect(CartItem::where('user_id', $user->id)->count())->toBe(1)
        ->and(Order::where('user_id', $user->id)->first()->payment_status)->toBe('failed');
});

test('empty cart cannot be checked out', function () {
    $user = User::factory()->customer()->create();

    $this->actingAs($user)->post(route('checkout.cart'))->assertSessionHasErrors('checkout');
    expect(Order::count())->toBe(0);
});

test('webhook with invalid signature is rejected', function () {
    $order = Order::factory()->create();

    $this->postJson('/api/webhooks/doku', [
        'order' => ['invoice_number' => $order->order_number],
        'transaction' => ['status' => 'SUCCESS'],
    ], ['Client-Id' => 'BRN-TEST', 'Request-Id' => 'x', 'Request-Timestamp' => 'x', 'Signature' => 'HMACSHA256=bad'])
        ->assertUnauthorized();

    expect($order->fresh()->payment_status)->toBe('unpaid');
});

test('successful webhook marks pick n go order paid with pin and is idempotent', function () {
    $order = Order::factory()->create();
    Payment::factory()->create([
        'order_id' => $order->id,
        'transaction_reference' => $order->order_number,
        'amount' => $order->total_amount,
    ]);

    [$body, $server] = signedDokuNotification([
        'order' => ['invoice_number' => $order->order_number],
        'transaction' => ['status' => 'SUCCESS'],
        'channel' => ['id' => 'QRIS'],
    ]);

    $this->call('POST', '/api/webhooks/doku', [], [], [], $server, $body)->assertOk();

    $order->refresh();
    expect($order->payment_status)->toBe('paid')
        ->and($order->status)->toBe('ready_for_pickup')
        ->and($order->pickup_pin)->not->toBeNull()
        ->and($order->pickup_rack)->not->toBeNull();
    expect($order->payments()->first()->status)->toBe('success');

    $pin = $order->pickup_pin;
    $this->call('POST', '/api/webhooks/doku', [], [], [], $server, $body)->assertOk();
    expect($order->fresh()->pickup_pin)->toBe($pin);
});

test('expired webhook cancels the order', function () {
    $order = Order::factory()->create();

    [$body, $server] = signedDokuNotification([
        'order' => ['invoice_number' => $order->order_number],
        'transaction' => ['status' => 'EXPIRED'],
    ]);

    $this->call('POST', '/api/webhooks/doku', [], [], [], $server, $body)->assertOk();

    expect($order->fresh()->payment_status)->toBe('expired')
        ->and($order->fresh()->status)->toBe('cancelled');
});
