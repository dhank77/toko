# Dokumentasi Integrasi Payment Gateway DOKU — MakassarNotebook

> Sumber resmi:
> - Docs produk: `https://docs.doku.com/`
> - API Reference: `https://developers.doku.com/`
> - Halaman acuan: [Backend Integration](https://developers.doku.com/accept-payments/doku-checkout/integration-guide), [Signature Component](https://developers.doku.com/get-started-with-doku-api/signature-component), [HTTP Notification](https://developers.doku.com/get-started-with-doku-api/notification), [Check Status API](https://developers.doku.com/get-started-with-doku-api/check-status-api)
>
> Dokumen ini adalah referensi **teknis/how-to**. Rencana implementasi internal ada di [`docs/doku-payment-plan.md`](./doku-payment-plan.md).

---

## 1. Ringkasan

DOKU (PT Nusa Satu Inti Artha) menyediakan beberapa cara menerima pembayaran. Untuk MakassarNotebook, pilihan yang dipakai adalah **DOKU Checkout (Jokul Checkout)**.

| Produk | Cocok untuk | Keterangan |
|---|---|---|
| **DOKU Checkout** ✅ | Website e-commerce yang butuh banyak kanal pembayaran sekaligus | Integrasi **satu kali** ke `POST /checkout/v1/payment`, halaman pembayaran ditangani DOKU (QRIS, VA, Kartu, e-Wallet, Paylater, Gerai) |
| **Direct API (Non-SNAP/SNAP)** | Merchant yang membangun halaman pembayaran sendiri per kanal | Banyak endpoint terpisah (VA, QRIS, OVO, Kartu, …), wajib integrasi per kanal |
| **Payment Link / QRIS Statis** | Penjualan tanpa sistem (Instagram, toko offline) | Tidak ada integrasi API |
| **Payouts (Kirim DOKU)** | Pengiriman dana ke rekening bank | Di luar cakupan dokumen ini |

### 1.1. Alur Transaksi

```text
[Pelanggan] --Beli Sekarang / Lanjut Pembayaran--> [CheckoutController]
                                                          |
                                                          v
                                                  [DokuService::createPayment()]
                                                          |
                                          POST /checkout/v1/payment  (HMACSHA256)
                                                          |
                                                          v
                                                 response.payment.url
                                                          |
                                                          v
                                            Redirect / modal ke DOKU Checkout
                                                          |
                                                 Pelanggan membayar
                                                          |
                                                          v
                                      POST ke Notification URL kita (webhook)
                                                          |
                                                          v
                                       [Verifikasi Signature] --> [Update Order: paid]
```

> **Penting:** status pembayaran final **hanya** boleh diambil dari webhook DOKU atau Check Status API. Halaman balik pelanggan (`callback_url_result`) hanya untuk UX, bukan sumber kebenaran.

---

## 2. Kredensial & Konfigurasi

### 2.1. Mengambil Kredensial

1. Login ke [DOKU Dashboard](https://dashboard.doku.com/bo/login) (sandbox: [sandbox.doku.com](https://sandbox.doku.com/bo/login)).
2. Menu **Settings → Integration → API Keys**.
3. Ambil **Client ID** dan **Secret Key**.

> Client ID berawalan `BRN-` pada akun baru (mis. `BRN-0214-1714016624673`). Contoh di bawah memakai format lama `MCH-0001-...`.

### 2.2. Environment Variables

Sudah tersedia di `config/services.php` proyek ini:

```env
# .env / .env.example
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_ENVIRONMENT=sandbox
DOKU_PAYMENT_DUE_MINUTES=60
```

```php
// config/services.php
'doku' => [
    'client_id' => env('DOKU_CLIENT_ID'),
    'secret_key' => env('DOKU_SECRET_KEY'),
    'environment' => env('DOKU_ENVIRONMENT', 'sandbox'),
    'base_url' => env('DOKU_ENVIRONMENT', 'sandbox') === 'production'
        ? 'https://api.doku.com'
        : 'https://api-sandbox.doku.com',
    'payment_due_minutes' => (int) env('DOKU_PAYMENT_DUE_MINUTES', 60),
],
```

> **Jangan pernah** menaruh `DOKU_SECRET_KEY` di repository. Pastikan `.env` sudah masuk `.gitignore`.

---

## 3. Endpoint & Lingkungan

| Alias | Base URL |
|---|---|
| Sandbox | `https://api-sandbox.doku.com` |
| Production | `https://api.doku.com` |

| Kebutuhan | Method | Path | Request Target |
|---|---|---|---|
| Buat sesi pembayaran | `POST` | `/checkout/v1/payment` | `/checkout/v1/payment` |
| Cek status transaksi | `GET` | `/orders/v1/status/{invoice_number}` | `/orders/v1/status/{invoice_number}` |

> **Request Target** adalah *path* endpoint (tanpa domain, tanpa query string). Nilai ini dipakai saat menghitung signature.

Aset frontend DOKU Checkout:

| Alias | URL |
|---|---|
| Sandbox | `https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js` |
| Production | `https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js` |

---

## 4. Mekanisme Keamanan — Signature

Semua request ke API DOKU **wajib** membawa header berikut:

```http
Client-Id: BRN-0214-1714016624673
Request-Id: fdb69f47-96da-499d-acec-7cdc318ab2fe
Request-Timestamp: 2020-08-11T08:45:42Z
Signature: HMACSHA256=1jap2tpgvWt83tG4J7IhEwUrwmMt71OaIk0oL0e6sPM=
Content-Type: application/json
```

| Header | Wajib | Keterangan |
|---|---|---|
| `Client-Id` | Ya | Client ID dari DOKU Dashboard |
| `Request-Id` | Ya | String unik (maks. 128 karakter). Untuk idempotensi request. Gunakan UUID (`Str::uuid()`) |
| `Request-Timestamp` | Ya | Waktu **UTC** format ISO-8601 (`Y-m-d\TH:i:s\Z`). WIB = UTC + 7 jam |
| `Signature` | Ya | `HMACSHA256=` + Base64(HMAC-SHA256) dari *string to sign* |

> Header `Digest` **tidak** dikirim ke DOKU pada endpoint Checkout. `Digest` hanya dipakai sebagai komponen perhitungan signature di sisi merchant.

### 4.1. Komponen *String to Sign*

Untuk method `POST` (5 komponen):

```text
Client-Id:{client-id}\n
Request-Id:{request-id}\n
Request-Timestamp:{request-timestamp}\n
Request-Target:{request-target}\n
Digest:{digest}
```

Untuk method `GET` (tanpa `Digest`, 4 komponen):

```text
Client-Id:{client-id}\n
Request-Id:{request-id}\n
Request-Timestamp:{request-timestamp}\n
Request-Target:{request-target}
```

Baris dipisahkan `\n`, **tanpa** baris kosong di akhir string.

### 4.2. Menghitung `Digest`

```php
$digest = base64_encode(hash('sha256', $rawJsonBody, true));
```

> ⚠️ Body yang di-*hash* harus **persis sama** dengan body yang dikirim (huruf besar/kecil, urutan key, dan whitespace). Encode JSON sekali di variabel lalu kirim variabel yang sama.

### 4.3. Menghitung `Signature`

```php
$component = "Client-Id:{$clientId}\n".
             "Request-Id:{$requestId}\n".
             "Request-Timestamp:{$timestamp}\n".
             "Request-Target:{$targetPath}\n".
             "Digest:{$digest}";              // hapus baris ini untuk GET

$signature = 'HMACSHA256='.base64_encode(hash_hmac('sha256', $component, $secretKey, true));
```

### 4.4. Verifikasi Signature pada Response DOKU

Komponennya sama, tapi memakai `Response-Timestamp` dari response header:

```text
Client-Id:{client-id}\n
Request-Id:{request-id}\n
Response-Timestamp:{response-timestamp}\n
Request-Target:{request-target}\n
Digest:{digest-dari-response-body}
```

### 4.5. Implementasi PHP (reusable)

```php
<?php

/**
 * Generator signature DOKU (HMAC-SHA256).
 *
 * @see docs/doku.md
 */
final class DokuSignature
{
    public static function digest(string $rawJsonBody): string
    {
        return base64_encode(hash('sha256', $rawJsonBody, true));
    }

    /**
     * @param  string  $targetPath  Path endpoint DOKU, mis. "/checkout/v1/payment"
     * @param  string|null  $rawJsonBody  Body JSON mentah; null untuk GET/DELETE
     * @return array<string, string>
     */
    public static function request(
        string $clientId,
        string $secretKey,
        string $requestId,
        string $targetPath,
        ?string $rawJsonBody = null,
        ?string $timestamp = null,
    ): array {
        $timestamp ??= gmdate('Y-m-d\TH:i:s\Z');

        $component = "Client-Id:{$clientId}\n".
                     "Request-Id:{$requestId}\n".
                     "Request-Timestamp:{$timestamp}\n".
                     "Request-Target:{$targetPath}";

        if ($rawJsonBody !== null) {
            $component .= "\nDigest:".self::digest($rawJsonBody);
        }

        $signature = 'HMACSHA256='.base64_encode(
            hash_hmac('sha256', $component, $secretKey, true)
        );

        return [
            'Client-Id' => $clientId,
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $signature,
        ];
    }
}
```

**Contoh hasil perhitungan (dari dokumentasi DOKU):**

```text
Client-Id:MCH-0001-10791114622547
Request-Id:cc682442-6c22-493e-8121-b9ef6b3fa728
Request-Timestamp:2020-08-11T08:45:42Z
Request-Target:/doku-virtual-account/v2/payment-code
Digest:5WIYK2TJg6iiZ0d5v4IXSR0EkYEkYOezJIma3Ufli5s=

Signature: HMACSHA256=OvIRJs/jH8BIcGsktr4d8nnYtxY6E0Uzdm9d1GVgv5s=
```

---

## 5. Membuat Sesi Pembayaran (Create Payment)

### 5.1. Endpoint

| Tipe | Nilai |
|---|---|
| HTTP Method | `POST` |
| Sandbox | `https://api-sandbox.doku.com/checkout/v1/payment` |
| Production | `https://api.doku.com/checkout/v1/payment` |

### 5.2. Request — Basic

Hanya bisa dipakai untuk kanal: **Virtual Account, Credit Card, QRIS, Convenience Store, E-money (OVO & LinkAja)**.

```json
{
  "order": {
    "amount": 20000,
    "invoice_number": "INV-20210231-0001"
  },
  "payment": {
    "payment_due_date": 60
  }
}
```

### 5.3. Request — Full

```json
{
  "order": {
    "amount": 350000,
    "invoice_number": "MKN-20261004-9821",
    "currency": "IDR",
    "language": "ID",
    "callback_url": "https://makassarnotebook.com/client?tab=orders",
    "callback_url_result": "https://makassarnotebook.com/payment/result",
    "auto_redirect": false,
    "line_items": [
      {
        "id": "1",
        "name": "Keyboard Mechanical RGB Wireless",
        "quantity": 1,
        "price": 350000,
        "sku": "KB-RGB-001",
        "category": "electronics-and-telecom",
        "url": "https://makassarnotebook.com/products/keyboard-mechanical",
        "image_url": "https://makassarnotebook.com/storage/products/keyboard.jpg"
      }
    ]
  },
  "payment": {
    "payment_due_date": 60,
    "payment_method_types": ["QRIS", "VIRTUAL_ACCOUNT_BCA", "EMONEY_DANA"]
  },
  "customer": {
    "id": "12",
    "name": "Hamdani",
    "last_name": "Latjoro",
    "phone": "6281234567890",
    "email": "customer@example.com"
  },
  "shipping_address": {
    "first_name": "Hamdani",
    "address": "Jl. Boulevard No. 10",
    "city": "Makassar",
    "postal_code": "90231",
    "phone": "6281234567890",
    "country_code": "IDN"
  },
  "additional_info": {
    "override_notification_url": "https://makassarnotebook.com/api/webhooks/doku"
  }
}
```

### 5.4. Referensi Parameter Request

#### Object `order`

| Parameter | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `order.amount` | number | **Ya** | Nominal IDR tanpa desimal. Maks. 12 digit |
| `order.invoice_number` | string | **Ya** | ID unik dari merchant. Maks. 64 karakter (maks. 30 bila Credit Card aktif). Jangan pakai simbol jika memakai KKI |
| `order.currency` | string | Tidak | Kode ISO 4217, panjang 3. Default `IDR` |
| `order.language` | string | Tidak | Bahasa halaman checkout. Panjang maks. 2 (`ID` / `EN`) |
| `order.callback_url` | string | Bersyarat | URL tombol "Back to Merchant" di halaman utama. **Wajib** untuk Jenius |
| `order.callback_url_result` | string | Tidak | URL tombol "Back to Merchant" di halaman hasil |
| `order.callback_url_cancel` | string | Bersyarat | URL redirect saat pesanan dibatalkan. Saat ini hanya Indodana |
| `order.auto_redirect` | boolean | **Ya** | `true` = halaman hasil langsung redirect ke callback URL; `false` = tampilkan halaman hasil DOKU |
| `order.disable_retry_payment` | boolean | Bersyarat | `true` = pelanggan tidak bisa ganti kanal di halaman hasil. Berlaku untuk Credit Card, DOKU Wallet, Akulaku, OVO, ShopeePay |
| `order.recover_abandoned_cart` | boolean | Bersyarat | Mengaktifkan pemulihan pesanan yang expired. Berlaku untuk VA, O2O, Credit Card |
| `order.expired_recovered_cart` | number | Bersyarat | Masa berlaku pemulihan (menit), maks. 44640 |
| `order.line_items` | array | Tidak | Rincian item; **wajib** untuk Jenius, Kredivo, Akulaku, Indodana, KKI, Allobank |

#### Object `order.line_items`

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID item, maks. 64 karakter. Wajib untuk Akulaku, Kredivo, Indodana, Allobank |
| `name` | string | Nama produk, maks. 255 karakter |
| `quantity` | number | Jumlah item. `price x quantity` harus sama dengan total `order.amount` |
| `price` | number | Harga satuan |
| `sku` | string | SKU produk |
| `category` | string | Kategori (daftar tetap). Wajib untuk Akulaku, Kredivo, Indodana |
| `url` | string | URL halaman produk di website merchant. Wajib untuk Kredivo |
| `image_url` | string | URL gambar produk. Wajib untuk Indodana |
| `type` | string | Tipe item. Wajib untuk Indodana, Kredivo |

---

#### Object `payment`

| Parameter | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `payment.payment_due_date` | number | Tidak | Masa berlaku halaman checkout dalam **menit**. Default 60, maks. 6 digit |
| `payment.payment_method_types` | array | Tidak | Batasi kanal yang tampil. **Kosongkan** untuk menampilkan semua kanal aktif |
| `payment.type` | string | Tidak | `SALE`, `INSTALLMENT`, atau `AUTHORIZE`. Hanya untuk Credit Card. `AUTHORIZE` menghasilkan status awal *On Hold* |

#### Object `customer`

| Parameter | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | string | Bersyarat | ID pelanggan unik. Wajib untuk tokenization (BRI Direct Debit, Allobank, Credit Card) dan Akulaku. Maks. 50 karakter |
| `name` | string | Bersyarat | Huruf saja, maks. 255. Wajib untuk Jenius, Akulaku, Indodana, Kredivo |
| `last_name` | string | Tidak | Maks. 16 |
| `email` | string | Bersyarat | Maks. 128. Wajib untuk Indodana, Kredivo, Allobank. Wajib agar email notifikasi DOKU terkirim |
| `phone` | string | Bersyarat | Format `{calling_code}{number}` → `6281234567890`. Maks. 16 |
| `address` | string | Bersyarat | Wajib untuk Akulaku |
| `postcode` | string | Bersyarat | Kode pos. Wajib untuk Akulaku |
| `city`, `state`, `country` | string | Bersyarat | Kota / provinsi / negara (`ID`) |

#### Object `shipping_address` & `billing_address`

| Parameter | Keterangan |
|---|---|
| `first_name`, `last_name` | Nama penerima |
| `address` | Alamat lengkap |
| `city` | Kota |
| `postal_code` | Kode pos |
| `phone` | Nomor telepon |
| `country_code` | `IDN` |

> Wajib untuk **Kredivo & Indodana** (shipping), dan **Indodana** (billing).

#### Object `additional_info`

| Parameter | Tipe | Keterangan |
|---|---|---|
| `allow_tenor` | array | Tenor cicilan yang diizinkan untuk Credit Card, mis. `[0, 3, 6, 12]` |
| `override_notification_url` | string | Override URL notifikasi level request (URL utama tetap harus dikonfigurasi di DOKU Dashboard) |
| `doku_wallet_notify_url` | string | URL notifikasi khusus DOKU Wallet |

#### Object `collect_customer`

Fitur terbaru: menampilkan form pengumpulan data di halaman checkout.

| Parameter | Tipe | Keterangan |
|---|---|---|
| `collect_customer.name` | boolean | Tampilkan input nama lengkap |
| `collect_customer.email` | boolean | Tampilkan input email |
| `collect_customer.phone` | boolean | Tampilkan input nomor telepon |
| `collect_customer.address` | boolean | Tampilkan input alamat pengiriman |

### 5.5. Response Sukses (HTTP 200)

```json
{
  "message": ["SUCCESS"],
  "response": {
    "order": {
      "amount": "350000",
      "invoice_number": "MKN-20261004-9821",
      "currency": "IDR",
      "session_id": "5f6304ca900144c7a4fcf802ad6c0898"
    },
    "payment": {
      "payment_due_date": 60,
      "token_id": "2ebffd22d23e436895ce5c38f7ddcf8620244712094712362",
      "url": "https://sandbox.doku.com/checkout-link-v2/2ebffd22d23e4368...",
      "expired_date": "20240712104711",
      "payment_method_types": ["QRIS", "VIRTUAL_ACCOUNT_BCA"]
    },
    "additional_info": {
      "origin": {
        "product": "CHECKOUT",
        "system": "mid-jokul-checkout-system",
        "apiFormat": "JOKUL",
        "source": "direct"
      }
    },
    "uuid": 2225240712094712339,
    "headers": {
      "request_id": "ed06da30-bbbc-4e90-a3c7-390c24476cb9",
      "signature": "HMACSHA256=cyoua5cA6DR5mG/4vw3ice48KjCX+CGdLdSfMumJUuo=",
      "date": "2024-07-12T02:47:11Z",
      "client_id": "BRN-0214-1714016624673"
    }
  }
}
```

| Field | Keterangan |
|---|---|
| `response.payment.url` | **URL yang diarahkan ke pelanggan** |
| `response.payment.token_id` | Token checkout, bisa disimpan untuk referensi |
| `response.payment.expired_date` | Batas akhir pembayaran (format `yyyyMMddHHmmss`, zona UTC+7) |
| `response.order.session_id` | ID sesi yang dibuat DOKU |

> Sebagai sanity check, sebaiknya verifikasi signature pada response header sebelum menyimpan `payment.url`.

### 5.6. Response Gagal (HTTP 400)

```json
{
  "error_messages": [
    "order.invoice_number must be filled",
    "order.amount must greater than 0"
  ]
}
```

---

### 5.7. Contoh cURL

```bash
curl --location 'https://api-sandbox.doku.com/checkout/v1/payment' \
--header 'Content-Type: application/json' \
--header 'Client-Id: BRN-0214-1714016624673' \
--header 'Request-Id: 9f8c1a4e-1f2b-4c3d-8e5f-0a1b2c3d4e5f' \
--header 'Request-Timestamp: 2026-10-04T02:47:11Z' \
--header 'Signature: HMACSHA256=<dihitung-oleh-server>' \
--data '{
  "order": {
    "amount": 350000,
    "invoice_number": "MKN-20261004-9821"
  },
  "payment": {
    "payment_due_date": 60
  }
}'
```

### 5.8. Contoh Implementasi di Laravel

```php
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

$baseUrl = (string) config('services.doku.base_url');
$clientId = (string) config('services.doku.client_id');
$secretKey = (string) config('services.doku.secret_key');

$targetPath = '/checkout/v1/payment';
$requestId = (string) Str::uuid();
$timestamp = gmdate('Y-m-d\TH:i:s\Z');

$payload = [
    'order' => [
        'amount' => $order->total_amount,          // integer IDR
        'invoice_number' => $order->order_number,  // ID unik dari tabel orders
        'currency' => 'IDR',
        'callback_url_result' => route('payment.result'),
        'line_items' => $order->items->map(fn ($item) => [
            'id' => (string) $item->id,
            'name' => $item->product_name,
            'quantity' => $item->quantity,
            'price' => $item->price,
            'sku' => $item->sku,
            'category' => 'electronics-and-telecom',
            'url' => route('products.show', $item->product?->slug),
        ])->all(),
    ],
    'payment' => [
        'payment_due_date' => (int) config('services.doku.payment_due_minutes', 60),
    ],
];

// Encode sekali: string yang sama dipakai untuk Digest dan dikirim sebagai body.
$rawBody = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$component = "Client-Id:{$clientId}\n".
             "Request-Id:{$requestId}\n".
             "Request-Timestamp:{$timestamp}\n".
             "Request-Target:{$targetPath}\n".
             'Digest:'.base64_encode(hash('sha256', $rawBody, true));

$signature = 'HMACSHA256='.base64_encode(
    hash_hmac('sha256', $component, $secretKey, true)
);

$response = Http::withHeaders([
    'Client-Id' => $clientId,
    'Request-Id' => $requestId,
    'Request-Timestamp' => $timestamp,
    'Signature' => $signature,
    'Content-Type' => 'application/json',
])->timeout(20)->withBody($rawBody, 'application/json')
  ->post($baseUrl.$targetPath);

if ($response->failed()) {
    report(new RuntimeException($response->json('error_messages.0') ?? 'DOKU create payment gagal'));
}

$paymentUrl = $response->json('response.payment.url');
```

> Gunakan `JSON_UNESCAPED_SLASHES` secara konsisten agar Digest tidak berubah karena encoding.

---

## 6. Menampilkan Halaman Checkout (Frontend)

Ada dua pendekatan:

### 6.1. Redirect ke halaman baru (paling umum)

```ts
window.location.href = paymentUrl;
```

Tidak perlu mengimpor JS apa pun.

### 6.2. Modal overlay (pop-up)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"></script>
<button id="checkout-button">Bayar Sekarang</button>

<script>
  document.getElementById('checkout-button').addEventListener('click', function () {
    // Ganti dengan response.payment.url dari backend
    loadJokulCheckout('https://sandbox.doku.com/checkout-link-v2/xxxx');
  });
</script>
```

> Tag `<meta name="viewport">` **wajib** agar halaman pembayaran tampil benar, terutama di perangkat mobile.

---

## 7. HTTP Notification (Webhook)

DOKU mengirim `POST` ke **Notification URL** kita ketika status pembayaran berubah. Endpoint inilah sumber kebenaran status pesanan.

### 7.1. Konfigurasi Notification URL di DOKU Dashboard

URL notifikasi **dikonfigurasi per kanal pembayaran**:

| Kanal | Lokasi di Dashboard |
|---|---|
| Virtual Account | Settings → Payment Settings → **Virtual Account** → CONFIGURE |
| Cards | Settings → Payment Settings → **Cards** → Tab *Payment Configuration* → Edit |
| e-Wallet | Settings → Payment Settings → **e-Wallet** → CONFIGURE |
| Convenience Store | Settings → Payment Settings → **Convenience Store** → CONFIGURE |
| Paylater | Settings → Payment Settings → **Paylater** → CONFIGURE |
| Direct Debit | Settings → Payment Settings → **Direct Debit** → CONFIGURE |
| Digital Banking | Settings → Payment Settings → **Digital Banking** → CONFIGURE |
| QRIS | Settings → Payment Settings → **QRIS** → CONFIGURE |

Notifikasi **Expired** dikonfigurasi terpisah:

> Settings → **Accept Payments** → **Checkout Appearance** → Tab **Expired Settings** → toggle **Expired Notification** → isi URL.

Syarat Notification URL:

- Harus dapat diakses dari **internet publik** dengan protokol `https://`.
- **Dilarang** memakai domain **ngrok**.
- Tidak boleh dilindungi autentikasi basic auth, tidak boleh di balik VPN, dan tidak boleh memakai port tidak lazim.
- Untuk pengembangan lokal, gunakan tunneling seperti [localhost.run](http://localhost.run/) atau Cloudflare Tunnel.

### 7.2. Header Notifikasi

```http
Client-Id: BRN-0214-1714016624673
Request-Id: 479b663f-5c9d-400d-8e80-3e548a8f7639
Request-Timestamp: 2020-08-11T08:45:42Z
Signature: HMACSHA256=vl9DBTX5KhEiXmnpOD0TSm8PYQknuHPdyHSTSc3W6Ps=
```

| Header | Keterangan |
|---|---|
| `Client-Id` | Client ID merchant (harus cocok dengan konfigurasi kita) |
| `Request-Id` | ID unik notifikasi dari DOKU — bisa dipakai sebagai kunci idempotensi |
| `Request-Timestamp` | Waktu pengiriman notifikasi (UTC, ISO-8601) |
| `Signature` | Signature dengan **Request Target = path Notification URL kita** |

> ⚠️ Untuk notifikasi, `Request-Target` adalah **path server merchant**, bukan path endpoint DOKU. Contoh: Notification URL `https://toko.com/api/webhooks/doku` → Request Target `/api/webhooks/doku`.

### 7.3. Body Notifikasi

```json
{
  "order": {
    "invoice_number": "MKN-20261004-9821",
    "session_id": "2ebffd22d23e436895ce5c38f7ddcf86"
  },
  "payment": {
    "payment_method_types": ["QRIS"],
    "payment_due_date": 60,
    "token_id": "2ebffd22d23e436895ce5c38f7ddcf8620244712094712362",
    "url": "https://sandbox.doku.com/checkout-link-v2/...",
    "expired_date": "20240712104711"
  },
  "transaction": {
    "status": "SUCCESS",
    "date": "2026-10-04T03:15:22Z",
    "payment_channel": "QRIS",
    "payment_id": "INV-20261004-9821-7f3a",
    "gross_amount": "350000",
    "fee": { "value": "0" },
    "amount": { "value": "350000" }
  },
  "additional_info": {
    "origin": {
      "product": "CHECKOUT",
      "system": "mid-jokul-checkout-system",
      "apiFormat": "JOKUL",
      "source": "direct"
    }
  }
}
```

Field kunci yang dipakai merchant:

| Field | Keterangan |
|---|---|
| `order.invoice_number` | **Join key** ke tabel `orders` kita |
| `transaction.status` | `SUCCESS` atau `FAILED` |
| `transaction.date` | Waktu transaksi settled (UTC) |
| `transaction.payment_channel` | Kanal yang dipakai (mis. `QRIS`, `VIRTUAL_ACCOUNT_BCA`) |
| `transaction.amount.value` | Nominal yang dibayar — **wajib cocokkan** dengan `orders.total_amount` |
| `transaction.fee.value` | Biaya transaksi |

> Body notifikasi **dapat bertambah field baru** tanpa pemberitahuan. Parse secara non-strict dan abaikan field yang tidak dikenali.

### 7.4. Verifikasi Signature Notifikasi

```php
$clientId    = $request->header('Client-Id');
$requestId   = $request->header('Request-Id');
$timestamp   = $request->header('Request-Timestamp');
$signature   = (string) $request->header('Signature');
$rawBody     = $request->getContent();
$targetPath  = '/api/webhooks/doku';   // path Notification URL kita

abort_if($clientId !== config('services.doku.client_id'), 403);

$component = "Client-Id:{$clientId}\n".
             "Request-Id:{$requestId}\n".
             "Request-Timestamp:{$timestamp}\n".
             "Request-Target:{$targetPath}\n".
             'Digest:'.base64_encode(hash('sha256', $rawBody, true));

$expected = 'HMACSHA256='.base64_encode(
    hash_hmac('sha256', $component, config('services.doku.secret_key'), true)
);

abort_unless(hash_equals($expected, $signature), 403);
```

> ⚠️ Body yang di-*hash* adalah body **mentah** (`$request->getContent()`), **jangan** parse-re-encode JSON.

### 7.5. Respon Merchant & Retry

Merchant **wajib** merespons HTTP `2xx`.

| Percobaan | Selisih dari percobaan sebelumnya | Selisih dari percobaan pertama |
|---|---|---|
| 1 | 30 menit | 30 menit |
| 2 | 5 jam 30 menit | 6 jam |
| 3 | 11 jam 30 menit | 12 jam |

Retry manual bisa dilakukan dari Dashboard: **Integration → HTTP Notification → ikon pengiriman**.

### 7.6. Best Practice (wajib diterapkan)

1. **Verifikasi signature** sebelum memproses apa pun.
2. **Acknowledge dengan cepat.** Pisahkan proses validasi/logging dari proses bisnis berat (antrean/queue), lalu balas `200`.
3. **Idempoten.** Notifikasi bisa terkirim berkali-kali. Simpan `Request-Id` atau pastikan update hanya dijalankan bila status belum `paid`.
4. **Parse non-strict.** Abaikan field baru yang tidak dikenali.
5. **Untuk DOKU Checkout, abaikan `transaction.status = FAILED`.** Halaman Checkout dirancang agar pelanggan bisa ganti kanal pembayaran, sehingga status `FAILED` belum final — tunggu webhook `SUCCESS` atau Check Status API.
6. **Cocokkan nominal.** Pastikan `transaction.amount.value` sama dengan `orders.total_amount` sebelum menandai lunas.

---

## 8. Check Status API

Dipakai untuk **reonsiliasi** atau saat webhook terlewat. DOKU butuh waktu propagasi status kanal — **panggil minimal 60 detik setelah pembayaran selesai**.

### 8.1. Endpoint

| Tipe | Nilai |
|---|---|
| HTTP Method | `GET` |
| Sandbox | `https://api-sandbox.doku.com/orders/v1/status/{order.invoice_number}` |
| Production | `https://api.doku.com/orders/v1/status/{order.invoice_number}` |

`{order.invoice_number}` bisa diisi dengan `invoice_number` **atau** `Request-Id` dari saat create payment.

### 8.2. Header

```http
Client-Id: BRN-0214-1714016624673
Request-Id: e71fe02a-bfef-4af9-a6f6-2cf1f03b00e7
Request-Timestamp: 2020-11-18T08:45:42Z
Signature: HMACSHA256=vl9DBTX5KhEiXmnpOD0TSm8PYQknuHPdyHSTSc3W6Ps=
```

> Method `GET` **tidak** memerlukan `Digest`. Komponen signature hanya 4 baris.

### 8.3. Mapping `transaction.status`

| Status | Arti | Final? | Tindakan Merchant |
|---|---|---|---|
| `PENDING` | Menunggu dibayar pelanggan | Tidak | Tunggu notifikasi / panggil Check Status lagi |
| `SUCCESS` | Sudah dibayar | **Ya** | Tandai pesanan lunas |
| `FAILED` | Pembayaran gagal | Tidak | Buat permintaan pembayaran baru |
| `EXPIRED` | Melewati batas waktu | **Ya** | Buat permintaan pembayaran baru |
| `REFUNDED` | Dana dikembalikan | **Ya** | Proses refund |
| `TIMEOUT` | Timeout kanal | Tidak | Panggil Check Status API lagi |
| `REDIRECT` | Menunggu verifikasi acquirer | Tidak | Tunggu notifikasi / panggil Check Status lagi |

### 8.4. `order.status` (fitur Check Status API untuk Checkout)

Tersedia untuk merchant yang terdaftar sejak Desember 2024 (hubungi support DOKU untuk mengaktifkan). Nilai: `ORDER_GENERATED`, `ORDER_EXPIRED`, `ORDER_RECOVERED`.

Dengan fitur ini, status order sudah bisa dilacak **sebelum** kanal menerbitkan status transaksi.

### 8.5. Contoh Implementasi di Laravel

```php
$targetPath = "/orders/v1/status/{$order->order_number}";

// Method GET -> tanpa Digest
$component = "Client-Id:{$clientId}\n".
             "Request-Id:{$requestId}\n".
             "Request-Timestamp:{$timestamp}\n".
             "Request-Target:{$targetPath}";

$signature = 'HMACSHA256='.base64_encode(
    hash_hmac('sha256', $component, $secretKey, true)
);

$response = Http::withHeaders([
    'Client-Id' => $clientId,
    'Request-Id' => $requestId,
    'Request-Timestamp' => $timestamp,
    'Signature' => $signature,
])->timeout(20)->get($baseUrl.$targetPath);

$status = $response->json('transaction.status');
```

---

## 9. Cancel Order API

Membatalkan pesanan Checkout yang **belum dibayar** sebelum URL checkout expired.

| Aspek | Keterangan |
|---|---|
| Kanal yang didukung | Bank Transfer (VA, kecuali BTN/BNC/BPD/OCBC) dan QRIS saja |
| Kanal tidak didukung | Convenience Store, Cards, e-Wallet, Direct Debit, Paylater, KKI, Digital Banking |
| Syarat | Pesanan **paid** atau **expired** **tidak bisa** dibatalkan |
| Aktivasi | Settings → **Checkout Appearance** → Tab **System Settings** → **Order Cancellation** |

> Endpoint persis untuk API ini tidak dipublikasikan di dokumentasi publik DOKU. Ambil dari tim support DOKU atau dashboard merchant sebelum mengimplementasikan.

---

## 10. Daftar Metode Pembayaran

Isi `payment.payment_method_types` dengan nilai berikut. **Kosongkan parameternya** untuk menampilkan semua kanal yang sudah diaktifkan di akun merchant.

### Virtual Account

| Metode | Nilai |
|---|---|
| BCA VA | `VIRTUAL_ACCOUNT_BCA` |
| Bank Mandiri VA | `VIRTUAL_ACCOUNT_BANK_MANDIRI` |
| Bank Syariah Indonesia VA | `VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI` |
| BRI VA | `VIRTUAL_ACCOUNT_BRI` |
| BNI VA | `VIRTUAL_ACCOUNT_BNI` |
| DOKU VA | `VIRTUAL_ACCOUNT_DOKU` |
| Permata VA | `VIRTUAL_ACCOUNT_BANK_PERMATA` |
| CIMB VA | `VIRTUAL_ACCOUNT_BANK_CIMB` |
| Danamon VA | `VIRTUAL_ACCOUNT_BANK_DANAMON` |
| BTN VA | `VIRTUAL_ACCOUNT_BTN` |
| BNC VA | `VIRTUAL_ACCOUNT_BNC` |
| BSS VA | `VIRTUAL_ACCOUNT_BSS` |
| BJB VA | `VIRTUAL_ACCOUNT_BJB` |
| Sinarmas VA | `VIRTUAL_ACCOUNT_SINARMAS` |

### Kartu & E-Wallet

| Metode | Nilai |
|---|---|
| Credit Card | `CREDIT_CARD` |
| Google Pay | `GOOGLE_PAY` |
| OVO | `EMONEY_OVO` |
| ShopeePay | `EMONEY_SHOPEEPAY` |
| DOKU Wallet | `EMONEY_DOKU` |
| LinkAja | `EMONEY_LINKAJA` |
| DANA | `EMONEY_DANA` |

### QRIS, Gerai, Paylater, dll.

| Metode | Nilai |
|---|---|
| QRIS | `QRIS` |
| Alfamart / Alfamidi / Dan+Dan | `ONLINE_TO_OFFLINE_ALFA` |
| Indomaret | `ONLINE_TO_OFFLINE_INDOMARET` |
| AKULAKU | `PEER_TO_PEER_AKULAKU` |
| KREDIVO | `PEER_TO_PEER_KREDIVO` |
| INDODANA | `PEER_TO_PEER_INDODANA` |
| Direct Debit BRI | `DIRECT_DEBIT_BRI` |
| Jenius Pay | `JENIUS_PAY` |
| Kartu Kredit Indonesia | `KARTU_KREDIT_INDONESIA` |

> Hanya kanal yang sudah diaktifkan di **Settings → Manage Payment Methods** yang tampil di halaman Checkout.

### 10.1. Daftar Kategori `line_items.category`

Diperlukan untuk kanal Paylater/Indodana. Nilai yang umum dipakai untuk toko elektronik:

| Kategori | Nilai |
|---|---|
| Elektronik & telekomunikasi | `electronics-and-telecom` |
| Ritel | `retail` |
| Toko offline | `offline-store` |
| Komputer & periferal | `electronics-and-telecom` |
| ATK / stationary | `business-to-business-including-mlm` |
| Layanan | `services` |

---

## 11. Kode Status & Error

### 11.1. HTTP Status

| HTTP | Arti | Tindakan |
|---|---|---|
| `200` | Berhasil | Proses response |
| `400` | Bad Request — format field salah / field wajib kosong | Perbaiki payload; baca `error_messages` |
| `401` | Unauthorized — Client-Id tidak dikenali atau Signature tidak valid | Cek kredensial & perhitungan signature |
| `403` | Forbidden — layanan tidak diaktifkan atau melebihi limit transaksi | Aktivasi layanan di Dashboard |
| `500` | Internal error DOKU | Log payload dan timestamp, coba lagi / hubungi support |

### 11.2. Case Code Umum (Non-SNAP)

| HTTP | Case Code | Pesan | Arti |
|---|---|---|---|
| `400XX` | `00` | Bad Request | Request gagal umum / parsing body gagal |
| `400XX` | `01` | Invalid Field Format `{field}` | Format field salah |
| `400XX` | `02` | Invalid Mandatory Field `{field}` | Field wajib kosong |
| `401XX` | `00` | Unauthorized `[reason]` | Client ID / API tidak valid |
| `401XX` | `01` | Invalid Token (B2B) | Token tidak ada / kedaluwarsa |
| `401XX` | `03` | Token Not Found (B2B) | Token tidak ditemukan di sistem |

> Error Credit Card memakai response code dari acquirer (ISO 8583), bukan case code di atas. `00` = approved, `05` = do not honor, `14` = invalid card number, `54` = expired card, `91` = issuer unavailable, dan seterusnya.

---

## 12. Pengujian di Sandbox

1. Login ke [DOKU Sandbox](https://sandbox.doku.com/bo/login).
2. Menu **Settings → Payment Settings → Simulator**.
3. Pilih metode pembayaran yang **sama persis** dengan yang dipilih saat checkout.
4. Klik **Simulate** — panduan simulasi per kanal akan tampil.
5. Status **HTTP Notification** bisa dipantau di **Settings → HTTP Notifications**, termasuk mengunduh payload mentah dan melakukan *Resend Notification*.

Ada juga demo Direct API resmi: `https://sandbox.doku.com/demo/direct-api`.

Checklist uji:

- [ ] Redirect ke halaman checkout berhasil dan menampilkan nominal yang benar.
- [ ] Webhook diterima, signature valid, `orders.payment_status` → `paid`.
- [ ] Notifikasi duplikat tidak menyebabkan mutasi ganda.
- [ ] Nominal pada `transaction.amount.value` dicocokkan dengan `orders.total_amount`.
- [ ] Pesanan expired kembali ke status unpaid dan stok dilepas.
- [ ] Halaman `callback_url_result` menampilkan status yang benar setelah pelanggan kembali.

---

## 13. Implementasi Referensi di Laravel

### 13.1. Routes

```php
// routes/web.php

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/checkout/buy-now', [CheckoutController::class, 'buyNow'])->name('checkout.buy-now');
    Route::post('/checkout/cart', [CheckoutController::class, 'processCart'])->name('checkout.cart');
    Route::get('/payment/result', [CheckoutController::class, 'result'])->name('payment.result');
});

// Webhook DOKU: tidak boleh berada di dalam middleware auth
Route::post('/api/webhooks/doku', [DokuNotificationController::class, 'handle'])
    ->name('doku.notification');
```

### 13.2. Pengecualian CSRF

Webhook DOKU tidak membawa token CSRF. Daftarkan di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'api/webhooks/*',
    ]);
})
```

---

### 13.3. Controller Webhook

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DokuNotificationController extends Controller
{
    /**
     * Terima notifikasi pembayaran dari DOKU.
     */
    public function handle(Request $request): JsonResponse
    {
        if (! $this->hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $payload = $request->json()->all();

        $order = Order::query()
            ->where('order_number', $payload['order']['invoice_number'] ?? '')
            ->first();

        if (! $order instanceof Order) {
            return response()->json(['message' => 'Order not found'], 200);
        }

        // Status FAILED pada DOKU Checkout belum final -> abaikan.
        if (($payload['transaction']['status'] ?? null) !== 'SUCCESS') {
            return response()->json(['message' => 'Ignored'], 200);
        }

        // Idempoten: sudah lunas, tidak ada mutasi ulang.
        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Already paid'], 200);
        }

        $order->forceFill([
            'payment_status' => 'paid',
            'status' => $order->fulfillment_type === 'pick_n_go'
                ? 'ready_for_pickup'
                : 'processing',
            'payment_method' => $payload['transaction']['payment_channel'] ?? $order->payment_method,
        ])->save();

        return response()->json(['message' => 'OK'], 200);
    }

    protected function hasValidSignature(Request $request): bool
    {
        $clientId = (string) $request->header('Client-Id');

        if ($clientId !== (string) config('services.doku.client_id')) {
            return false;
        }

        $component = "Client-Id:{$clientId}\n".
                     'Request-Id:'.(string) $request->header('Request-Id')."\n".
                     'Request-Timestamp:'.(string) $request->header('Request-Timestamp')."\n".
                     'Request-Target:/api/webhooks/doku\n'.
                     'Digest:'.base64_encode(hash('sha256', $request->getContent(), true));

        $expected = 'HMACSHA256='.base64_encode(
            hash_hmac('sha256', $component, (string) config('services.doku.secret_key'), true)
        );

        return hash_equals($expected, (string) $request->header('Signature'));
    }
}
```

### 13.4. Pitfall yang Perlu Diperhatikan

| Pitfall | Solusi |
|---|---|
| Signature gagal karena body JSON berbeda | Hash `$request->getContent()` (body mentah) |
| `Request-Target` salah | Gunakan **path Notification URL merchant**, bukan path DOKU |
| Timestamp ditolak | Format `gmdate('Y-m-d\TH:i:s\Z')`, bukan `now()->toDateTimeString()` |
| Webhook masuk tapi order tidak ketemu | `invoice_number` yang dikirim harus **persis sama** dengan `orders.order_number` |
| Notifikasi diproses 2x | Guard `payment_status === 'paid'` + opsional tabel `doku_notification_logs` |
| Digest tidak cocok | Encode JSON **sekali**, pakai variabel yang sama untuk hash dan request body |
| Stok terkunci selamanya | Jalankan scheduler untuk mengembalikan stok pesanan `unpaid` yang lewat `payment_due_date` |

---

## 14. Checklist Go-Live

- [ ] Account bisnis DOKU terverifikasi (KYB selesai).
- [ ] Kanal pembayaran yang diinginkan sudah diaktifkan di **Settings → Manage Payment Methods**.
- [ ] Notification URL terisi untuk **setiap** kanal yang dipakai.
- [ ] Notification URL untuk **Expired** juga diaktifkan.
- [ ] `DOKU_ENVIRONMENT=production` dan `APP_DEBUG=false` di server.
- [ ] `DOKU_CLIENT_ID` / `DOKU_SECRET_KEY` production terpasang di secret manager.
- [ ] Domain produksi terdaftar (fitur *Whitelist Domain* pada DOKU Checkout bisa diaktifkan).
- [ ] Alur pembayaran berhasil diuji penuh di sandbox (termasuk simulasi gagal & expired).
- [ ] Halaman hasil pembayaran (`callback_url_result`) menampilkan instruksi yang benar untuk Pick N Go dan Delivery.
- [ ] Reconciliation job terjadwal: panggil Check Status API untuk pesanan `unpaid` yang melewati batas waktu.

---

## 15. Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| `HTTP 400 order.amount must greater than 0` | Nominal 0, atau string berisi titik. Kirim integer murni tanpa pemisah ribuan |
| `HTTP 401 Unauthorized` | `Client-Id` salah, atau `DOKU_ENVIRONMENT` tidak cocok dengan kredensial |
| `HTTP 400 Invalid Signature` | Urutan baris string to sign, `Request-Target`, atau Digest tidak sesuai. Bandingkan dengan contoh di [§4.5](#45-implementasi-php-reusable) |
| Checkout error: `payment_method_types` tidak valid | Nilai kanal salah atau kanal belum diaktifkan di Dashboard |
| Webhook tidak pernah masuk | URL tidak bisa diakses publik / memakai ngrok / tidak dikonfigurasi per kanal |
| Notifikasi `FAILED` tapi pelanggan sebenarnya bayar | Wajib abaikan `FAILED` pada Checkout; tunggu `SUCCESS` atau Check Status API |
| `line_items` tidak cocok dengan `amount` | Jumlahkan `price x quantity` dan samakan dengan `order.amount` |

---

## 16. Referensi

| Topik | URL |
|---|---|
| Docs produk | `https://docs.doku.com/` |
| API Reference | `https://developers.doku.com/` |
| Backend Integration (create payment) | `https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration` |
| Frontend Integration | `https://developers.doku.com/accept-payments/doku-checkout/integration-guide/frontend-integration` |
| Supported Payment Methods | `https://developers.doku.com/accept-payments/doku-checkout/configuration/supported-payment-methods` |
| Order & Notification Handling | `https://developers.doku.com/accept-payments/doku-checkout/order-and-notification-handling` |
| Signature Component | `https://developers.doku.com/get-started-with-doku-api/signature-component` |
| HTTP Notification (best practice & retry) | `https://developers.doku.com/get-started-with-doku-api/notification` |
| Check Status API | `https://developers.doku.com/get-started-with-doku-api/check-status-api` |
| HTTP Status & Case Code | `https://developers.doku.com/get-started-with-doku-api/response-code/http-status-and-case-code` |
| Setup Notification URL (Dashboard) | `https://docs.doku.com/get-started/manage-business/set-up-integration/webhook-payment-notification` |
| Simulate Transactions | `https://docs.doku.com/get-started/manage-business/set-up-integration/simulate-transactions` |
| Dashboard | `https://dashboard.doku.com/bo/login` |
| Sandbox Dashboard | `https://sandbox.doku.com/bo/login` |
| Service Status | `https://status.doku.com` |
