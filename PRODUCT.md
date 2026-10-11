# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pembeli umum di Makassar, Sulawesi, dan Indonesia Timur yang mencari barang unik, gadget, dan kebutuhan harian dengan harga termurah. Mereka berbelanja lewat website (mobile dan desktop), mengambil langsung di toko fisik (Pick N Go), atau memakai pengiriman instan/se-kota dan reguler. Reseller/dropshipper adalah audiens sekunder, bukan target utama homepage.

## Product Purpose

MakassarNotebook adalah toko online + offline yang menjual aneka produk unik, perlengkapan komputer & laptop, outdoor gear, rumah tangga, aksesoris HP, hobi, dan perkakas dengan slogan #SudahPastiMurahnya. Homepage harus meyakinkan pengunjung dalam hitungan detik bahwa di sinilah harga termurah, lalu mengantar mereka ke promo, kategori, dan produk. Sukses berarti pengunjung menemukan barang murah dengan cepat dan menyelesaikan pembelian (online, COD, atau Pick N Go).

## Positioning

Harga langsung importir tanpa perantara (#SudahPastiMurahnya) yang bisa dibuktikan lewat flash sale harian dan harga coret, dikombinasikan dengan 9 toko fisik Pick N Go (4 di Makassar, 5 di Jabodetabek) untuk ambil di toko tanpa antre dan bebas ongkir. Klaim ini tidak bisa ditiru toko online murni tanpa cabang fisik.

## Operating Context

Alur belanja: cari/temukan produk di homepage → halaman kategori/produk → keranjang → checkout → bayar (transfer bank, QRIS) atau COD/Pick N Go. Layanan pelanggan via WhatsApp dan call center. Jam toko WITA untuk Makassar, WIB untuk Jabodetabek; tutup saat Idul Fitri. Konten homepage: hero promo, value bubbles, flash sale dengan countdown, kategori populer, video shopping, pencarian populer, rekomendasi produk per kategori, artikel, pilar value, info SEO, dan contact center cabang.

## Capabilities and Constraints

- Katalog dinamis dari database (kategori, subkategori, produk, diskon) dengan fallback konten statis bila kosong.
- Filter rekomendasi per kategori, pencarian dengan kata kunci populer, countdown flash sale.
- 9 cabang dengan alamat, jam buka, telepon, dan WhatsApp sales masing-masing.
- Pembayaran: transfer bank (BCA, Mandiri, BNI, BRI) dan QRIS; opsi COD dan Pick N Go.
- Fakta yang belum diputuskan: target konversi homepage dan urutan section yang paling menghasilkan (inferred).

## Brand Commitments

- Nama dan logo "makassarbook" (biru) + "notebook" (biru muda #0099FF) dengan ikon kacamata oranye, dan tagline #SudahPastiMurahnya. (confirmed)
- Warna brand biru #0099FF (interaksi) dan oranye #FF6000 (aksen dagang) wajib dipertahankan. (confirmed)
- Bahasa Indonesia, gaya bicara lugas dan promo ala ritel (confirmed dari copy yang ada).
- Visual boleh diganti total selain komitmen di atas; copy faktual (alamat, jam, harga) tidak boleh diubah. (confirmed)

## Evidence on Hand

- Data nyata: produk, kategori, harga, dan diskon dari database via `WelcomeController`; foto produk dari CDN jaknot (inferred dari kode).
- Aset promo: banner hero dan side-banner dari jakartanotebook.com (inferred dari kode).
- Tidak ada testimoni, rating agregat, atau studi kasus di homepage yang boleh difabrikasi; jangan membuat klaim angka baru.

## Product Principles

1. Harga murah harus terbukti, bukan sekadar dikatakan: setiap klaim murah ditemani harga coret, badge diskon, atau countdown.
2. Satu aksi per layar: tiap section punya satu pekerjaan (promo, cari, beli, atau kontak).
3. Jangan sembunyikan biaya dan ketersediaan: ongkir, stok cabang, dan jam buka selalu terlihat sebelum checkout.
4. Cabang fisik adalah fitur, bukan catatan kaki: Pick N Go dan info toko sejajar dengan promo online.
5. Tenang sebagai bawaan: ramai hanya di momen urgensi (flash sale); selebihnya hirarki tipografi yang jelas.

## Accessibility & Inclusion

Belum ada standar formal yang ditetapkan. Kebutuhan yang diketahui: teks kecil saat ini (11px) menyulitkan pembaca layar kecil; kontras label di atas gambar harus memenuhi WCAG AA. Bahasa sederhana untuk pembeli awam.
