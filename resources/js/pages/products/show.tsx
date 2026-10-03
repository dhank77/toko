import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Clock,
    Heart,
    HelpCircle,
    Info,
    MapPin,
    Menu,
    Minus,
    Package,
    Plus,
    RotateCcw,
    Search,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Star,
    Store,
    Truck,
    User,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { StoreAccountMenu } from '@/components/store-account-menu';
import { formatRupiah } from '@/lib/utils';
import { dashboard, login } from '@/routes';

interface SubCategory {
    id: number;
    name: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    sub_categories?: SubCategory[];
}

interface Product {
    id: number;
    sku?: string | null;
    name: string;
    slug: string;
    brand?: string | null;
    color?: string | null;
    price: number;
    original_price?: number | null;
    discount_percent?: number | null;
    stock?: number;
    weight_grams?: number;
    warranty?: string | null;
    package_dimension?: string | null;
    overview?: string | null;
    description?: string | null;
    features?: Array<{ title: string; description: string }> | null;
    specifications?: Array<{ key: string; value: string }> | null;
    whats_in_the_box?: string[] | null;
    thumbnail?: string | null;
    images?: string[] | null;
    rating?: number | null;
    review_count?: number | null;
    category?: Category | null;
    sub_category?: SubCategory | null;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    categories: Category[];
}

export default function ProductDetail({ product, relatedProducts = [], categories = [] }: Props) {
    const { auth } = usePage().props;

    // Media & images
    const allImages = [
        ...(product.thumbnail ? [product.thumbnail] : []),
        ...(Array.isArray(product.images) ? product.images : []),
    ];
    const uniqueImages = allImages.length > 0 ? Array.from(new Set(allImages)) : ['/images/placeholder.png'];
    const [selectedImage, setSelectedImage] = useState(uniqueImages[0]);

    // Quantity state
    const [quantity, setQuantity] = useState(1);
    const maxStock = product.stock && product.stock > 0 ? product.stock : 99;

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'inc' && quantity < maxStock) {
            setQuantity((q) => q + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity((q) => q - 1);
        }
    };

    // Cart state & feedback toast
    const [cartCount, setCartCount] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleAddToCart = () => {
        if (auth.user) {
            router.post(
                '/client/cart',
                { product_id: product.id, quantity, branch: selectedBranch },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setCartCount((c) => c + quantity);
                        triggerToast(`Berhasil menambahkan ${quantity}x "${product.name}" ke keranjang!`);
                    },
                },
            );
        } else {
            setCartCount((c) => c + quantity);
            triggerToast(`Berhasil menambahkan ${quantity}x "${product.name}" ke keranjang!`);
        }
    };

    // Tabs inside details
    type DetailTab = 'overview' | 'features' | 'specifications' | 'box';
    const [activeTab, setActiveTab] = useState<DetailTab>('overview');

    // Drawer Kategori
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [activeDepartment, setActiveDepartment] = useState(0);

    // Search input
    const [searchKeyword, setSearchKeyword] = useState('');

    const getImgUrl = (src?: string | null) => {
        if (!src) return 'https://placehold.co/500x500/f5f5f5/999999?text=No+Image';
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
        return `/storage/${src}`;
    };

    // Branches for Pick N Go showcase
    const branches = [
        { name: 'Pick N Go Maricaya (Pusat)', status: 'Tersedia', readyTime: 'Siap dalam 15 Menit', isReady: true },
        { name: 'Pick N Go Panakkukang', status: 'Tersedia', readyTime: 'Siap dalam 15 Menit', isReady: true },
        { name: 'Pick N Go AP Pettarani', status: 'Tersedia', readyTime: 'Siap dalam 15 Menit', isReady: true },
        { name: 'Pick N Go Perintis (UNHAS)', status: 'Tersedia', readyTime: 'Siap dalam 15 Menit', isReady: true },
    ];

    return (
        <>
            <Head>
                <title>{`${product.name} - MakassarNotebook`}</title>
                <meta name="description" content={product.overview || product.name} />
            </Head>

            <div className="min-h-screen bg-[#f7f7f7] font-sans text-xs text-[#333333] antialiased">
                {/* --- TOAST NOTIFICATION --- */}
                {toastMessage && (
                    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-[#222222] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in border border-[#0099ff]">
                        <ShoppingCart className="size-4 text-[#0099ff]" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* ========================================================
                    1. TOP UTILITY BAR
                    ======================================================== */}
                <div className="border-b border-[#e5e5e5] bg-white py-1.5 text-[11px] text-[#666666]">
                    <div className="mx-auto flex max-w-[1200px] xl:max-w-[1400px] items-center justify-between px-3 sm:px-4">
                        <div className="flex items-center gap-2 truncate">
                            <span className="flex items-center gap-1 font-semibold text-[#222222]">
                                <MapPin className="size-3.5 text-[#ff6000]" />
                                <span>Makassar</span>
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="font-medium text-[#444444] truncate">
                                Layanan Ambil di Toko <strong>Pick N Go</strong> Tersedia di 4 Cabang Makassar
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-[#555555]">
                            <span className="hover:text-[#0099ff] transition-colors cursor-pointer">Garansi Resmi</span>
                            <span className="hover:text-[#0099ff] transition-colors cursor-pointer">Panduan Belanja</span>
                            <span className="hover:text-[#0099ff] transition-colors cursor-pointer">Cek Resi</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    2. MAIN HEADER
                    ======================================================== */}
                <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white shadow-xs">
                    <div className="mx-auto flex h-16 max-w-[1200px] xl:max-w-[1400px] items-center justify-between gap-4 px-3 sm:px-4">
                        {/* Kategori Button */}
                        <button
                            type="button"
                            onClick={() => setIsCategoryDrawerOpen(true)}
                            className="flex items-center gap-2 rounded-lg border border-[#cccccc] bg-[#fafafa] px-3.5 py-2 text-xs font-semibold text-[#444444] hover:bg-[#f0f0f0] transition-all cursor-pointer shrink-0"
                        >
                            <Menu className="size-4 text-[#ff6000]" />
                            <span className="hidden sm:inline">Kategori</span>
                        </button>

                        {/* Brand Logo MakassarNotebook */}
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <svg viewBox="0 0 24 24" className="size-8">
                                <path d="M 12.0331 20.0119 C 10.2264 19.9492 8.51686 19.5975 6.86925 18.9462 C 5.40864 18.3688 4.05164 17.5578 2.8514 16.5448 C 2.69483 16.4131 2.51397 16.2957 2.49023 16.0603 C 2.48123 15.9716 2.47059 15.8835 2.5587 15.834 C 2.64054 15.7873 2.69809 15.8565 2.75811 15.9005 C 3.93354 16.7556 5.25518 17.3044 6.63165 17.7298 C 7.80462 18.0922 9.00979 18.323 10.2294 18.4663 C 11.0922 18.5669 11.9585 18.6389 12.829 18.5868 C 14.5189 18.4859 16.1919 18.2829 17.807 17.7412 C 18.2814 17.5806 18.7435 17.3858 19.1899 17.1585 C 19.2978 17.0999 19.4104 17.0507 19.5268 17.0112 C 19.6955 16.9602 19.8227 17.0137 19.8922 17.1428 C 19.9664 17.2791 19.9468 17.3882 19.8022 17.5162 C 19.5245 17.7617 19.21 17.9548 18.8914 18.1387 C 17.4367 18.9786 15.8714 19.5056 14.2188 19.788 C 13.4959 19.9097 12.7658 19.9845 12.0331 20.0119 " fill="#0099FF"></path>
                                <path d="M 18.0337 16.4889 C 18.0528 16.3667 18.1317 16.3202 18.2045 16.2897 C 19.0408 15.9392 19.8783 15.5903 20.8142 15.635 C 20.9933 15.6456 21.1696 15.6844 21.3366 15.7499 C 21.5077 15.814 21.5821 15.9214 21.5788 16.1138 C 21.5688 16.6433 21.4577 17.166 21.2515 17.6539 C 21.0398 18.1648 20.7229 18.6108 20.3898 19.0467 C 20.3729 19.0693 20.354 19.0903 20.3333 19.1095 C 20.296 19.1435 20.2499 19.1619 20.2045 19.1345 C 20.1593 19.1073 20.153 19.0601 20.1759 19.011 C 20.1959 18.9682 20.2171 18.9259 20.234 18.882 C 20.4522 18.3173 20.6475 17.7472 20.6953 17.1378 C 20.7028 17.1008 20.7075 17.0634 20.7098 17.0257 C 20.6787 16.5585 20.5718 16.4318 20.1219 16.3901 C 19.6981 16.3532 19.2716 16.3594 18.849 16.4087 C 18.5809 16.4381 18.3128 16.4616 18.0337 16.4889 Z" fill="#0099FF"></path>
                                <path d="M 10.8112 5.97367 C 9.49198 4.28487 7.74508 3.70328 5.67818 4.13919 C 3.56029 4.58574 1.35236 6.81112 2.17699 9.9471 C 2.71928 12.0085 4.63205 13.4386 6.90762 13.466 C 7.05029 13.4562 7.27697 13.4469 7.50229 13.4226 C 7.66133 13.4056 7.81872 13.3713 7.97557 13.3391 C 9.71649 12.9845 11.4994 11.3167 11.6781 9.17506 C 11.7763 7.99773 11.5441 6.91205 10.8112 5.97367 Z M 6.86234 11.9092 C 5.22864 11.9654 3.6773 10.56 3.67621 8.72225 C 3.67629 7.88138 4.0103 7.07496 4.60481 6.4803 C 5.19931 5.88563 6.00565 5.55141 6.84652 5.55112 C 8.6128 5.54867 10.0026 6.94751 10.0294 8.70778 C 10.0555 10.4411 8.57189 11.9547 6.86234 11.9092 Z" fill="#FF8500"></path>
                                <path d="M 20.6701 5.46145 C 19.4747 4.2631 18.0241 3.85666 16.3677 4.06343 C 14.2018 4.33376 11.5787 6.57087 12.4863 9.97846 C 13.1063 12.3026 15.5284 13.7843 17.9182 13.4202 C 20.0111 13.1015 22.043 11.1853 21.9991 8.67676 C 22.0094 7.4315 21.5627 6.35455 20.6701 5.46145 Z M 17.1602 11.9123 C 15.45 11.962 13.9661 10.4684 13.9798 8.72068 C 13.9934 6.96312 15.3917 5.55419 17.1531 5.55419 C 18.9145 5.55419 20.3281 6.95767 20.3291 8.71522 C 20.33 10.4995 18.9317 11.9101 17.1602 11.9123 Z" fill="#FF8500"></path>
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#222222] leading-none">
                                    makassar<span className="text-[#0099ff]">notebook</span>
                                </span>
                                <span className="text-[10px] font-bold text-[#ff6000] tracking-tight mt-0.5">
                                    #SudahPastiMurahnya
                                </span>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-2xl">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchKeyword.trim()) {
                                        router.get('/', { search: searchKeyword });
                                    }
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="Cari produk di MakassarNotebook..."
                                    className="h-10 w-full rounded-lg border border-[#cccccc] bg-[#f0f0f0] pr-10 pl-3.5 text-xs text-[#333333] placeholder-[#999999] focus:bg-white focus:border-[#0099ff] focus:outline-none transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-[#777777] hover:text-[#0099ff] transition-colors"
                                >
                                    <Search className="size-4.5" />
                                </button>
                            </form>
                        </div>

                        {/* Cart & Account */}
                        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                            <Link
                                href="/client?tab=cart"
                                className="flex items-center gap-2 text-[#333333] hover:text-[#ff6000] transition-colors cursor-pointer"
                            >
                                <div className="relative">
                                    <ShoppingCart className="size-5 text-[#ff6000]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-[#ff0000] text-[10px] font-bold text-white shadow-xs">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:inline text-xs font-medium">Keranjang ({cartCount})</span>
                            </Link>

                            <span className="text-gray-300 hidden sm:inline">|</span>

                            <StoreAccountMenu />
                        </div>
                    </div>
                </header>

                {/* ========================================================
                    CATEGORY DRAWER
                    ======================================================== */}
                {isCategoryDrawerOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                            onClick={() => setIsCategoryDrawerOpen(false)}
                        />
                        <div className="relative z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
                                <h2 className="text-base font-bold text-[#222222]">Semua Kategori</h2>
                                <button
                                    onClick={() => setIsCategoryDrawerOpen(false)}
                                    className="rounded p-1 text-gray-400 hover:text-black cursor-pointer"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-12 flex-1 overflow-hidden">
                                <div className="col-span-5 border-r border-[#e5e5e5] bg-[#fafafa] overflow-y-auto">
                                    {categories.map((dept, index) => (
                                        <button
                                            key={dept.id}
                                            type="button"
                                            onClick={() => setActiveDepartment(index)}
                                            className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors border-l-4 ${
                                                activeDepartment === index
                                                    ? 'bg-white text-[#0099ff] border-[#0099ff]'
                                                    : 'text-[#444444] border-transparent hover:bg-white/60'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {dept.icon && <span>{dept.icon}</span>}
                                                <span>{dept.name}</span>
                                            </span>
                                            <ChevronRight className="size-3.5 text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                                <div className="col-span-7 p-6 overflow-y-auto bg-white">
                                    {categories[activeDepartment] && (
                                        <div>
                                            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2 mb-4">
                                                <span className="text-sm font-bold text-[#222222]">
                                                    {categories[activeDepartment].name}
                                                </span>
                                                <Link
                                                    href={`/categories/${categories[activeDepartment].slug}`}
                                                    className="text-xs text-[#0099ff] hover:underline font-semibold"
                                                >
                                                    Buka Kategori &rarr;
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories[activeDepartment].sub_categories?.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/categories/${categories[activeDepartment].slug}?sub_category=${sub.slug}`}
                                                        className="text-left text-xs text-[#555555] hover:text-[#0099ff] hover:underline p-1.5 rounded transition-colors"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================
                    MAIN CONTENT CONTAINER
                    ======================================================== */}
                <main className="mx-auto max-w-[1200px] xl:max-w-[1400px] px-3 sm:px-4 py-4">
                    {/* BREADCRUMB */}
                    <nav className="flex items-center gap-1.5 text-[11px] text-[#666666] mb-4 overflow-x-auto whitespace-nowrap scrollbar-none">
                        <Link href="/" className="hover:text-[#0099ff] transition-colors">
                            Home
                        </Link>
                        {product.category && (
                            <>
                                <ChevronRight className="size-3 text-gray-400 shrink-0" />
                                <Link
                                    href={`/categories/${product.category.slug}`}
                                    className="hover:text-[#0099ff] transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        {product.sub_category && product.category && (
                            <>
                                <ChevronRight className="size-3 text-gray-400 shrink-0" />
                                <Link
                                    href={`/categories/${product.category.slug}?sub_category=${product.sub_category.slug}`}
                                    className="hover:text-[#0099ff] transition-colors"
                                >
                                    {product.sub_category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="size-3 text-gray-400 shrink-0" />
                        <span className="font-medium text-[#222222] truncate max-w-[280px]">
                            {product.name}
                        </span>
                    </nav>

                    {/* PRODUCT MAIN CONTAINER (Grid 12 Columns) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* COLUMN 1: PRODUCT GALLERY (5 Columns) */}
                        <div className="lg:col-span-5 flex flex-col gap-3">
                            {/* Main Image Box */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[#e5e5e5] bg-white p-3 shadow-xs flex items-center justify-center">
                                <img
                                    src={getImgUrl(selectedImage)}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                                />
                                {product.discount_percent && product.discount_percent > 0 && (
                                    <span className="absolute top-3 left-3 rounded bg-[#d32f2f] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                        -{product.discount_percent}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnail Carousel / List */}
                            {uniqueImages.length > 1 && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                    {uniqueImages.map((img, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative size-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 cursor-pointer transition-all ${
                                                selectedImage === img
                                                    ? 'border-[#0099ff] ring-2 ring-[#0099ff]/20'
                                                    : 'border-[#e0e0e0] hover:border-[#999999]'
                                            }`}
                                        >
                                            <img
                                                src={getImgUrl(img)}
                                                alt={`Thumb ${i + 1}`}
                                                className="h-full w-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Trust badges strip */}
                            <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#e5e5e5] bg-white p-3 text-center">
                                <div className="flex flex-col items-center">
                                    <ShieldCheck className="size-5 text-[#0099ff] mb-1" />
                                    <span className="font-bold text-[#222222]">Garansi {product.warranty || '7 Hari'}</span>
                                    <span className="text-[10px] text-gray-500">Tukar Unit Baru</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-[#f0f0f0]">
                                    <RotateCcw className="size-5 text-[#ff6000] mb-1" />
                                    <span className="font-bold text-[#222222]">Retur Mudah</span>
                                    <span className="text-[10px] text-gray-500">Service Center</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Store className="size-5 text-[#166397] mb-1" />
                                    <span className="font-bold text-[#222222]">Pick N Go</span>
                                    <span className="text-[10px] text-gray-500">Ambil di Toko</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: PRODUCT INFO & OVERVIEW (4 Columns) */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                                {/* SKU & Brand header */}
                                <div className="flex items-center gap-2 mb-2">
                                    {product.brand && (
                                        <span className="rounded bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-bold text-[#555555]">
                                            BRAND: {product.brand.toUpperCase()}
                                        </span>
                                    )}
                                    {product.sku && (
                                        <span className="text-[11px] font-mono text-[#777777]">
                                            SKU: {product.sku}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-base sm:text-lg font-bold text-[#222222] leading-snug">
                                    {product.name}
                                </h1>

                                {/* Rating & Review Summary */}
                                <div className="mt-2.5 flex items-center gap-3 pb-3 border-b border-[#f0f0f0] text-[11px]">
                                    <div className="flex items-center gap-1 font-bold text-[#222222]">
                                        <Star className="size-3.5 fill-[#ff8500] text-[#ff8500]" />
                                        <span>{product.rating || '4.9'}</span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-[#666666]">{product.review_count || 12} Ulasan</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-[#0099ff] font-semibold">
                                        Stok: {product.stock || 0} unit
                                    </span>
                                </div>

                                {/* Price block */}
                                <div className="mt-3.5 bg-[#fafafa] rounded-lg p-3 border border-[#eeeeee]">
                                    <div className="text-[11px] text-[#777777]">Harga Retail Makassar:</div>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-2xl font-black text-[#222222]">
                                            {formatRupiah(product.price)}
                                        </span>
                                        {product.original_price && product.original_price > product.price && (
                                            <span className="text-xs text-[#999999] line-through">
                                                {formatRupiah(product.original_price)}
                                            </span>
                                        )}
                                        {product.discount_percent && (
                                            <span className="rounded bg-[#ffe6e6] px-1.5 py-0.5 text-[10px] font-bold text-[#d32f2f]">
                                                Hemat {product.discount_percent}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Color / Variant if any */}
                                {product.color && (
                                    <div className="mt-3">
                                        <div className="text-[11px] font-semibold text-[#555555] mb-1.5">
                                            Pilihan Warna:
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 rounded-md border border-[#0099ff] bg-[#e6f5ff] px-3 py-1 font-semibold text-[#0099ff]">
                                            <Check className="size-3.5" />
                                            <span>{product.color}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Pick N Go Branch Stock Availability */}
                                <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                                            <Store className="size-4 text-[#0099ff]" />
                                            Ketersediaan di Toko Offline:
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#0099ff]">
                                            Pick N Go
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {branches.map((b, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#fbfbfb] border border-[#f0f0f0]"
                                            >
                                                <span className="font-medium text-[#444444]">{b.name}</span>
                                                <span className="font-bold text-[#008000] flex items-center gap-1">
                                                    <Check className="size-3" />
                                                    {b.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: STICKY BUY BOX (3 Columns) */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-20 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-sm">
                                <h3 className="text-xs font-bold text-[#222222] mb-3 pb-2 border-b border-[#f0f0f0]">
                                    Atur Jumlah Pembelian
                                </h3>

                                {/* Quantity Control */}
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs text-[#555555]">Kuantitas:</span>
                                    <div className="flex items-center rounded-lg border border-[#cccccc] bg-[#f9f9f9]">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange('dec')}
                                            disabled={quantity <= 1}
                                            className="flex size-7 items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
                                        >
                                            <Minus className="size-3.5" />
                                        </button>
                                        <input
                                            type="text"
                                            readOnly
                                            value={quantity}
                                            className="w-10 text-center font-bold text-xs bg-transparent border-x border-[#cccccc] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange('inc')}
                                            disabled={quantity >= maxStock}
                                            className="flex size-7 items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
                                        >
                                            <Plus className="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal calculation */}
                                <div className="flex items-baseline justify-between py-2 border-t border-[#f0f0f0] mb-4">
                                    <span className="text-xs text-[#666666]">Subtotal:</span>
                                    <span className="text-lg font-black text-[#d32f2f]">
                                        {formatRupiah(product.price * quantity)}
                                    </span>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#0099ff] bg-[#e6f5ff] py-2.5 text-xs font-bold text-[#0099ff] hover:bg-[#d0ebff] transition-colors cursor-pointer"
                                    >
                                        <ShoppingCart className="size-4" />
                                        <span>+ Keranjang</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddToCart();
                                            triggerToast('Mengarahkan ke pembayaran...');
                                        }}
                                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#ff6000] py-2.5 text-xs font-bold text-white hover:bg-[#e05500] shadow-xs transition-colors cursor-pointer"
                                    >
                                        <Zap className="size-4 fill-current" />
                                        <span>Beli Sekarang</span>
                                    </button>
                                </div>

                                {/* Delivery & Pick N Go info */}
                                <div className="mt-4 pt-3 border-t border-[#f0f0f0] text-[11px] text-[#666666] space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Truck className="size-4 text-[#0099ff] shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-[#222222]">Kurir Cepat Makassar</div>
                                            <div>GrabExpress / GoSend (2-4 Jam)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Store className="size-4 text-[#ff6000] shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-[#222222]">Pick N Go Gratis</div>
                                            <div>Langsung ambil di toko tanpa antre</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT DETAILS TABS (Overview, Features, Specifications, What's in the Box) */}
                    <div className="mt-6 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-[#e5e5e5] pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-[#0099ff] text-white shadow-xs'
                                        : 'text-[#555555] hover:bg-[#f0f0f0]'
                                }`}
                            >
                                Ringkasan Produk
                            </button>
                            {product.features && product.features.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('features')}
                                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                        activeTab === 'features'
                                            ? 'bg-[#0099ff] text-white shadow-xs'
                                            : 'text-[#555555] hover:bg-[#f0f0f0]'
                                    }`}
                                >
                                    Fitur Unggulan
                                </button>
                            )}
                            {product.specifications && product.specifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('specifications')}
                                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                        activeTab === 'specifications'
                                            ? 'bg-[#0099ff] text-white shadow-xs'
                                            : 'text-[#555555] hover:bg-[#f0f0f0]'
                                    }`}
                                >
                                    Spesifikasi Teknis
                                </button>
                            )}
                            {product.whats_in_the_box && product.whats_in_the_box.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('box')}
                                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                        activeTab === 'box'
                                            ? 'bg-[#0099ff] text-white shadow-xs'
                                            : 'text-[#555555] hover:bg-[#f0f0f0]'
                                    }`}
                                >
                                    Isi Kemasan
                                </button>
                            )}
                        </div>

                        {/* Tab Contents */}
                        <div className="mt-4 text-xs leading-relaxed text-[#444444]">
                            {activeTab === 'overview' && (
                                <div className="space-y-3">
                                    {product.overview && (
                                        <p className="text-sm font-medium text-[#222222]">{product.overview}</p>
                                    )}
                                    {product.description && (
                                        <div className="whitespace-pre-line text-[#555555]">{product.description}</div>
                                    )}
                                    {!product.overview && !product.description && (
                                        <p className="text-gray-400 italic">Belum ada keterangan ringkasan untuk produk ini.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'features' && product.features && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.features.map((feat, idx) => (
                                        <div key={idx} className="rounded-lg border border-[#f0f0f0] bg-[#fafafa] p-3">
                                            <div className="font-bold text-[#222222] mb-1">{feat.title}</div>
                                            <div className="text-[11px] text-[#666666]">{feat.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specifications' && product.specifications && (
                                <div className="rounded-lg border border-[#e5e5e5] overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <tbody>
                                            {product.specifications.map((spec, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={idx % 2 === 0 ? 'bg-[#fcfcfc]' : 'bg-white'}
                                                >
                                                    <td className="w-1/3 p-2.5 font-semibold text-[#333333] border-b border-[#f0f0f0]">
                                                        {spec.key}
                                                    </td>
                                                    <td className="p-2.5 text-[#555555] border-b border-[#f0f0f0]">
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ))}
                                            {product.package_dimension && (
                                                <tr className="bg-[#fcfcfc]">
                                                    <td className="w-1/3 p-2.5 font-semibold text-[#333333] border-b border-[#f0f0f0]">
                                                        Dimensi Paket
                                                    </td>
                                                    <td className="p-2.5 text-[#555555] border-b border-[#f0f0f0]">
                                                        {product.package_dimension}
                                                    </td>
                                                </tr>
                                            )}
                                            {product.weight_grams && (
                                                <tr className="bg-white">
                                                    <td className="w-1/3 p-2.5 font-semibold text-[#333333] border-b border-[#f0f0f0]">
                                                        Berat Produk
                                                    </td>
                                                    <td className="p-2.5 text-[#555555] border-b border-[#f0f0f0]">
                                                        {product.weight_grams} gram
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'box' && product.whats_in_the_box && (
                                <div className="space-y-2">
                                    <div className="font-semibold text-[#222222] mb-1">
                                        Kelengkapan yang Anda dapatkan untuk pembelian produk ini:
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-[#555555]">
                                        {product.whats_in_the_box.map((boxItem, idx) => (
                                            <li key={idx}>{boxItem}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* REKOMENDASI PRODUK TERKAIT */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-8 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="size-5 text-[#0099ff]" />
                                    <h3 className="text-sm font-bold text-[#222222]">
                                        Produk Terkait di Kategori Ini
                                    </h3>
                                </div>
                                {product.category && (
                                    <Link
                                        href={`/categories/${product.category.slug}`}
                                        className="text-xs font-semibold text-[#0099ff] hover:underline"
                                    >
                                        Lihat Semua di {product.category.name} &rarr;
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 2xl:gap-3.5">
                                {relatedProducts.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/products/${rel.slug}`}
                                        className="cursor-pointer group flex flex-col justify-between rounded-lg border border-[#e9e9e9] p-2 hover:border-[#ff6000] hover:shadow-xs transition-all bg-white"
                                    >
                                        <div>
                                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#fafafa]">
                                                <img
                                                    src={getImgUrl(rel.thumbnail)}
                                                    alt={rel.name}
                                                    className="h-full w-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                />
                                                {rel.discount_percent && rel.discount_percent > 0 && (
                                                    <span className="absolute top-1 left-1 rounded bg-[#0099ff] px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                                                        -{rel.discount_percent}%
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="mt-2 text-[11px] font-medium text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ff6000]">
                                                {rel.name}
                                            </h4>
                                        </div>

                                        <div className="mt-2 pt-1 border-t border-[#f5f5f5]">
                                            <div className="text-xs font-bold text-[#222222]">
                                                {formatRupiah(rel.price)}
                                            </div>
                                            {rel.original_price && rel.original_price > rel.price && (
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <span className="text-[#999999] line-through">
                                                        {formatRupiah(rel.original_price)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
