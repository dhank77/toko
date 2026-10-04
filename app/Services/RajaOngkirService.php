<?php

namespace App\Services;

use App\Models\Province;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

/**
 * Layanan integrasi RajaOngkir V2 (Komerce).
 *
 * @see docs/rajaongkir.md
 */
class RajaOngkirService
{
    protected string $baseUrl;

    protected string $apiKey;

    protected int $originDistrictId;

    protected string $originDistrictName;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.rajaongkir.base_url', 'https://rajaongkir.komerce.id/api/v1');
        $this->apiKey = (string) config('services.rajaongkir.key');
        $this->originDistrictId = (int) config('services.rajaongkir.origin_district_id', 6736);
        $this->originDistrictName = (string) config('services.rajaongkir.origin_district_name', 'Panakkukang');
    }

    public function originDistrictId(): int
    {
        return $this->originDistrictId;
    }

    public function originDistrictName(): string
    {
        return $this->originDistrictName;
    }

    /**
     * @return array<string, mixed>
     */
    protected function headers(): array
    {
        return ['key' => $this->apiKey];
    }

    /**
     * Ambil data provinsi langsung dari API RajaOngkir.
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchProvincesFromApi(): array
    {
        $response = Http::withHeaders($this->headers())
            ->timeout(15)
            ->get("{$this->baseUrl}/destination/province");

        $this->throwIfFailed($response, 'Gagal memuat daftar provinsi.');

        return $response->json('data') ?? [];
    }

    /**
     * Ambil daftar provinsi dari database lokal (fallback sinkronisasi ke API jika kosong).
     *
     * @return array<int, array{id: int, name: string}>
     */
    public function provinces(): array
    {
        $provinces = Province::query()->orderBy('name')->get(['id', 'name'])->toArray();

        if (! empty($provinces)) {
            return $provinces;
        }

        try {
            $apiProvinces = $this->fetchProvincesFromApi();
            foreach ($apiProvinces as $p) {
                Province::updateOrCreate(
                    ['id' => (int) $p['id']],
                    ['name' => (string) $p['name']]
                );
            }

            return Province::query()->orderBy('name')->get(['id', 'name'])->toArray();
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * Ambil daftar kota berdasarkan provinsi (Step 2).
     *
     * @return array<int, array<string, mixed>>
     */
    public function cities(string|int $provinceId): array
    {
        return Cache::remember("rajaongkir:cities:{$provinceId}", now()->addDays(7), function () use ($provinceId): array {
            $response = Http::withHeaders($this->headers())
                ->timeout(15)
                ->get("{$this->baseUrl}/destination/city/{$provinceId}");

            $this->throwIfFailed($response, 'Gagal memuat daftar kota.');

            return $response->json('data') ?? [];
        });
    }

    /**
     * Ambil daftar kecamatan berdasarkan kota (Step 3).
     * Nilai `id` inilah yang dipakai sebagai origin/destination ongkir.
     *
     * @return array<int, array{id: int|string, name: string, zip_code: string}>
     */
    public function districts(string|int $cityId): array
    {
        return Cache::remember("rajaongkir:districts:{$cityId}", now()->addDays(7), function () use ($cityId): array {
            $response = Http::withHeaders($this->headers())
                ->timeout(15)
                ->get("{$this->baseUrl}/destination/district/{$cityId}");

            $this->throwIfFailed($response, 'Gagal memuat daftar kecamatan.');

            return $response->json('data') ?? [];
        });
    }

    /**
     * Hitung ongkir antar kecamatan (Step 5 / final).
     *
     * @return array<int, array{name: string, code: string, service: string, description: string, cost: int, etd: string}>
     */
    public function calculateCost(int $origin, int $destination, int $weight, string $courier = 'jne:jnt:sicepat', string $price = 'lowest'): array
    {
        abort_if($weight <= 0, 422, 'Berat harus lebih dari 0 gram.');

        $cacheKey = "rajaongkir:cost:{$origin}:{$destination}:{$weight}:".md5("{$courier}:{$price}");

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($origin, $destination, $weight, $courier, $price): array {
            $response = Http::asForm()
                ->withHeaders($this->headers())
                ->timeout(20)
                ->post("{$this->baseUrl}/calculate/district/domestic-cost", [
                    'origin' => $origin,
                    'destination' => $destination,
                    'weight' => $weight,
                    'courier' => $courier,
                    'price' => $price,
                ]);

            $this->throwIfFailed($response, 'Gagal menghitung ongkos kirim.');

            return $response->json('data') ?? [];
        });
    }

    /**
     * Hitung ongkir dari toko (Panakkukang 6736) ke kecamatan pembeli.
     *
     * @return array<int, array{name: string, code: string, service: string, description: string, cost: int, etd: string}>
     */
    public function calculateFromStore(int $destinationDistrictId, int $weight, string $courier = 'jne:jnt:sicepat', string $price = 'lowest'): array
    {
        return $this->calculateCost($this->originDistrictId, $destinationDistrictId, $weight, $courier, $price);
    }

    protected function throwIfFailed(mixed $response, string $fallbackMessage): void
    {
        if ($response->failed()) {
            $message = $response->json('meta.message') ?? $fallbackMessage;
            throw new RuntimeException(is_string($message) ? $message : $fallbackMessage);
        }
    }
}
