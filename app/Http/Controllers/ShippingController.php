<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function __construct(protected RajaOngkirService $rajaOngkir) {}

    /**
     * Daftar provinsi untuk dropdown alamat pembeli.
     */
    public function provinces(): JsonResponse
    {
        return response()->json([
            'data' => $this->rajaOngkir->provinces(),
        ]);
    }

    /**
     * Daftar kota berdasarkan provinsi.
     */
    public function cities(string $provinceId): JsonResponse
    {
        return response()->json([
            'data' => $this->rajaOngkir->cities($provinceId),
        ]);
    }

    /**
     * Daftar kecamatan berdasarkan kota.
     * Nilai `id` dipakai sebagai destination ongkir & disimpan ke users.district_id.
     */
    public function districts(string $cityId): JsonResponse
    {
        return response()->json([
            'data' => $this->rajaOngkir->districts($cityId),
        ]);
    }

    /**
     * Hitung ongkir dari toko (Panakkukang 6736) ke kecamatan pembeli.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'destination' => ['required', 'integer', 'min:1'],
            'weight' => ['required', 'integer', 'min:1', 'max:30000'],
            'courier' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'in:lowest,highest'],
            'origin' => ['nullable', 'integer', 'min:1'],
        ]);

        $destination = (int) $validated['destination'];
        if ($destination <= 0 && $request->user()?->district_id) {
            $destination = (int) $request->user()->district_id;
        }

        $origin = (int) ($validated['origin'] ?? $this->rajaOngkir->originDistrictId());

        $costs = $this->rajaOngkir->calculateCost(
            $origin,
            $destination,
            (int) $validated['weight'],
            $validated['courier'] ?? 'jne:jnt:sicepat:pos:tiki',
            $validated['price'] ?? 'lowest',
        );

        return response()->json([
            'origin_id' => $origin,
            'origin_name' => $this->rajaOngkir->originDistrictName(),
            'destination_id' => $destination,
            'weight' => (int) $validated['weight'],
            'data' => $costs,
        ]);
    }
}
