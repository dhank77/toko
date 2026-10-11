<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('guests and non-admins cannot access whatsapp settings', function () {
    $this->get(route('admin.settings.whatsapp'))->assertRedirect(route('login'));

    $customer = User::factory()->customer()->create();
    $this->actingAs($customer)
        ->get(route('admin.settings.whatsapp'))
        ->assertForbidden();
});

test('admin can view whatsapp settings page', function () {
    $admin = User::factory()->admin()->create();

    Setting::set('whapify_base_url', 'https://whapify.id/api');
    Setting::set('whapify_secret', 'test-secret');
    Setting::set('whapify_account', 'test-account-123');
    Setting::set('whapify_priority', 1);
    Setting::set('whapify_is_enabled', '1');

    $response = $this->actingAs($admin)->get(route('admin.settings.whatsapp'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/settings/whatsapp')
            ->where('settings.base_url', 'https://whapify.id/api')
            ->where('settings.secret', 'test-secret')
            ->where('settings.account', 'test-account-123')
            ->where('settings.priority', 1)
            ->where('settings.is_enabled', true)
            ->where('settings.is_configured', true)
        );
});

test('admin can update whapify configuration stored in database', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->put(route('admin.settings.whatsapp.update'), [
        'base_url' => 'https://whapify.id/api',
        'secret' => 'new-secret-xyz',
        'account' => 'acc-998877',
        'priority' => 1,
        'is_enabled' => true,
    ]);

    $response->assertSessionHas('success');

    expect(Setting::get('whapify_secret'))->toBe('new-secret-xyz')
        ->and(Setting::get('whapify_account'))->toBe('acc-998877')
        ->and(Setting::get('whapify_priority'))->toBe('1')
        ->and(Setting::get('whapify_is_enabled'))->toBe('1');
});

test('admin can send test whatsapp message via whapify', function () {
    $admin = User::factory()->admin()->create();

    Setting::set('whapify_base_url', 'https://whapify.id/api');
    Setting::set('whapify_secret', 'test-secret');
    Setting::set('whapify_account', 'test-acc');
    Setting::set('whapify_priority', 1);

    Http::fake([
        'whapify.id/api/send/whatsapp' => Http::response([
            'status' => 200,
            'message' => 'WhatsApp chat has been sent!',
            'data' => ['messageId' => 999],
        ], 200),
    ]);

    $response = $this->actingAs($admin)->post(route('admin.settings.whatsapp.test'), [
        'recipient' => '081234567890',
        'message' => 'Halo tes pengiriman',
    ]);

    $response->assertSessionHas('success');

    Http::assertSent(function ($request) {
        return str_contains($request->url(), '/send/whatsapp');
    });
});

