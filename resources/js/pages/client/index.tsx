import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Clock,
    Copy,
    CreditCard,
    ExternalLink,
    FileText,
    HelpCircle,
    Home,
    MapPin,
    Package,
    Phone,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Store,
    Trash2,
    Truck,
    User,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/utils';
import { logout } from '@/routes';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string;
    address: string;
    province: string;
    province_id: string;
    city: string;
    city_id: string;
    district: string;
    district_id: string;
    subdistrict: string;
    subdistrict_id: string;
    postal_code: string;
    created_at: string;
}

interface OrderItemData {
    id: number;
    product_id: number | null;
    product_name: string;
    sku: string | null;
    price: number;
    quantity: number;
    subtotal: number;
    thumbnail: string | null;
}

interface OrderData {
    id: number;
    order_number: string;
    branch: string;
    fulfillment_type: string;
    status: string;
    pickup_pin: string | null;
    pickup_rack: string | null;
    shipping_address: string | null;
    courier: string | null;
    tracking_number: string | null;
    payment_method: string;
    payment_status: string;
    total_amount: number;
    notes: string | null;
    created_at: string;
    items: OrderItemData[];
}

interface CartItemData {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    branch: string;
    product: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        brand: string | null;
        price: number;
        original_price: number | null;
        discount_percent: number | null;
        stock: number;
        thumbnail: string | null;
    } | null;
}

interface Props {
    user: UserProfile;
    orders: OrderData[];
    cartItems: CartItemData[];
    activeTab: 'profile' | 'orders' | 'cart';
    storeOrigin: { district_id: number; district_name: string };
}

interface WilayahItem {
    id: number | string;
    name: string;
}

interface ShippingOption {
    name: string;
    code: string;
    service: string;
    description: string;
    cost: number;
    etd: string;
}

export default function ClientPortal({
    user,
    orders = [],
    cartItems = [],
    activeTab: initialTab = 'profile',
}: Props) {
    const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'cart'>(initialTab);
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
    const [copiedPin, setCopiedPin] = useState<string | null>(null);

    // Profile form
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Makassar',
        postal_code: user.postal_code || '90222',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/client/profile', {
            onSuccess: () => {
                toast.success('Profil akun pembeli berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui profil. Periksa data kembali.');
            },
        });
    };

    const copyPinToClipboard = (pin: string) => {
        void navigator.clipboard.writeText(pin.replace('-', ''));
        setCopiedPin(pin);
        toast.info(`PIN ${pin} berhasil disalin ke clipboard!`);
        setTimeout(() => setCopiedPin(null), 2500);
    };

    // Cart actions
    const handleUpdateCartQuantity = (cartItemId: number, newQty: number) => {
        if (newQty < 1) return;
        router.patch(
            `/client/cart/${cartItemId}`,
            { quantity: newQty },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Jumlah produk diperbarui'),
            },
        );
    };

    const handleRemoveCartItem = (cartItemId: number, productName?: string) => {
        router.delete(`/client/cart/${cartItemId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    productName
                        ? `"${productName}" dihapus dari keranjang.`
                        : 'Produk dihapus dari keranjang.',
                );
            },
        });
    };

    const handleClearCart = () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?')) {
            router.delete('/client/cart', {
                preserveScroll: true,
                onSuccess: () => toast.success('Keranjang belanja berhasil dikosongkan.'),
            });
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        if (orderStatusFilter === 'all') return true;
        if (orderStatusFilter === 'ready_for_pickup') {
            return order.status === 'ready_for_pickup';
        }
        if (orderStatusFilter === 'shipped') {
            return order.status === 'shipped';
        }
        if (orderStatusFilter === 'completed') {
            return order.status === 'completed';
        }
        return true;
    });

    // Cart totals
    const cartSubtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.product?.price || 0;
        return acc + itemPrice * item.quantity;
    }, 0);

    const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <Head title="Akun Pembeli & Layanan Client - MakassarNotebook" />

            {/* TOP BAR / BREADCRUMB */}
            <div className="border-b border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2.5 text-xs text-[#666666]">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-1 font-semibold text-[#0099FF] hover:underline"
                        >
                            <Home className="size-3.5" />
                            <span>Katalog MakassarNotebook</span>
                        </Link>
                        <ChevronRight className="size-3 text-gray-400" />
                        <span className="font-bold text-[#222222]">Akun Saya (Portal Client)</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0099FF] hover:underline"
                        >
                            <ShoppingBag className="size-3.5" />
                            <span>Lanjut Belanja</span>
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                            href={logout()}
                            as="button"
                            method="post"
                            className="text-xs font-medium text-red-600 hover:underline"
                        >
                            Keluar
                        </Link>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 text-[#222222] sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">

                    {/* HERO HEADER GREETING BANNER */}
                    <div className="relative overflow-hidden rounded-xl border border-[#166397]/20 bg-gradient-to-r from-[#166397] via-[#12527D] to-[#0D3B59] p-6 text-white shadow-xs sm:p-7">
                        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                            <div>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6000] px-3 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                    <UserCheck className="size-3.5" />
                                    <span>Akun Pembeli (Client) Resmi #SudahPastiMurahnya</span>
                                </div>
                                <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Halo, {user.name}!
                                </h1>
                                <p className="mt-1 max-w-2xl text-xs text-white/80 sm:text-sm">
                                    Selamat datang di portal pembeli MakassarNotebook. Kelola profil kontak pengiriman, pantau status pengambilan pesanan Pick N Go di toko cabang, dan kelola keranjang belanja Anda secara instan.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <Link
                                    href="/"
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#007ACC] active:scale-98"
                                >
                                    <Plus className="size-4" /> Belanja Produk Baru
                                </Link>
                                <a
                                    href="/#cabang"
                                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                                >
                                    <Store className="size-3.5 text-[#FFD166]" /> Lokasi Cabang
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 3 STATS SUMMARY CARDS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Card 1: Status Akun */}
                        <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                                    Status Akun Pembeli
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xl font-bold text-[#0099FF]">Client Aktif</span>
                                    <span className="rounded bg-[#E6F5FF] px-2 py-0.5 text-[10px] font-bold text-[#0099FF]">
                                        Verified
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#888888]">
                                    Bergabung sejak {user.created_at || 'Baru mendaftar'}
                                </p>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#E6F5FF] text-[#0099FF]">
                                <User className="size-5.5" />
                            </div>
                        </div>

                        {/* Card 2: Total Pesanan */}
                        <div
                            onClick={() => setCurrentTab('orders')}
                            className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs transition-all hover:border-[#FF6000]/60 hover:shadow-sm"
                        >
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6000]">
                                    Riwayat Pesanan
                                </span>
                                <div className="mt-1 text-xl font-bold text-[#222222]">
                                    {orders.length} Transaksi
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#666666]">
                                    {orders.filter((o) => o.status === 'ready_for_pickup').length} pesanan siap diambil di loker
                                </p>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#FFF3EB] text-[#FF6000]">
                                <Package className="size-5.5" />
                            </div>
                        </div>

                        {/* Card 3: Keranjang Belanja */}
                        <div
                            onClick={() => setCurrentTab('cart')}
                            className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs transition-all hover:border-[#0099FF]/60 hover:shadow-sm"
                        >
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0099FF]">
                                    Keranjang Belanja
                                </span>
                                <div className="mt-1 text-xl font-bold text-[#222222]">
                                    {cartTotalItems} Barang
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#666666]">
                                    Estimasi: <strong className="text-[#222222]">{formatRupiah(cartSubtotal)}</strong>
                                </p>
                            </div>
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#E6F5FF] text-[#0099FF]">
                                <ShoppingCart className="size-5.5" />
                            </div>
                        </div>
                    </div>

                    {/* MAIN NAVIGATION TABS */}
                    <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-1">
                        <button
                            type="button"
                            onClick={() => setCurrentTab('profile')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                                currentTab === 'profile'
                                    ? 'bg-[#0099FF] text-white shadow-xs'
                                    : 'text-[#555555] hover:bg-gray-200/60'
                            }`}
                        >
                            <User className="size-4" />
                            <span>Profil &amp; Kontak Pembeli</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('orders')}
                            className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                                currentTab === 'orders'
                                    ? 'bg-[#0099FF] text-white shadow-xs'
                                    : 'text-[#555555] hover:bg-gray-200/60'
                            }`}
                        >
                            <Package className="size-4" />
                            <span>Riwayat Pesanan</span>
                            {orders.length > 0 && (
                                <span
                                    className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                                        currentTab === 'orders'
                                            ? 'bg-white text-[#0099FF]'
                                            : 'bg-[#FF6000] text-white'
                                    }`}
                                >
                                    {orders.length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('cart')}
                            className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                                currentTab === 'cart'
                                    ? 'bg-[#0099FF] text-white shadow-xs'
                                    : 'text-[#555555] hover:bg-gray-200/60'
                            }`}
                        >
                            <ShoppingCart className="size-4" />
                            <span>Keranjang Belanja</span>
                            {cartTotalItems > 0 && (
                                <span
                                    className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                                        currentTab === 'cart'
                                            ? 'bg-white text-[#0099FF]'
                                            : 'bg-[#0099FF] text-white'
                                    }`}
                                >
                                    {cartTotalItems}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* ========================================================
                        TAB 1: PROFIL PEMBELI
                        ======================================================== */}
                    {currentTab === 'profile' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Profile Edit Form */}
                            <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs lg:col-span-2">
                                <div className="border-b border-[#F0F0F0] pb-4">
                                    <h2 className="text-base font-bold text-[#222222]">
                                        Data Profil &amp; Alamat Pengiriman
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#666666]">
                                        Pastikan data nomor WhatsApp dan alamat pengiriman di Makassar sudah sesuai untuk kelancaran transaksi Pick N Go atau kurir instan.
                                    </p>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1.5 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 py-2 text-xs focus:border-[#0099FF] focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                                                placeholder="Nama lengkap pembeli"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700">
                                                Alamat Email (Akun)
                                            </label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#E5E5E5] bg-gray-100 px-3 py-2 text-xs text-gray-500"
                                            />
                                            <p className="mt-1 text-[10px] text-gray-400">
                                                Email digunakan untuk login dan menerima nota digital.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700">
                                                Nomor WhatsApp / HP
                                            </label>
                                            <div className="relative mt-1.5">
                                                <Phone className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className="w-full rounded-lg border border-[#D5D5D5] bg-white py-2 pl-9 pr-3 text-xs focus:border-[#0099FF] focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                                                    placeholder="Contoh: 081234567890"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700">
                                                Kota / Kabupaten
                                            </label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="mt-1.5 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 py-2 text-xs focus:border-[#0099FF] focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                                                placeholder="Contoh: Makassar, Gowa, Maros"
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-[11px] text-red-600">{errors.city}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700">
                                            Alamat Lengkap Pengiriman
                                        </label>
                                        <div className="relative mt-1.5">
                                            <MapPin className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-gray-400" />
                                            <textarea
                                                rows={3}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="w-full rounded-lg border border-[#D5D5D5] bg-white py-2 pl-9 pr-3 text-xs focus:border-[#0099FF] focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                                                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan di area Makassar / Sulawesi Selatan"
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="mt-1 text-[11px] text-red-600">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="sm:w-1/2">
                                        <label className="block text-xs font-bold text-gray-700">
                                            Kode Pos
                                        </label>
                                        <input
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-[#D5D5D5] bg-white px-3 py-2 text-xs focus:border-[#0099FF] focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
                                            placeholder="Contoh: 90222"
                                        />
                                        {errors.postal_code && (
                                            <p className="mt-1 text-[11px] text-red-600">{errors.postal_code}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-[#F0F0F0] pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0099FF] px-5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#007ACC] active:scale-98 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <RefreshCw className="size-3.5 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="size-3.5" />
                                            )}
                                            Simpan Perubahan Profil
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Sidebar Info Card */}
                            <div className="space-y-4">
                                {/* Account Perks Card */}
                                <div className="rounded-xl border border-[#0099FF]/30 bg-[#E6F5FF]/50 p-5 shadow-xs">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#0099FF] uppercase tracking-wider">
                                        <Sparkles className="size-4" />
                                        <span>Keuntungan Akun Pembeli</span>
                                    </div>
                                    <ul className="mt-3 space-y-2 text-xs text-[#444444]">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="size-3.5 shrink-0 text-[#0099FF] mt-0.5" />
                                            <span><strong>Pick N Go Otomatis:</strong> Langsung dapatkan PIN loker saat checkout di toko cabang Makassar.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="size-3.5 shrink-0 text-[#0099FF] mt-0.5" />
                                            <span><strong>Bebas Antre di Kasir:</strong> Bayar via QRIS online, langsung ambil di rak cabang pilihan.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="size-3.5 shrink-0 text-[#0099FF] mt-0.5" />
                                            <span><strong>Garansi Toko Resmi:</strong> Klaim nota digital terintegrasi tanpa perlu bawa struk kertas fisik.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Security / Settings Card */}
                                <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#222222]">
                                        <ShieldCheck className="size-4 text-[#166397]" />
                                        <span>Keamanan &amp; Pengaturan Akun</span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-[#666666]">
                                        Perbarui kata sandi atau aktifkan verifikasi 2 langkah untuk melindungi pesanan Anda.
                                    </p>
                                    <div className="mt-4 flex flex-col gap-2">
                                        <Link
                                            href="/settings/profile"
                                            className="inline-flex h-8 items-center justify-between rounded-lg border border-[#E5E5E5] px-3 text-xs font-semibold text-[#333333] hover:bg-gray-50"
                                        >
                                            <span>Pengaturan Keamanan &amp; Password</span>
                                            <ExternalLink className="size-3 text-gray-400" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        TAB 2: RIWAYAT PESANAN
                        ======================================================== */}
                    {currentTab === 'orders' && (
                        <div className="space-y-4">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-bold text-[#666666]">Filter Status:</span>
                                    <button
                                        type="button"
                                        onClick={() => setOrderStatusFilter('all')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            orderStatusFilter === 'all'
                                                ? 'bg-[#0099FF] text-white'
                                                : 'border border-[#E5E5E5] text-[#555555] hover:bg-gray-100'
                                        }`}
                                    >
                                        Semua ({orders.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOrderStatusFilter('ready_for_pickup')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            orderStatusFilter === 'ready_for_pickup'
                                                ? 'bg-[#0099FF] text-white'
                                                : 'border border-[#E5E5E5] text-[#555555] hover:bg-gray-100'
                                        }`}
                                    >
                                        Siap Diambil di Rak ({orders.filter((o) => o.status === 'ready_for_pickup').length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOrderStatusFilter('shipped')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            orderStatusFilter === 'shipped'
                                                ? 'bg-[#0099FF] text-white'
                                                : 'border border-[#E5E5E5] text-[#555555] hover:bg-gray-100'
                                        }`}
                                    >
                                        Dikirim Kurir ({orders.filter((o) => o.status === 'shipped').length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOrderStatusFilter('completed')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            orderStatusFilter === 'completed'
                                                ? 'bg-[#0099FF] text-white'
                                                : 'border border-[#E5E5E5] text-[#555555] hover:bg-gray-100'
                                        }`}
                                    >
                                        Selesai ({orders.filter((o) => o.status === 'completed').length})
                                    </button>
                                </div>

                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0099FF] hover:underline"
                                >
                                    <Plus className="size-3.5" /> Buat Pesanan Baru
                                </Link>
                            </div>

                            {/* Orders List */}
                            {filteredOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D5D5] bg-white p-12 text-center shadow-xs">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-[#E6F5FF] text-[#0099FF]">
                                        <Package className="size-7" />
                                    </div>
                                    <h3 className="mt-3 text-base font-bold text-[#222222]">
                                        Tidak Ada Pesanan Ditemukan
                                    </h3>
                                    <p className="mt-1 max-w-sm text-xs text-[#666666]">
                                        Belum ada riwayat pesanan untuk status ini. Jelajahi ribuan produk gadget &amp; aksesoris dengan harga terbaik.
                                    </p>
                                    <Link
                                        href="/"
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0099FF] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#007ACC]"
                                    >
                                        Mulai Belanja Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredOrders.map((order) => {
                                        const isPickNGo = order.fulfillment_type === 'pick_n_go';

                                        return (
                                            <div
                                                key={order.id}
                                                className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-xs transition-shadow hover:shadow-sm"
                                            >
                                                {/* Header Order */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F0F0] bg-[#FAFAFA] px-5 py-3.5 text-xs">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="font-mono font-bold text-[#0099FF]">
                                                            {order.order_number}
                                                        </span>
                                                        <span className="text-gray-300">|</span>
                                                        <span className="text-[#666666]">
                                                            Cabang: <strong className="text-[#222222]">{order.branch}</strong>
                                                        </span>
                                                        <span className="text-gray-300">|</span>
                                                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                                                            {isPickNGo ? (
                                                                <>
                                                                    <Store className="size-3 text-[#FF6000]" />
                                                                    <span>Ambil di Toko (Pick N Go)</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Truck className="size-3 text-[#0099FF]" />
                                                                    <span>Pengiriman Kurir</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                                                                order.status === 'ready_for_pickup'
                                                                    ? 'border border-[#0099FF]/40 bg-[#E6F5FF] text-[#0099FF]'
                                                                    : order.status === 'completed'
                                                                    ? 'border border-green-300 bg-green-50 text-green-700'
                                                                    : 'border border-[#FF6000]/40 bg-[#FFF3EB] text-[#FF6000]'
                                                            }`}
                                                        >
                                                            {order.status === 'ready_for_pickup'
                                                                ? '● Siap Diambil di Rak'
                                                                : order.status === 'completed'
                                                                ? '✓ Pesanan Selesai'
                                                                : order.status === 'shipped'
                                                                ? '✈ Dalam Pengiriman'
                                                                : order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Pick N Go Special Locker Card if applicable */}
                                                {isPickNGo && order.status === 'ready_for_pickup' && order.pickup_pin && (
                                                    <div className="border-b border-[#0099FF]/20 bg-[#E6F5FF]/50 p-4 sm:px-6">
                                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex size-9 items-center justify-center rounded-lg bg-[#0099FF] text-white">
                                                                    <Store className="size-4.5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-bold text-[#222222]">
                                                                        PIN Loker Pengambilan di Cabang {order.branch}
                                                                    </div>
                                                                    <div className="text-[11px] text-[#555555]">
                                                                        Tunjukkan PIN atau sebutkan ke kasir untuk mengambil barang di{' '}
                                                                        <strong>{order.pickup_rack || 'Rak Loker'}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <div className="rounded-lg border border-[#0099FF] bg-white px-3 py-1 text-center">
                                                                    <span className="font-mono text-base font-black text-[#0099FF]">
                                                                        {order.pickup_pin}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyPinToClipboard(order.pickup_pin!)}
                                                                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#0099FF] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#007ACC]"
                                                                >
                                                                    <Copy className="size-3" />
                                                                    {copiedPin === order.pickup_pin ? 'Tersalin' : 'Salin PIN'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Items in order */}
                                                <div className="divide-y divide-[#F0F0F0] p-4 sm:px-6">
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between py-2.5 text-xs first:pt-0 last:pb-0"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {item.thumbnail ? (
                                                                    <img
                                                                        src={item.thumbnail}
                                                                        alt={item.product_name}
                                                                        className="size-12 rounded-lg border border-[#E5E5E5] object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex size-12 items-center justify-center rounded-lg border border-[#E5E5E5] bg-gray-50 text-gray-400">
                                                                        <Package className="size-5" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className="font-bold text-[#222222]">
                                                                        {item.product_name}
                                                                    </div>
                                                                    <div className="text-[10px] text-[#666666]">
                                                                        SKU: {item.sku || 'MKN-ITEM'} &bull; {item.quantity} pcs &times; {formatRupiah(item.price)}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="font-bold text-[#222222]">
                                                                {formatRupiah(item.subtotal)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Footer Order Summary */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F0F0] bg-[#FAFAFA] px-5 py-3 text-xs">
                                                    <div className="flex items-center gap-2 text-[#666666]">
                                                        <span>Pembayaran: <strong>{order.payment_method}</strong></span>
                                                        <span className="text-gray-300">&bull;</span>
                                                        <span className="text-green-700 font-semibold">Lunas</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-[#666666]">Total Belanja:</span>
                                                        <span className="text-base font-bold text-[#FF6000]">
                                                            {formatRupiah(order.total_amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================
                        TAB 3: KERANJANG BELANJA
                        ======================================================== */}
                    {currentTab === 'cart' && (
                        <div>
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D5D5] bg-white p-12 text-center shadow-xs">
                                    <div className="flex size-16 items-center justify-center rounded-full bg-[#E6F5FF] text-[#0099FF]">
                                        <ShoppingCart className="size-8" />
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-[#222222]">
                                        Keranjang Belanja Anda Masih Kosong
                                    </h3>
                                    <p className="mt-1 max-w-sm text-xs text-[#666666]">
                                        Jelajahi berbagai produk komputer, gadget, dan aksesoris teknologi dengan jaminan harga termurah di Makassar.
                                    </p>
                                    <Link
                                        href="/"
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0099FF] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#007ACC]"
                                    >
                                        <ShoppingBag className="size-4" />
                                        Mulai Belanja Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Left: Cart Items Table */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-4 text-xs font-semibold shadow-xs">
                                            <span>Daftar Produk ({cartTotalItems} item)</span>
                                            <button
                                                type="button"
                                                onClick={handleClearCart}
                                                className="text-red-600 hover:underline"
                                            >
                                                Kosongkan Keranjang
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {cartItems.map((item) => {
                                                const product = item.product;
                                                const itemPrice = product?.price || 0;
                                                const itemSubtotal = itemPrice * item.quantity;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col gap-4 rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {product?.thumbnail ? (
                                                                <img
                                                                    src={product.thumbnail}
                                                                    alt={product.name}
                                                                    className="size-16 rounded-lg border border-[#E5E5E5] object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex size-16 items-center justify-center rounded-lg border border-[#E5E5E5] bg-gray-50 text-gray-400">
                                                                    <Package className="size-6" />
                                                                </div>
                                                            )}

                                                            <div>
                                                                <div className="font-bold text-xs text-[#222222] sm:text-sm">
                                                                    {product?.name || 'Produk MakassarNotebook'}
                                                                </div>
                                                                <div className="mt-0.5 text-[10px] text-[#666666]">
                                                                    SKU: {product?.sku || '-'} &bull; Cabang: {item.branch}
                                                                </div>
                                                                <div className="mt-1 font-bold text-xs text-[#0099FF]">
                                                                    {formatRupiah(itemPrice)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Modifier & Remove */}
                                                        <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3 sm:border-0 sm:pt-0 sm:justify-end sm:gap-4">
                                                            <div className="flex items-center rounded-lg border border-[#D5D5D5]">
                                                                <button
                                                                    type="button"
                                                                    disabled={item.quantity <= 1}
                                                                    onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                                                                    className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-xs font-bold text-[#222222]">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                                                                    className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="text-xs font-bold text-[#222222]">
                                                                    {formatRupiah(itemSubtotal)}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveCartItem(item.id, product?.name)}
                                                                    className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-red-600 hover:underline"
                                                                >
                                                                    <Trash2 className="size-3" /> Hapus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Right: Checkout Summary */}
                                    <div className="space-y-4">
                                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
                                            <h3 className="text-sm font-bold text-[#222222]">
                                                Ringkasan Belanja
                                            </h3>

                                            <div className="mt-4 space-y-2.5 text-xs text-[#666666]">
                                                <div className="flex justify-between">
                                                    <span>Total Harga ({cartTotalItems} item)</span>
                                                    <span className="font-semibold text-[#222222]">{formatRupiah(cartSubtotal)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Biaya Layanan Pick N Go</span>
                                                    <span className="font-semibold text-green-600">Gratis (Rp 0)</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Estimasi PPN (11%)</span>
                                                    <span className="font-semibold text-[#222222]">Termasuk Harga</span>
                                                </div>

                                                <div className="border-t border-[#F0F0F0] pt-3 flex justify-between text-sm font-bold text-[#222222]">
                                                    <span>Total Pembayaran</span>
                                                    <span className="text-[#FF6000]">{formatRupiah(cartSubtotal)}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    toast.success('Melanjutkan ke pembayaran Pick N Go...');
                                                }}
                                                className="mt-5 w-full rounded-lg bg-[#FF6000] py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#E05500] active:scale-98"
                                            >
                                                Lanjut ke Pembayaran Pick N Go
                                            </button>

                                            <p className="mt-2 text-center text-[10px] text-gray-500">
                                                Tersedia pembayaran instan via QRIS, Transfer Bank, atau Bayar di Toko.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-[#0099FF]/20 bg-[#E6F5FF]/60 p-4 text-xs">
                                            <div className="flex items-center gap-1.5 font-bold text-[#0099FF]">
                                                <Store className="size-4" />
                                                <span>Pick N Go Makassar</span>
                                            </div>
                                            <p className="mt-1 text-[11px] text-[#444444]">
                                                Barang siap diambil dalam 15 menit setelah pembayaran terkonfirmasi di Cabang Panakkukang / Pettarani.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
