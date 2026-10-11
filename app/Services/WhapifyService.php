<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class WhapifyService
{
    /**
     * Dapatkan Base URL Whapify.
     */
    public function getBaseUrl(): string
    {
        $url = (string) Setting::get('whapify_base_url');

        return $url !== '' ? rtrim($url, '/') : (string) config('services.whapify.base_url', 'https://whapify.id/api');
    }

    /**
     * Dapatkan API Secret Whapify.
     */
    public function getSecret(): string
    {
        $secret = (string) Setting::get('whapify_secret');

        return $secret !== '' ? $secret : (string) config('services.whapify.secret', '');
    }

    /**
     * Dapatkan Unique ID WhatsApp Account Whapify.
     */
    public function getAccount(): string
    {
        $account = (string) Setting::get('whapify_account');

        return $account !== '' ? $account : (string) config('services.whapify.account', '');
    }

    /**
     * Dapatkan prioritas pesan default (1 = segera, 2 = normal).
     */
    public function getPriority(): int
    {
        $priority = Setting::get('whapify_priority');

        if ($priority !== null && $priority !== '') {
            return (int) $priority;
        }

        return (int) config('services.whapify.priority', 2);
    }

    /**
     * Periksa apakah integrasi WhatsApp diaktifkan.
     */
    public function isEnabled(): bool
    {
        $enabled = Setting::get('whapify_is_enabled');

        if ($enabled === null) {
            return true;
        }

        return in_array($enabled, [true, 1, '1', 'true', 'yes'], true);
    }

    /**
     * Periksa apakah kredensial Whapify sudah lengkap.
     */
    public function isConfigured(): bool
    {
        return $this->getSecret() !== '' && $this->getAccount() !== '';
    }

    /**
     * Normalisasi nomor telepon ke format internasional (misal 0812 -> 62812).
     */
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

        if (str_starts_with($digits, '8')) {
            return '62'.$digits;
        }

        return $digits;
    }

    /**
     * Kirim pesan teks WhatsApp melalui endpoint Whapify.
     *
     * @return array{status: int, messageId: mixed, raw: array<string, mixed>}
     */
    public function sendText(string $recipient, string $message, ?int $priority = null): array
    {
        return $this->send([
            'recipient' => $this->normalize($recipient),
            'type' => 'text',
            'message' => $message,
            'priority' => $priority ?? $this->getPriority(),
        ]);
    }

    /**
     * Kirim notifikasi pesanan dibuat (menunggu pembayaran) ke nomor WhatsApp pembeli.
     *
     * @return array{status: int, messageId: mixed, raw: array<string, mixed>}|null
     */
    public function sendOrderCreated(Order $order): ?array
    {
        if (! $this->isEnabled() || ! $this->isConfigured()) {
            Log::info('Whapify: Notifikasi order created dilewati karena WhatsApp dinonaktifkan atau belum dikonfigurasi.', [
                'order' => $order->order_number,
            ]);

            return null;
        }

        $order->loadMissing(['user', 'items']);
        $phone = $order->user?->phone;

        if (empty($phone)) {
            Log::info('Whapify: Pengguna tidak memiliki nomor WhatsApp untuk pesanan '.$order->order_number);

            return null;
        }

        $message = $this->buildOrderCreatedMessage($order);

        try {
            return $this->sendText($phone, $message);
        } catch (Throwable $e) {
            Log::warning('Whapify: Gagal mengirim pesan pesanan dibuat.', [
                'order' => $order->order_number,
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Kirim notifikasi pembayaran berhasil ke nomor WhatsApp pembeli.
     *
     * @return array{status: int, messageId: mixed, raw: array<string, mixed>}|null
     */
    public function sendOrderPaid(Order $order): ?array
    {
        if (! $this->isEnabled() || ! $this->isConfigured()) {
            Log::info('Whapify: Notifikasi order paid dilewati karena WhatsApp dinonaktifkan atau belum dikonfigurasi.', [
                'order' => $order->order_number,
            ]);

            return null;
        }

        $order->loadMissing(['user', 'items']);
        $phone = $order->user?->phone;

        if (empty($phone)) {
            Log::info('Whapify: Pengguna tidak memiliki nomor WhatsApp untuk pesanan '.$order->order_number);

            return null;
        }

        $message = $this->buildOrderPaidMessage($order);

        try {
            // Prioritas 1 (segera) untuk konfirmasi pembayaran & PIN loker Pick N Go
            return $this->sendText($phone, $message, priority: 1);
        } catch (Throwable $e) {
            Log::warning('Whapify: Gagal mengirim pesan pembayaran berhasil.', [
                'order' => $order->order_number,
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Uji coba pengiriman WhatsApp dari halaman admin.
     *
     * @return array{status: int, message: string, messageId?: mixed}
     */
    public function testConnection(string $recipient, string $testMessage): array
    {
        $normalized = $this->normalize($recipient);

        if ($normalized === '') {
            throw new RuntimeException('Nomor tujuan tidak valid.');
        }

        $result = $this->sendText($normalized, $testMessage, priority: 1);

        return [
            'status' => 200,
            'message' => 'Pesan uji coba berhasil dikirim ke '.$normalized,
            'messageId' => $result['messageId'],
        ];
    }

    /**
     * Susun teks notifikasi pesanan dibuat (belum bayar).
     */
    public function buildOrderCreatedMessage(Order $order): string
    {
        $customerName = $order->user?->name ?? 'Pelanggan';
        $orderNumber = $order->order_number;
        $totalFormatted = 'Rp '.number_format((float) $order->total_amount, 0, ',', '.');
        $branch = $order->branch ?: 'Panakkukang';

        $itemsSummary = '';
        foreach ($order->items as $idx => $item) {
            $num = $idx + 1;
            $subtotal = 'Rp '.number_format((float) $item->subtotal, 0, ',', '.');
            $itemsSummary .= "{$num}. {$item->product_name} ({$item->quantity}x) - {$subtotal}\n";
        }

        $paymentUrl = $order->payment_url ?: route('client.index', ['tab' => 'orders']);

        return "Halo kak *{$customerName}*! 👋\n\n".
            "Terima kasih telah memesan di *MakassarNotebook*.\n".
            "Pesanan kamu dengan nomor *#{$orderNumber}* telah dibuat dan saat ini *MENUNGGU PEMBAYARAN*.\n\n".
            "📦 *Rincian Pesanan:*\n".
            trim($itemsSummary)."\n\n".
            "💰 *Total Tagihan:* *{$totalFormatted}*\n".
            "🏪 *Metode:* Ambil di Toko (Cabang {$branch})\n\n".
            "Segera selesaikan pembayaran kamu melalui link berikut:\n".
            "👉 {$paymentUrl}\n\n".
            "_Mohon selesaikan pembayaran sebelum batas waktu berakhir agar pesanan tidak dibatalkan otomatis._\n\n".
            "Salam,\n*MakassarNotebook Team*";
    }

    /**
     * Susun teks notifikasi pembayaran berhasil.
     */
    public function buildOrderPaidMessage(Order $order): string
    {
        $customerName = $order->user?->name ?? 'Pelanggan';
        $orderNumber = $order->order_number;
        $totalFormatted = 'Rp '.number_format((float) $order->total_amount, 0, ',', '.');
        $branch = $order->branch ?: 'Panakkukang';

        if ($order->fulfillment_type === 'pick_n_go') {
            $pickupPin = $order->pickup_pin ?: '-';
            $pickupRack = $order->pickup_rack ?: '-';

            return "Halo kak *{$customerName}*! 🎉\n\n".
                "Kabar gembira! Pembayaran untuk pesanan *#{$orderNumber}* sebesar *{$totalFormatted}* telah *BERHASIL KAMI TERIMA*.\n\n".
                "📦 *Status:* Siap Diambil (Pick N Go)\n".
                "🏢 *Cabang:* {$branch}\n".
                "🔑 *PIN Pengambilan:* *{$pickupPin}*\n".
                "📍 *Lokasi Rak:* *{$pickupRack}*\n\n".
                "*Cara Pengambilan di Toko:*\n".
                "1. Kunjungi cabang *{$branch}*.\n".
                "2. Masuk ke loker Pick N Go atau temui kasir / staf kami.\n".
                "3. Tunjukkan nomor pesanan *#{$orderNumber}* atau PIN *{$pickupPin}*.\n".
                "4. Ambil barang kamu di rak *{$pickupRack}*.\n\n".
                'Terima kasih telah berbelanja di *MakassarNotebook*! 🙏';
        }

        $courier = $order->courier ?: 'Kurir Toko';
        $address = $order->shipping_address ?: 'Alamat terdaftar';

        return "Halo kak *{$customerName}*! 🎉\n\n".
            "Kabar gembira! Pembayaran untuk pesanan *#{$orderNumber}* sebesar *{$totalFormatted}* telah *BERHASIL KAMI TERIMA*.\n\n".
            "📦 *Status:* Sedang Diproses & Disiapkan\n".
            "🚚 *Kurir:* {$courier}\n".
            "📍 *Tujuan:* {$address}\n\n".
            "Pesanan kamu sedang dikemas oleh tim kami. Resi pengiriman akan kami informasikan segera setelah paket diserahkan ke kurir.\n\n".
            'Terima kasih telah berbelanja di *MakassarNotebook*! 🙏';
    }

    /**
     * Kirim payload multipart ke Whapify.
     *
     * @param  array<string, mixed>  $fields
     * @return array{status: int, messageId: mixed, raw: array<string, mixed>}
     */
    protected function send(array $fields): array
    {
        $secret = $this->getSecret();
        $account = $this->getAccount();

        if ($secret === '' || $account === '') {
            throw new RuntimeException('Konfigurasi Whapify belum lengkap. Silakan isi Secret dan Account ID di menu Pengaturan Admin.');
        }

        $baseUrl = $this->getBaseUrl();

        $payload = array_merge([
            'secret' => $secret,
            'account' => $account,
            'priority' => $this->getPriority(),
        ], $fields);

        // Ubah semua field menjadi string/int untuk multipart form data
        $multipart = [];
        foreach ($payload as $name => $contents) {
            if ($contents !== null) {
                $multipart[] = [
                    'name' => (string) $name,
                    'contents' => (string) $contents,
                ];
            }
        }

        $response = Http::timeout(25)
            ->asMultipart()
            ->post("{$baseUrl}/send/whatsapp", $multipart);

        $this->throwIfFailed($response);

        return [
            'status' => (int) $response->json('status', 200),
            'messageId' => $response->json('data.messageId'),
            'raw' => $response->json() ?? [],
        ];
    }

    /**
     * Evaluasi response dari server Whapify.
     */
    protected function throwIfFailed(Response $response): void
    {
        $status = (int) $response->json('status', $response->status());
        $message = (string) ($response->json('message') ?? $response->body());

        if ($response->failed() || $status !== 200) {
            throw new RuntimeException('Gagal mengirim WhatsApp (Whapify): '.($message !== '' ? $message : 'HTTP '.$response->status()));
        }
    }
}
