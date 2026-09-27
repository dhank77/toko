import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    Edit2,
    Filter,
    FolderOpen,
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
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';
import { Pagination, type PaginationLink } from '@/components/pagination';

type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    sub_categories_count: number;
    created_at: string;
};

type PaginatedCategories = {
    data: Category[];
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
    status: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
};

type Stats = {
    total: number;
    active: number;
    inactive: number;
};

export default function CategoriesIndex({
    categories,
    filters,
    stats,
}: {
    categories: PaginatedCategories;
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Inline order editing state: { [categoryId]: { value: number; isEditing: boolean; isSaving: boolean } }
    const [orderInputs, setOrderInputs] = useState<Record<number, number>>({});
    const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

    const isFirstRender = useRef(true);

    // Apply filters to backend
    function applyFilter(newParams: Partial<Filters>) {
        const query: Record<string, string | number> = {
            search: newParams.search !== undefined ? newParams.search : search,
            status: newParams.status !== undefined ? newParams.status : status,
            sort: newParams.sort !== undefined ? newParams.sort : filters.sort,
            direction: newParams.direction !== undefined ? newParams.direction : filters.direction,
            per_page: newParams.per_page !== undefined ? newParams.per_page : filters.per_page,
            page: 1, // reset page on filter change
        };

        // Clean empty values
        if (!query.search) delete query.search;
        if (query.status === 'all') delete query.status;

        router.get(CategoryController.index().url, query, {
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

    // Handle column sort toggle
    function handleSort(column: string) {
        let newDirection: 'asc' | 'desc' = 'asc';
        if (filters.sort === column) {
            newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
        }
        applyFilter({ sort: column, direction: newDirection });
    }

    // Reset all filters
    function handleReset() {
        setSearch('');
        setStatus('all');
        router.get(CategoryController.index().url, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    // Inline update sort_order
    function handleSaveOrder(cat: Category, newOrder: number) {
        if (newOrder === cat.sort_order) return;
        setSavingOrderId(cat.id);
        router.patch(
            CategoryController.update(cat.id).url,
            { sort_order: newOrder },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSavingOrderId(null),
            },
        );
    }

    // Quick move up / down
    function handleQuickStep(cat: Category, delta: number) {
        const nextOrder = Math.max(0, cat.sort_order + delta);
        handleSaveOrder(cat, nextOrder);
    }

    // Quick toggle active status
    function handleToggleActive(cat: Category) {
        router.patch(
            CategoryController.update(cat.id).url,
            { is_active: !cat.is_active },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDelete(id: number, name: string) {
        if (!confirm(`Hapus kategori "${name}"? Semua sub kategori di dalamnya juga akan terhapus.`)) {
            return;
        }
        setDeletingId(id);
        router.delete(CategoryController.destroy(id).url, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    }

    const hasActiveFilters = Boolean(filters.search || (filters.status && filters.status !== 'all') || filters.sort !== 'sort_order' || filters.direction !== 'asc');

    // Helper to render sort icon on table headers
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
            <Head title="Master Data – Kategori" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#222222]">
                            Master Data Kategori
                        </h1>
                        <p className="mt-0.5 text-xs text-[#666666]">
                            Kelola kategori produk, pencarian cepat, pengurutan, dan sub-kategori
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={SubCategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                        >
                            <Tag className="size-3.5" />
                            Sub Kategori
                        </Link>
                        <Link
                            href={CategoryController.create().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#007ACC]"
                        >
                            <Plus className="size-4" />
                            Tambah Kategori
                        </Link>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0099FF]">Total Kategori</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{stats.total}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">Aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{stats.active}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#666666]">Non-aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{stats.inactive}</div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white shadow-2xs">
                    {/* Filter & Search Toolbar */}
                    <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama kategori, slug, deskripsi..."
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

                        {/* Dropdowns & Reset */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filter */}
                            <div className="flex items-center gap-1.5">
                                <Filter className="size-3.5 text-[#888]" />
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilter({ status: e.target.value });
                                    }}
                                    aria-label="Filter status kategori"
                                    className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Hanya Aktif</option>
                                    <option value="inactive">Hanya Non-aktif</option>
                                </select>
                            </div>

                            {/* Sort Selector Dropdown */}
                            <select
                                value={`${filters.sort}_${filters.direction}`}
                                onChange={(e) => {
                                    const [sort, direction] = e.target.value.split('_');
                                    applyFilter({ sort, direction: direction as 'asc' | 'desc' });
                                }}
                                aria-label="Pilih urutan data"
                                className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                            >
                                <option value="sort_order_asc">Urutan Angka (Terkecil)</option>
                                <option value="sort_order_desc">Urutan Angka (Terbesar)</option>
                                <option value="name_asc">Nama (A - Z)</option>
                                <option value="name_desc">Nama (Z - A)</option>
                                <option value="sub_categories_count_desc">Sub Kategori Terbanyak</option>
                                <option value="created_at_desc">Terbaru Dibuat</option>
                            </select>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-semibold text-[#666] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] hover:text-[#D32F2F]"
                                    title="Reset semua filter dan pencarian"
                                >
                                    <RotateCcw className="size-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table View */}
                    {categories.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F0F8FF]">
                                <FolderOpen className="size-7 text-[#0099FF]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#222222]">
                                    {filters.search || filters.status !== 'all'
                                        ? 'Tidak ditemukan data yang sesuai'
                                        : 'Belum ada kategori'}
                                </p>
                                <p className="mt-0.5 text-xs text-[#666666]">
                                    {filters.search || filters.status !== 'all'
                                        ? 'Coba gunakan kata kunci pencarian lain atau reset filter'
                                        : 'Mulai tambahkan kategori produk pertama Anda'}
                                </p>
                            </div>
                            {filters.search || filters.status !== 'all' ? (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg border border-[#0099FF] bg-[#E6F5FF] px-4 text-xs font-bold text-[#0099FF] hover:bg-[#D6EEFF]"
                                >
                                    <RotateCcw className="size-3.5" /> Reset Filter
                                </button>
                            ) : (
                                <Link
                                    href={CategoryController.create().url}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white hover:bg-[#007ACC]"
                                >
                                    <Plus className="size-4" /> Tambah Kategori
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                        <th className="px-5 py-3 font-semibold">#</th>
                                        <th className="px-5 py-3 font-semibold">Ikon</th>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Nama Kategori</span>
                                                {renderSortIcon('name')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('slug')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Slug</span>
                                                {renderSortIcon('slug')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('sub_categories_count')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Sub Kategori</span>
                                                {renderSortIcon('sub_categories_count')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('sort_order')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Urutan</span>
                                                {renderSortIcon('sort_order')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('is_active')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#0099FF]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Status</span>
                                                {renderSortIcon('is_active')}
                                            </div>
                                        </th>
                                        <th className="px-5 py-3 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0F0F0]">
                                    {categories.data.map((cat, i) => {
                                        const rowNumber = (categories.from ?? 1) + i;
                                        const currentInputValue =
                                            orderInputs[cat.id] !== undefined
                                                ? orderInputs[cat.id]
                                                : cat.sort_order;
                                        const isModified = currentInputValue !== cat.sort_order;

                                        return (
                                            <tr
                                                key={cat.id}
                                                className="transition-colors hover:bg-[#FAFAFA]"
                                            >
                                                <td className="px-5 py-3.5 text-[#999]">{rowNumber}</td>
                                                <td className="px-5 py-3.5 text-xl">{cat.icon ?? '📦'}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="font-semibold text-[#222222]">{cat.name}</div>
                                                    {cat.description && (
                                                        <div className="mt-0.5 max-w-xs truncate text-[10px] text-[#999]">
                                                            {cat.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 font-mono text-[10px] text-[#666]">
                                                    {cat.slug}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <Link
                                                        href={`${SubCategoryController.index().url}?category_id=${cat.id}`}
                                                        className="inline-flex items-center gap-1 rounded-full bg-[#E6F5FF] px-2.5 py-0.5 text-[10px] font-bold text-[#0099FF] transition-colors hover:bg-[#0099FF] hover:text-white"
                                                        title="Lihat sub-kategori ini"
                                                    >
                                                        <Tag className="size-3" />
                                                        {cat.sub_categories_count}
                                                    </Link>
                                                </td>

                                                {/* Ubah Urutan Langsung (Inline Reordering) */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex flex-col">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuickStep(cat, -1)}
                                                                disabled={cat.sort_order <= 0 || savingOrderId === cat.id}
                                                                className="rounded p-0.5 text-[#888] hover:bg-[#E5E5E5] hover:text-[#0099FF] disabled:opacity-30"
                                                                title="Naikkan urutan (angka lebih kecil)"
                                                            >
                                                                ▲
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuickStep(cat, 1)}
                                                                disabled={savingOrderId === cat.id}
                                                                className="rounded p-0.5 text-[#888] hover:bg-[#E5E5E5] hover:text-[#0099FF] disabled:opacity-30"
                                                                title="Turunkan urutan (angka lebih besar)"
                                                            >
                                                                ▼
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="9999"
                                                            value={currentInputValue}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                setOrderInputs((prev) => ({
                                                                    ...prev,
                                                                    [cat.id]: isNaN(val) ? 0 : val,
                                                                }));
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveOrder(cat, currentInputValue);
                                                                }
                                                            }}
                                                            className={`h-7 w-14 rounded border px-1.5 text-center font-mono text-xs font-semibold outline-none transition-all ${
                                                                isModified
                                                                    ? 'border-[#0099FF] bg-[#E6F5FF] text-[#0099FF] ring-1 ring-[#0099FF]'
                                                                    : 'border-[#E5E5E5] bg-white text-[#444] focus:border-[#0099FF]'
                                                            }`}
                                                            title="Tekan Enter untuk simpan urutan"
                                                        />
                                                        {isModified && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveOrder(cat, currentInputValue)}
                                                                disabled={savingOrderId === cat.id}
                                                                className="inline-flex size-6 items-center justify-center rounded bg-[#0099FF] text-white hover:bg-[#007ACC]"
                                                                title="Simpan urutan baru"
                                                            >
                                                                <Check className="size-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Toggle Status */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(cat)}
                                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-transform hover:scale-105 active:scale-95"
                                                        title="Klik untuk ubah status aktif/non-aktif"
                                                    >
                                                        {cat.is_active ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[#16A34A]">
                                                                <ToggleRight className="size-3.5 text-[#16A34A]" /> Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-0.5 text-[#888]">
                                                                <ToggleLeft className="size-3.5 text-[#999]" /> Non-aktif
                                                            </span>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={CategoryController.edit(cat).url}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#0099FF] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#E6F5FF]"
                                                            title="Edit Kategori"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            disabled={deletingId === cat.id}
                                                            onClick={() => handleDelete(cat.id, cat.name)}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#D32F2F] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] disabled:opacity-50"
                                                            title="Hapus Kategori"
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
                        links={categories.links}
                        from={categories.from}
                        to={categories.to}
                        total={categories.total}
                        perPage={filters.per_page}
                        onPerPageChange={(per_page) => applyFilter({ per_page })}
                    />
                </div>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Kategori', href: '/admin/categories' },
    ],
};
