import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    HelpCircle,
    MessageSquare,
    RefreshCw,
    Send,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

type SettingsData = {
    base_url: string;
    secret: string;
    account: string;
    priority: number;
    is_enabled: boolean;
    is_configured: boolean;
};

type PageProps = {
    settings: SettingsData;
    samplePreviews: {
        order_created: string;
        order_paid: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors: Record<string, string>;
};

export default function WhatsAppSettings({ settings, samplePreviews }: PageProps) {
    const { errors: pageErrors } = usePage<PageProps>().props;
    const [showSecret, setShowSecret] = useState(false);
    const [activePreviewTab, setActivePreviewTab] = useState<'order_created' | 'order_paid'>('order_created');

    // Form Konfigurasi Utama
    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        base_url: settings.base_url || 'https://whapify.id/api',
        secret: settings.secret || '',
        account: settings.account || '',
        priority: settings.priority || 2,
        is_enabled: settings.is_enabled ?? true,
    });

    // Form Test Pengiriman
    const {
        data: testData,
        setData: setTestData,
        post: postTest,
        processing: testProcessing,
        errors: testErrors,
        reset: resetTest,
    } = useForm({
        recipient: '',
        message: '',
    });

    const handleSaveConfig: FormEventHandler = (e) => {
        e.preventDefault();
        put('/admin/settings/whatsapp', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan WhatsApp Whapify berhasil disimpan.');
            },
            onError: () => {
                toast.error('Gagal menyimpan pengaturan. Silakan periksa formulir.');
            },
        });
    };

    const handleSendTest: FormEventHandler = (e) => {
        e.preventDefault();
        if (!testData.recipient) {
            toast.error('Masukkan nomor WhatsApp tujuan terlebih dahulu.');
            return;
        }

        postTest('/admin/settings/whatsapp/test', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pesan uji coba berhasil dikirim!');
                resetTest('message');
            },
            onError: (err) => {
                toast.error(err.test || 'Gagal mengirim pesan uji coba.');
            },
        });
    };

    return (
        <>
            <Head title="Pengaturan WhatsApp Whapify" />

            <div className="flex flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                                <MessageSquare className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#222222]">
                                Pengaturan Notifikasi WhatsApp
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-[#666666]">
                            Kelola kredensial Whapify.id langsung dari database tanpa perlu mengedit file .env di server.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {settings.is_configured && data.is_enabled ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                Gateway Siap & Aktif
                            </span>
                        ) : !data.is_enabled ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                <span className="size-2 rounded-full bg-slate-400" />
                                Dinonaktifkan
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                <AlertCircle className="size-3.5" />
                                Belum Dikonfigurasi
                            </span>
                        )}
                    </div>
                </div>

                {/* Main Grid Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Form Pengaturan */}
                    <div className="flex flex-col gap-6 lg:col-span-7">
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs sm:p-6">
                            <div className="mb-5 flex items-center justify-between border-b border-[#F0F0F0] pb-4">
                                <div>
                                    <h2 className="text-sm font-bold text-[#222222]">
                                        Kredensial Gateway Whapify.id
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#777777]">
                                        Nilai yang tersimpan di sini akan memprioritaskan konfigurasi database di atas .env.
                                    </p>
                                </div>
                                <span className="rounded bg-[#F5F5F5] px-2 py-0.5 text-[11px] font-mono text-[#666]">
                                    POST /send/whatsapp
                                </span>
                            </div>

                            <form onSubmit={handleSaveConfig} className="space-y-4">
                                {/* Toggle Aktifkan */}
                                <div className="flex items-center justify-between rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-3.5">
                                    <div>
                                        <label htmlFor="is_enabled" className="text-xs font-semibold text-[#222222]">
                                            Status Pengiriman WhatsApp
                                        </label>
                                        <p className="text-[11px] text-[#777777]">
                                            Aktifkan pengiriman otomatis saat checkout dan saat pembayaran sukses.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_enabled', !data.is_enabled)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                            data.is_enabled ? 'bg-[#25D366]' : 'bg-[#D1D5DB]'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                data.is_enabled ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Base URL */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#333333]">
                                        Base URL API Whapify
                                    </label>
                                    <input
                                        type="url"
                                        value={data.base_url}
                                        onChange={(e) => setData('base_url', e.target.value)}
                                        placeholder="https://whapify.id/api"
                                        className="h-9 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 text-xs text-[#222222] transition-colors focus:border-[#0099FF] focus:outline-hidden focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.base_url && (
                                        <p className="mt-1 text-[11px] text-red-600">{errors.base_url}</p>
                                    )}
                                    <p className="mt-1 text-[11px] text-[#888888]">
                                        Default: <code className="font-mono text-[#555]">https://whapify.id/api</code>
                                    </p>
                                </div>

                                {/* Secret */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <label className="text-xs font-semibold text-[#333333]">
                                            API Secret (WHAPIFY_SECRET)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="inline-flex items-center gap-1 text-[11px] text-[#0099FF] hover:underline"
                                        >
                                            {showSecret ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                                            {showSecret ? 'Sembunyikan' : 'Tampilkan'}
                                        </button>
                                    </div>
                                    <input
                                        type={showSecret ? 'text' : 'password'}
                                        value={data.secret}
                                        onChange={(e) => setData('secret', e.target.value)}
                                        placeholder="Salin API Secret dari Tools -> API Keys Whapify"
                                        className="h-9 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 text-xs text-[#222222] font-mono transition-colors focus:border-[#0099FF] focus:outline-hidden focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.secret && (
                                        <p className="mt-1 text-[11px] text-red-600">{errors.secret}</p>
                                    )}
                                    <p className="mt-1 text-[11px] text-[#888888]">
                                        Dapatkan di dashboard Whapify.id: <strong>Tools &rarr; API Keys</strong> (pastikan izin <code className="font-mono text-emerald-700">wa_send</code> aktif).
                                    </p>
                                </div>

                                {/* Account ID */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#333333]">
                                        Account Unique ID (WHAPIFY_ACCOUNT)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account}
                                        onChange={(e) => setData('account', e.target.value)}
                                        placeholder="Contoh: acc_66f1234abcd..."
                                        className="h-9 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 text-xs text-[#222222] font-mono transition-colors focus:border-[#0099FF] focus:outline-hidden focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.account && (
                                        <p className="mt-1 text-[11px] text-red-600">{errors.account}</p>
                                    )}
                                    <p className="mt-1 text-[11px] text-[#888888]">
                                        Unique ID dari akun/device WhatsApp yang telah dipindai QR code dan berstatus <em>Connected</em>.
                                    </p>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#333333]">
                                        Prioritas Pengiriman Default (WHAPIFY_PRIORITY)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('priority', 2)}
                                            className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                                                data.priority === 2
                                                    ? 'border-[#0099FF] bg-[#F0F8FF] text-[#0099FF]'
                                                    : 'border-[#E0E0E0] bg-white text-[#555] hover:bg-[#FAFAFA]'
                                            }`}
                                        >
                                            <span className="text-xs font-bold">2 - Antrean Normal</span>
                                            <span className="mt-0.5 text-[11px] opacity-80">
                                                Direkomendasikan untuk notifikasi pesanan umum (anti-banned).
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('priority', 1)}
                                            className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                                                data.priority === 1
                                                    ? 'border-[#0099FF] bg-[#F0F8FF] text-[#0099FF]'
                                                    : 'border-[#E0E0E0] bg-white text-[#555] hover:bg-[#FAFAFA]'
                                            }`}
                                        >
                                            <span className="text-xs font-bold">1 - Prioritas Tinggi / Segera</span>
                                            <span className="mt-0.5 text-[11px] opacity-80">
                                                Kirim langsung tanpa jeda (dipakai untuk OTP & PIN Loker).
                                            </span>
                                        </button>
                                    </div>
                                    {errors.priority && (
                                        <p className="mt-1 text-[11px] text-red-600">{errors.priority}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-3">
                                    <div className="text-[11px] text-[#888888]">
                                        {recentlySuccessful && (
                                            <span className="inline-flex items-center gap-1 text-emerald-600">
                                                <CheckCircle2 className="size-3.5" />
                                                Tersimpan di database!
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#FF6000] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#E05500] disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <RefreshCw className="size-3.5 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="size-3.5" />
                                                Simpan Pengaturan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Uji Coba Pengiriman Box */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs sm:p-6">
                            <div className="mb-4 flex items-center gap-2 border-b border-[#F0F0F0] pb-3">
                                <Send className="size-4 text-[#0099FF]" />
                                <h2 className="text-sm font-bold text-[#222222]">
                                    Uji Coba Pengiriman Langsung
                                </h2>
                            </div>
                            <p className="mb-4 text-xs text-[#666666]">
                                Tes koneksi API Whapify dan nomor device Anda dengan mengirim pesan uji coba ke nomor tujuan berikut:
                            </p>

                            <form onSubmit={handleSendTest} className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#333333]">
                                        Nomor WhatsApp Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.recipient}
                                        onChange={(e) => setTestData('recipient', e.target.value)}
                                        placeholder="Contoh: 081234567890 atau 6281234567890"
                                        className="h-9 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 text-xs text-[#222222] transition-colors focus:border-[#0099FF] focus:outline-hidden focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {testErrors.recipient && (
                                        <p className="mt-1 text-[11px] text-red-600">{testErrors.recipient}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#333333]">
                                        Pesan Kustom (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.message}
                                        onChange={(e) => setTestData('message', e.target.value)}
                                        placeholder="Pesan tes otomatis akan dikirim jika dikosongkan..."
                                        className="h-9 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 text-xs text-[#222222] transition-colors focus:border-[#0099FF] focus:outline-hidden focus:ring-1 focus:ring-[#0099FF]"
                                    />
                                    {testErrors.message && (
                                        <p className="mt-1 text-[11px] text-red-600">{testErrors.message}</p>
                                    )}
                                </div>

                                {pageErrors.test && (
                                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                        <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                                        <span>{pageErrors.test}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={testProcessing || !settings.is_configured}
                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#0099FF] bg-[#F0F8FF] px-4 text-xs font-bold text-[#0099FF] transition-all hover:bg-[#0099FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {testProcessing ? (
                                        <>
                                            <RefreshCw className="size-3.5 animate-spin" />
                                            Mengirim Uji Coba...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-3.5" />
                                            Kirim Pesan Tes Sekarang
                                        </>
                                    )}
                                </button>
                                {!settings.is_configured && (
                                    <p className="text-[11px] text-amber-600">
                                        * Harap simpan API Secret dan Account ID terlebih dahulu sebelum melakukan uji coba.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Preview Pesan Transaksional */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs sm:p-6">
                            <div className="mb-4 flex items-center justify-between border-b border-[#F0F0F0] pb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-[#FF6000]" />
                                    <h2 className="text-sm font-bold text-[#222222]">
                                        Preview Notifikasi Klien
                                    </h2>
                                </div>
                                <span className="text-[11px] text-[#888888]">
                                    Format Otomatis
                                </span>
                            </div>

                            {/* Switch Tabs for Preview */}
                            <div className="mb-4 flex rounded-lg bg-[#F5F5F5] p-1">
                                <button
                                    type="button"
                                    onClick={() => setActivePreviewTab('order_created')}
                                    className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                        activePreviewTab === 'order_created'
                                            ? 'bg-white text-[#222222] shadow-2xs'
                                            : 'text-[#666666] hover:text-[#222222]'
                                    }`}
                                >
                                    Pesanan Baru (Belum Bayar)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivePreviewTab('order_paid')}
                                    className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                        activePreviewTab === 'order_paid'
                                            ? 'bg-white text-[#222222] shadow-2xs'
                                            : 'text-[#666666] hover:text-[#222222]'
                                    }`}
                                >
                                    Pembayaran Berhasil (Lunas)
                                </button>
                            </div>

                            {/* WhatsApp Simulated Bubble */}
                            <div className="rounded-xl border border-[#D1D7DB] bg-[#EFEAE2] p-4 shadow-inner">
                                <div className="flex items-center justify-between border-b border-[#E1DBD2] pb-2 text-[10px] text-[#707579]">
                                    <span className="font-semibold text-[#075E54]">MakassarNotebook Official</span>
                                    <span>Hari ini, 14:30</span>
                                </div>

                                <div className="mt-3 max-w-[95%] rounded-lg rounded-tl-none bg-white p-3.5 text-xs leading-relaxed text-[#111B21] shadow-xs">
                                    <pre className="font-sans whitespace-pre-wrap font-normal text-[12px] leading-5 text-[#111b21]">
                                        {activePreviewTab === 'order_created'
                                            ? samplePreviews.order_created
                                            : samplePreviews.order_paid}
                                    </pre>
                                    <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
                                        <span>14:31</span>
                                        <span className="text-[#53BDEB]">✓✓</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-[11px] text-[#666666]">
                                <div className="flex items-start gap-1.5">
                                    <HelpCircle className="size-3.5 shrink-0 text-[#0099FF] mt-0.5" />
                                    <span>
                                        <strong>Pesanan Belum Bayar:</strong> Dikirim sesaat setelah pembeli checkout, dilengkapi rincian barang, total tagihan, dan link pembayaran DOKU.
                                    </span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <HelpCircle className="size-3.5 shrink-0 text-[#25D366] mt-0.5" />
                                    <span>
                                        <strong>Pembayaran Berhasil:</strong> Dikirim otomatis saat webhook DOKU menerima status SUCCESS, dilengkapi PIN Loker dan nomor rak Pick N Go.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

WhatsAppSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengaturan', href: '#' },
        { title: 'WhatsApp Whapify', href: '/admin/settings/whatsapp' },
    ],
};

