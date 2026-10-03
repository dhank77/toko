# System Design Specification (SDS)
## System: MakassarNotebook (MKN) - Core Engine & Infrastructure

---

### 1. High-Level Architectural Overview

Sistem **MakassarNotebook (MKN)** dirancang menggunakan arsitektur **Monolith Modern & Terstruktur** berbasis **Laravel 12 (PHP 8.3+)** dan **Inertia.js v3 + React 19 (TypeScript)**. 

Pilihan arsitektur ini memberikan kecepatan pengembangan dan integritas data monolitik (ACID transactions untuk transaksi inventaris multi-cabang) dengan tetap menyajikan antarmuka pengguna secepat aplikasi Single Page Application (SPA).

```
+--------------------------------------------------------------------------+
|                  Client Layer (Browser / Mobile Web)                     |
|        React 19 + TypeScript + Inertia.js v3 + Tailwind CSS v4           |
|         (Wayfinder Generated Action Endpoints: @/actions/...)            |
+--------------------------------------------------------------------------+
                                    ▲
                                    │ Inertia Protocol / JSON Payloads
                                    ▼
+--------------------------------------------------------------------------+
|                       Application Layer (Laravel 12)                     |
|  +--------------------+  +----------------------+  +------------------+  |
|  |   Web Controllers  |  |   Domain Services    |  | Fortify Security |  |
|  |  (Inertia Render)  |  | (Inventory, Checkout)|  |  (Auth, 2FA)     |  |
|  +--------------------+  +----------------------+  +------------------+  |
|  +--------------------+  +----------------------+  +------------------+  |
|  |   Queue Workers    |  |  Pessimistic Locks   |  | Webhook Handlers |  |
|  |  (Horizon / Redis) |  |   (Stock Mutex)      |  |  (Payment Gate)  |  |
|  +--------------------+  +----------------------+  +------------------+  |
+--------------------------------------------------------------------------+
                                    ▲
                                    │ Eloquent ORM / Query Builder
                                    ▼
+--------------------------------------------------------------------------+
|                       Persistence & Cache Layer                          |
|  +---------------------------------------+  +-------------------------+  |
|  |          MySQL 8 (InnoDB, ACID)       |  |     Redis 7 / Memory    |  |
|  | (Users, Products, Stocks, Orders, RMA)|  | (Cache, Session, Locks) |  |
|  +---------------------------------------+  +-------------------------+  |
+--------------------------------------------------------------------------+
```

---

### 2. Technology Stack & Tooling

| Komponen | Pilihan Teknologi | Versi / Spesifikasi | Catatan Implementasi |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Laravel | v12.x / PHP 8.3+ | Routing, Eloquent ORM, Queues, Security |
| **Authentication** | Laravel Fortify | v1.37+ | Multi-role auth, 2FA, Passkeys, Session guard |
| **Frontend Framework** | React | v19.x (TypeScript) | Komponen UI interaktif, Hooks, Server-Ready |
| **SPA Bridge** | Inertia.js | v3.x (`@inertiajs/react`) | Navigasi SPA, Deferred props, Layout props |
| **Type-Safe Routing**| Laravel Wayfinder | v0.1+ (`@/actions/...`) | Kode TypeScript otomatis dari rute Laravel |
| **Styling & Design** | Tailwind CSS | v4.x (`@tailwindcss/vite`)| Utility-first, tema warna kustom Navy & Orange |
| **Komponen UI** | Radix UI & Lucide | Radix Primitives + Lucide | Aksesibilitas modal, dropdown, tabs, icon |
| **Relational Database**| MySQL | v8.0+ (InnoDB) | Transaksi ACID, row-level locks, foreign keys |
| **Caching & Queues** | Redis / Database | Redis 7+ | Session, stock locks, antrean notifikasi |
| **Payment Gateway** | Doku / Midtrans / Xendit | REST API + Webhooks | QRIS, Virtual Account, e-Wallet, Kartu Kredit |
| **Testing Engine** | Pest PHP | v5.x | Unit & Feature tests terintegrasi |

---

### 3. Detailed Database Schema Design (MySQL 8)

#### 3.1. Entity Relationship Overview
- `branches` memiliki banyak `branch_inventories` dan `orders` (Pick N Go).
- `products` terhubung ke `categories`, `brands`, `product_images`, `product_specifications`, dan `branch_inventories`.
- `branch_inventories` menghubungkan `products` dan `branches` dengan pasangan unik (`product_id`, `branch_id`).
- `orders` memiliki banyak `order_items` dan satu `payments`.
- `users` dapat berperan sebagai `customer`, `dropshipper`, `branch_staff`, atau `super_admin`.

#### 3.2. Table Specifications & Columns

```sql
-- 1. Cabang Toko & Gudang Fisik
CREATE TABLE branches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,          -- Contoh: 'MKN-PNK' (Panakkukang), 'MKN-PTR' (Pettarani)
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL DEFAULT 'Makassar',
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    phone VARCHAR(30) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL DEFAULT '09:00 - 21:00 WITA',
    is_warehouse BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE jika CDC (Central Distribution Center)
    is_pickup_active BOOLEAN NOT NULL DEFAULT TRUE, -- Tersedia untuk Pick N Go
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 2. Kategori Produk Hierarkis
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Merek (Brands)
CREATE TABLE brands (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 4. Master Produk
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,            -- Contoh: 'MKN-7RTH14BK'
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id BIGINT UNSIGNED NOT NULL,
    brand_id BIGINT UNSIGNED NULL,
    base_price DECIMAL(14, 2) NOT NULL,         -- Harga normal retail
    dropship_price DECIMAL(14, 2) NOT NULL,     -- Harga khusus dropshipper
    weight_grams INT UNSIGNED NOT NULL DEFAULT 100,
    length_cm INT UNSIGNED NULL,
    width_cm INT UNSIGNED NULL,
    height_cm INT UNSIGNED NULL,
    warranty_type ENUM('toko', 'distributor_resmi', 'non_garansi') NOT NULL DEFAULT 'toko',
    warranty_duration VARCHAR(50) NOT NULL DEFAULT '1 Bulan', -- Contoh: '7 Hari', '1 Bulan', '1 Tahun'
    description LONGTEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_products_sku (sku),
    INDEX idx_products_slug (slug),
    INDEX idx_products_category (category_id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

-- 5. Spesifikasi Teknis Produk (Key-Value)
CREATE TABLE product_specifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    spec_key VARCHAR(100) NOT NULL,             -- Contoh: 'Daya Output', 'Kapasitas Baterai', 'Material'
    spec_value TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Galeri Gambar Produk
CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. Inventaris Multi-Cabang (Crucial for Pick N Go)
CREATE TABLE branch_inventories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,      -- Stok fisik tersedia
    reserved_quantity INT NOT NULL DEFAULT 0,   -- Stok terkunci dalam proses checkout
    aisle_bin_location VARCHAR(50) NULL,        -- Lokasi rak toko, contoh: 'RAK-A3-02'
    min_stock_alert INT NOT NULL DEFAULT 2,     -- Ambang batas restock
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uq_branch_product (branch_id, product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 8. Kampanye Flash Sale
CREATE TABLE flash_sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 9. Item Promo Flash Sale
CREATE TABLE flash_sale_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    flash_sale_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    promo_price DECIMAL(14, 2) NOT NULL,
    total_quota INT NOT NULL DEFAULT 50,
    sold_quantity INT NOT NULL DEFAULT 0,
    max_qty_per_user INT NOT NULL DEFAULT 1,
    FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 10. Master Pesanan (Orders)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,   -- Contoh: 'MKN-20260926-00129'
    user_id BIGINT UNSIGNED NOT NULL,
    order_type ENUM('pickup', 'delivery') NOT NULL, -- 'pickup' = Pick N Go, 'delivery' = Kurir
    pickup_branch_id BIGINT UNSIGNED NULL,      -- Cabang pengambilan jika Pick N Go
    pickup_code VARCHAR(10) NULL,               -- 6 digit PIN verifikasi pengambilan
    pickup_qr_token VARCHAR(64) NULL,           -- Token QR unik untuk di-scan kasir
    pickup_name VARCHAR(100) NULL,              -- Nama orang yang mengambil
    pickup_phone VARCHAR(30) NULL,              -- No HP pengambil
    status ENUM(
        'pending_payment',
        'paid',
        'processing',
        'ready_for_pickup',
        'shipped',
        'completed',
        'cancelled',
        'expired'
    ) NOT NULL DEFAULT 'pending_payment',
    payment_status ENUM('unpaid', 'paid', 'refunded', 'expired') NOT NULL DEFAULT 'unpaid',
    payment_method VARCHAR(50) NULL,            -- 'qris', 'bca_va', 'mandiri_va', 'cash_in_store'
    
    -- Delivery info (jika order_type = 'delivery')
    shipping_recipient_name VARCHAR(100) NULL,
    shipping_recipient_phone VARCHAR(30) NULL,
    shipping_address TEXT NULL,
    shipping_courier VARCHAR(50) NULL,          -- 'grab_instant', 'jne_reg', 'jnt'
    shipping_tracking_number VARCHAR(100) NULL, -- Nomor resi
    shipping_cost DECIMAL(14, 2) NOT NULL DEFAULT 0,
    
    -- Dropship Flag & Custom Sender Label
    is_dropship BOOLEAN NOT NULL DEFAULT FALSE,
    dropship_sender_name VARCHAR(100) NULL,     -- Nama toko online dropshipper
    dropship_sender_phone VARCHAR(30) NULL,
    
    subtotal_amount DECIMAL(14, 2) NOT NULL,
    discount_amount DECIMAL(14, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(14, 2) NOT NULL,
    
    reservation_expires_at DATETIME NULL,       -- Batas waktu pembayaran/penguncian stok
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_pickup_branch (pickup_branch_id),
    INDEX idx_orders_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pickup_branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- 11. Item Rincian Pesanan
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    branch_id BIGINT UNSIGNED NOT NULL,         -- Sumber stok cabang barang dikeluarkan
    quantity INT NOT NULL,
    unit_price DECIMAL(14, 2) NOT NULL,
    subtotal DECIMAL(14, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 12. Transaksi Pembayaran (Payment Gateway Record)
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE, -- ID dari Payment Gateway
    gateway VARCHAR(30) NOT NULL,                       -- 'doku', 'midtrans', 'xendit'
    payment_channel VARCHAR(50) NOT NULL,               -- 'qris', 'va_bca', 'credit_card'
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

-- 13. Dompet Saldo Dropshipper (Deposit Wallet)
CREATE TABLE dropshipper_wallets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    balance DECIMAL(14, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Tiket Layanan Purna Jual & Garansi (RMA)
CREATE TABLE rma_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(40) NOT NULL UNIQUE, -- Contoh: 'RMA-2026-0041'
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    branch_id BIGINT UNSIGNED NULL,            -- Cabang tempat penyerahan unit jika offline
    status ENUM('submitted', 'received_at_store', 'inspecting', 'approved_replacement', 'rejected', 'completed') NOT NULL DEFAULT 'submitted',
    issue_description TEXT NOT NULL,
    evidence_url VARCHAR(255) NULL,
    technician_notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

### 4. Concurrency, Race Condition, & Stock Reservation Strategy

Salah satu titik paling rawan dalam sistem e-commerce seperti MakassarNotebook (diadaptasi dari model referensi JakartaNotebook) adalah persaingan pembelian pada saat **Flash Sale** dan stok terakhir di toko cabang fisik.

#### 4.1. Two-Phase Stock Reservation
1. **Fase 1: Checkout Reservation (Kunci Sementara)**
   - Saat pengguna menekan `Proses Pesanan`, sistem mengeksekusi transaksi database menggunakan `lockForUpdate()` pada tabel `branch_inventories`:
   ```php
   DB::transaction(function () use ($branchId, $items, $order) {
       foreach ($items as $item) {
           $inventory = BranchInventory::where('branch_id', $branchId)
               ->where('product_id', $item->product_id)
               ->lockForUpdate()
               ->firstOrFail();

           if (($inventory->stock_quantity - $inventory->reserved_quantity) < $item->quantity) {
               throw new OutOfStockException("Stok produk {$item->product->name} tidak mencukupi.");
           }

           // Naikkan reserved_quantity
           $inventory->increment('reserved_quantity', $item->quantity);
       }
       // Set batas kedaluwarsa pesanan (misal: 15 menit)
       $order->update(['reservation_expires_at' => now()->addMinutes(15)]);
   });
   ```

2. **Fase 2: Settlement / Completion (Pengurangan Permanen)**
   - Saat webhook pembayaran menerima notifikasi sukses:
     - `stock_quantity = stock_quantity - reserved_quantity`
     - `reserved_quantity = reserved_quantity - item.quantity`
     - Status pesanan berubah menjadi `paid` (atau `ready_for_pickup` jika barang sudah disiapkan di rak toko).

3. **Pelepasan Otomatis Pesanan Kedaluwarsa (Expired Order Cleanup Job)**
   - Scheduler cron Laravel berjalan setiap 1 menit memanggil Job `ReleaseExpiredOrderReservations`:
   ```php
   $expiredOrders = Order::where('status', 'pending_payment')
       ->where('reservation_expires_at', '<', now())
       ->get();

   foreach ($expiredOrders as $order) {
       DB::transaction(function () use ($order) {
           foreach ($order->items as $item) {
               BranchInventory::where('branch_id', $item->branch_id)
                   ->where('product_id', $item->product_id)
                   ->decrement('reserved_quantity', $item->quantity);
           }
           $order->update(['status' => 'expired', 'payment_status' => 'expired']);
       });
   }
   ```

---

### 5. API & Routing Architecture (Wayfinder & Inertia)

Aplikasi memanfaatkan **Laravel Wayfinder** untuk mengekspos pemanggilan rute PHP yang _type-safe_ langsung ke frontend React di bawah `@/actions/` atau `@/routes/`.

#### Struktur Kontroller Utama (`app/Http/Controllers/`):
1. **`Web/CatalogController.php`**
   - `index()`: Merender halaman beranda dengan Flash Sale aktif, kategori unggulan, dan promo.
   - `category(Category $category)`: Halaman daftar produk kategori dengan filter & pagination.
   - `show(Product $product)`: Halaman PDP dengan data spesifikasi dan matriks stok cabang `branch_inventories`.
2. **`Web/BranchController.php`**
   - `setActiveBranch(Request $request)`: Mengubah toko aktif pengguna dalam session.
   - `checkStock(Product $product)`: Memberikan data stok real-time per cabang via Inertia partial reload.
3. **`Web/CartController.php`**
   - `index()`, `add()`, `update()`, `remove()`: Manajemen keranjang belanja dengan validasi konflik multi-cabang.
4. **`Web/CheckoutController.php`**
   - `index()`: Formulir checkout (pemilihan mode Pick N Go vs Delivery, identitas dropship).
   - `store()`: Pembuatan pesanan, penguncian stok (`lockForUpdate`), dan inisiasi sesi payment gateway.
5. **`Web/PickNGoController.php`** (Khusus Staf Toko & Kasir)
   - `verifyPin(Request $request)`: Verifikasi 6-digit PIN atau scan QR code dari pelanggan di toko.
   - `handoverOrder(Order $order)`: Konfirmasi barang telah diserahkan, ubah status ke `completed`.
6. **`Web/DropshipController.php`**
   - `dashboard()`: Ringkasan pesanan dropship, label pengiriman, riwayat saldo.
   - `topupWallet()`: Pengisian saldo deposit dropshipper.
7. **`Api/PaymentWebhookController.php`**
   - `handleDoku(Request $request)`: Menerima callback dari gateway pembayaran dengan validasi tanda tangan HMAC-SHA256 untuk memproses konfirmasi pembayaran secara asinkron dan idempoten.

---

### 6. Design System & UI/UX Specifications

#### 6.1. Visual Palette (MakassarNotebook Aesthetics, diadaptasi dari referensi JakartaNotebook)
- **Primary Navy:** `#0B3B60` (Warna utama header, tombol aksi netral, sidebar aktif)
- **Primary Dark Slate:** `#07263F` (Background footer dan panel atas kontras tinggi)
- **Action Orange:** `#FF6B00` (Warna aksen tombol `Beli Sekarang`, badge `Flash Sale`, harga diskon)
- **Action Orange Hover:** `#E05D00`
- **Success Green:** `#10B981` (Indikator stok cabang tersedia `Tersedia di Toko`)
- **Warning Amber:** `#F59E0B` (Indikator stok sisa sedikit `Sisa < 3`)
- **Danger Red:** `#EF4444` (Indikator stok kosong / countdown timer berakhir)
- **Surface Background:** `#F8FAFC` (Latar belakang sejuk untuk keterbacaan data padat)

#### 6.2. Kepadatan Informasi (Density Guidelines)
- Padding kartu produk kompak (`p-2.5` hingga `p-3`).
- Ukuran font teks harga tegas dan kontras (`font-bold text-orange-600`).
- Badge status cabang berbentuk pill ringkas dengan titik status warna (`w-2 h-2 rounded-full`).
- Tombol aksi mobile mengambang di bawah (*Sticky Bottom Bar*) saat membuka halaman produk untuk memudahkan checkout cepat satu tangan.
