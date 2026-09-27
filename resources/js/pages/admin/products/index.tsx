import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    Edit2,
    Eye,
    Filter,
    FolderOpen,
    Package,
    Plus,
    RotateCcw,
    Search,
    Tag,
    Trash2,
    ToggleLeft,
    ToggleRight,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';
import { Pagination, type PaginationLink } from '@/components/pagination';

type Category = {
    id: number;
    name: string;
    icon: string | null;
    sub_categories?: { id: number; name: string }[];
};

type Product = {
    id: number;
    sku: string;
    name: string;
    slug: string;
    brand: string;
    color: string | null;
    price: number;
    original_price: number | null;
    discount_percent: number | null;
    stock: number;
    weight_grams: number;
    warranty: string;
    thumbnail: string | null;
    rating: number;
    review_count: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    category?: { id: number; name: string; icon: string | null };
    sub_category?: { id: number; name: string };
};

type PaginatedProducts = {
    data: Product[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};

type Filters = {
    search: string;
    category_id: string | number;
    sub_category_id: string | number;
    status: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
};

type Stats = {
    total: number;
    active: number;
    out_of_stock: number;
    total_stock: number;
};

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ProductsIndex({
    products,
    categories,
    filters,
    stats,
}: {
    products: PaginatedProducts;
    categories: Category[];
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState<string | number>(filters.category_id || 'all');
    const [subCategoryId, setSubCategoryId] = useState<string | number>(filters.sub_category_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Inline stock editing
    const [stockInputs, setStockInputs] = useState<Record<number, number>>({});
    const [savingStockId, setSavingStockId] = useState<number | null>(null);

    const isFirstRender = useRef(true);

    // Selected category for filtering subcategories in dropdown
    const selectedCategory = categories.find((c) => String(c.id) === String(categoryId));
    const availableSubCategories = selectedCategory?.sub_categories || [];

    function applyFilter(newParams: Partial<Filters>) {
        const query: Record<string, string | number> = {
            search: newParams.search !== undefined ? newParams.search : search,
            category_id: newParams.category_id !== undefined ? newParams.category_id : categoryId,
            sub_category_id: newParams.sub_category_id !== undefined ? newParams.sub_category_id : subCategoryId,
            status: newParams.status !== undefined ? newParams.status : status,
            sort: newParams.sort !== undefined ? newParams.sort : filters.sort,
            direction: newParams.direction !== undefined ? newParams.direction : filters.direction,
            per_page: newParams.per_page !== undefined ? newParams.per_page : filters.per_page,
            page: 1,
        };

        if (!query.search) delete query.search;
        if (query.category_id === 'all') delete query.category_id;
        if (query.sub_category_id === 'all') delete query.sub_category_id;
        if (query.status === 'all') delete query.status;

        router.get(ProductController.index().url, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    // Debounced search
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            if (search !== filters.search) {
                applyFilter({ search });
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    function handleSort(column: string) {
        let newDirection: 'asc' | 'desc' = 'asc';
        if (filters.sort === column) {
            newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
        }
        applyFilter({ sort: column, direction: newDirection });
    }

    function handleReset() {
        setSearch('');
        setCategoryId('all');
        setSubCategoryId('all');
        setStatus('all');
        router.get(ProductController.index().url, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function handleSaveStock(product: Product, newStock: number) {
        if (newStock === product.stock) return;
        setSavingStockId(product.id);
        router.patch(
            ProductController.update(product.id).url,
            { stock: newStock },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSavingStockId(null),
            },
        );
    }

    function handleToggleActive(product: Product) {
        router.patch(
            ProductController.update(product.id).url,
            { is_active: !product.is_active },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDelete(id: number, name: string) {
        if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(id);
        router.delete(ProductController.destroy(id).url, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    }

    const hasActiveFilters = Boolean(
        filters.search ||
        (filters.category_id && filters.category_id !== 'all') ||
        (filters.sub_category_id && filters.sub_category_id !== 'all') ||
        (filters.status && filters.status !== 'all') ||
        filters.sort !== 'created_at' ||
        filters.direction !== 'desc'
    );

    function renderSortIcon(column: string) {
        if (filters.sort !== column) {
            return <ArrowUpDown className="size-3 text-[#BBB] group-hover:text-[#666]" />;
        }
        return filters.direction === 'asc' ? (
            <ArrowUp className="size-3 text-[#0099FF]" />
        ) : (
            <ArrowDown className="size-3 text-[#0099FF]" />
        );
    }

    return (
        <>
            <Head title="Master Data – Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#222222]">
                            Master Data Produk
                        </h1>
                        <p className="mt-0.5 text-xs text-[#666666]">
                            Katalog produk omnichannel, kontrol harga coret, diskon, SKU, dan inventaris
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={CategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                        >
                            <FolderOpen className="size-3.5" />
                            Kategori
                        </Link>
                        <Link
                            href={SubCategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#FF6000] hover:bg-[#FFF3EB] hover:text-[#FF6000]"
                        >
                            <Tag className="size-3.5" />
                            Sub Kategori
                        </Link>
                        <Link
                            href={ProductController.create().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#007ACC]"
                        >
                            <Plus className="size-4" />
                            Tambah Produk
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0099FF]">Total Produk</div>
                        <div className="mt-2 text-2xl font-black text-[#222222]">{stats.total}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">Aktif Dijual</div>
                        <div className="mt-2 text-2xl font-black text-[#222222]">{stats.active}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#D32F2F]">Stok Habis</div>
                        <div className="mt-2 text-2xl font-black text-[#D32F2F]">{stats.out_of_stock}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF6000]">Total Unit Stok</div>
                        <div className="mt-2 text-2xl font-black text-[#222222]">{stats.total_stock}</div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white shadow-2xs">
                    {/* Filter Toolbar */}
                    <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk, SKU, brand, slug..."
                                className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] pl-9 pr-8 text-xs text-[#222] placeholder:text-[#999] outline-none transition-all focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        applyFilter({ search: '' });
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#222]"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter Dropdowns */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Category Filter */}
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setSubCategoryId('all');
                                    applyFilter({ category_id: e.target.value, sub_category_id: 'all' });
                                }}
                                aria-label="Filter Kategori"
                                className="h-9 max-w-40 truncate rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.icon ?? '📦'} {c.name}
                                    </option>
                                ))}
                            </select>

                            {/* Sub Category Filter (active when category chosen) */}
                            {availableSubCategories.length > 0 && (
                                <select
                                    value={subCategoryId}
                                    onChange={(e) => {
                                        setSubCategoryId(e.target.value);
                                        applyFilter({ sub_category_id: e.target.value });
                                    }}
                                    aria-label="Filter Sub Kategori"
                                    className="h-9 max-w-40 truncate rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                                >
                                    <option value="all">Semua Sub Kategori</option>
                                    {availableSubCategories.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Status Filter */}
                            <div className="flex items-center gap-1.5">
                                <Filter className="size-3.5 text-[#888]" />
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilter({ status: e.target.value });
                                    }}
                                    aria-label="Filter Status"
                                    className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Hanya Aktif</option>
                                    <option value="inactive">Hanya Non-aktif</option>
                                    <option value="out_of_stock">Stok Habis</option>
                                </select>
                            </div>

                            {/* Sort Selector */}
                            <select
                                value={`${filters.sort}_${filters.direction}`}
                                onChange={(e) => {
                                    const [sort, direction] = e.target.value.split('_');
                                    applyFilter({ sort, direction: direction as 'asc' | 'desc' });
                                }}
                                aria-label="Urutkan Data"
                                className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                            >
                                <option value="created_at_desc">Terbaru Dibuat</option>
                                <option value="created_at_asc">Terlama</option>
                                <option value="price_asc">Harga Terendah</option>
                                <option value="price_desc">Harga Tertinggi</option>
                                <option value="stock_desc">Stok Terbanyak</option>
                                <option value="stock_asc">Stok Tersedikit</option>
                                <option value="discount_percent_desc">Diskon Terbesar</option>
                                <option value="name_asc">Nama (A - Z)</option>
                            </select>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-semibold text-[#666] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] hover:text-[#D32F2F]"
                                    title="Reset filter"
                                >
                                    <RotateCcw className="size-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F0F8FF]">
                                <Package className="size-7 text-[#0099FF]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#222222]">
                                    {hasActiveFilters
                                        ? 'Tidak ditemukan produk yang sesuai'
                                        : 'Belum ada produk terdaftar'}
                                </p>
                                <p className="mt-0.5 text-xs text-[#666666]">
                                    {hasActiveFilters
                                        ? 'Coba gunakan filter lain atau kata kunci yang lebih umum'
                                        : 'Mulai input produk pertama Anda ke dalam sistem'}
                                </p>
                            </div>
                            {hasActiveFilters ? (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg border border-[#0099FF] bg-[#E6F5FF] px-4 text-xs font-bold text-[#0099FF] hover:bg-[#D6EEFF]"
                                >
                                    <RotateCcw className="size-3.5" /> Reset Filter
                                </button>
                            ) : (
                                <Link
                                    href={ProductController.create().url}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white hover:bg-[#007ACC]"
                                >
                                    <Plus className="size-4" /> Tambah Produk Baru
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                        <th className="px-4 py-3 font-semibold">Foto</th>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="group cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Produk & Identitas</span>
                                                {renderSortIcon('name')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-semibold">Kategori</th>
                                        <th
                                            onClick={() => handleSort('price')}
                                            className="group cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Harga Jual</span>
                                                {renderSortIcon('price')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('stock')}
                                            className="group cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Stok</span>
                                                {renderSortIcon('stock')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('is_active')}
                                            className="group cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Status</span>
                                                {renderSortIcon('is_active')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0F0F0]">
                                    {products.data.map((prod) => {
                                        const currentStockValue =
                                            stockInputs[prod.id] !== undefined
                                                ? stockInputs[prod.id]
                                                : prod.stock;
                                        const isStockModified = currentStockValue !== prod.stock;

                                        return (
                                            <tr
                                                key={prod.id}
                                                className="transition-colors hover:bg-[#FAFAFA]"
                                            >
                                                {/* Thumbnail */}
                                                <td className="px-4 py-3">
                                                    <div className="size-12 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
                                                        {prod.thumbnail ? (
                                                            <img
                                                                src={prod.thumbnail}
                                                                alt={prod.name}
                                                                className="size-full object-contain p-1"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src =
                                                                        'https://placehold.co/100x100?text=No+Image';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center bg-[#F9F9F9] text-[#AAA]">
                                                                <Package className="size-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Product Info */}
                                                <td className="max-w-xs px-4 py-3">
                                                    <Link
                                                        href={ProductController.show(prod.id).url}
                                                        className="font-bold text-[#222222] transition-colors hover:text-[#0099FF] line-clamp-2"
                                                        title={prod.name}
                                                    >
                                                        {prod.name}
                                                    </Link>
                                                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                        <span className="rounded bg-[#F0F0F0] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#555]">
                                                            SKU: {prod.sku}
                                                        </span>
                                                        <span className="rounded bg-[#E6F5FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#0099FF]">
                                                            {prod.brand}
                                                        </span>
                                                        {prod.color && (
                                                            <span className="rounded bg-[#FFF3EB] px-1.5 py-0.5 text-[10px] font-medium text-[#FF6000]">
                                                                {prod.color}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Category & Sub */}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-[#222222]">
                                                            {prod.category?.name ?? '—'}
                                                        </span>
                                                        {prod.sub_category && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-[#666666]">
                                                                <Tag className="size-2.5 text-[#999]" />
                                                                {prod.sub_category.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Price & Discount */}
                                                <td className="px-4 py-3">
                                                    <div className="font-black text-[#D32F2F]">
                                                        {formatRupiah(prod.price)}
                                                    </div>
                                                    {prod.original_price && prod.original_price > prod.price && (
                                                        <div className="mt-0.5 flex items-center gap-1.5">
                                                            <span className="text-[10px] text-[#999] line-through">
                                                                {formatRupiah(prod.original_price)}
                                                            </span>
                                                            {prod.discount_percent && (
                                                                <span className="rounded bg-[#FFE6E6] px-1 text-[9px] font-bold text-[#D32F2F]">
                                                                    -{prod.discount_percent}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Stock & Inline Update */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={currentStockValue}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                setStockInputs((prev) => ({
                                                                    ...prev,
                                                                    [prod.id]: isNaN(val) ? 0 : val,
                                                                }));
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveStock(prod, currentStockValue);
                                                                }
                                                            }}
                                                            className={`h-7 w-16 rounded border px-1.5 text-center font-mono text-xs font-semibold outline-none transition-all ${
                                                                isStockModified
                                                                    ? 'border-[#0099FF] bg-[#E6F5FF] text-[#0099FF] ring-1 ring-[#0099FF]'
                                                                    : prod.stock <= 0
                                                                    ? 'border-[#D32F2F] bg-[#FFE6E6] text-[#D32F2F]'
                                                                    : 'border-[#E5E5E5] bg-white text-[#333]'
                                                            }`}
                                                            title="Tekan Enter untuk simpan stok"
                                                        />
                                                        {isStockModified && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveStock(prod, currentStockValue)}
                                                                disabled={savingStockId === prod.id}
                                                                className="inline-flex size-6 items-center justify-center rounded bg-[#0099FF] text-white hover:bg-[#007ACC]"
                                                                title="Simpan stok"
                                                            >
                                                                <Check className="size-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Toggle Status */}
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(prod)}
                                                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-transform hover:scale-105 active:scale-95"
                                                        title="Klik untuk ubah status aktif"
                                                    >
                                                        {prod.is_active ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[#16A34A]">
                                                                <ToggleRight className="size-3.5 text-[#16A34A]" /> Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[#888]">
                                                                <ToggleLeft className="size-3.5 text-[#999]" /> Non-aktif
                                                            </span>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={ProductController.show(prod.id).url}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                                                            title="Lihat Detail Produk"
                                                        >
                                                            <Eye className="size-3.5" />
                                                        </Link>
                                                        <Link
                                                            href={ProductController.edit(prod.id).url}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#0099FF] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#E6F5FF]"
                                                            title="Edit Produk"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            disabled={deletingId === prod.id}
                                                            onClick={() => handleDelete(prod.id, prod.name)}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#D32F2F] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] disabled:opacity-50"
                                                            title="Hapus Produk"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Bar */}
                    <Pagination
                        links={products.links}
                        from={products.from}
                        to={products.to}
                        total={products.total}
                        perPage={filters.per_page}
                        onPerPageChange={(per_page) => applyFilter({ per_page })}
                    />
                </div>
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Produk', href: '/admin/products' },
    ],
};
