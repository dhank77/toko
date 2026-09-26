# Product Requirements Document (PRD)
## Product: MakassarNotebook (MKN) - Web Application & Omnichannel System

---

### 1. Product Vision & Design Principles

**MakassarNotebook (MKN)** menghadirkan pengalaman belanja e-commerce yang instan, efisien, dan padat informasi bagi konsumen dan pebisnis di Makassar dan Indonesia Timur. Sistem mereplikasi keunggulan fungsional **JakartaNotebook** dengan menggabungkan kecepatan Single Page Application (SPA), akurasi stok multi-cabang, dan fleksibilitas pemenuhan pesanan (Pick N Go & Delivery).

#### Core Design Principles
1. **High Information Density (Kepadatan Informasi Terorganisir):**
   - Menghindari ruang kosong berlebih. Tampilan produk menampilkan informasi penting secara ringkas: Foto produk, Nama, Brand, SKU, Harga Coret, Harga Bersaing, Status Garansi, dan Ringkasan Stok per Cabang Toko.
2. **Instant & Seamless SPA Experience:**
   - Navigasi antar halaman kategori, filter, pencarian, dan keranjang belanja berjalan mulus tanpa muat ulang halaman (_full-page reload_), memanfaatkan Inertia.js v3 dengan _deferred props_ dan _prefetching_.
3. **Omnichannel First:**
   - Opsi pengambilan di toko fisik (**Pick N Go**) diposisikan sebagai fitur utama setara dengan opsi pengiriman kurir.
4. **Reseller-Ready:**
   - Tata letak dan alur transaksi mempermudah dropshipper memesan secara kilat dengan label pengirim kustom.

---

### 2. User Roles & Permissions Matrix

| Fitur / Modul | Guest (Tamu) | Customer Reguler | Dropshipper / Reseller | Staff Toko / Kasir Cabang | Super Admin / Manajemen |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Jelajah Katalog & Cari Produk | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cek Stok Real-Time per Toko | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkout Pick N Go & Kurir | ❌ (Wajib Login) | ✅ | ✅ | ❌ | ❌ |
| Harga Khusus & Diskon Grosir | ❌ | ❌ | ✅ | ❌ | ✅ |
| Fitur Label Pengirim Kustom (Dropship) | ❌ | ❌ | ✅ | ❌ | ❌ |
| Top-up & Transaksi via Saldo Deposit | ❌ | ❌ | ✅ | ❌ | ❌ |
| Scan QR / Validasi PIN Pick N Go | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pengaturan Stok Toko Fisik | ❌ | ❌ | ❌ | ✅ (Cabang Sendiri) | ✅ (Semua Cabang) |
| Manajemen Flash Sale & Banner | ❌ | ❌ | ❌ | ❌ | ✅ |
| Laporan Transaksi & Keuangan | ❌ | ❌ | ❌ | ❌ | ✅ |

---

### 3. Detailed Functional Modules & Requirements

#### 3.1. Header & Branch Selector Module
- **Fungsi:** Komponen persisten pada navigasi atas untuk memilih toko aktif pembeli.
- **Kebutuhan Teknis:**
  - Menampilkan dropdown daftar cabang fisik MakassarNotebook:
    - *Cabang Panakkukang* (Mall Panakkukang / Pengayoman)
    - *Cabang Pettarani* (AP Pettarani Business District)
    - *Cabang Tamalanrea / Perintis* (Dekat Kampus UNHAS)
    - *Cabang Gowa / Sultan Hasanuddin*
    - *Semua Cabang (Mode Pengiriman Online / Delivery)*
  - Menampilkan status operasional cabang secara dinamis: `Buka (09:00 - 21:00 WITA)` atau `Tutup`.
  - Pilihan cabang tersimpan pada _client session/local storage_ dan menentukan prioritas stok yang ditampilkan di seluruh katalog.

#### 3.2. Product Catalog, Filtering, & Search Engine
- **Tampilan Grid & List:** Pilihan beralih antara tampilan grid gambar produk atau daftar tabel padat informasi teknis.
- **Kartu Produk (Product Card Components):**
  - Foto produk resolusi tinggi dengan rasio 1:1.
  - Lencana promosi: `Flash Sale`, `Diskon %`, `Best Seller`, `Garansi Toko 1 Bulan`.
  - Judul produk, merek (Brand), dan kode unik SKU (contoh: `MKN-7RTH14BK`).
  - Harga retail (dan harga khusus dropshipper jika login sebagai mitra).
  - Mini-indikator stok per cabang (titik hijau = tersedia, titik kuning = sisa sedikit, titik abu-abu = habis).
  - Tombol aksi cepat: `+ Keranjang` dan `Beli Sekarang`.
- **Filter Multi-Faset:**
  - Filter ketersediaan cabang (hanya tampilkan barang yang siap di toko X).
  - Filter rentang harga (slider minimum - maksimum).
  - Filter merek (Baseus, Orico, Remax, Taffware, Xiaomi, dll).
  - Filter rating ulasan dan jenis garansi.
- **Pencarian Cerdas (Live Search):**
  - Autocomplete saran kata kunci, nama produk, kategori, dan pencarian langsung berdasarkan SKU.

#### 3.3. Product Detail Page (PDP)
- **Galeri Gambar & Video:** Gambar multi-sudut, zoom detail, serta embed video review produk (YouTube/TikTok showcase).
- **Tabel Ketersediaan Stok Multi-Cabang:**
  - Menampilkan tabel komprehensif berisi seluruh cabang MakassarNotebook.
  - Kolom: Nama Cabang, Alamat Ringkas, Status Ketersediaan (`Tersedia >10`, `Sisa 3 unit`, `Kosong`), dan Jam Operasional.
  - Tombol `Pilih untuk Pick N Go di Cabang Ini`.
- **Rincian Spesifikasi & Kelengkapan Produk:**
  - Tabel spesifikasi mendalam (dimensi, berat, voltase, kompatibilitas, isi kotak/kemasan).
- **Tab Kebijakan Garansi & Ulasan:**
  - Rincian syarat klaim garansi toko (tukar baru jika cacat produksi).
  - Komentar pembeli terverifikasi dengan foto asli.

#### 3.4. Flash Sale & Countdown Promotion Engine
- **Banner & Jadwal Sesi:**
  - Tampilan sesi aktif: `Sedang Berlangsung` vs `Akan Datang`.
  - Jam hitung mundur presisi `[ Jam : Menit : Detik ]`.
- **Indikator Kuota Terjual:**
  - Progress bar dinamis (misal: "Terjual 85% - Sisa 3 Unit").
- **Proteksi Transaksi Flash Sale:**
  - Pembatasan maksimal 1 unit per pesanan untuk barang berlabel Flash Sale.
  - Reservasi stok sementara (10 menit batas pembayaran); jika tidak diselesaikan, stok otomatis dilepaskan kembali ke publik.

#### 3.5. Shopping Cart & Multi-Branch Conflict Engine
- Memungkinkan penambahan beberapa produk ke keranjang.
- **Validasi Ketersediaan Cabang:**
  - Jika pelanggan memilih mode **Pick N Go**: Keranjang memvalidasi apakah seluruh barang dalam keranjang tersedia di cabang yang sama.
  - Jika ada barang yang tidak tersedia di cabang terpilih, sistem memberikan opsi jelas:
    1. Ganti cabang pengambilan yang memiliki semua barang lengkap, atau
    2. Pisahkan pesanan menjadi 2 cabang berbeda, atau
    3. Alihkan ke metode pengiriman ekspedisi (Delivery dari Gudang Pusat).
- Perhitungan subtotal, kalkulasi berat total barang (gram/kg).

#### 3.6. Omnichannel Checkout Flow

##### Alur A: Pick N Go (Ambil di Toko Fisik)
1. Pelanggan memilih cabang pengambilan.
2. Memasukkan identitas pengambil: Nama Lengkap dan Nomor WhatsApp aktif (bisa diri sendiri atau perwakilan orang lain).
3. Memilih metode pembayaran:
   - **Bayar Sekarang (Online Payment):** Melalui QRIS, Virtual Account, e-Wallet.
   - **Bayar di Kasir Toko:** Bayar tunai/debit saat mengambil barang di toko (dengan batas waktu kedatangan maksimal 6 jam).
4. Setelah konfirmasi pesanan:
   - Sistem menghasilkan **Nomor Pesanan (Order No)**, **PIN Pengambilan 6 Digit**, dan **QR Code**.
   - Pelanggan menerima notifikasi WhatsApp/Email konfirmasi.
   - Staf toko menerima pesanan di dashboard kasir dan menyiapkan barang ke rak pengambilan (*Hold Shelf*).
   - Ketika barang selesai disiapkan, sistem mengirim notifikasi: `Pesanan Anda Telah Siap Diambil di Cabang X`.

##### Alur B: Kirim ke Alamat (Delivery Reguler & Instan)
1. Pelanggan memilih atau menambah alamat penerima.
2. Memilih kurir:
   - **Instant Kurir Makassar:** GrabExpress / GoSend (pengiriman dalam 2-4 jam untuk kota Makassar & sekitarnya).
   - **Ekspedisi Reguler / Kargo:** JNE (Reg/YES), J&T Express, SiCepat, Wahana.
3. Menghitung tarif ongkos kirim real-time berdasarkan total berat dan jarak/kecamatan tujuan.
4. Opsi Asuransi Pengiriman barang elektronik.

#### 3.7. Dropshipper & Reseller System
- **Checkbox "Kirim Sebagai Dropshipper":**
  - Muncul di halaman checkout untuk akun dengan status Dropshipper.
  - Form input: `Nama Pengirim / Toko Online Pengirim` dan `Nomor Telepon Pengirim`.
- **Cetak Label Pengiriman Tanpa Logo (White-Label Shipping Label):**
  - Resi pengiriman mencetak identitas dropshipper sebagai pengirim.
  - Tidak mencantumkan nama MakassarNotebook maupun harga modal barang.
- **Dompet Saldo Dropship (Deposit Wallet):**
  - Fitur top-up saldo via transfer bank / Virtual Account.
  - Pembayaran pesanan instan sekali klik memotong saldo dompet tanpa biaya transaksi gerbang pembayaran per transaksi.
- **Pusat Download Katalog & Gambar:**
  - Fasilitas unduh foto produk tanpa watermark dan deskripsi spesifikasi untuk promosi dropshipper.

#### 3.8. In-Store POS & Pick N Go Verification Screen
- Layar khusus kasir/staf toko cabang yang responsif di tablet/layar sentuh POS:
  - Input cepat: Masukkan 6 digit PIN atau scan QR code dari smartphone pelanggan.
  - Tampilan verifikasi: Daftar barang yang harus diserahkan beserta foto dan nomor lokasi rak (*Aisle/Bin Location*).
  - Tombol `Serahkan Barang & Selesai`: Memperbarui status pesanan menjadi `Completed`, mencetak struk pengambilan, dan mencatat mutasi stok keluar toko secara permanen.

#### 3.9. Layanan Garansi & Klaim RMA (Return Merchandise Authorization)
- Pelanggan dapat membuat tiket komplain / klaim garansi pada menu riwayat pesanan:
  - Mengunggah video unboxing / bukti kerusakan unit.
  - Memilih cara klaim: Kirim paket ke service center atau bawa langsung ke konter toko cabang terdekat.
- Pelacakan status perbaikan: `Tiket Diterima` -> `Pemeriksaan Teknisi` -> `Penggantian Unit Baru / Selesai Perbaikan` -> `Siap Diambil / Dikirim Kembali`.

---

### 4. Non-Functional Requirements (NFR)

1. **Performance & Page Load:**
   - First Contentful Paint (FCP) < 1.2 detik pada jaringan 4G mobile.
   - Respon navigasi halaman antar-katalog < 300 ms memanfaatkan Inertia.js client-side caching.
2. **Concurrency & Race Condition Prevention:**
   - Mekanisme penguncian inventaris (*Pessimistic Locking / Redis Lock*) untuk menjamin tidak ada dua pelanggan yang dapat membayar unit stok terakhir yang sama secara bersamaan saat Flash Sale.
3. **Availability & Reliability:**
   - Service Level Objective (SLO) ketersediaan sistem 99.9% uptime.
4. **Keamanan Transaksi & Data:**
   - Enkripsi SSL/TLS HTTPS end-to-end.
   - Proteksi Cross-Site Request Forgery (CSRF) dan Cross-Site Scripting (XSS).
   - Validasi ketat tanda tangan digital (*HMAC Signature*) pada webhook callback payment gateway.
5. **Responsivitas Perangkat:**
   - Desain 100% responsif: Prioritas utama pada antarmuka mobile (karena >80% pelanggan e-commerce mengakses via ponsel cerdas).
