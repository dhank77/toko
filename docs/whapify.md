# Panduan Integrasi WhatsApp Whapify.id

Sumber: dashboard dan API reference Whapify.id.
Base URL: https://whapify.id/api
Endpoint: POST /send/whatsapp (multipart/form-data).
Permission API key: wa_send.

Dokumen ini panduan teknis memakai Whapify di project ini,
ditulis ulang dari catatan mentah endpoint Send Single Chat.

---

## 1. Ringkasan

Whapify dipakai untuk notifikasi WhatsApp transaksional:

- Tipe text: notif order dibuat, lunas, PIN Pick N Go, resi.
- Tipe media: kirim gambar/video/audio via media_file atau media_url.
- Tipe document: kirim invoice PDF via document_file atau document_url.

Alur:

1. Order dibayar atau status berubah.
2. Panggil WhapifyService dari Queue/Job.
3. POST multipart ke /send/whatsapp.
4. Simpan data.messageId untuk tracing.

Pengiriman WA tidak boleh menghambat checkout. Bungkus try/catch
agar gagal kirim tidak menggagalkan order.

---

## 2. Kredensial

1. Login dashboard Whapify.id.
2. Buka Tools -> API Keys, salin API Secret.
3. Salin WhatsApp Account Unique ID dari dashboard atau GET /get/wa.accounts.
4. Pastikan permission wa_send aktif dan device connected.

Contoh .env:

```env
WHAPIFY_BASE_URL=https://whapify.id/api
WHAPIFY_SECRET=isi_secret
WHAPIFY_ACCOUNT=isi_account_id
WHAPIFY_PRIORITY=2
```

Contoh config/services.php:

```php
'whapify' => [
    'base_url' => env('WHAPIFY_BASE_URL', 'https://whapify.id/api'),
    'secret' => env('WHAPIFY_SECRET'),
    'account' => env('WHAPIFY_ACCOUNT'),
    'priority' => (int) env('WHAPIFY_PRIORITY', 2),
],
```

Catatan: 1 = prioritas/kirim segera, 2 = antrean normal (default).

---

## 3. Parameter Endpoint

| Field | Wajib | Keterangan |
|---|---|---|
| secret | ya | API secret dari Tools -> API Keys |
| account | ya | Unique ID akun/device WA pengirim |
| recipient | ya | Nomor E.164 (+62812...) atau lokal (0812...) atau alamat grup WA |
| type | tidak | text (default), media, document |
| message | ya | Isi pesan/caption, mendukung Spintax |
| priority | tidak | 1 = segera, 2 = normal (default) |
| media_file | khusus media | Upload jpg/png/gif/mp4/mp3/ogg |
| media_url | khusus media | Direct link file, wajib + media_type |
| media_type | wajib jika media_url | image, audio, video |
| document_file | khusus document | Upload pdf/xml/xls/xlsx/doc/docx |
| document_url | khusus document | Direct link dokumen, wajib + document_type |
| document_name | khusus document_url | Nama file + ekstensi, mis. invoice.pdf |
| document_type | wajib jika document_url | pdf/xml/xls/xlsx/doc/docx |
| shortener | tidak | ID shortener dari GET /get/shorteners |

Aturan:

- type text: abaikan field media dan document.
- type media: isi media_file ATAU (media_url + media_type).
- type document: isi document_file ATAU (document_url + document_type + document_name).

Response sukses:

```json
{
  "status": 200,
  "message": "WhatsApp chat has been sent!",
  "data": { "messageId": 123 }
}
```

---

## 4. Contoh Request

### 4.1. Pesan teks

```bash
curl -X POST 'https://whapify.id/api/send/whatsapp' \
  -F 'secret=YOUR_SECRET' \
  -F 'account=YOUR_ACCOUNT_ID' \
  -F 'recipient=081234567890' \
  -F 'type=text' \
  -F 'message=Halo, pesanan INV-001 sudah lunas.'
```

### 4.2. Media via URL

```bash
curl -X POST 'https://whapify.id/api/send/whatsapp' \
  -F 'secret=YOUR_SECRET' \
  -F 'account=YOUR_ACCOUNT_ID' \
  -F 'recipient=081234567890' \
  -F 'type=media' \
  -F 'message=Panduan pengambilan loker' \
  -F 'media_url=https://toko.example/panduan.jpg' \
  -F 'media_type=image'
```

### 4.3. Dokumen via upload

```bash
curl -X POST 'https://whapify.id/api/send/whatsapp' \
  -F 'secret=YOUR_SECRET' \
  -F 'account=YOUR_ACCOUNT_ID' \
  -F 'recipient=081234567890' \
  -F 'type=document' \
  -F 'message=Invoice INV-001 terlampir' \
  -F 'document_file=@/path/invoice.pdf'
```

### 4.4. PHP native (rapian dari catatan asli)

```php
$url = 'https://whapify.id/api/send/whatsapp';
$data = [
    'secret' => 'YOUR_SECRET',
    'account' => 'YOUR_ACCOUNT_ID',
    'recipient' => 'RECIPIENT_NUMBER',
    'type' => 'text',
    'message' => 'YOUR_MESSAGE',
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo $code === 200 ? 'Success: '.$response : 'Error: '.$response;
```

---

## 5. Spintax dan Format Nomor

Contoh Spintax: {Halo|Hai|Assalamualaikum} kak, pesanan kamu lunas.
Salah satu variasi terkirim acak agar pesan massal tidak identik.

Format recipient:

- E.164: +62812345678
- Lokal: 0812345678 (ikut country code profil)
- Grup: alamat grup WA mis. 62812xxx@g.us

Normalisasi 08... menjadi 628... sebelum kirim agar konsisten.
---

## 6. Integrasi Laravel

Buat service dengan php artisan make:class Services/WhapifyService.

```php
namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class WhapifyService
{
    protected string $baseUrl;
    protected string $secret;
    protected string $account;
    protected int $priority;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.whapify.base_url', 'https://whapify.id/api');
        $this->secret = (string) config('services.whapify.secret');
        $this->account = (string) config('services.whapify.account');
        $this->priority = (int) config('services.whapify.priority', 2);
    }

    public function sendText(string $recipient, string $message, ?int $priority = null): array
    {
        return $this->send([
            'recipient' => $this->normalize($recipient),
            'type' => 'text',
            'message' => $message,
            'priority' => $priority ?? $this->priority,
        ]);
    }

    public function sendMediaUrl(string $to, string $caption, string $url, string $mediaType): array
    {
        return $this->send([
            'recipient' => $this->normalize($to),
            'type' => 'media',
            'message' => $caption,
            'media_url' => $url,
            'media_type' => $mediaType,
        ]);
    }

    public function sendDocumentUrl(string $to, string $caption, string $url, string $docType, string $docName): array
    {
        return $this->send([
            'recipient' => $this->normalize($to),
            'type' => 'document',
            'message' => $caption,
            'document_url' => $url,
            'document_type' => $docType,
            'document_name' => $docName,
        ]);
    }

    protected function send(array $fields): array
    {
        abort_if($this->secret === '' || $this->account === '', 500, 'Konfigurasi Whapify belum lengkap.');

        $payload = array_merge([
            'secret' => $this->secret,
            'account' => $this->account,
            'priority' => $this->priority,
        ], $fields);

        $response = Http::asMultipart()->timeout(20)->post($this->baseUrl.'/send/whatsapp', $payload);
        $this->throwIfFailed($response);

        return ['messageId' => $response->json('data.messageId'), 'raw' => $response->json() ?? []];
    }

    protected function throwIfFailed(Response $response): void
    {
        if ($response->failed() || (int) $response->json('status', 0) !== 200) {
            throw new RuntimeException('Gagal kirim WA: '.($response->json('message') ?? $response->body()));
        }
    }

    public function normalize(string $recipient): string
    {
        $recipient = trim($recipient);
        if (str_contains($recipient, '@g.us')) {
            return $recipient;
        }
        $digits = preg_replace('/[^0-9]/', '', $recipient) ?? '';
        if (str_starts_with($digits, '0')) {
            return '62'.substr($digits, 1);
        }

        return $digits;
    }
}
```

---

## 7. Contoh Pemakaian

Contoh kirim teks order lunas:

```php
$wa = app(App\Services.WhapifyService::class);

$wa->sendText(
    $order->user->phone,
    'Halo kak '.$order->user->name.', pembayaran '.$order->order_number.' sudah kami terima.'
);
```

Contoh kirim invoice PDF via URL publik:

```php
$wa->sendDocumentUrl(
    $order->user->phone,
    'Invoice '.$order->order_number.' terlampir.',
    route('orders.invoice', $order),
    'pdf',
    $order->order_number.'.pdf'
);
```

Contoh upload file lokal:

```php
use Illuminate\Support\Facades\Http;

Http::attach('document_file', file_get_contents($path), 'invoice.pdf')
    ->post('https://whapify.id/api/send/whatsapp', [
        'secret' => config('services.whapify.secret'),
        'account' => config('services.whapify.account'),
        'recipient' => '6281234567890',
        'type' => 'document',
        'message' => 'Invoice terlampir',
    ]);
```

Kirim dari queue agar tidak blok response:

```php
dispatch(function () use ($order): void {
    try {
        app(App\Services.WhapifyService::class)->sendText(
            $order->user->phone,
            'Pesanan '.$order->order_number.' lunas. Terima kasih!'
        );
    } catch (Throwable $e) {
        logger()->warning('WA gagal terkirim', ['order' => $order->order_number, 'error' => $e->getMessage()]);
    }
})->afterResponse();
```

---

## 8. Testing dan Tips

Testing:

1. Cek config terbaca via tinker: config services.whapify.
2. Kirim ke nomor sendiri dulu dengan type text dan priority 1.
3. Pastikan device connected bila pesan pending.
4. Uji media_url dengan URL publik, bukan localhost.
5. Simulasikan secret salah, pastikan order tetap sukses dan error tercatat di log.

Tips:

1. Selalu pakai multipart/form-data, bukan JSON.
2. media_url wajib ditemani media_type, document_url wajib document_type.
3. message wajib diisi walau tipe media/document (jadi caption).
4. Normalisasi nomor 08 menjadi 628 agar konsisten.
5. priority 1 hanya untuk pesan penting seperti PIN/OTP.
6. Jangan kirim file dari localhost, pakai URL publik atau upload langsung.
7. Untuk banyak nomor, beri jeda dan Spintax agar tidak dianggap spam.

