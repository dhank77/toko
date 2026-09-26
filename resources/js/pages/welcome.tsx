import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Flame,
    HelpCircle,
    Laptop,
    MapPin,
    Package,
    Phone,
    Plus,
    QrCode,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Truck,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { dashboard, login, register } from '@/routes';

interface ProductItem {
    id: number;
    sku: string;
    name: string;
    category: string;
    categoryColor: 'purple' | 'orange' | 'blue' | 'pink';
    brand: string;
    price: number;
    normalPrice: number;
    warranty: string;
    rating: number;
    imageUrl: string;
    isFlashSale?: boolean;
    flashSaleQuota?: number;
    flashSaleClaimed?: number;
    stock: {
        panakkukang: number;
        pettarani: number;
        perintis: number;
    };
}

const products: ProductItem[] = [
    {
        id: 1,
        sku: 'MKN-7RTH14BK',
        name: 'Taffware Pompa Ban Elektrik Portable LCD 150 PSI',
        category: 'Outdoor & Tools',
        categoryColor: 'orange',
        brand: 'Taffware',
        price: 198000,
        normalPrice: 325000,
        warranty: 'Garansi Toko 1 Bulan',
        rating: 4.9,
        imageUrl:
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
        isFlashSale: true,
        flashSaleQuota: 40,
        flashSaleClaimed: 34,
        stock: { panakkukang: 12, pettarani: 5, perintis: 2 },
    },
    {
        id: 2,
        sku: 'MKN-9XPL02GY',
        name: 'Baseus 7-in-1 USB-C Hub HDMI 4K 100W PD Ultra Slim',
        category: 'Aksesoris PC',
        categoryColor: 'purple',
        brand: 'Baseus',
        price: 269000,
        normalPrice: 420000,
        warranty: 'Garansi Distributor 6 Bulan',
        rating: 4.8,
        imageUrl:
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
        isFlashSale: true,
        flashSaleQuota: 30,
        flashSaleClaimed: 26,
        stock: { panakkukang: 8, pettarani: 14, perintis: 0 },
    },
    {
        id: 3,
        sku: 'MKN-1GME99RD',
        name: 'Remax Gaming Mechanical Keyboard 68-Keys Hot-Swap RGB',
        category: 'Gaming Gear',
        categoryColor: 'pink',
        brand: 'Remax',
        price: 389000,
        normalPrice: 580000,
        warranty: 'Garansi Toko 3 Bulan',
        rating: 4.8,
        imageUrl:
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
        isFlashSale: false,
        stock: { panakkukang: 20, pettarani: 11, perintis: 4 },
    },
    {
        id: 4,
        sku: 'MKN-8AUD33BK',
        name: 'Edifier Wireless Bluetooth 5.3 Earphones Low Latency',
        category: 'Audio',
        categoryColor: 'blue',
        brand: 'Edifier',
        price: 175000,
        normalPrice: 285000,
        warranty: 'Garansi Toko 1 Bulan',
        rating: 4.9,
        imageUrl:
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
        isFlashSale: true,
        flashSaleQuota: 50,
        flashSaleClaimed: 45,
        stock: { panakkukang: 18, pettarani: 8, perintis: 15 },
    },
    {
        id: 5,
        sku: 'MKN-5KJM88WH',
        name: 'Orico M.2 NVMe SSD Enclosure Tool-Free 10Gbps USB 3.2',
        category: 'Aksesoris PC',
        categoryColor: 'purple',
        brand: 'Orico',
        price: 345000,
        normalPrice: 510000,
        warranty: 'Garansi Resmi 1 Tahun',
        rating: 4.9,
        imageUrl:
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80',
        isFlashSale: false,
        stock: { panakkukang: 15, pettarani: 7, perintis: 9 },
    },
    {
        id: 6,
        sku: 'MKN-2LED45BK',
        name: 'Xiaomi Youpin Desk Lamp Monitor Screenbar Touch Sensor',
        category: 'Smart Home',
        categoryColor: 'orange',
        brand: 'Xiaomi',
        price: 215000,
        normalPrice: 330000,
        warranty: 'Garansi Toko 1 Bulan',
        rating: 4.7,
        imageUrl:
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80',
        isFlashSale: false,
        stock: { panakkukang: 6, pettarani: 2, perintis: 5 },
    },
];

const branches = [
    {
        id: 'panakkukang',
        name: 'Cabang Panakkukang',
        location: 'Jl. Pengayoman No. 42 (Dekat MP)',
        hours: '09:00 - 21:00 WITA',
        pickupSLA: '15 Menit',
    },
    {
        id: 'pettarani',
        name: 'Cabang AP Pettarani',
        location: 'Kompleks Ruko Pettarani Blok B-7',
        hours: '09:00 - 21:00 WITA',
        pickupSLA: '15 Menit',
    },
    {
        id: 'perintis',
        name: 'Cabang Perintis / UNHAS',
        location: 'Jl. Perintis Kemerdekaan KM 10',
        hours: '09:00 - 21:00 WITA',
        pickupSLA: '15 Menit',
    },
];

const brandPartners = [
    { name: 'Xiaomi', logo: 'https://cdn.simpleicons.org/xiaomi/8998A5' },
    { name: 'Baseus', logo: 'https://cdn.simpleicons.org/anker/8998A5' },
    { name: 'Orico', logo: 'https://cdn.simpleicons.org/sandisk/8998A5' },
    { name: 'Remax', logo: 'https://cdn.simpleicons.org/logitech/8998A5' },
    { name: 'Edifier', logo: 'https://cdn.simpleicons.org/jbl/8998A5' },
    { name: 'Taffware', logo: 'https://cdn.simpleicons.org/razer/8998A5' },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [selectedBranch, setSelectedBranch] = useState<'panakkukang' | 'pettarani' | 'perintis'>('panakkukang');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [cartCount, setCartCount] = useState<number>(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Dynamic Flash Sale Timer
    const [timer, setTimer] = useState({ hours: 4, minutes: 18, seconds: 45 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                }
                if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                }
                if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const filteredItems = useMemo(() => {
        return products.filter((p) => {
            const matchesTab =
                activeCategory === 'all' ||
                (activeCategory === 'flash' && p.isFlashSale) ||
                (activeCategory === 'pc' && p.category.includes('PC')) ||
                (activeCategory === 'audio' && p.category.includes('Audio')) ||
                (activeCategory === 'gear' && (p.category.includes('Tools') || p.category.includes('Gaming')));

            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const addToCart = (productName: string) => {
        setCartCount((c) => c + 1);
        setToastMessage(`"${productName}" ditambahkan ke keranjang.`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const getTagClasses = (color: ProductItem['categoryColor']) => {
        switch (color) {
            case 'purple':
                return 'bg-[#7928CA]/10 text-[#7928CA] border-[#7928CA]/20';
            case 'orange':
                return 'bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20';
            case 'blue':
                return 'bg-[#0070F3]/10 text-[#0070F3] border-[#0070F3]/20';
            case 'pink':
                return 'bg-[#FF0080]/10 text-[#FF0080] border-[#FF0080]/20';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            <Head title="MakassarNotebook - Omnichannel Gadget & IT Platform Makassar" />

            <div className="min-h-[100dvh] bg-white font-sans text-[#001E2B] selection:bg-[#00ED64] selection:text-[#001E2B]">
                {/* 1. TOP NOTICE STRIP (Rules: Dark Teal #001E2B) */}
                <div className="border-b border-[#1C3B47] bg-[#001E2B] px-4 py-2 text-xs text-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#00ED64] px-2 py-0.5 text-[10px] font-bold text-[#001E2B]">
                                PICK N GO
                            </span>
                            <span className="truncate">
                                Pesan online, ambil di toko fisik dalam 15 menit tanpa antre.
                            </span>
                        </div>
                        <div className="hidden items-center gap-6 sm:flex text-[#8998A5]">
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5 text-[#00ED64]" />
                                Buka: 09:00 - 21:00 WITA
                            </span>
                            <a href="#kemitraan" className="text-[#00ED64] hover:underline font-medium">
                                Portal Dropship →
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. NAVIGATION (Rules: Single line at desktop, height 64px, pill buttons) */}
                <nav className="sticky top-0 z-40 border-b border-[#E8EDEB] bg-white/95 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#001E2B] text-[#00ED64] shadow-xs">
                                <Laptop className="size-5" />
                            </div>
                            <div>
                                <span className="text-lg font-bold tracking-tight text-[#001E2B]">
                                    Makassar<span className="text-[#00A35C]">Notebook</span>
                                </span>
                                <div className="text-[10px] font-medium text-[#8998A5] leading-none">
                                    MKN Omnichannel Store
                                </div>
                            </div>
                        </Link>

                        {/* Branch Picker */}
                        <div className="hidden lg:flex items-center gap-2 rounded-full border border-[#C1C7C6] bg-[#F9FBFA] px-3 py-1.5 text-xs">
                            <MapPin className="size-3.5 text-[#00A35C]" />
                            <span className="text-[#8998A5]">Cabang:</span>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value as any)}
                                className="cursor-pointer bg-transparent font-semibold text-[#001E2B] focus:outline-none"
                            >
                                <option value="panakkukang">Panakkukang (Buka)</option>
                                <option value="pettarani">AP Pettarani (Buka)</option>
                                <option value="perintis">Perintis / UNHAS (Buka)</option>
                            </select>
                        </div>

                        {/* Search Pill (44px height) */}
                        <div className="relative hidden md:block max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8998A5]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama barang, brand, atau SKU..."
                                className="h-10 w-full rounded-full border border-[#C1C7C6] bg-[#F9FBFA] pr-4 pl-10 text-xs text-[#001E2B] placeholder-[#8998A5] focus:border-[#00684A] focus:bg-white focus:outline-none"
                            />
                        </div>

                        {/* Cart & Auth */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="relative flex size-10 items-center justify-center rounded-full border border-[#E8EDEB] text-[#001E2B] hover:border-[#C1C7C6]"
                                aria-label="Keranjang Belanja"
                            >
                                <ShoppingBag className="size-4.5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#00ED64] text-[11px] font-bold text-[#001E2B]">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-10 items-center justify-center rounded-full bg-[#001E2B] px-5 text-xs font-semibold text-white hover:opacity-90"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={login()}
                                        className="hidden sm:inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-semibold text-[#001E2B] hover:bg-[#F0F4F2]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#00ED64] px-5 text-xs font-semibold text-[#001E2B] hover:bg-[#00C351] active:scale-98 transition-transform"
                                    >
                                        Daftar Akun
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Toast Feedback */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#00ED64] bg-[#001E2B] px-4 py-3 text-xs text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
                        <CheckCircle2 className="size-4 text-[#00ED64]" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* 3. HERO SECTION (Rules: Fits viewport, max 2 lines headline, max 20 words subtext, max 1 eyebrow, split layout) */}
                <section className="border-b border-[#E8EDEB] bg-[#001E2B] py-14 sm:py-18 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-10 lg:grid-cols-12">
                            {/* Left Copy Column */}
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#1C3B47] bg-[#0C2D38] px-3 py-1 text-xs text-[#00ED64] font-medium mb-4">
                                    <Sparkles className="size-3.5" />
                                    <span>Omnichannel Tech Retail Makassar</span>
                                </div>

                                <h1 className="text-3xl font-medium tracking-tight sm:text-5xl lg:text-[52px] leading-[1.12]">
                                    Pusat Gadget & Komputer
                                    <br />
                                    <span className="font-semibold text-[#00ED64]">
                                        Termurah di Makassar.
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-xl text-sm sm:text-base text-[#8998A5] leading-relaxed">
                                    Pesan online, ambil di toko dalam 15 menit atau kirim instan hari ini ke seluruh Indonesia Timur.
                                </p>

                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <a
                                        href="#katalog"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#00ED64] px-7 text-sm font-semibold text-[#001E2B] hover:bg-[#00C351] active:scale-98 transition-all"
                                    >
                                        Mulai Belanja <ArrowRight className="size-4" />
                                    </a>
                                    <a
                                        href="#cabang"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#1C3B47] bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10"
                                    >
                                        <Store className="size-4 text-[#00ED64]" />
                                        Cek Lokasi Cabang
                                    </a>
                                </div>

                                <div className="mt-8 flex items-center gap-6 border-t border-[#1C3B47] pt-5 text-xs text-[#8998A5]">
                                    <div>
                                        <strong className="block text-base font-bold text-white">15 Menit</strong>
                                        SLA Ambil di Toko
                                    </div>
                                    <div className="h-6 w-px bg-[#1C3B47]" />
                                    <div>
                                        <strong className="block text-base font-bold text-[#00ED64]">3 Cabang</strong>
                                        Panakkukang, Pettarani, Perintis
                                    </div>
                                    <div className="h-6 w-px bg-[#1C3B47]" />
                                    <div>
                                        <strong className="block text-base font-bold text-white">100% Netral</strong>
                                        Label Resi Khusus Dropship
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual Spotlight Card (Real photography, no div fake screenshots) */}
                            <div className="lg:col-span-5">
                                <div className="overflow-hidden rounded-xl border border-[#1C3B47] bg-[#0C2D38]/80 shadow-2xl backdrop-blur-md">
                                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                                        <img
                                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                                            alt="Taffware Portable Air Pump"
                                            className="h-full w-full object-cover object-center"
                                        />
                                        <div className="absolute top-3 left-3 rounded-full bg-[#001E2B]/85 px-3 py-1 text-[11px] font-bold text-[#00ED64] backdrop-blur-xs">
                                            SPOTLIGHT HARI INI
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] text-[#8998A5]">MKN-7RTH14BK</span>
                                            <span className="text-xs font-semibold text-[#00ED64]">Garansi Toko 1 Bulan</span>
                                        </div>
                                        <h3 className="mt-1 text-base font-semibold text-white">
                                            Taffware Pompa Ban Elektrik Portable LCD 150 PSI
                                        </h3>
                                        <div className="mt-3 flex items-baseline justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-[#FF6A00]">Rp 198.000</span>
                                                <span className="text-xs text-[#8998A5] line-through">Rp 325.000</span>
                                            </div>
                                            <span className="rounded-full bg-[#00ED64]/15 px-2.5 py-0.5 text-xs font-semibold text-[#00ED64]">
                                                Stok Panakkukang: 12 unit
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. BRAND LOGO STRIP (Rules: Under hero, logo only, real SVGs, no labels below) */}
                <section className="border-b border-[#E8EDEB] bg-[#F9FBFA] py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-6 opacity-75">
                            {brandPartners.map((b) => (
                                <div key={b.name} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                                    <img src={b.logo} alt={b.name} className="h-5 w-auto" />
                                    <span className="text-xs font-bold text-[#5C768D] tracking-wider uppercase">
                                        {b.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FLASH SALE SECTION (Rules: Real-time timer, diverse cards) */}
                <section className="py-14 border-b border-[#E8EDEB]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8EDEB]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Flame className="size-5 text-[#FF6A00]" />
                                    <h2 className="text-2xl font-bold tracking-tight text-[#001E2B]">
                                        Flash Sale Makassar
                                    </h2>
                                </div>
                                <p className="mt-1 text-xs text-[#5C768D]">
                                    Promo kuota terbatas per cabang. Maksimal 1 unit per pesanan.
                                </p>
                            </div>

                            {/* Timer Block */}
                            <div className="flex items-center gap-2 font-mono text-sm font-bold">
                                <span className="text-xs font-sans text-[#5C768D]">Berakhir Dalam:</span>
                                <span className="rounded-md bg-[#001E2B] px-2 py-1 text-white">
                                    {String(timer.hours).padStart(2, '0')}
                                </span>
                                <span>:</span>
                                <span className="rounded-md bg-[#001E2B] px-2 py-1 text-white">
                                    {String(timer.minutes).padStart(2, '0')}
                                </span>
                                <span>:</span>
                                <span className="rounded-md bg-[#001E2B] px-2 py-1 text-[#00ED64]">
                                    {String(timer.seconds).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                            {products
                                .filter((p) => p.isFlashSale)
                                .slice(0, 3)
                                .map((product) => {
                                    const percent = Math.round(
                                        ((product.flashSaleClaimed || 0) / (product.flashSaleQuota || 1)) * 100
                                    );
                                    return (
                                        <div
                                            key={product.id}
                                            className="group flex flex-col justify-between rounded-xl border border-[#E8EDEB] bg-white p-5 shadow-xs transition-all hover:border-[#00ED64] hover:shadow-md"
                                        >
                                            <div>
                                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#F9FBFA] mb-4">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                                                    />
                                                    <span className="absolute top-2 left-2 rounded-xs border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/90">
                                                        {product.category}
                                                    </span>
                                                </div>

                                                <h3 className="text-sm font-semibold line-clamp-2 text-[#001E2B] group-hover:text-[#00684A]">
                                                    {product.name}
                                                </h3>

                                                <div className="mt-3 flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-[#FF6A00]">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                    <span className="text-xs text-[#8998A5] line-through">
                                                        {formatCurrency(product.normalPrice)}
                                                    </span>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="flex justify-between text-[11px] text-[#5C768D]">
                                                        <span>Terjual {percent}%</span>
                                                        <span className="font-semibold text-[#FF6A00]">
                                                            Sisa {product.flashSaleQuota! - product.flashSaleClaimed!} unit
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E8EDEB]">
                                                        <div
                                                            className="h-full rounded-full bg-[#FF6A00]"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-3 border-t border-[#E8EDEB] flex items-center justify-between">
                                                <span className="text-xs text-[#5C768D]">
                                                    Stok {selectedBranch}:{' '}
                                                    <strong className="text-[#00684A]">
                                                        {product.stock[selectedBranch]}
                                                    </strong>
                                                </span>
                                                <button
                                                    onClick={() => addToCart(product.name)}
                                                    className="inline-flex h-8 items-center justify-center rounded-full bg-[#001E2B] px-4 text-xs font-semibold text-white hover:bg-[#00ED64] hover:text-[#001E2B] transition-colors"
                                                >
                                                    + Keranjang
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>

                {/* 6. CATALOG BENTO GRID (Rules: Diverse cell backgrounds, rhythm, no white-on-white monotony) */}
                <section id="katalog" className="py-16 bg-[#F9FBFA]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Headline (Vertical Stack - No Split-Header slop) */}
                        <div className="pb-6 border-b border-[#E8EDEB]">
                            <h2 className="text-3xl font-bold tracking-tight text-[#001E2B]">
                                Katalog Produk & Stok Cabang Fisik
                            </h2>
                            <p className="mt-1 text-sm text-[#5C768D] max-w-[65ch]">
                                Pantau ketersediaan stok fisik secara transparan di Panakkukang, Pettarani, dan Perintis.
                            </p>

                            {/* Category Filter Tabs */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'Semua Produk' },
                                    { id: 'flash', label: '⚡ Flash Sale' },
                                    { id: 'pc', label: 'Aksesoris PC' },
                                    { id: 'gear', label: 'Gaming & Outdoor' },
                                    { id: 'audio', label: 'Audio' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveCategory(tab.id)}
                                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                            activeCategory === tab.id
                                                ? 'bg-[#001E2B] text-white'
                                                : 'border border-[#E8EDEB] bg-white text-[#5C768D] hover:border-[#C1C7C6]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((product) => {
                                const currentStock = product.stock[selectedBranch];
                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col justify-between rounded-xl border border-[#E8EDEB] bg-white p-5 shadow-xs transition-all hover:border-[#00ED64] hover:shadow-lg"
                                    >
                                        <div>
                                            {/* Photo & Category Tag */}
                                            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-[#F9FBFA] mb-4">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <span
                                                    className={`absolute top-2 left-2 rounded-xs border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTagClasses(
                                                        product.categoryColor
                                                    )}`}
                                                >
                                                    {product.category}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-[#8998A5] font-mono">
                                                <span>{product.sku}</span>
                                                <span className="flex items-center gap-1 text-[#FF6A00]">
                                                    <Star className="size-3.5 fill-current" /> {product.rating}
                                                </span>
                                            </div>

                                            <h3 className="mt-1 text-sm font-semibold text-[#001E2B] line-clamp-2">
                                                {product.name}
                                            </h3>

                                            <div className="mt-3 text-lg font-bold text-[#001E2B]">
                                                {formatCurrency(product.price)}
                                            </div>

                                            {/* Multi-Branch Stock Matrix */}
                                            <div className="mt-3 rounded-lg border border-[#F0F4F2] bg-[#F9FBFA] p-2.5 text-xs">
                                                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                                                    <div>
                                                        <span className="text-[#8998A5] block">Panakkukang</span>
                                                        <strong className={product.stock.panakkukang > 0 ? 'text-[#00684A]' : 'text-gray-400'}>
                                                            {product.stock.panakkukang > 0 ? `${product.stock.panakkukang} unit` : 'Habis'}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#8998A5] block">Pettarani</span>
                                                        <strong className={product.stock.pettarani > 0 ? 'text-[#00684A]' : 'text-gray-400'}>
                                                            {product.stock.pettarani > 0 ? `${product.stock.pettarani} unit` : 'Habis'}
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#8998A5] block">Perintis</span>
                                                        <strong className={product.stock.perintis > 0 ? 'text-[#00684A]' : 'text-gray-400'}>
                                                            {product.stock.perintis > 0 ? `${product.stock.perintis} unit` : 'Habis'}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <button
                                                onClick={() => addToCart(product.name)}
                                                disabled={currentStock === 0}
                                                className={`w-full inline-flex h-9 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                                                    currentStock > 0
                                                        ? 'bg-[#00ED64] text-[#001E2B] hover:bg-[#00C351] active:scale-98'
                                                        : 'bg-[#E8EDEB] text-[#8998A5] cursor-not-allowed'
                                                }`}
                                            >
                                                {currentStock > 0 ? 'Ambil di Toko Ini' : 'Stok Kosong di Cabang Ini'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 7. OMNICHANNEL FLOW COMPARISON (Pick N Go vs Delivery) */}
                <section className="py-16 border-b border-[#E8EDEB]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pb-6 border-b border-[#E8EDEB]">
                            <h2 className="text-3xl font-bold tracking-tight text-[#001E2B]">
                                Dua Jalur Pemenuhan Pesanan
                            </h2>
                            <p className="mt-1 text-sm text-[#5C768D] max-w-[65ch]">
                                Sesuaikan kebutuhan belanja Anda: ambil mandiri di toko terdekat atau kirim kurir instan ke rumah.
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Pick N Go */}
                            <div className="rounded-xl border border-[#00ED64] bg-[#E8FCF4]/40 p-8 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#001E2B] text-[#00ED64]">
                                        <QrCode className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#001E2B]">Pick N Go (Ambil Sendiri)</h3>
                                        <div className="text-xs text-[#00684A] font-semibold">SLA: 15 Menit Siap di Rak</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-[#5C768D] leading-relaxed">
                                    Pesan barang dari website, pilih cabang toko terdekat, dan bayar online atau bayar di kasir saat tiba.
                                    Dapatkan PIN 6-digit & QR Code untuk pengambilan cepat tanpa mengantre rak toko.
                                </p>
                                <ul className="mt-5 space-y-2 text-xs text-[#001E2B] font-medium">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-[#00A35C]" />
                                        <span>Bebas ongkos kirim ke seluruh cabang Makassar</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-[#00A35C]" />
                                        <span>Cek fisik barang langsung di konter penyerahan</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Delivery */}
                            <div className="rounded-xl border border-[#E8EDEB] bg-white p-8 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#001E2B] text-white">
                                        <Truck className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#001E2B]">Kirim ke Alamat</h3>
                                        <div className="text-xs text-[#5C768D] font-semibold">Kurir Instan & Ekspedisi</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-[#5C768D] leading-relaxed">
                                    Pengiriman roda dua (GrabExpress / GoSend Makassar) untuk tiba dalam 2-4 jam,
                                    atau ekspedisi logistik (JNE, J&T, SiCepat) untuk jangkauan antar-kota se-Indonesia Timur.
                                </p>
                                <ul className="mt-5 space-y-2 text-xs text-[#5C768D]">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-[#00A35C]" />
                                        <span>Pengiriman instan Makassar & Gowa/Maros</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-[#00A35C]" />
                                        <span>Pelacakan resi otomatis via WhatsApp</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. 3-TIER PARTNERSHIP (Rules: Featured Mint Card + 2px Green Border + Paling Populer Badge) */}
                <section id="kemitraan" className="py-16 bg-[#F9FBFA] border-b border-[#E8EDEB]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pb-6 border-b border-[#E8EDEB]">
                            <h2 className="text-3xl font-bold tracking-tight text-[#001E2B]">
                                Program Kemitraan & Belanja
                            </h2>
                            <p className="mt-1 text-sm text-[#5C768D] max-w-[65ch]">
                                Solusi belanja untuk kebutuhan pribadi, reseller online, hingga pengadaan korporat.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Tier 1: Customer */}
                            <div className="flex flex-col justify-between rounded-xl border border-[#E8EDEB] bg-white p-7 shadow-xs">
                                <div>
                                    <h3 className="text-lg font-bold text-[#001E2B]">Customer Reguler</h3>
                                    <p className="mt-1 text-xs text-[#5C768D]">
                                        Untuk pembeli harian dan pehobi gadget.
                                    </p>
                                    <div className="mt-5 text-2xl font-bold text-[#001E2B]">
                                        Gratis <span className="text-xs font-normal text-[#8998A5]">/ selamanya</span>
                                    </div>
                                    <ul className="mt-5 space-y-2.5 text-xs text-[#5C768D]">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Layanan Pick N Go 15 Menit</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Akses Sesi Flash Sale Harian</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Garansi Toko Ganti Baru</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-7">
                                    <Link
                                        href={register()}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[#C1C7C6] text-xs font-semibold text-[#001E2B] hover:bg-[#F0F4F2]"
                                    >
                                        Daftar Akun
                                    </Link>
                                </div>
                            </div>

                            {/* Tier 2: Dropshipper (FEATURED MINT) */}
                            <div className="relative flex flex-col justify-between rounded-xl border-2 border-[#00ED64] bg-[#E8FCF4] p-7 shadow-md">
                                <div className="absolute -top-3 right-6">
                                    <span className="rounded-full bg-[#001E2B] px-3 py-0.5 text-[10px] font-bold text-[#00ED64]">
                                        Paling Populer
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#001E2B]">Mitra Dropshipper</h3>
                                    <p className="mt-1 text-xs text-[#00684A]">
                                        Untuk seller marketplace di Sulawesi & kawasan Timur.
                                    </p>
                                    <div className="mt-5 text-2xl font-bold text-[#001E2B]">
                                        Harga Khusus <span className="text-xs font-normal text-[#00684A]">/ margin tinggi</span>
                                    </div>
                                    <ul className="mt-5 space-y-2.5 text-xs text-[#001E2B] font-medium">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Harga Modal Khusus Dropshipper</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Resi Netral (Tanpa Logo MakassarNotebook)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Dompet Saldo Deposit 1-Klik</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Download Foto Katalog Tanpa Watermark</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-7">
                                    <Link
                                        href={register()}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[#001E2B] text-xs font-semibold text-[#00ED64] hover:bg-[#093B47]"
                                    >
                                        Gabung Mitra Dropship →
                                    </Link>
                                </div>
                            </div>

                            {/* Tier 3: B2B */}
                            <div className="flex flex-col justify-between rounded-xl border border-[#E8EDEB] bg-white p-7 shadow-xs">
                                <div>
                                    <h3 className="text-lg font-bold text-[#001E2B]">B2B & Pengadaan</h3>
                                    <p className="mt-1 text-xs text-[#5C768D]">
                                        Instansi, sekolah, kampus, dan korporat.
                                    </p>
                                    <div className="mt-5 text-2xl font-bold text-[#001E2B]">
                                        Faktur Pajak <span className="text-xs font-normal text-[#8998A5]">/ resmi</span>
                                    </div>
                                    <ul className="mt-5 space-y-2.5 text-xs text-[#5C768D]">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>PPN Terbit Resmi</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Dedicated Account Manager di Makassar</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#00A35C]" />
                                            <span>Ekspedisi Kargo Antar-Pulau</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-7">
                                    <a
                                        href="https://wa.me/6281144400199"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[#C1C7C6] text-xs font-semibold text-[#001E2B] hover:bg-[#F0F4F2]"
                                    >
                                        Hubungi Sales B2B
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. PHYSICAL BRANCHES */}
                <section id="cabang" className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pb-6 border-b border-[#E8EDEB]">
                            <h2 className="text-3xl font-bold tracking-tight text-[#001E2B]">
                                Lokasi Toko Cabang Fisik
                            </h2>
                            <p className="mt-1 text-sm text-[#5C768D] max-w-[65ch]">
                                Kunjungi konter Pick N Go kami di 3 titik strategis kota Makassar.
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                            {branches.map((b) => (
                                <div
                                    key={b.id}
                                    className={`rounded-xl border p-6 transition-all ${
                                        selectedBranch === b.id
                                            ? 'border-[#00ED64] bg-[#E8FCF4]/40'
                                            : 'border-[#E8EDEB] bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-[#001E2B]">{b.name}</span>
                                        <span className="text-xs text-[#00A35C] font-semibold">● Buka</span>
                                    </div>
                                    <p className="mt-2 text-xs text-[#5C768D]">{b.location}</p>
                                    <div className="mt-4 pt-3 border-t border-[#E8EDEB] flex justify-between text-xs text-[#5C768D]">
                                        <span>Jam: {b.hours}</span>
                                        <span className="font-bold text-[#001E2B]">SLA {b.pickupSLA}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBranch(b.id as any)}
                                        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full border border-[#C1C7C6] text-xs font-semibold text-[#001E2B] hover:bg-white"
                                    >
                                        {selectedBranch === b.id ? '✓ Cabang Terpilih' : 'Pilih Cabang Ini'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 10. FAQ ACCORDION */}
                <section className="py-14 bg-[#F9FBFA] border-t border-[#E8EDEB]">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="pb-6 border-b border-[#E8EDEB] text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-[#001E2B]">
                                Pertanyaan Umum (FAQ)
                            </h2>
                            <p className="mt-1 text-xs text-[#5C768D]">
                                Seputar Pick N Go, pengiriman, dan layanan garansi.
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            {[
                                {
                                    q: 'Bagaimana cara kerja Pick N Go di MakassarNotebook?',
                                    a: 'Anda memilih produk di website, memilih cabang toko terdekat saat checkout, lalu memilih bayar online atau bayar di kasir. Anda akan menerima PIN 6-digit dan QR Code. Staf kami menyiapkan barang dalam 15 menit, lalu Anda cukup datang menunjukkan PIN ke kasir untuk serah terima barang.',
                                },
                                {
                                    q: 'Apakah label pengiriman dropship benar-benar tanpa logo MKN?',
                                    a: 'Ya, 100% netral (white-label). Label resi hanya mencantumkan nama dan nomor kontak toko online Anda sebagai pengirim, tanpa ada logo, nama MakassarNotebook, maupun rincian harga modal barang.',
                                },
                                {
                                    q: 'Bagaimana jika barang yang dibeli mengalami kerusakan?',
                                    a: 'Setiap produk bergaransi toko dilindungi fasilitas Replace 1-on-1 (ganti unit baru) jika terdapat cacat pabrik dalam masa garansi. Anda dapat mengajukan klaim online atau membawa unit langsung ke konter service di cabang fisik terdekat.',
                                },
                            ].map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-[#E8EDEB] bg-white p-4 shadow-xs"
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                        className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#001E2B]"
                                    >
                                        <span>{faq.q}</span>
                                        <span className="text-[#8998A5] font-mono text-base">
                                            {activeFaq === idx ? '−' : '+'}
                                        </span>
                                    </button>
                                    {activeFaq === idx && (
                                        <p className="mt-2 text-xs text-[#5C768D] leading-relaxed border-t border-[#F0F4F2] pt-2">
                                            {faq.a}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 11. FOOTER (Rules: Deep Teal #001E2B, 6 Columns) */}
                <footer className="border-t border-[#1C3B47] bg-[#001E2B] text-white py-14">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 text-xs">
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#00ED64] text-[#001E2B]">
                                        <Laptop className="size-4" />
                                    </div>
                                    <span className="text-base font-bold text-white">
                                        Makassar<span className="text-[#00ED64]">Notebook</span>
                                    </span>
                                </div>
                                <p className="mt-3 text-[#8998A5] leading-relaxed">
                                    Platform e-commerce ritel dan dropship omnichannel terdepan di kota Makassar dan kawasan Indonesia Timur.
                                </p>
                                <div className="mt-4 text-[#8998A5]">
                                    WhatsApp: <strong>+62 811-4440-0199</strong>
                                    <br />
                                    Email: <strong>support@makassarnotebook.com</strong>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider mb-3">Layanan</h4>
                                <ul className="space-y-2 text-[#8998A5]">
                                    <li><a href="#cabang" className="hover:text-white">Pick N Go</a></li>
                                    <li><a href="#katalog" className="hover:text-white">Flash Sale</a></li>
                                    <li><a href="#kemitraan" className="hover:text-white">Mitra Dropship</a></li>
                                    <li><a href="#" className="hover:text-white">Klaim Garansi</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider mb-3">Toko Cabang</h4>
                                <ul className="space-y-2 text-[#8998A5]">
                                    <li>Panakkukang</li>
                                    <li>AP Pettarani</li>
                                    <li>Perintis / UNHAS</li>
                                    <li>Gudang Daya</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider mb-3">Pembayaran</h4>
                                <ul className="space-y-2 text-[#8998A5]">
                                    <li>QRIS Instan</li>
                                    <li>BCA / Mandiri VA</li>
                                    <li>GoPay / ShopeePay</li>
                                    <li>Bayar di Kasir</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider mb-3">Akun</h4>
                                <ul className="space-y-2 text-[#8998A5]">
                                    <li><Link href={login()} className="hover:text-white">Masuk</Link></li>
                                    <li><Link href={register()} className="hover:text-white">Daftar Akun</Link></li>
                                    <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
                                    <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 pt-6 border-t border-[#1C3B47] flex flex-col sm:flex-row justify-between items-center text-xs text-[#8998A5]">
                            <p>© 2026 MakassarNotebook. Hak cipta dilindungi undang-undang.</p>
                            <p className="mt-2 sm:mt-0">Sistem Omnichannel Cepat untuk Indonesia Timur.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
