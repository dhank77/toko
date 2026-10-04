# Rencana Integrasi Payment Gateway DOKU — MakassarNotebook

Dokumen ini merangkum rencana arsitektur dan langkah implementasi teknis untuk mengintegrasikan gateway pembayaran **DOKU Checkout (Jokul)** pada fitur **Keranjang Belanja (Cart)** dan **Beli Sekarang (Buy Now)** di MakassarNotebook.

---

## 1. Ringkasan Eksekutif & Alur Transaksi

MakassarNotebook melayani dua model pemenuhan pesanan (*fulfillment*):
1. **Pick N Go (Ambil di Toko Cabang)**: Pelanggan memesan secara online, membayar via DOKU, dan saat pembayaran berhasil, sistem secara otomatis menerbitkan **6-digit PIN Loker** dan menetapkan **Rak Pengambilan** (misal: `Rak B-02` di Cabang Panakkukang/Pettarani).
2. **Delivery (Pengiriman Ekspedisi)**: Pelanggan membayar total pesanan (subtotal produk + ongkos kirim hasil hitung RajaOngkir), lalu pesanan masuk ke antrean pengemasan (*processing*).

Integrasi DOKU dilakukan melalui **DOKU Checkout Hosted Page**, di mana pelanggan dialihkan ke halaman pembayaran aman yang mendukung berbagai kanal pembayaran lokal (QRIS, Virtual Account BCA/Mandiri/BRI/BNI/Permata, Kartu Kredit/Debit, OVO, ShopeePay, DANA, dan Gerai Minimarket).

### Alur Diagram Transaksi
```text
[Halaman Detail Produk] ---> [Tombol Beli Sekarang] -----\
                                                           +---> [CheckoutController] ---> [Order: pending]
[Halaman Keranjang]     ---> [Tombol Lanjut Pembayaran] -/             |
                                                                       v
                                                             [DokuService::createCheckout]
                                                                       |
                                                                       v
                                                           [Request DOKU Checkout API]
                                                            (HMAC-SHA256 Signature)
                                                                       |
                                                                       v
                                                              [Redirect ke DOKU URL]
                                                                       |
                                                                       v
                                                            [Pelanggan Membayar]
                                                                       |
                                                                       v
                                                             [Webhook DOKU Callback]
                                                                       |
                                                                       v
                                                       [Update Order: paid & PIN Pick N Go]
```

---

## 2. Spesifikasi API DOKU Checkout (Jokul)

### 2.1. Lingkungan & Endpoint
- **Sandbox Base URL**: `https://api-sandbox.doku.com`
- **Production Base URL**: `https://api.doku.com`
- **Checkout Endpoint**: `POST /checkout/v1/payment`
- **Checkout URL Pelanggan**: didapat dari nilai atribut response `response.payment.url`

### 2.2. Autentikasi & Header Keamanan
Setiap request ke API DOKU wajib menyertakan header keamanan berikut:

| Header | Tipe | Penjelasan |
|---|---|---|
| `Client-Id` | String | Merchant Client ID dari DOKU Dashboard |
| `Request-Id` | UUID | Identifier unik request (contoh: `Str::uuid()`) |
| `Request-Timestamp` | String (ISO-8601 UTC) | Waktu request dalam UTC (`gmdate('Y-m-d\TH:i:s\Z')`) |
| `Digest` | String (Base64) | Hash SHA-256 dari JSON request body: `base64_encode(hash('sha256', $rawBody, true))` |
| `Signature` | String (HMAC-SHA256) | Tanda tangan digital yang dihitung menggunakan Secret Key DOKU |

#### Komponen String To Sign:
```text
Client-Id:{Client-Id}\n
Request-Id:{Request-Id}\n
Request-Timestamp:{Request-Timestamp}\n
Request-Target:{Request-Target}\n
Digest:{Digest}
```
*Catatan: `Request-Target` adalah path URI beserta query param (contoh: `/checkout/v1/payment`).*

### 2.3. Contoh Payload Request (`POST /checkout/v1/payment`)
```json
{
  "order": {
    "invoice_number": "MKN-20261004-9821",
    "amount": 350000,
    "currency": "IDR",
    "callback_url": "https://makassarnotebook.com/client?tab=orders",
    "auto_redirect_url": "https://makassarnotebook.com/client?tab=orders&status=success",
    "line_items": [
      {
        "name": "Keyboard Mechanical RGB Wireless",
        "price": 350000,
        "quantity": 1
      }
    ]
  },
  "payment": {
    "payment_due_date": 60
  },
  "customer": {
    "id": "12",
    "name": "Hamdani Latjoro",
    "email": "customer@example.com",
    "phone": "08123456789",
    "address": "Jl. Boulevard No. 10, Panakkukang, Makassar"
  }
}
```

### 2.4. Contoh Respons Sukses dari DOKU
```json
{
  "response": {
    "order": {
      "invoice_number": "MKN-20261004-9821"
    },
    "payment": {
      "url": "https://checkout-sandbox.doku.com/orders/v1/xxxxxx",
      "token_id": "xxxxxx"
    }
  }
}
```

---

## 3. Webhook / Notification Callback

DOKU akan mengirimkan HTTP POST secara asinkron ke server MakassarNotebook saat status pembayaran pelanggan berubah (misal: pembayaran selesai di ATM/Mobile Banking/QRIS).

- **URL Callback Webhook**: `POST /api/webhooks/doku`
- **Pengecualian CSRF**: Tambahkan URI `/api/webhooks/*` ke opsi pengecualian middleware CSRF di `bootstrap/app.php`.
- **Validasi Keamanan Webhook**:
  1. Verifikasi header `Signature` dari payload callback menggunakan Secret Key DOKU.
  2. Pengecekan idempotensi: Jika pesanan sudah berstatus `paid`, respon dengan HTTP `200 OK` tanpa mengeksekusi mutasi ulang.
- **Tindakan Pasca-Bayar**:
  - Ubah `orders.payment_status` = `'paid'`.
  - Jika `orders.fulfillment_type === 'pick_n_go'`:
    - Generate `pickup_pin` 6-digit acak (contoh: `381-904`).
    - Tetapkan loker rak toko (contoh: `Rak B-02`).
    - Ubah `orders.status` = `'ready_for_pickup'`.
  - Jika `orders.fulfillment_type === 'delivery'`:
    - Ubah `orders.status` = `'processing'`.
  - Update atau buat catatan di tabel `payments`.

---

## 4. Perubahan Database & Model

### 4.1. Tabel `payments` (Sesuai `rules/SDS.md`)
Buat migration `create_payments_table`:
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE, -- Invoice DOKU
    gateway VARCHAR(30) NOT NULL DEFAULT 'doku',
    payment_channel VARCHAR(50) NULL,                   -- qris, va_bca, dll.
    amount DECIMAL(14, 2) NOT NULL,
    status ENUM('pending', 'success', 'failed', 'expired') NOT NULL DEFAULT 'pending',
    payment_url TEXT NULL,
    va_number VARCHAR(50) NULL,
    raw_payload JSON NULL,
    paid_at DATETIME NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 4.2. Penyesuaian Kolom Tabel `orders`
Pastikan kolom berikut tersedia pada tabel `orders`:
- `payment_status`: ENUM/VARCHAR (`unpaid`, `paid`, `expired`, `failed`)
- `payment_url`: TEXT NULL (menyimpan link DOKU Checkout agar pelanggan bisa klik ulang jika belum sempat membayar)
- `doku_invoice_number`: VARCHAR(100) NULL INDEX

---

## 5. Konfigurasi Sistem (`.env` & `config/services.php`)

### Di file `.env`:
```env
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_ENVIRONMENT=sandbox
```

### Di file `config/services.php`:
```php
'doku' => [
    'client_id' => env('DOKU_CLIENT_ID'),
    'secret_key' => env('DOKU_SECRET_KEY'),
    'environment' => env('DOKU_ENVIRONMENT', 'sandbox'),
    'base_url' => env('DOKU_ENVIRONMENT') === 'production'
        ? 'https://api.doku.com'
        : 'https://api-sandbox.doku.com',
],
```

---

## 6. Modifikasi Kontroller & Alur Frontend

### 6.1. Halaman Detail Produk (`ProductDetailController.php` & `show.tsx`)
- **Masalah Saat Ini**: Tombol **Beli Sekarang** di baris 412 `resources/js/pages/products/show.tsx` hanya memicu notifikasi toast statis: `triggerToast('Mengarahkan ke pembayaran...')`.
- **Rencana Solusi**:
  1. Tambahkan endpoint `POST /checkout/buy-now`.
  2. Saat tombol diklik:
     - Jika pengguna belum login, arahkan ke login dengan pengembalian URL (*intended location*).
     - Jika sudah login, kirim `product_id`, `quantity`, dan `branch` yang dipilih.
     - Controller membuat `Order` instan untuk produk tersebut, memanggil `DokuService::createCheckout()`, dan merespon dengan `payment_url`.
     - Frontend melakukan navigasi / pembukaan URL pembayaran DOKU: `window.location.href = response.payment_url`.

### 6.2. Halaman Keranjang Belanja (`ClientPortalController.php` & `client/index.tsx`)
- **Masalah Saat Ini**: Tombol **"Lanjut ke Pembayaran Pick N Go"** di baris 1238 `resources/js/pages/client/index.tsx` hanya menjalankan toast notifikasi.
- **Rencana Solusi**:
  1. Buat endpoint `POST /checkout/process-cart`.
  2. Menerima data:
     - `fulfillment_type`: `'pick_n_go'` atau `'delivery'`.
     - `branch`: Cabang toko yang dipilih jika Pick N Go (contoh: Panakkukang, Pettarani, Maricaya).
     - Data kurir pengiriman jika delivery (ongkir RajaOngkir).
  3. Controller merangkum semua item di tabel `cart_items` milik user:
     - Hitung total amount.
     - Buat `Order` dan relasi `OrderItems`.
     - Kosongkan keranjang belanja (`cart_items` dihapus).
     - Panggil `DokuService::createCheckout()`.
     - Redirect pelanggan ke `payment_url` DOKU.

### 6.3. Tab Riwayat Pesanan (`client/index.tsx` - Tab Orders)
- Tambahkan tombol aksi **"Bayar Sekarang"** untuk pesanan yang masih berstatus `unpaid` / `pending_payment` menggunakan tautan `order.payment_url`.
- Tambahkan status visual yang jelas:
  - `Menunggu Pembayaran` (Kuning)
  - `Siap Diambil di Loker` (Hijau dengan PIN dan nama rak jika Pick N Go)
  - `Sedang Dikemas / Dikirim` (Biru jika Delivery)

---

## 7. Tahapan Eksekusi Bertahap

| Tahap | Aktivitas | File Terkait |
|---|---|---|
| **Langkah 1** | Buat migration tabel `payments` dan update schema `orders` | `database/migrations/*` |
| **Langkah 2** | Tambahkan konfigurasi DOKU di `config/services.php` & `.env.example` | `config/services.php`, `.env` |
| **Langkah 3** | Buat service backend `App\Services\Payment\DokuService` | `app/Services/Payment/DokuService.php` |
| **Langkah 4** | Buat `CheckoutController` untuk Cart & Buy Now | `app/Http/Controllers/CheckoutController.php` |
| **Langkah 5** | Buat `PaymentWebhookController` & kecualikan dari CSRF | `app/Http/Controllers/Api/PaymentWebhookController.php`, `bootstrap/app.php` |
| **Langkah 6** | Hubungkan tombol **Beli Sekarang** di PDP | `resources/js/pages/products/show.tsx` |
| **Langkah 7** | Hubungkan tombol checkout di keranjang belanja | `resources/js/pages/client/index.tsx` |
| **Langkah 8** | Pengujian unit & alur simulasi checkout DOKU | `tests/Feature/CheckoutDokuTest.php` |
