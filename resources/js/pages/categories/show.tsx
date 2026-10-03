import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    Layers,
    MapPin,
    Menu,
    Package,
    Search,
    ShieldCheck,
    ShoppingCart,
    Store,
    User,
    X,
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
    thumbnail?: string | null;
    category?: { id: number; name: string; slug: string } | null;
    sub_category?: { id: number; name: string; slug: string } | null;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    category: Category;
    products: PaginatedProducts;
    selectedSubCategory?: string;
    selectedSort?: string;
    categories: Category[];
}

export default function CategoryShow({
    category,
    products,
    selectedSubCategory = 'all',
    selectedSort = 'latest',
    categories = [],
}: Props) {
    const { auth } = usePage().props;
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [activeDepartment, setActiveDepartment] = useState(0);

    const getImgUrl = (src?: string | null) => {
        if (!src) return 'https://placehold.co/400x400/f5f5f5/999999?text=No+Image';
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
        return `/storage/${src}`;
    };

    const handleSubCategoryChange = (subSlug: string) => {
        router.get(
            `/categories/${category.slug}`,
            {
                sub_category: subSlug === 'all' ? undefined : subSlug,
                sort: selectedSort !== 'latest' ? selectedSort : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSortChange = (sortVal: string) => {
        router.get(
            `/categories/${category.slug}`,
            {
                sub_category: selectedSubCategory !== 'all' ? selectedSubCategory : undefined,
                sort: sortVal,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <Head>
                <title>{`${category.name} - MakassarNotebook`}</title>
                <meta name="description" content={`Belanja produk kategori ${category.name} harga termurah di MakassarNotebook`} />
            </Head>

            <div className="min-h-screen bg-[#f7f7f7] font-sans text-xs text-[#333333] antialiased">
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
                                    placeholder={`Cari di ${category.name}...`}
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
                                className="flex items-center gap-1.5 text-[#333333] hover:text-[#ff6000] transition-colors cursor-pointer"
                            >
                                <ShoppingCart className="size-5 text-[#ff6000]" />
                                <span className="hidden lg:inline text-xs font-medium">Keranjang</span>
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
                                                    onClick={() => setIsCategoryDrawerOpen(false)}
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
                                                        onClick={() => setIsCategoryDrawerOpen(false)}
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
                    MAIN CONTAINER
                    ======================================================== */}
                <main className="mx-auto max-w-[1200px] xl:max-w-[1400px] px-3 sm:px-4 py-4">
                    {/* BREADCRUMB */}
                    <nav className="flex items-center gap-1.5 text-[11px] text-[#666666] mb-4">
                        <Link href="/" className="hover:text-[#0099ff] transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="size-3 text-gray-400" />
                        <span className="font-semibold text-[#222222]">{category.name}</span>
                    </nav>

                    {/* CATEGORY BANNER HEADER */}
                    <div className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-xs mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {category.icon ? (
                                    <span className="flex size-14 items-center justify-center rounded-xl bg-[#e6f5ff] text-2xl">
                                        {category.icon}
                                    </span>
                                ) : (
                                    <span className="flex size-14 items-center justify-center rounded-xl bg-[#e6f5ff] text-[#0099ff]">
                                        <Layers className="size-7" />
                                    </span>
                                )}
                                <div>
                                    <h1 className="text-lg sm:text-xl font-black text-[#222222]">
                                        {category.name}
                                    </h1>
                                    <p className="text-xs text-[#666666] mt-0.5">
                                        Pilihan terlengkap dan termurah di Makassar &amp; Indonesia Timur. Tersedia opsi Pick N Go.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#444444] shrink-0 bg-[#fafafa] px-3.5 py-2 rounded-lg border border-[#eeeeee]">
                                <Package className="size-4 text-[#0099ff]" />
                                <span>Total {products.total} Produk</span>
                            </div>
                        </div>

                        {/* SUB CATEGORY TABS / CHIPS */}
                        {category.sub_categories && category.sub_categories.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none pb-1">
                                <button
                                    type="button"
                                    onClick={() => handleSubCategoryChange('all')}
                                    className={`rounded-full px-3.5 py-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                        selectedSubCategory === 'all'
                                            ? 'bg-[#0099ff] text-white shadow-xs'
                                            : 'bg-[#f0f0f0] text-[#555555] hover:bg-[#e6f5ff] hover:text-[#0099ff]'
                                    }`}
                                >
                                    Semua Sub-Kategori
                                </button>
                                {category.sub_categories.map((sub) => {
                                    const isSelected = selectedSubCategory === sub.slug;
                                    return (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => handleSubCategoryChange(sub.slug)}
                                            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                                isSelected
                                                    ? 'bg-[#0099ff] text-white shadow-xs'
                                                    : 'bg-[#f0f0f0] text-[#555555] hover:bg-[#e6f5ff] hover:text-[#0099ff]'
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* SORT & FILTER CONTROLS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e5e5] mb-4 shadow-xs">
                        <div className="text-xs text-[#555555]">
                            Menampilkan <span className="font-bold text-[#222222]">{products.data.length}</span> dari <span className="font-bold text-[#222222]">{products.total}</span> produk
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#666666] flex items-center gap-1">
                                <ArrowUpDown className="size-3.5" />
                                Urutkan:
                            </span>
                            <select
                                value={selectedSort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="h-8 rounded-lg border border-[#cccccc] bg-white px-2.5 text-xs text-[#333333] focus:border-[#0099ff] focus:outline-none cursor-pointer"
                            >
                                <option value="latest">Terbaru</option>
                                <option value="price_low">Harga Terendah</option>
                                <option value="price_high">Harga Tertinggi</option>
                                <option value="discount">Diskon Tertinggi</option>
                                <option value="name">Nama (A - Z)</option>
                            </select>
                        </div>
                    </div>

                    {/* PRODUCT GRID (8-Column High-Density Grid) */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 2xl:gap-3.5">
                            {products.data.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.slug}`}
                                    className="cursor-pointer group flex flex-col justify-between rounded-lg border border-[#e9e9e9] p-2 hover:border-[#ff6000] hover:shadow-xs transition-all bg-white"
                                >
                                    <div>
                                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#fafafa]">
                                            <img
                                                src={getImgUrl(item.thumbnail)}
                                                alt={item.name}
                                                className="h-full w-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            {item.discount_percent && item.discount_percent > 0 && (
                                                <span className="absolute top-1 left-1 rounded bg-[#0099ff] px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                                                    -{item.discount_percent}%
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="mt-2 text-[11px] font-medium text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ff6000]">
                                            {item.name}
                                        </h4>

                                        {item.brand && (
                                            <span className="mt-1 inline-block rounded bg-[#f2f2f2] px-1.5 py-0.5 text-[9px] text-[#666666]">
                                                {item.brand}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 pt-1 border-t border-[#f5f5f5]">
                                        <div className="text-xs font-bold text-[#222222]">
                                            {formatRupiah(item.price)}
                                        </div>
                                        {item.original_price && item.original_price > item.price && (
                                            <div className="flex items-center gap-1 text-[10px]">
                                                <span className="text-[#999999] line-through">
                                                    {formatRupiah(item.original_price)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-[#e5e5e5] bg-white p-12 text-center shadow-xs">
                            <Package className="size-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-[#222222]">Belum ada produk di kategori ini</h3>
                            <p className="text-xs text-[#777777] mt-1 max-w-md mx-auto">
                                Kami terus memperbarui stok katalog produk setiap hari. Silakan cek kembali atau pilih sub-kategori lainnya.
                            </p>
                            <button
                                type="button"
                                onClick={() => handleSubCategoryChange('all')}
                                className="mt-4 rounded-lg bg-[#0099ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#007acc] transition-colors cursor-pointer"
                            >
                                Lihat Semua Sub-Kategori
                            </button>
                        </div>
                    )}

                    {/* PAGINATION */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center gap-1 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-xs text-xs">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 rounded font-medium transition-colors ${
                                            link.active
                                                ? 'bg-[#0099ff] text-white font-bold'
                                                : link.url
                                                ? 'text-[#555555] hover:bg-[#f0f0f0]'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
