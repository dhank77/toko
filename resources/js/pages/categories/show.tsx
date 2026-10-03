import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpDown, ChevronRight, Layers, Package } from 'lucide-react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { formatRupiah } from '@/lib/utils';

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
        <StorefrontLayout categories={categories}>
            <Head>
                <title>{`${category.name} - MakassarNotebook`}</title>
                <meta name="description" content={`Belanja produk kategori ${category.name} harga termurah di MakassarNotebook`} />
            </Head>

            <div className="mx-auto max-w-[1200px] xl:max-w-[1400px] px-3 sm:px-4 py-4">
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
            </div>
        </StorefrontLayout>
    );
}
