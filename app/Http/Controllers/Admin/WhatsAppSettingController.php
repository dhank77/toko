<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\WhapifyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class WhatsAppSettingController extends Controller
{
    public function __construct(protected WhapifyService $whapify) {}

    /**
     * Tampilkan halaman formulir konfigurasi WhatsApp Whapify.
     */
    public function index(Request $request): Response
    {
        abort_if(! $request->user()?->isAdmin(), 403, 'Akses ditolak.');

        $baseUrl = (string) (Setting::get('whapify_base_url') ?: config('services.whapify.base_url', 'https://whapify.id/api'));
        $secret = (string) (Setting::get('whapify_secret') ?: (config('services.whapify.secret') ?? ''));
        $account = (string) (Setting::get('whapify_account') ?: (config('services.whapify.account') ?? ''));
        $priority = (int) (Setting::get('whapify_priority') ?? config('services.whapify.priority', 2));
        $isEnabled = (bool) Setting::get('whapify_is_enabled', true);

        $samplePreviews = [
            'order_created' => "Halo kak *Budi Santoso*! 👋\n\n".
                "Terima kasih telah memesan di *MakassarNotebook*.\n".
                "Pesanan kamu dengan nomor *#MKN-20261011-00123* telah dibuat dan saat ini *MENUNGGU PEMBAYARAN*.\n\n".
                "📦 *Rincian Pesanan:*\n".
                "1. Keyboard Mechanical RGB (1x) - Rp 350.000\n".
                "2. Mouse Gaming Wireless (1x) - Rp 250.000\n\n".
                "💰 *Total Tagihan:* *Rp 600.000*\n".
                "🏪 *Metode:* Ambil di Toko (Cabang Panakkukang)\n\n".
                "Segera selesaikan pembayaran kamu melalui link berikut:\n".
                "👉 https://checkout.doku.com/payment/xyz...\n\n".
                "_Mohon selesaikan pembayaran sebelum batas waktu berakhir agar pesanan tidak dibatalkan otomatis._\n\n".
                "Salam,\n*MakassarNotebook Team*",

            'order_paid' => "Halo kak *Budi Santoso*! 🎉\n\n".
                "Kabar gembira! Pembayaran untuk pesanan *#MKN-20261011-00123* sebesar *Rp 600.000* telah *BERHASIL KAMI TERIMA*.\n\n".
                "📦 *Status:* Siap Diambil (Pick N Go)\n".
                "🏢 *Cabang:* Panakkukang\n".
                "🔑 *PIN Pengambilan:* *824-192*\n".
                "📍 *Lokasi Rak:* *Rak B-04*\n\n".
                "*Cara Pengambilan di Toko:*\n".
                "1. Kunjungi cabang *Panakkukang*.\n".
                "2. Masuk ke loker Pick N Go atau temui kasir / staf kami.\n".
                "3. Tunjukkan nomor pesanan *#MKN-20261011-00123* atau PIN *824-192*.\n".
                "4. Ambil barang kamu di rak *Rak B-04*.\n\n".
                'Terima kasih telah berbelanja di *MakassarNotebook*! 🙏',
        ];

        return Inertia::render('admin/settings/whatsapp', [
            'settings' => [
                'base_url' => $baseUrl,
                'secret' => $secret,
                'account' => $account,
                'priority' => $priority,
                'is_enabled' => $isEnabled,
                'is_configured' => $secret !== '' && $account !== '',
            ],
            'samplePreviews' => $samplePreviews,
        ]);
    }

    /**
     * Simpan perubahan konfigurasi WhatsApp Whapify ke database.
     */
    public function update(Request $request): RedirectResponse
    {
        abort_if(! $request->user()?->isAdmin(), 403, 'Akses ditolak.');

        $validated = $request->validate([
            'base_url' => ['required', 'url'],
            'secret' => ['required', 'string', 'max:255'],
            'account' => ['required', 'string', 'max:255'],
            'priority' => ['required', 'integer', 'in:1,2'],
            'is_enabled' => ['required', 'boolean'],
        ]);

        Setting::set('whapify_base_url', $validated['base_url']);
        Setting::set('whapify_secret', $validated['secret']);
        Setting::set('whapify_account', $validated['account']);
        Setting::set('whapify_priority', $validated['priority']);
        Setting::set('whapify_is_enabled', $validated['is_enabled'] ? '1' : '0');

        return back()->with('success', 'Pengaturan WhatsApp Whapify berhasil disimpan.');
    }

    /**
     * Kirim pesan WhatsApp uji coba ke nomor yang ditentukan.
     */
    public function test(Request $request): RedirectResponse
    {
        abort_if(! $request->user()?->isAdmin(), 403, 'Akses ditolak.');

        $validated = $request->validate([
            'recipient' => ['required', 'string', 'max:30'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        $message = $validated['message'] ?: "Tes pengiriman WhatsApp dari MakassarNotebook via Whapify.id berhasil! ✅\nWaktu: ".now()->format('d/m/Y H:i:s');

        try {
            $result = $this->whapify->testConnection($validated['recipient'], $message);

            return back()->with('success', $result['message']);
        } catch (Throwable $e) {
            return back()->withErrors([
                'test' => 'Uji coba gagal: '.$e->getMessage(),
            ]);
        }
    }
}
