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
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';

type SubCategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    category: {
        id: number;
        name: string;
        icon: string | null;
    };
};

export default function SubCategoriesIndex({ subCategories }: { subCategories: SubCategory[] }) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function handleDelete(id: number, name: string) {
        if (!confirm(`Hapus sub kategori "${name}"?`)) return;
        setDeletingId(id);
        router.delete(SubCategoryController.destroy(id).url, {
            onFinish: () => setDeletingId(null),
        });
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
                            Kelola sub kategori produk di bawah setiap kategori utama
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={CategoryController.index().url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-xs font-semibold text-[#444444] shadow-xs transition-colors hover:bg-[#F5F5F5]"
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
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF6000]">Total Sub Kategori</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{subCategories.length}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">Aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{subCategories.filter(s => s.is_active).length}</div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#666666]">Non-aktif</div>
                        <div className="mt-2 text-3xl font-black text-[#222222]">{subCategories.filter(s => !s.is_active).length}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white shadow-xs">
                    <div className="border-b border-[#F0F0F0] px-6 py-4">
                        <h2 className="text-sm font-bold text-[#222222]">
                            Daftar Sub Kategori ({subCategories.length})
                        </h2>
                    </div>

                    {subCategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF3EB]">
                                <Tag className="size-7 text-[#FF6000]" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#222222]">Belum ada sub kategori</p>
                                <p className="mt-0.5 text-xs text-[#666666]">Pastikan Anda sudah membuat kategori terlebih dahulu</p>
                            </div>
                            <Link
                                href={SubCategoryController.create().url}
                                className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-[#FF6000] px-4 text-xs font-bold text-white hover:bg-[#E05500]"
                            >
                                <Plus className="size-4" /> Tambah Sub Kategori
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]">
                                        <th className="px-5 py-3 font-semibold">#</th>
                                        <th className="px-5 py-3 font-semibold">Nama Sub Kategori</th>
                                        <th className="px-5 py-3 font-semibold">Kategori Induk</th>
                                        <th className="px-5 py-3 font-semibold">Slug</th>
                                        <th className="px-5 py-3 font-semibold">Urutan</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0F0F0]">
                                    {subCategories.map((sub, i) => (
                                        <tr key={sub.id} className="transition-colors hover:bg-[#FAFAFA]">
                                            <td className="px-5 py-3.5 text-[#999]">{i + 1}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="font-semibold text-[#222222]">{sub.name}</div>
                                                {sub.description && (
                                                    <div className="mt-0.5 max-w-xs truncate text-[10px] text-[#999]">{sub.description}</div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F8FF] px-2.5 py-0.5 text-[10px] font-bold text-[#166397]">
                                                    <span>{sub.category.icon ?? '📦'}</span>
                                                    {sub.category.name}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-[10px] text-[#666]">{sub.slug}</td>
                                            <td className="px-5 py-3.5 font-mono text-[#666]">{sub.sort_order}</td>
                                            <td className="px-5 py-3.5">
                                                {sub.is_active ? (
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
                                                        href={SubCategoryController.edit(sub).url}
                                                        className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#FF6000] transition-colors hover:border-[#FF6000] hover:bg-[#FFF3EB]"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === sub.id}
                                                        onClick={() => handleDelete(sub.id, sub.name)}
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

SubCategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Sub Kategori', href: '/admin/sub-categories' },
    ],
};
