<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Services\WhapifyService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Setting::set('whapify_base_url', 'https://whapify.id/api');
    Setting::set('whapify_secret', 'test-secret');
    Setting::set('whapify_account', 'acc-test');
    Setting::set('whapify_priority', 2);
    Setting::set('whapify_is_enabled', '1');

    config([
        'services.doku.client_id' => 'BRN-TEST',
        'services.doku.secret_key' => 'secret-test',
        'services.doku.base_url' => 'https://api-sandbox.doku.com',
    ]);
});

function fakeDokuCheckoutForWa(): void
{
    Http::fake([
        'api-sandbox.doku.com/checkout/v1/payment' => Http::response([
            'response' => ['payment' => ['url' => 'https://checkout-sandbox.doku.com/orders/v1/abc']],
        ]),
        'whapify.id/api/send/whatsapp' => Http::response([
            'status' => 200,
            'message' => 'WhatsApp chat has been sent!',
            'data' => ['messageId' => 12345],
        ], 200),
    ]);
}

test('phone numbers are normalized to 62 international format', function () {
    $service = app(WhapifyService::class);

    expect($service->normalize('081234567890'))->toBe('6281234567890')
        ->and($service->normalize('+6281234567890'))->toBe('6281234567890')
        ->and($service->normalize('0812-3456-7890'))->toBe('6281234567890')
        ->and($service->normalize('81234567890'))->toBe('6281234567890')
        ->and($service->normalize('6281234567890@g.us'))->toBe('6281234567890@g.us');
});

test('whatsapp notification is sent when order is created (unpaid)', function () {
    fakeDokuCheckoutForWa();

    $user = User::factory()->customer()->create([
        'phone' => '081234567890',
    ]);
    $product = Product::factory()->create([
        'category_id' => Category::factory()->create()->id,
        'price' => 200000,
    ]);

    $this->actingAs($user)->post(route('checkout.buy-now'), [
        'product_id' => $product->id,
        'quantity' => 1,
        'branch' => 'Panakkukang',
    ]);

    $order = Order::where('user_id', $user->id)->first();
    expect($order)->not->toBeNull()
        ->and($order->payment_status)->toBe('unpaid');

    // Run the service directly to verify message contents & API call
    $service = app(WhapifyService::class);
    $result = $service->sendOrderCreated($order);

    expect($result)->not->toBeNull()
        ->and($result['status'])->toBe(200);

    Http::assertSent(function ($request) {
        if (! str_contains($request->url(), 'whapify.id/api/send/whatsapp')) {
            return false;
        }

        $body = (string) $request->body();

        return str_contains($body, '6281234567890')
            && str_contains($body, 'MENUNGGU PEMBAYARAN');
    });
});

test('whatsapp notification is sent when order payment is successful with pick n go details', function () {
    Http::fake([
        'whapify.id/api/send/whatsapp' => Http::response([
            'status' => 200,
            'message' => 'WhatsApp chat has been sent!',
            'data' => ['messageId' => 67890],
        ], 200),
    ]);

    $user = User::factory()->customer()->create([
        'phone' => '085299887766',
    ]);

    $order = Order::create([
        'order_number' => 'MKN-20261011-99887',
        'user_id' => $user->id,
        'branch' => 'Panakkukang',
        'fulfillment_type' => 'pick_n_go',
        'status' => 'ready_for_pickup',
        'pickup_pin' => '777-888',
        'pickup_rack' => 'Rak C-05',
        'payment_method' => 'DOKU',
        'payment_status' => 'paid',
        'total_amount' => 500000,
    ]);

    $service = app(WhapifyService::class);
    $result = $service->sendOrderPaid($order);

    expect($result)->not->toBeNull()
        ->and($result['status'])->toBe(200);

    Http::assertSent(function ($request) {
        if (! str_contains($request->url(), 'whapify.id/api/send/whatsapp')) {
            return false;
        }

        $body = (string) $request->body();

        return str_contains($body, '6285299887766')
            && str_contains($body, 'BERHASIL KAMI TERIMA')
            && str_contains($body, '777-888')
            && str_contains($body, 'Rak C-05');
    });
});

test('notifications are safely skipped when user has no phone number', function () {
    Http::fake();

    $user = User::factory()->customer()->create([
        'phone' => null,
    ]);

    $order = Order::create([
        'order_number' => 'MKN-20261011-11111',
        'user_id' => $user->id,
        'branch' => 'Panakkukang',
        'fulfillment_type' => 'pick_n_go',
        'status' => 'pending_payment',
        'payment_method' => 'DOKU',
        'payment_status' => 'unpaid',
        'total_amount' => 100000,
    ]);

    $service = app(WhapifyService::class);
    expect($service->sendOrderCreated($order))->toBeNull()
        ->and($service->sendOrderPaid($order))->toBeNull();

    Http::assertNothingSent();
});

test('notifications are safely skipped when whatsapp integration is disabled in admin', function () {
    Http::fake();

    Setting::set('whapify_is_enabled', '0');

    $user = User::factory()->customer()->create([
        'phone' => '081234567890',
    ]);

    $order = Order::create([
        'order_number' => 'MKN-20261011-22222',
        'user_id' => $user->id,
        'branch' => 'Panakkukang',
        'fulfillment_type' => 'pick_n_go',
        'status' => 'pending_payment',
        'payment_method' => 'DOKU',
        'payment_status' => 'unpaid',
        'total_amount' => 100000,
    ]);

    $service = app(WhapifyService::class);
    expect($service->sendOrderCreated($order))->toBeNull();

    Http::assertNothingSent();
});
