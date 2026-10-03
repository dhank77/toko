---
paths:
  - 'resources/js/**/*.{tsx,ts}'
---

# Js

## Format Standar Nominal Rupiah (Titik untuk UI, Polos untuk Database)
Semua nominal mata uang Rupiah yang ditampilkan dan diisi oleh pengguna pada UI harus diformat menggunakan pemisah ribuan berupa titik (contoh: 50.000 atau Rp 50.000). Untuk penyimpanan ke database dan pengiriman payload backend tetap menggunakan format angka numerik murni tanpa titik (integer, contoh: 50000). Gunakan helper formatNumberWithDots/formatRupiah untuk tampilan input dan hilangkan titik sebelum dikirim ke backend.
