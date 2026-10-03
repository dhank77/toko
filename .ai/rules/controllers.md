---
paths:
  - 'app/Http/Controllers/**/*.php'
---

# Controllers

## Sanitasi Nominal Rupiah ke Integer Database
Field harga atau nominal rupiah dari request harus disanitasi dari tanda pemisah titik/koma jika terkirim dalam format string sebelum divalidasi dan disimpan ke database (kolom unsignedBigInteger/integer murni). Contoh: $request->merge(['price' => (int) str_replace(['.', ','], '', $request->input('price'))]).
