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
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Pagination, type PaginationLink } from '@/components/pagination';

type ParentCategory = {
    id: number;
    name: string;
    icon: string | null;
};

type SubCategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    category: ParentCategory;
};

type PaginatedSubCategories = {
    data: SubCategory[];
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

export default function SubCategoriesIndex({
    subCategories,
    categories,
    filters,
    stats,
}: {
    subCategories: PaginatedSubCategories;
    categories: ParentCategory[];
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState<string | number>(filters.category_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Inline order inputs
    const [orderInputs, setOrderInputs] = useState<Record<number, number>>({});
    const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

    const isFirstRender = useRef(true);

    function applyFilter(newParams: Partial<Filters>) {
        const query: Record<string, string | number> = {
            search: newParams.search !== undefined ? newParams.search : search,
            category_id: newParams.category_id !== undefined ? newParams.category_id : categoryId,
            status: newParams.status !== undefined ? newParams.status : status,
            sort: newParams.sort !== undefined ? newParams.sort : filters.sort,
            direction: newParams.direction !== undefined ? newParams.direction : filters.direction,
            per_page: newParams.per_page !== undefined ? newParams.per_page : filters.per_page,
            page: 1, // reset page on filter change
        };

        if (!query.search) delete query.search;
        if (query.category_id === 'all') delete query.category_id;
        if (query.status === 'all') delete query.status;

        router.get(SubCategoryController.index().url, query, {
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

    // Reset filters
    function handleReset() {
        setSearch('');
        setCategoryId('all');
        setStatus('all');
        router.get(SubCategoryController.index().url, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    // Save inline order
    function handleSaveOrder(sub: SubCategory, newOrder: number) {
        if (newOrder === sub.sort_order) return;
        setSavingOrderId(sub.id);
        router.patch(
            SubCategoryController.update(sub.id).url,
            { sort_order: newOrder },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSavingOrderId(null),
            },
        );
    }

    function handleQuickStep(sub: SubCategory, delta: number) {
        const nextOrder = Math.max(0, sub.sort_order + delta);
        handleSaveOrder(sub, nextOrder);
    }

    function handleToggleActive(sub: SubCategory) {
        router.patch(
            SubCategoryController.update(sub.id).url,
            { is_active: !sub.is_active },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDelete(id: number, name: string) {
        if (!confirm(`Hapus sub kategori "${name}"?`)) return;
        setDeletingId(id);
        router.delete(SubCategoryController.destroy(id).url, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    }

    const hasActiveFilters = Boolean(
        filters.search ||
        (filters.category_id && filters.category_id !== 'all') ||
        (filters.status && filters.status !== 'all') ||
        filters.sort !== 'sort_order' ||
        filters.direction !== 'asc'
    );

    function renderSortIcon(column: string) {
        if (filters.sort !== column) {
            return <ArrowUpDown className="size-3 text-[#BBB] group-hover:text-[#666]" />;
        }
        return filters.direction === 'asc' ? (
            <ArrowUp className="size-3 text-[#FF6000]" />
        ) : (
            <ArrowDown className="size-3 text-[#FF6000]" />
        );
    }

    return (
        <>
            <Head title="Master Data – Sub Kategori" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#222222]">
                            Master Data Sub Kategori
                        </h1>
                        <p className="mt-0.5 text-xs text-[#666666]">
                            Kelola sub-kategori produk, filter per kategori induk, pencarian, dan pengurutan
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={CategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                        >
                            <FolderOpen className="size-3.5" />
                            Kategori
                        </Link>
                        <Link
                            href={SubCategoryController.create().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#FF6000] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#E05500]"
                        >
                            <Plus className="size-4" />
                            Tambah Sub Kategori
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF6000]">Total Sub Kategori</div>
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

                {/* Table Card */}
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
                                placeholder="Cari nama sub-kategori, kategori induk, slug..."
                                className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] pl-9 pr-8 text-xs text-[#222] placeholder:text-[#999] outline-none transition-all focus:border-[#FF6000] focus:bg-white focus:ring-1 focus:ring-[#FF6000]"
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
                            {/* Parent Category Filter */}
                            <div className="flex items-center gap-1.5">
                                <FolderOpen className="size-3.5 text-[#888]" />
                                <select
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        applyFilter({ category_id: e.target.value });
                                    }}
                                    aria-label="Filter kategori induk"
                                    className="h-9 max-w-44 truncate rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000]"
                                >
                                    <option value="all">Semua Kategori Induk</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.icon ?? '📦'} {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-1.5">
                                <Filter className="size-3.5 text-[#888]" />
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilter({ status: e.target.value });
                                    }}
                                    aria-label="Filter status sub kategori"
                                    className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000]"
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
                                className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-medium text-[#444] shadow-2xs outline-none focus:border-[#FF6000] focus:ring-1 focus:ring-[#FF6000]"
                            >
                                <option value="sort_order_asc">Urutan Angka (Terkecil)</option>
                                <option value="sort_order_desc">Urutan Angka (Terbesar)</option>
                                <option value="name_asc">Nama (A - Z)</option>
                                <option value="name_desc">Nama (Z - A)</option>
                                <option value="category_id_asc">Kategori Induk</option>
                                <option value="created_at_desc">Terbaru Dibuat</option>
                            </select>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-semibold text-[#666] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] hover:text-[#D32F2F]"
                                    title="Reset filter dan pencarian"
                                >
                                    <RotateCcw className="size-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table View */}
                    {subCategories.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF3EB]">
                                <Tag className="size-7 text-[#FF6000]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#222222]">
                                    {filters.search || filters.category_id !== 'all' || filters.status !== 'all'
                                        ? 'Tidak ditemukan sub kategori yang sesuai'
                                        : 'Belum ada sub kategori'}
                                </p>
                                <p className="mt-0.5 text-xs text-[#666666]">
                                    {filters.search || filters.category_id !== 'all' || filters.status !== 'all'
                                        ? 'Coba gunakan kata kunci pencarian lain atau reset filter'
                                        : 'Mulai tambahkan sub kategori produk pertama Anda'}
                                </p>
                            </div>
                            {filters.search || filters.category_id !== 'all' || filters.status !== 'all' ? (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg border border-[#FF6000] bg-[#FFF3EB] px-4 text-xs font-bold text-[#FF6000] hover:bg-[#FFE6D6]"
                                >
                                    <RotateCcw className="size-3.5" /> Reset Filter
                                </button>
                            ) : (
                                <Link
                                    href={SubCategoryController.create().url}
                                    className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[#FF6000] px-4 text-xs font-bold text-white hover:bg-[#E05500]"
                                >
                                    <Plus className="size-4" /> Tambah Sub Kategori
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                        <th className="px-5 py-3 font-semibold">#</th>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#FF6000]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Nama Sub Kategori</span>
                                                {renderSortIcon('name')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('category_id')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#FF6000]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Kategori Induk</span>
                                                {renderSortIcon('category_id')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('slug')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#FF6000]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Slug</span>
                                                {renderSortIcon('slug')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('sort_order')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#FF6000]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>Urutan</span>
                                                {renderSortIcon('sort_order')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('is_active')}
                                            className="group cursor-pointer px-5 py-3 font-semibold transition-colors hover:text-[#FF6000]"
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
                                    {subCategories.data.map((sub, i) => {
                                        const rowNumber = (subCategories.from ?? 1) + i;
                                        const currentInputValue =
                                            orderInputs[sub.id] !== undefined
                                                ? orderInputs[sub.id]
                                                : sub.sort_order;
                                        const isModified = currentInputValue !== sub.sort_order;

                                        return (
                                            <tr
                                                key={sub.id}
                                                className="transition-colors hover:bg-[#FAFAFA]"
                                            >
                                                <td className="px-5 py-3.5 text-[#999]">{rowNumber}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="font-semibold text-[#222222]">{sub.name}</div>
                                                    {sub.description && (
                                                        <div className="mt-0.5 max-w-xs truncate text-[10px] text-[#999]">
                                                            {sub.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCategoryId(sub.category.id);
                                                            applyFilter({ category_id: sub.category.id });
                                                        }}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F8FF] px-2.5 py-0.5 text-[10px] font-bold text-[#166397] transition-colors hover:bg-[#0099FF] hover:text-white"
                                                        title={`Filter hanya kategori ${sub.category.name}`}
                                                    >
                                                        <span>{sub.category.icon ?? '📦'}</span>
                                                        {sub.category.name}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5 font-mono text-[10px] text-[#666]">
                                                    {sub.slug}
                                                </td>

                                                {/* Ubah Urutan Langsung (Inline Reordering) */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex flex-col">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuickStep(sub, -1)}
                                                                disabled={sub.sort_order <= 0 || savingOrderId === sub.id}
                                                                className="rounded p-0.5 text-[#888] hover:bg-[#E5E5E5] hover:text-[#FF6000] disabled:opacity-30"
                                                                title="Naikkan urutan (angka lebih kecil)"
                                                            >
                                                                ▲
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuickStep(sub, 1)}
                                                                disabled={savingOrderId === sub.id}
                                                                className="rounded p-0.5 text-[#888] hover:bg-[#E5E5E5] hover:text-[#FF6000] disabled:opacity-30"
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
                                                                    [sub.id]: isNaN(val) ? 0 : val,
                                                                }));
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveOrder(sub, currentInputValue);
                                                                }
                                                            }}
                                                            className={`h-7 w-14 rounded border px-1.5 text-center font-mono text-xs font-semibold outline-none transition-all ${
                                                                isModified
                                                                    ? 'border-[#FF6000] bg-[#FFF3EB] text-[#FF6000] ring-1 ring-[#FF6000]'
                                                                    : 'border-[#E5E5E5] bg-white text-[#444] focus:border-[#FF6000]'
                                                            }`}
                                                            title="Tekan Enter untuk simpan urutan"
                                                        />
                                                        {isModified && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveOrder(sub, currentInputValue)}
                                                                disabled={savingOrderId === sub.id}
                                                                className="inline-flex size-6 items-center justify-center rounded bg-[#FF6000] text-white hover:bg-[#E05500]"
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
                                                        onClick={() => handleToggleActive(sub)}
                                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-transform hover:scale-105 active:scale-95"
                                                        title="Klik untuk ubah status aktif/non-aktif"
                                                    >
                                                        {sub.is_active ? (
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
                                                            href={SubCategoryController.edit(sub).url}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#FF6000] shadow-2xs transition-colors hover:border-[#FF6000] hover:bg-[#FFF3EB]"
                                                            title="Edit Sub Kategori"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            disabled={deletingId === sub.id}
                                                            onClick={() => handleDelete(sub.id, sub.name)}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#D32F2F] shadow-2xs transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] disabled:opacity-50"
                                                            title="Hapus Sub Kategori"
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
                        links={subCategories.links}
                        from={subCategories.from}
                        to={subCategories.to}
                        total={subCategories.total}
                        perPage={filters.per_page}
                        onPerPageChange={(per_page) => applyFilter({ per_page })}
                    />
                </div>
            </div>
        </>
    );
}

SubCategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Sub Kategori', href: '/admin/sub-categories' },
    ],
};
