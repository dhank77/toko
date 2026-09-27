import { Head, Link, router } from '@inertiajs/react';
import {
    Edit2,
    FolderOpen,
    Plus,
    Tag,
    Trash2,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';
import { useState } from 'react';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';

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

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleDelete(id: number, name: string) {
        if (!confirm(`Hapus kategori "${name}"? Semua sub kategori di dalamnya juga akan dihapus.`)) {
            return;
        }
        setDeletingId(id);
        router.delete(CategoryController.destroy(id).url, {
            onFinish: () => setDeletingId(null),
        });
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
                            Kelola kategori produk yang tampil pada halaman utama dan mega-menu
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={SubCategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-xs font-semibold text-[#444444] shadow-xs transition-colors hover:bg-[#F5F5F5]"
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
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0099FF]">Total Kategori</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{categories.length}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">Aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{categories.filter(c => c.is_active).length}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#666666]">Non-aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{categories.filter(c => !c.is_active).length}</div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white shadow-xs">
                    <div className="border-b border-[#F0F0F0] px-6 py-4">
                        <h2 className="text-sm font-bold text-[#222222]">
                            Daftar Kategori ({categories.length})
                        </h2>
                    </div>

                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F0F8FF]">
                                <FolderOpen className="size-7 text-[#0099FF]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#222222]">Belum ada kategori</p>
                                <p className="mt-0.5 text-xs text-[#666666]">Mulai tambahkan kategori produk pertama Anda</p>
                            </div>
                            <Link
                                href={CategoryController.create().url}
                                className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white hover:bg-[#007ACC]"
                            >
                                <Plus className="size-4" /> Tambah Kategori
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                        <th className="px-5 py-3 font-semibold">#</th>
                                        <th className="px-5 py-3 font-semibold">Ikon</th>
                                        <th className="px-5 py-3 font-semibold">Nama Kategori</th>
                                        <th className="px-5 py-3 font-semibold">Slug</th>
                                        <th className="px-5 py-3 font-semibold">Sub Kategori</th>
                                        <th className="px-5 py-3 font-semibold">Urutan</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0F0F0]">
                                    {categories.map((cat, i) => (
                                        <tr key={cat.id} className="transition-colors hover:bg-[#FAFAFA]">
                                            <td className="px-5 py-3.5 text-[#999]">{i + 1}</td>
                                            <td className="px-5 py-3.5 text-xl">{cat.icon ?? '📦'}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="font-semibold text-[#222222]">{cat.name}</div>
                                                {cat.description && (
                                                    <div className="mt-0.5 max-w-xs truncate text-[10px] text-[#999]">{cat.description}</div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-[10px] text-[#666]">{cat.slug}</td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F5FF] px-2.5 py-0.5 text-[10px] font-bold text-[#0099FF]">
                                                    <Tag className="size-3" />
                                                    {cat.sub_categories_count}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-[#666]">{cat.sort_order}</td>
                                            <td className="px-5 py-3.5">
                                                {cat.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#16A34A]">
                                                        <ToggleRight className="size-3" /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-0.5 text-[10px] font-bold text-[#999]">
                                                        <ToggleLeft className="size-3" /> Non-aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={CategoryController.edit(cat).url}
                                                        className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#0099FF] transition-colors hover:border-[#0099FF] hover:bg-[#E6F5FF]"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === cat.id}
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                        className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#D32F2F] transition-colors hover:border-[#D32F2F] hover:bg-[#FFF5F5] disabled:opacity-50"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
