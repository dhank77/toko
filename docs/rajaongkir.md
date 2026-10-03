# Dokumentasi Penggunaan RajaOngkir — Perhitungan Ongkir (Calculate Cost)

> Sumber resmi: `https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/calculate-cost`
> Base URL: `https://rajaongkir.komerce.id/api/v1`

RajaOngkir V2 (Komerce) menyediakan 2 varian endpoint hitung ongkir domestik:

| Metode | Endpoint | Kegunaan |
|---|---|---|
| **Form Base / Step-by-Step (District)** | `POST /calculate/district/domestic-cost` | Alur bertingkat: Province → City → District → Hitung. `origin` & `destination` = **ID Kecamatan (district)** |
| **Search Base (Direct)** | `POST /calculate/domestic-cost` | Alur langsung: Search Destination → Hitung. `origin` & `destination` = **ID hasil Search Domestics Destination** |

## 1. Autentikasi

Semua request wajib kirim API Key di header `key`:

```http
key: YOUR_API_KEY
Content-Type: application/x-www-form-urlencoded
```

Simpan di `.env`:

```env
RAJAONGKIR_API_KEY=vzO6kaFo58ab14eed19690e7luWefbyn
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
```

> Catatan: `API Shipping Cost` selalu Live. Toggle Sandbox/Live tidak berpengaruh.

## 2. Cara Mencari ID Kecamatan (Search District)

> Sumber: `https://rajaongkir.com/docs/shipping-cost/endpoint-rajaongkir-for-form-base-calculate-cost/search_district`

ID kecamatan (`origin` / `destination`) **tidak bisa ditebak** — harus dicari lewat
hierarki bertingkat: Province → City → District. Endpoint ini adalah **langkah ke-3**
dari metode Step-by-Step.

```http
GET https://rajaongkir.komerce.id/api/v1/destination/district/{city_id}
Header: key: YOUR_API_KEY
```

| Bagian | Keterangan |
|---|---|
| Method | `GET` (tanpa body) |
| Path param `{city_id}` | ✅ Wajib. ID kota dari endpoint `Search City`. Contoh: `575` (Jakarta Selatan) |
| Header `key` | ✅ Wajib. API Key RajaOngkir |
| Response `data[].id` | **ID kecamatan — inilah yang dipakai sebagai `origin`/`destination` saat hitung ongkir** |
| Response `data[].name` | Nama kecamatan (contoh: `JAGAKARSA`, `TEBET`) |
| Response `data[].zip_code` | Kode pos kecamatan |

### 2.1. Alur Hierarki Lengkap

```text
1. GET /destination/province            -> dapat province_id
2. GET /destination/city/{province_id}  -> dapat city_id
3. GET /destination/district/{city_id}  -> dapat district_id (ID kecamatan) ✅
4. [Opsional] GET /destination/sub-district/{district_id} -> detail kelurahan
5. POST /calculate/district/domestic-cost dengan origin & destination = district_id
```

### 2.2. Contoh Request cURL

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/destination/district/575' \
--header 'Key: YOUR_API_KEY'
```

### 2.3. Contoh PHP Native

```php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'https://rajaongkir.komerce.id/api/v1/destination/district/575',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Key: YOUR_API_KEY'],
]);
$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
// $data['data'] = daftar kecamatan, ambil ['id'] untuk origin/destination
```

### 2.4. Contoh JavaScript (fetch, Search District)

```js
const res = await fetch('https://rajaongkir.komerce.id/api/v1/destination/district/575', {
  headers: { Key: 'YOUR_API_KEY' },
});
const json = await res.json();
// json.data => [{ id, name, zip_code }, ...]
const firstDistrictId = json.data[0]?.id;
```

### 2.5. Contoh Response Sukses Search District (200)

```json
{
  "meta": { "message": "Success Get District By City ID", "code": 200, "status": "success" },
  "data": [
    { "id": 1360, "name": "JAKARTA SELATAN", "zip_code": "0" },
    { "id": 1361, "name": "JAGAKARSA", "zip_code": "12630" },
    { "id": 1362, "name": "KEBAYORAN BARU", "zip_code": "12150" },
    { "id": 1369, "name": "TEBET", "zip_code": "12840" },
    { "id": 1370, "name": "CILANDAK", "zip_code": "12430" }
  ]
}
```

> Contoh nyata: `origin=1391` dan `destination=1376` pada endpoint calculate-cost
> adalah nilai `id` dari response seperti di atas.

### 2.6. Contoh di Laravel

```php
use Illuminate\Support\Facades\Http;

$cityId = 575; // dari dropdown kota yang dipilih user

$districts = Http::withHeaders(['key' => config('services.rajaongkir.key')])
    ->timeout(15)
    ->get('https://rajaongkir.komerce.id/api/v1/destination/district/'.$cityId)
    ->throw()
    ->json('data');

// $districts untuk mengisi dropdown kecamatan:
// <option value="{{ $d['id'] }}">{{ $d['name'] }} ({{ $d['zip_code'] }})</option>
```

Cache daftar kecamatan per kota agar dropdown cepat (data wilayah jarang berubah):

```php
use Illuminate\Support\Facades\Cache;

$districts = Cache::remember("rajaongkir:districts:{$cityId}", now()->addDays(7), fn () => Http::withHeaders([
    'key' => config('services.rajaongkir.key'),
])->get("https://rajaongkir.komerce.id/api/v1/destination/district/{$cityId}")->throw()->json('data'));
```

## 3. Endpoint Calculate Cost (Form Base / District)

```http
POST https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost
```

### 3.1. Request Body (`x-www-form-urlencoded`)

| Param | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `origin` | int | ✅ | ID district asal dari endpoint `Search District`. Contoh: `1391` |
| `destination` | int | ✅ | ID district tujuan. Contoh: `1376` |
| `weight` | int | ✅ | Berat gram. `1000` = 1kg. Jangan `0` / negatif. |
| `courier` | string | ✅ | Kode kurir dipisah `:`. Contoh: `jne:sicepat:jnt` |
| `price` | string | ❌ | `lowest` (default) atau `highest` |

Kode kurir didukung:

```text
jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse
```

### 3.2. Contoh Request cURL (Calculate Cost)

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost' \
--header 'key: YOUR_API_KEY' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'origin=1391' \
--data-urlencode 'destination=1376' \
--data-urlencode 'weight=1000' \
--data-urlencode 'courier=jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse' \
--data-urlencode 'price=lowest'
```

### 3.3. Contoh PHP Native (Calculate Cost)

```php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'key: YOUR_API_KEY',
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_POSTFIELDS => http_build_query([
        'origin' => 1391,
        'destination' => 1376,
        'weight' => 1000,
        'courier' => 'jne:sicepat:jnt',
        'price' => 'lowest',
    ]),
]);
$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
```

### 3.4. Contoh JavaScript (fetch, Calculate Cost)

```js
const params = new URLSearchParams({
  origin: '1391',
  destination: '1376',
  weight: '1000',
  courier: 'jne:sicepat:jnt',
  price: 'lowest',
});

const res = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost', {
  method: 'POST',
  headers: {
    key: 'YOUR_API_KEY',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params,
});
const json = await res.json();
console.log(json.data);
```

## 4. Endpoint Calculate Domestic Cost (Search Base)

```http
POST https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost
```

Param sama persis: `origin`, `destination`, `weight`, `courier`, `price`.
Bedanya `origin/destination` berasal dari endpoint `Search Domestics Destination`
(bisa ID subdistrict / zip_code, lebih presisi).

```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost' \
--header 'key: inputapikey' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'origin=1234' \
--data-urlencode 'destination=5678' \
--data-urlencode 'weight=1700' \
--data-urlencode 'courier=jne' \
--data-urlencode 'price=lowest'
```

## 5. Response Calculate Cost

### 5.1. Sukses (200)

```json
{
  "meta": {
    "message": "Success Calculate Domestic Shipping cost",
    "code": 200,
    "status": "success"
  },
  "data": [
    {
      "name": "Jalur Nugraha Ekakurir (JNE)",
      "code": "jne",
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 9000,
      "etd": "2-3 hari"
    }
  ]
}
```

| Field | Arti |
|---|---|
| `meta.message/code/status` | Status request |
| `data[].name` | Nama kurir |
| `data[].code` | Kode kurir |
| `data[].service` | Layanan (REG, YES, OKE, JTR, dll) |
| `data[].description` | Deskripsi layanan |
| `data[].cost` | Ongkir Rupiah (integer) |
| `data[].etd` | Estimasi sampai (`1 hari`, `2-3 hari`) |

### 5.2. Error Calculate Cost

```json
{
  "meta": { "message": "Missing Params", "code": 400, "status": "error" },
  "data": null
}
```

| Code | Arti | Solusi |
|---|---|---|
| `200` | Sukses | — |
| `400` | `Calculate Domestic Shipping Cost not found` | Rute/kurir tidak melayani. Tawarkan kurir lain. |
| `400` | `Missing Params` | Cek `origin, destination, weight, courier` + header `key` |
| `401` | Unauthorized | API Key salah / tidak dikirim |
| `422` | `Invalid Courier` | Kode kurir salah |

## 6. Implementasi di Laravel (TokoOnline / MakassarNotebook)

### 6.1. Config `config/services.php`

```php
'rajaongkir' => [
    'key' => env('RAJAONGKIR_API_KEY'),
    'base_url' => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),
],
```

### 6.2. Service `app/Services/RajaOngkirService.php`

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.rajaongkir.base_url');
        $this->apiKey = (string) config('services.rajaongkir.key');
    }

    /** @return array<int, array{name:string,code:string,service:string,description:string,cost:int,etd:string}> */
    public function calculateCost(int $origin, int $destination, int $weight, string $courier = 'jne:jnt:sicepat', string $price = 'lowest'): array
    {
        abort_if($weight <= 0, 422, 'Berat harus lebih dari 0 gram.');

        $response = Http::asForm()
            ->withHeaders(['key' => $this->apiKey])
            ->timeout(15)
            ->post("{$this->baseUrl}/calculate/district/domestic-cost", [
                'origin' => $origin,
                'destination' => $destination,
                'weight' => $weight,
                'courier' => $courier,
                'price' => $price,
            ]);

        if ($response->failed()) {
            throw new \RuntimeException('Gagal hitung ongkir: '.($response->json('meta.message') ?? $response->body()));
        }

        return $response->json('data') ?? [];
    }
}
```

### 6.3. Contoh Controller Checkout

```php
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;

public function checkOngkir(Request $request, RajaOngkirService $ongkir)
{
    $validated = $request->validate([
        'origin' => ['required', 'integer'],
        'destination' => ['required', 'integer'],
        'weight' => ['required', 'integer', 'min:1'],
        'courier' => ['nullable', 'string'],
    ]);

    try {
        $costs = $ongkir->calculateCost(
            $validated['origin'],
            $validated['destination'],
            $validated['weight'],
            $validated['courier'] ?? 'jne:jnt:sicepat',
            'lowest'
        );
    } catch (\Throwable $e) {
        return back()->withErrors(['ongkir' => $e->getMessage()]);
    }

    return inertia('Checkout/Shipping', ['shippingOptions' => $costs]);
}
```

### 6.4. Hitung Berat Total

```php
$totalWeight = $cartItems->sum(fn ($item) => $item->qty * $item->product->weight_gram);
$totalWeight = max($totalWeight, 1000);
```

## 7. Alur Lengkap Step-by-Step

```text
1. Search Province  -> dapat province_id
2. Search City      -> param province_id -> dapat city_id
3. Search District  -> param city_id -> dapat district_id (origin/destination)
4. [Opsional] Search Subdistrict -> detail granular
5. POST /calculate/district/domestic-cost -> tampilkan opsi di checkout
```

## 8. Tips Anti-Error

1. Berat selalu gram: `1kg = 1000`. Bulatkan ke atas.
2. Ambil `origin/destination` dari endpoint Search, jangan hardcode (kecuali testing `1391 → 1376`).
3. Kode kurir lowercase, dipisah `:` tanpa spasi.
4. Selalu kirim header `key`, bukan `Authorization`.
5. Jika `data = []`, tampilkan "Layanan tidak tersedia, coba kurir lain".
6. Cache hasil per kombinasi `origin-destination-weight-courier` 1-6 jam (Redis) agar checkout < 3 detik.

