# Business Requirements Document (BRD)
## Project: MakassarNotebook (MKN) - Omnichannel Gadget & IT Retail Platform

---

### 1. Executive Summary & Project Vision

**MakassarNotebook (MKN)** adalah platform e-commerce dan sistem ritel omnichannel berkecepatan tinggi yang mengadopsi model bisnis dan arsitektur operasional dari model referensi **JakartaNotebook (Jaknote)**, yang dirancang dan dioptimalkan secara spesifik untuk pasar Makassar serta kawasan Indonesia Timur (Sulawesi, Maluku, Papua).

Platform ini menggabungkan penjualan daring (online marketplace) dengan jaringan toko fisik/gudang lokal melalui model **BOPIS (Buy Online, Pick Up In Store / "Pick N Go")**, sistem promosi **Flash Sale** berbasis kuota dan waktu nyata, serta ekosistem kemitraan **Dropshipper & Reseller** tanpa modal stok.

Karakteristik utama sistem ini berfokus pada:
1. **Harga Sangat Kompetitif (Low Margin, High Turnover):** Efisiensi inventaris dan rantai pasok memungkinkan penawaran harga terbaik untuk gadget, aksesoris komputer, perlengkapan outdoor/EDC, peralatan rumah tangga cerdas, dan komponen elektronik unik.
2. **Kepadatan Informasi (Dense Catalog & Transparency):** Informasi spesifikasi produk mendalam, transparansi ketersediaan stok fisik per cabang/toko secara _real-time_, serta kejelasan masa garansi (Garansi Toko vs Garansi Resmi).
3. **Kecepatan Layanan Omnichannel:** Pengambilan barang di toko ("Pick N Go") dengan proses verifikasi cepat (< 5 menit dari kedatangan pelanggan), serta opsi pengiriman instan roda dua dalam hitungan jam untuk area Makassar.

---

### 2. Business Objectives & Strategic Goals

1. **Efisiensi Omnichannel Multi-Cabang:**
   - Menyediakan visibilitas stok fisik yang akurat per cabang (contoh: Cabang Panakkukang, Cabang Pettarani, Cabang Perintis Kemerdekaan, Cabang Gowa/Maros, dan Central Warehouse Makassar).
   - Memangkas waktu tunggu antrean di toko fisik melalui fitur reservasi dan pembayaran online "Pick N Go".

2. **Skalabilitas Penjualan & Promosi Dinamis (Flash Sale):**
   - Menggerakkan trafik harian dan perputaran barang (_inventory turnover_) melalui kampanye _Flash Sale_ terjadwal dengan pembatasan kuota ketat per cabang dan per akun pengguna guna mencegah penimbunan (hoarding/scalping).

3. **Pemberdayaan Ekosistem Dropshipper Indonesia Timur:**
   - Menjadikan MakassarNotebook sebagai pusat suplai utama bagi para penjual di marketplace (Shopee, Tokopedia, TikTok Shop, media sosial) di kawasan Timur Indonesia dengan waktu pengiriman jauh lebih cepat daripada memesan dari Jakarta/Jawa.
   - Menyediakan fitur label pengiriman resi otomatis/manual (White-Label Packaging) dengan identitas pengirim atas nama toko dropshipper.

4. **Keandalan & Transaksi Bebas Hambatan (Zero-Friction Checkout):**
   - Menghadirkan proses checkout cepat berbasis Single Page Application (SPA), kalkulasi ongkos kirim multi-kurir instan & reguler, serta integrasi Payment Gateway lokal (QRIS, Virtual Account, e-Wallet, Kartu Kredit).

---

### 3. Target Audience & Stakeholder Personas

| Persona | Profil & Karakteristik | Kebutuhan Utama pada Sistem |
| :--- | :--- | :--- |
| **Tech Enthusiast & Gadget Hunter** | Penggemar gawai, rakit PC, peralatan outdoor, tools elektronik di area Makassar. | Mencari barang unik/murah, ingin segera ambil di toko hari itu juga tanpa menunggu kurir ekspedisi dari pulau Jawa. |
| **Pemburu Diskon / Konsumen Retail** | Mahasiswa, pekerja kantor, masyarakat umum pemburu promo. | Katalog padat, navigasi pencarian instan, filter ketersediaan cabang terdekat, Flash Sale countdown. |
| **Dropshipper & Reseller Mitra** | Pebisnis online lokal di Sulsel dan Indonesia Timur. | Harga bertingkat (khusus dropship), fitur cetak label pengiriman tanpa embel-embel toko, saldo deposit/wallet, katalog siap unduh. |
| **Store Front Staff / Kasir Cabang** | Karyawan toko fisik di cabang Makassar. | Layar operasional cepat untuk scan barcode/QR pesanan Pick N Go, pengecekan nomor PIN pengambilan, penyesuaian stok instan. |
| **Warehouse & Purchasing Admin** | Tim gudang pusat dan logistik pengadaan. | Manajemen mutasi barang antar-cabang, penerimaan PO vendor, peringatan stok menipis (_low stock threshold_). |
| **Manajemen & Super Admin** | Pemilik bisnis dan tim operasional pusat. | Laporan penjualan real-time, margin keuntungan, manajemen kampanye promosi, kontrol harga dan audit jejak transaksi. |

---

### 4. Key Business Requirements & Operational Domains

#### 4.1. Multi-Branch & Real-Time Inventory Control
- Sistem wajib mengelola banyak titik lokasi fisik:
  - **Gudang Utama (Central Distribution Center - CDC Makassar)**
  - **Toko Cabang Retail (Store Hubs):** Contoh: Makassar Panakkukang, Makassar Pettarani, Makassar Tamalanrea/Perintis, dan titik pickup satelit.
- Setiap produk memiliki kuantitas stok independen di tiap cabang.
- Pelanggan dapat melihat rincian ketersediaan stok fisik per toko:
  - `Tersedia (> 10)`
  - `Sisa Sedikit (1 - 5)`
  - `Habis di Cabang Ini`
- Mekanisme **Stock Reservation**: Ketika pelanggan melanjutkan ke proses pembayaran (checkout), stok barang di cabang yang dipilih otomatis dikunci (_locked/reserved_) selama maksimal 15-30 menit untuk mencegah _overselling_ (kondisi barang habis sebelum bayar).

#### 4.2. Model Transaksi Omnichannel: "Pick N Go" vs "Kirim ke Alamat"
- **Opsi 1: Pick N Go (Ambil Sendiri di Toko):**
  - Pelanggan memilih cabang toko tempat pengambilan barang.
  - Memilih metode pembayaran: Bayar Online terlebih dahulu (QRIS/VA) atau Bayar di Kasir Toko saat ambil (opsi dapat diatur oleh admin).
  - Sistem menerbitkan **Nomor Pesanan (Order ID)**, **Kode PIN Pengambilan (6 digit)**, dan **QR Barcode**.
  - SLA: Pesanan disiapkan oleh staf toko dalam < 15 menit. Pelanggan menerima notifikasi (WhatsApp/Email/SMS) bahwa barang telah `Siap Diambil`.
  - Masa berlaku reservasi Pick N Go: Maksimal 1x24 jam. Jika tidak diambil, pesanan dibatalkan otomatis dan stok dikembalikan ke inventaris toko.
- **Opsi 2: Pengiriman Reguler & Kurir Instan (Delivery):**
  - Dikirim dari Gudang Utama atau Cabang terdekat pelanggan.
  - Dukungan kurir instan lokal Makassar (Gojek / Grab Same-Day & Instant) untuk pesanan dalam radius jangkauan kota.
  - Dukungan ekspedisi logistik nasional (JNE, J&T Express, SiCepat, Wahana, POS Indonesia) untuk pengiriman antar-kota/pulau di Indonesia Timur.

#### 4.3. Program Kemitraan Dropshipper & Reseller
- Pendaftaran akun dengan verifikasi khusus untuk tier `Dropshipper`.
- **Leveling & Keuntungan:**
  - Harga khusus dropshipper (lebih murah dari harga retail reguler).
  - Fasilitas **White-Label Shipping**: Kolom nama pengirim dan nomor telepon pengirim dapat diisi dengan nama toko online dropshipper; nama MakassarNotebook tidak dicantumkan pada label resi pengiriman ke pembeli akhir.
  - Saldo Deposit Dompet Dropshipper (Top-up balance untuk checkout instan tanpa harus membuka payment gateway setiap transaksi).
  - Ekspor data katalog produk (CSV/Excel format standar marketplace) untuk memudahkan dropshipper mengunggah dagangan ke marketplace mereka.

#### 4.4. Flash Sale & Promo Rules Engine
- Modul Flash Sale dengan periode waktu terjadwal (misal: Sesi Siang 12:00 - 15:00 WITA, Sesi Malam 19:00 - 23:59 WITA).
- Batasan pembelian per pengguna (_Purchase Limit_: misal maksimal 1-2 unit per akun terverifikasi).
- Alokasi kuota produk promosi per cabang (contoh: 20 unit untuk Panakkukang, 20 unit untuk Pettarani, 50 unit untuk online delivery).
- Countdown visual jam, menit, detik dan visual progress bar persentase produk yang telah diklaim.

#### 4.5. Layanan Purna Jual & Kebijakan Garansi (After-Sales & RMA)
- Kejelasan jenis garansi pada setiap halaman produk:
  - **Garansi Toko:** Penukaran unit baru (Replace 1-on-1) dalam batas waktu 3 hingga 7 hari kerja untuk cacat pabrik.
  - **Garansi Distributor / Resmi:** 1 bulan hingga 1-2 tahun ke service center resmi distributor.
  - **Non-Garansi:** Barang habis pakai / aksesoris tertentu (hanya cek fisik saat diterima).
- Modul tiket klaim RMA (Return Merchandise Authorization): Pelanggan dapat mengajukan klaim perbaikan/retur secara online atau menitipkan unit di konter toko cabang terdekat.

---

### 5. Regulatory, Security, & Tax Compliance

1. **Perpajakan (PPN 11% / 12%):**
   - Harga produk yang ditampilkan kepada pembeli merupakan harga final (sudah termasuk komponen PPN sesuai regulasi perpajakan ritel Indonesia).
   - Pembuatan faktur/invoice penjualan terstandar dengan rincian PPN yang dapat dicetak.
2. **Kerahasiaan Data Pribadi (UU PDP No. 27/2022):**
   - Enkripsi kata sandi dan token otentikasi.
   - Pembatasan akses alamat pelanggan hanya untuk kurir/staf pemenuhan pesanan.
3. **Standar Keamanan Transaksi Finansial:**
   - Tidak menyimpan nomor kartu kredit/debit secara langsung pada database (menggunakan tokenisasi Payment Gateway berlisensi Bank Indonesia).
   - Verifikasi Webhook Callback dengan tanda tangan kriptografi (Signature Key Validation).

---

### 6. Key Performance Indicators (KPIs) & Success Criteria

1. **Transaction Velocity:** Waktu penyelesaian checkout dari keranjang hingga halaman instruksi pembayaran < 3 detik.
2. **Pick N Go Fulfillment SLA:** 95% pesanan Pick N Go siap diambil oleh pembeli dalam waktu 15 menit sejak pembayaran dikonfirmasi.
3. **Stock Accuracy Rate:** Tingkat akurasi antara pencatatan stok di sistem dan fisik di rak toko fisik minimal 99.5% (mencegah komplain barang kosong).
4. **Dropshipper Adoption:** Peningkatan volume transaksi harian dari jaringan reseller hingga minimal 30% dari total gross merchandise value (GMV).
