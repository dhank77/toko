import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    MapPin,
    Package,
    Plus,
    QrCode,
    RefreshCw,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

const activePickNGo = {
    orderNumber: 'MKN-20260926-0041',
    branch: 'Cabang Panakkukang (Pengayoman)',
    pickupPin: '739-102',
    status: 'Siap Diambil di Rak B-02',
    expiresAt: '23:59 WITA',
    items: [
        {
            name: 'Taffware Pompa Ban Elektrik Portable 150 PSI',
            sku: 'MKN-7RTH14BK',
            qty: 1,
            price: 198000,
        },
        {
            name: 'Baseus 7-in-1 USB-C Hub 4K 100W PD',
            sku: 'MKN-9XPL02GY',
            qty: 1,
            price: 269000,
        },
    ],
    total: 467000,
};

const recentTransactions = [
    {
        id: 'MKN-20260925-0812',
        type: 'Pick N Go',
        branch: 'Panakkukang',
        date: '25 Sep 2026, 14:20',
        total: 175000,
        status: 'Selesai Diambil',
        statusColor: 'bg-[#00ED64]/20 text-[#00684A] border-[#00ED64]',
    },
    {
        id: 'MKN-20260922-0391',
        type: 'Dropship Kurir (J&T)',
        branch: 'Gudang Pusat',
        date: '22 Sep 2026, 10:15',
        total: 734000,
        status: 'Terkirim (Resi Terbit)',
        statusColor: 'bg-[#7928CA]/15 text-[#7928CA] border-[#7928CA]/30',
    },
    {
        id: 'MKN-20260919-0114',
        type: 'Pick N Go',
        branch: 'AP Pettarani',
        date: '19 Sep 2026, 18:45',
        total: 389000,
        status: 'Selesai Diambil',
        statusColor: 'bg-[#00ED64]/20 text-[#00684A] border-[#00ED64]',
    },
];

export default function Dashboard() {
    const [copiedPin, setCopiedPin] = useState(false);

    const copyPin = () => {
        navigator.clipboard.writeText(activePickNGo.pickupPin.replace('-', ''));
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]}>
            <Head title="Ringkasan Toko - MakassarNotebook" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F9FBFA] text-[#001E2B]">
                {/* Header Greeting Banner */}
                <div className="rounded-xl border border-[#1C3B47] bg-[#001E2B] p-6 text-white shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#00ED64]/20 px-3 py-0.5 text-xs font-semibold text-[#00ED64]">
                                <Sparkles className="size-3.5" />
                                <span>Mitra Dropshipper Aktif - Tier Gold</span>
                            </div>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                Halo, Mitra MakassarNotebook!
                            </h1>
                            <p className="mt-1 text-xs text-[#8998A5] sm:text-sm">
                                Kelola pesanan Pick N Go, periksa saldo dompet dropship, dan pantau stok multi-cabang secara instan.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="/#katalog"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#00ED64] px-5 text-xs font-bold text-[#001E2B] transition-all hover:bg-[#00C351] active:scale-98"
                            >
                                <Plus className="size-4" /> Buat Pesanan Baru
                            </a>
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#1C3B47] px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                <FileText className="size-4 text-[#00ED64]" /> Cetak Resi Netral
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3 Metric Cards (DESIGN.md: 12px rounded cards, featured mint tier styling) */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Dompet Saldo Dropship (Featured Mint Card) */}
                    <div className="rounded-xl border-2 border-[#00ED64] bg-[#E8FCF4] p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#00684A] uppercase">
                                Saldo Dompet Dropship
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#001E2B] text-[#00ED64]">
                                <Wallet className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-[#001E2B]">
                            Rp 2.450.000
                        </div>
                        <p className="mt-1 text-xs text-[#00684A]">
                            Otomatis terpotong saat pesanan dropship masuk
                        </p>
                        <div className="mt-5 border-t border-[#00ED64]/30 pt-4 flex items-center justify-between">
                            <span className="text-xs text-[#001E2B] font-medium">Bebas Fee Gateway</span>
                            <button
                                type="button"
                                className="inline-flex h-8 items-center justify-center rounded-full bg-[#001E2B] px-4 text-xs font-semibold text-[#00ED64] hover:bg-[#093B47]"
                            >
                                Top Up Saldo
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Pick N Go Status */}
                    <div className="rounded-xl border border-[#E8EDEB] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#5C768D] uppercase">
                                Pesanan Siap Diambil
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#001E2B] text-white">
                                <ShoppingBag className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-[#001E2B]">
                            1 Pesanan
                        </div>
                        <p className="mt-1 text-xs text-[#5C768D]">
                            Di Cabang Panakkukang (Batas ambil 23:59 WITA)
                        </p>
                        <div className="mt-5 border-t border-[#E8EDEB] pt-4 flex items-center justify-between text-xs text-[#5C768D]">
                            <span>PIN: <strong className="font-mono text-[#001E2B]">739-102</strong></span>
                            <span className="font-semibold text-[#00A35C]">● Siap di Rak</span>
                        </div>
                    </div>

                    {/* Card 3: Total Transaksi Bulan Ini */}
                    <div className="rounded-xl border border-[#E8EDEB] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#5C768D] uppercase">
                                Transaksi Bulan September
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#001E2B] text-white">
                                <CreditCard className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-[#001E2B]">
                            Rp 18.620.000
                        </div>
                        <p className="mt-1 text-xs text-[#5C768D]">
                            34 pesanan selesai (28 dropship, 6 pick n go)
                        </p>
                        <div className="mt-5 border-t border-[#E8EDEB] pt-4 flex items-center justify-between text-xs text-[#5C768D]">
                            <span>Margin Untung Bersih</span>
                            <strong className="text-[#00A35C]">+Rp 3.840.000</strong>
                        </div>
                    </div>
                </div>

                {/* Active Pick N Go Quick Ticket Card */}
                <div className="rounded-xl border border-[#E8EDEB] bg-white p-6 shadow-xs">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#E8EDEB] pb-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#00ED64]/20 text-[#00684A]">
                                <QrCode className="size-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold text-[#001E2B]">
                                        Tiket Pengambilan: {activePickNGo.orderNumber}
                                    </h2>
                                    <span className="rounded-full bg-[#00ED64] px-2 py-0.5 text-[10px] font-bold text-[#001E2B]">
                                        SIAP DIAMBIL
                                    </span>
                                </div>
                                <p className="text-xs text-[#5C768D]">
                                    Tunjukkan PIN ini ke kasir toko cabang {activePickNGo.branch}
                                </p>
                            </div>
                        </div>

                        {/* PIN Code Box */}
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg border-2 border-dashed border-[#00ED64] bg-[#F9FBFA] px-4 py-2 text-center">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C768D]">
                                    PIN PENGAMBILAN
                                </div>
                                <div className="font-mono text-2xl font-black tracking-widest text-[#001E2B]">
                                    {activePickNGo.pickupPin}
                                </div>
                            </div>
                            <button
                                onClick={copyPin}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-[#001E2B] px-4 text-xs font-semibold text-white hover:bg-[#093B47]"
                            >
                                {copiedPin ? '✓ Tersalin' : 'Salin PIN'}
                            </button>
                        </div>
                    </div>

                    {/* Order Item List */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {activePickNGo.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg border border-[#F0F4F2] bg-[#F9FBFA] p-3 text-xs"
                            >
                                <div>
                                    <div className="font-semibold text-[#001E2B]">{item.name}</div>
                                    <div className="font-mono text-[10px] text-[#8998A5]">
                                        SKU: {item.sku} • Qty: {item.qty}
                                    </div>
                                </div>
                                <div className="font-bold text-[#001E2B]">
                                    Rp {item.price.toLocaleString('id-ID')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transaction Table (DESIGN.md: comparison-table styling) */}
                <div className="rounded-xl border border-[#E8EDEB] bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#E8EDEB] pb-4">
                        <div>
                            <h2 className="text-base font-bold text-[#001E2B]">
                                Riwayat Pesanan Terbaru
                            </h2>
                            <p className="text-xs text-[#5C768D]">
                                Transaksi pembelian langsung, Pick N Go toko fisik, dan pesanan dropshipper.
                            </p>
                        </div>
                        <a
                            href="/#katalog"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00684A] hover:underline"
                        >
                            Belanja Lagi <ArrowUpRight className="size-3.5" />
                        </a>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#E8EDEB] text-[#8998A5]">
                                    <th className="py-3 pr-4 font-semibold uppercase tracking-wider">No. Pesanan</th>
                                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Tipe</th>
                                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Cabang / Gudang</th>
                                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Waktu</th>
                                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Total</th>
                                    <th className="py-3 pl-4 font-semibold uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F4F2]">
                                {recentTransactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-[#F9FBFA] transition-colors">
                                        <td className="py-3.5 pr-4 font-mono font-bold text-[#001E2B]">{trx.id}</td>
                                        <td className="py-3.5 px-4 text-[#001E2B] font-medium">{trx.type}</td>
                                        <td className="py-3.5 px-4 text-[#5C768D]">{trx.branch}</td>
                                        <td className="py-3.5 px-4 text-[#8998A5]">{trx.date}</td>
                                        <td className="py-3.5 px-4 font-bold text-[#001E2B]">
                                            Rp {trx.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3.5 pl-4 text-right">
                                            <span
                                                className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${trx.statusColor}`}
                                            >
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
