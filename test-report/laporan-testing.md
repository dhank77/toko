# Laporan Testing E2E — TokoOnline (MakassarNotebook)

| Item | Keterangan |
|---|---|
| Tanggal | 11 Oktober 2026 |
| Aplikasi | TokoOnline / MakassarNotebook (Laravel 13 + Inertia React) |
| Target uji | `https://toko.test` (Herd/nginx + PHP 8.4, DB MySQL) |
| Framework uji | `tester-army/e2e` v0.19.0, engine `@e2e-dev/web` (Chromium headless) |
| Metode | Deterministik tanpa AI (locator + assertion, tanpa `agent.act`) |
| Hasil akhir | **35/35 test lolos (6 file)** |

## 1. Ringkasan Hasil

| File test | Jumlah | Status |
|---|---|---|
| `tests/storefront.e2e.ts` | 11 | Lolos |
| `tests/auth.e2e.ts` | 7 | Lolos |
| `tests/protected.e2e.ts` | 12 | Lolos |
| `tests/registered.e2e.ts` | 2 | Lolos |
| `tests/api.e2e.ts` | 2 | Lolos |
| `tests/example.e2e.ts` | 1 | Lolos |

Perintah reproduksi:

```bash
npm run test:e2e
```

> `test:e2e` menyetel `NODE_EXTRA_CA_CERTS` ke CA Herd agar request HTTPS Node (API test) memverifikasi sertifikat lokal dengan benar.

## 2. Hasil per Halaman

### 2.1 Storefront (publik)

| Halaman / Skenario | Hasil | Screenshot |
|---|---|---|
| Homepage (`/`) tampil: search, brand, tombol Kategori | Lolos | `screenshots/home.png` |
| Kategori (`/categories/komputer-laptop`) tampil + total produk | Lolos | `screenshots/category.png` |
| Sort kategori (`sort=price_low`) update URL, list tetap tampil | Lolos | — |
| Detail produk tampil: buy box, `+ Keranjang`, `Beli Sekarang` | Lolos | `screenshots/product.png` |
| `+ Keranjang` memunculkan toast `Berhasil menambahkan` | Lolos | — |
| Guest `Beli Sekarang` → redirect `/login` | Lolos | — |
| Search menampilkan dropdown `Paling Sering Dicari` | Lolos | — |
| Breadcrumb `Home` kembali ke homepage | Lolos | — |
| Link `Lihat Semua di …` membuka halaman kategori | Lolos | — |
| Link `Keranjang Belanja` (guest) → redirect `/login` | Lolos | — |
| Slug produk/kategori tidak dikenal → halaman 404 | Lolos | `screenshots/not-found.png` |

### 2.2 Autentikasi (publik)

| Halaman / Skenario | Hasil | Screenshot |
|---|---|---|
| `/login` tampil: passkey, Google, form email | Lolos | `screenshots/login.png` |
| `/register` tampil: form pembeli + `Daftar Sebagai Pembeli` | Lolos | `screenshots/register.png` |
| `/forgot-password` tampil + tombol kirim link | Lolos | `screenshots/forgot-password.png` |
| `/reset-password/{token}` tampil | Lolos | — |
| Login kredensial salah → error `These credentials do not match our records.` | Lolos | — |
| `/auth/google/redirect` keluar ke domain Google | Lolos | — |
| Guest `/email/verify` → redirect `/login` | Lolos | — |

### 2.3 Rute Terproteksi (guest → `/login`, 12 rute)

`/client`, `/dashboard`, `/admin/products`, `/admin/products/create`,
`/admin/categories`, `/admin/sub-categories`, `/settings`, `/settings/profile`,
`/settings/security`, `/settings/appearance`, `/user/confirm-password`,
`/two-factor-challenge` — **semua benar redirect ke `/login`**.

### 2.4 Alur Pembeli Terautentikasi

> Membutuhkan user seed terverifikasi (lihat §5).

| Skenario | Hasil | Screenshot |
|---|---|---|
| Register baru → mendarat di `/email/verify` + tombol kirim ulang | Lolos | — |
| Login user terverifikasi → `/client`, sapaan nama, 3 tab, tab keranjang, `/settings/profile` | Lolos | `screenshots/client-portal.png`, `screenshots/settings-profile.png` |

### 2.5 API Publik

| Endpoint | Hasil |
|---|---|
| `GET /.well-known/passkey-endpoints` → 200, `enroll`/`manage` menunjuk `/settings/security` | Lolos |
| `GET /shipping/provinces` → 200, `data` array provinsi terisi | Lolos |

## 3. Temuan

### 3.1 [Riwayat, non-aktif] `ReferenceError: ChevronRight` di Safari (bundle basi)

- Log browser mencatat `Uncaught ReferenceError: ChevronRight is not defined` dari bundle lama `storefront-layout-C8Rl216_.js` pada iPhone Safari (halaman kategori + `?sub_category=`).
- Build saat ini (`storefront-layout-DfH1x8AB.js`) tidak mengandung masalah tersebut dan file bundle lama sudah tidak ada di `public/build` — kasus berasal dari **cache pengguna**, akan hilang sendiri.
- Catatan hygiene: setiap build me-purge bundle lama ber-hash, sehingga pengguna dengan halaman lama yang ter-cache bisa blank sampai hard-refresh.

### 3.2 [Minor] Halaman 404 belum ber-branding

Slug produk/kategori yang tidak dikenal menampilkan halaman default Laravel (`404 | Not Found`, lihat `screenshots/not-found.png`), bukan layout toko. Fungsional benar (status 404), hanya belum konsisten secara visual.

### 3.3 [Flaky minor] Registrasi lambat karena kirim mail sinkron

Alur register mengirim mail verifikasi sinkron via SMTP Mailtrap (±5 detik), sehingga test memakai timeout 30 detik. Satu dari lima run sempat gagal saat Mailtrap stall; stabil di run berikutnya. Pertimbangkan queue/log mail untuk lingkungan dev.

## 4. Di Luar Cakupan (belum diuji)

- CRUD admin UI (`/admin/*`) — butuh user admin.
- Pembayaran DOKU — log aplikasi menunjukkan kegagalan sesi di sandbox (`DOKU checkout gagal`, kredensial/track-ID sandbox), bukan bug kode yang bisa diverifikasi tanpa kredensial valid.
- Flow 2FA (`two-factor-challenge`) dan passkey end-to-end.

## 5. Akun Uji

User customer terverifikasi untuk test portal (dibuat via tinker, dipertahankan di DB dev):

- Email: `e2e-buyer@example.com` / Password: `Password123`

Buat ulang bila diperlukan:

```bash
php artisan tinker --execute 'App\Models\User::updateOrCreate(["email" => "e2e-buyer@example.com"], ["name" => "E2E Buyer", "password" => Hash::make("Password123"), "role" => "customer", "email_verified_at" => now()]);'
```

## 6. Lampiran Screenshot

Semua di `test-report/screenshots/`:

- `home.png` — homepage lengkap
- `category.png` — halaman kategori
- `product.png` — detail produk
- `login.png` — halaman login
- `register.png` — halaman registrasi
- `forgot-password.png` — lupa password
- `client-portal.png` — portal client (sudah login)
- `settings-profile.png` — pengaturan profil
- `not-found.png` — halaman 404
