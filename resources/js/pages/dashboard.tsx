import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Package,
    Plus,
    ShoppingBag,
    Sparkles,
    Store,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
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
        statusColor: 'bg-[#E6F5FF] text-[#0099FF] border-[#0099FF]/40',
    },
    {
        id: 'MKN-20260922-0391',
        type: 'Dropship Kurir (J&T)',
        branch: 'Gudang Pusat',
        date: '22 Sep 2026, 10:15',
        total: 734000,
        status: 'Terkirim (Resi Terbit)',
        statusColor: 'bg-[#FFF3EB] text-[#FF6000] border-[#FF6000]/40',
    },
    {
        id: 'MKN-20260919-0114',
        type: 'Pick N Go',
        branch: 'AP Pettarani',
        date: '19 Sep 2026, 18:45',
        total: 389000,
        status: 'Selesai Diambil',
        statusColor: 'bg-[#E6F5FF] text-[#0099FF] border-[#0099FF]/40',
    },
];

export default function Dashboard() {
    const [copiedPin, setCopiedPin] = useState(false);

    const copyPin = () => {
        void navigator.clipboard.writeText(
            activePickNGo.pickupPin.replace('-', ''),
        );
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
    };

    return (
        <>
            <Head title="Member &amp; Reseller Dashboard - MakassarNotebook" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Header Greeting Banner with MakassarNotebook Navy Accent */}
                <div className="rounded-xl border border-[#166397]/30 bg-gradient-to-r from-[#166397] to-[#12527D] p-6 text-white shadow-xs sm:p-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6000] px-3 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                <Sparkles className="size-3.5" />
                                <span>
                                    Mitra Reseller &amp; Dropshipper - Tier Gold
                                </span>
                            </div>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Halo, Mitra MakassarNotebook!
                            </h1>
                            <p className="mt-1 text-xs text-white/80 sm:text-sm">
                                Kelola pesanan Pick N Go, periksa saldo dompet
                                dropship, dan pantau stok toko offline secara
                                instan #SudahPastiMurahnya.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="/"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#007ACC] active:scale-98"
                            >
                                <Plus className="size-4" /> Belanja Produk Baru
                            </a>
                            <button
                                type="button"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                            >
                                <FileText className="size-4 text-[#FFD166]" />{' '}
                                Cetak Resi Netral
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Dompet Saldo Dropship */}
                    <div className="relative overflow-hidden rounded-xl border border-[#0099FF]/40 bg-white p-6 shadow-xs">
                        <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-[#E6F5FF]" />
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#0099FF] uppercase">
                                Saldo Dompet Dropship
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#0099FF] text-white">
                                <Wallet className="size-4.5" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-4 text-3xl font-bold text-[#222222]">
                            Rp 2.450.000
                        </div>
                        <p className="relative z-10 mt-1 text-xs text-[#666666]">
                            Otomatis terpotong saat pesanan dropship masuk
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-[#F0F0F0] pt-4">
                            <span className="text-xs font-medium text-[#666666]">
                                Bebas Biaya Admin
                            </span>
                            <button
                                type="button"
                                className="inline-flex h-8 items-center justify-center rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white transition-colors hover:bg-[#007ACC]"
                            >
                                Top Up Saldo
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Pick N Go Status */}
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#FF6000] uppercase">
                                Pesanan Siap Diambil
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#FF6000] text-white">
                                <ShoppingBag className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-[#222222]">
                            1 Pesanan
                        </div>
                        <p className="mt-1 text-xs text-[#666666]">
                            Cabang Panakkukang (Batas ambil 23:59 WITA)
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-[#F0F0F0] pt-4 text-xs text-[#666666]">
                            <span>
                                PIN:{' '}
                                <strong className="font-mono font-bold text-[#0099FF]">
                                    739-102
                                </strong>
                            </span>
                            <span className="font-semibold text-[#0099FF]">
                                ● Siap di Rak
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Total Transaksi Bulan Ini */}
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-[#666666] uppercase">
                                Transaksi Bulan Ini
                            </span>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#166397] text-white">
                                <Package className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-[#222222]">
                            14 Pesanan
                        </div>
                        <p className="mt-1 text-xs text-[#666666]">
                            Akumulasi omzet:{' '}
                            <strong className="text-[#222222]">
                                Rp 4.820.000
                            </strong>
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-[#F0F0F0] pt-4 text-xs text-[#666666]">
                            <span>Status Pengiriman</span>
                            <span className="font-semibold text-[#0099FF]">
                                100% On Time
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active Pick N Go Locker Highlight Card */}
                <div className="rounded-xl border border-[#0099FF]/30 bg-white p-6 shadow-xs">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#F0F0F0] pb-5 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#E6F5FF] text-[#0099FF]">
                                <Store className="size-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-[#222222]">
                                        Ambil di Toko (Pick N Go)
                                    </h3>
                                    <span className="rounded bg-[#E6F5FF] px-2 py-0.5 text-[10px] font-bold text-[#0099FF]">
                                        {activePickNGo.status}
                                    </span>
                                </div>
                                <p className="text-xs text-[#666666]">
                                    No. Pesanan:{' '}
                                    <strong className="text-[#222222]">
                                        {activePickNGo.orderNumber}
                                    </strong>{' '}
                                    &bull; {activePickNGo.branch}
                                </p>
                            </div>
                        </div>

                        {/* PIN Code Box with Copy Button */}
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg border border-[#0099FF] bg-[#E6F5FF] px-4 py-2 text-center">
                                <div className="text-[10px] font-bold tracking-wider text-[#007ACC] uppercase">
                                    PIN Pengambilan
                                </div>
                                <div className="font-mono text-xl font-black text-[#0099FF]">
                                    {activePickNGo.pickupPin}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={copyPin}
                                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white transition-all hover:bg-[#007ACC]"
                            >
                                {copiedPin ? 'Tersalin!' : 'Salin PIN'}
                            </button>
                        </div>
                    </div>

                    {/* Items List in Locker */}
                    <div className="mt-5 space-y-3">
                        <div className="text-xs font-bold text-[#222222]">
                            Detail Barang dalam Pesanan:
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {activePickNGo.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-xs"
                                >
                                    <div>
                                        <div className="font-semibold text-[#222222]">
                                            {item.name}
                                        </div>
                                        <div className="text-[10px] text-[#666666]">
                                            SKU: {item.sku} &bull; Qty:{' '}
                                            {item.qty} pcs
                                        </div>
                                    </div>
                                    <div className="font-bold text-[#222222]">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between border-b border-[#F0F0F0] pb-4">
                        <div>
                            <h3 className="text-base font-bold text-[#222222]">
                                Riwayat Transaksi Terkini
                            </h3>
                            <p className="text-xs text-[#666666]">
                                Daftar pesanan offline Pick N Go dan
                                blind-dropship kurir
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="text-xs font-bold text-[#0099FF] hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                    <th className="px-3 py-2.5 font-semibold">
                                        ID Pesanan
                                    </th>
                                    <th className="px-3 py-2.5 font-semibold">
                                        Tipe Layanan
                                    </th>
                                    <th className="px-3 py-2.5 font-semibold">
                                        Cabang / Jalur
                                    </th>
                                    <th className="px-3 py-2.5 font-semibold">
                                        Waktu Transaksi
                                    </th>
                                    <th className="px-3 py-2.5 font-semibold">
                                        Total Pembayaran
                                    </th>
                                    <th className="px-3 py-2.5 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F0]">
                                {recentTransactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="transition-colors hover:bg-[#FAFAFA]"
                                    >
                                        <td className="px-3 py-3 font-mono font-bold text-[#0099FF]">
                                            {tx.id}
                                        </td>
                                        <td className="px-3 py-3 font-medium text-[#222222]">
                                            {tx.type}
                                        </td>
                                        <td className="px-3 py-3 text-[#666666]">
                                            {tx.branch}
                                        </td>
                                        <td className="px-3 py-3 text-[#666666]">
                                            {tx.date}
                                        </td>
                                        <td className="px-3 py-3 font-bold text-[#222222]">
                                            Rp{' '}
                                            {tx.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span
                                                className={`inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-bold ${tx.statusColor}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
