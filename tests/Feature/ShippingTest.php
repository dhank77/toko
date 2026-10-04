<?php

use App\Models\Province;
use App\Models\User;
use App\Services\RajaOngkirService;
use Database\Seeders\ProvinceSeeder;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Http::preventStrayRequests();
});

test('user dapat menyimpan id wilayah rajaongkir pada profil', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->put('/client/profile', [
        'name' => 'Budi Pembeli',
        'phone' => '081234567890',
        'address' => 'Jl. Andi Djemma No. 10',
        'province' => 'SULAWESI SELATAN',
        'province_id' => '33',
        'city' => 'MAKASSAR',
        'city_id' => '648',
        'district' => 'PANAKKUKANG',
        'district_id' => '6736',
        'postal_code' => '90222',
    ]);

    $response->assertRedirect();
    expect($user->fresh()->district_id)->toBe('6736')
        ->and($user->fresh()->city_id)->toBe('648')
        ->and($user->fresh()->province_id)->toBe('33');
});

test('province seeder mengisi database dengan data provinsi rajaongkir', function () {
    $this->seed(ProvinceSeeder::class);

    expect(Province::count())->toBeGreaterThanOrEqual(34)
        ->and(Province::where('name', 'SULAWESI SELATAN')->exists())->toBeTrue();
});

test('endpoint provinces mengembalikan daftar dari database atau rajaongkir', function () {
    Province::create(['id' => 33, 'name' => 'SULAWESI SELATAN']);

    $this->get('/shipping/provinces')
        ->assertOk()
        ->assertJsonPath('data.0.id', 33);
});

test('endpoint calculate memakai origin toko panakkukang 6736 secara default', function () {
    Http::fake([
        'rajaongkir.komerce.id/*' => Http::response([
            'meta' => ['message' => 'Success Calculate Domestic Shipping cost', 'code' => 200, 'status' => 'success'],
            'data' => [[
                'name' => 'Jalur Nugraha Ekakurir (JNE)',
                'code' => 'jne',
                'service' => 'REG',
                'description' => 'Layanan Reguler',
                'cost' => 9000,
                'etd' => '2-3 hari',
            ]],
        ]),
    ]);

    $response = $this->postJson('/shipping/calculate', [
        'destination' => 6737,
        'weight' => 1000,
        'courier' => 'jne',
    ]);

    $response->assertOk()->assertJsonPath('origin_id', 6736)
        ->assertJsonPath('destination_id', 6737)
        ->assertJsonPath('data.0.cost', 9000);

    Http::assertSent(function ($request) {
        return $request->url() === 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost'
            && (int) $request['origin'] === 6736
            && (int) $request['destination'] === 6737;
    });
});

test('service mengekspos origin toko panakkukang', function () {
    $service = new RajaOngkirService;

    expect($service->originDistrictId())->toBe(6736)
        ->and($service->originDistrictName())->toBe('Panakkukang');
});
