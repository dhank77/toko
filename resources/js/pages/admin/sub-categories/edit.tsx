import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';

type Category = { id: number; name: string };

type SubCategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
};

export default function SubCategoriesEdit({
    subCategory,
    categories,
}: {
    subCategory: SubCategory;
    categories: Category[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: String(subCategory.category_id),
        name: subCategory.name,
        slug: subCategory.slug,
        description: subCategory.description ?? '',
        is_active: subCategory.is_active,
        sort_order: subCategory.sort_order,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(SubCategoryController.update(subCategory).url);
    }

    function slugify(str: string) {
        return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function handleNameChange(value: string) {
        setData(prev => ({
            ...prev,
            name: value,
            slug: prev.slug === slugify(prev.name) ? slugify(value) : prev.slug,
        }));
    }

    return (
        <>
            <Head title={`Edit ${subCategory.name} – Sub Kategori`} />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={SubCategoryController.index().url}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#666] shadow-xs transition-colors hover:bg-[#F5F5F5]"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#222222]">Edit Sub Kategori</h1>
                        <p className="text-xs text-[#666666]">Ubah data: <strong>{subCategory.name}</strong></p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="max-w-2xl rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Kategori Induk */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-[#222222]">
                                Kategori Induk <span className="text-[#D32F2F]">*</span>
                            </label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full rounded-lg border border-[#E5E5E5] px-3.5 py-2.5 text-sm text-[#222] outline-none ring-0 transition-colors focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="mt-1.5 text-xs text-[#D32F2F]">{errors.category_id}</p>}
                        </div>

                        {/* Nama */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-[#222222]">
                                Nama Sub Kategori <span className="text-[#D32F2F]">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => handleNameChange(e.target.value)}
                                className="w-full rounded-lg border border-[#E5E5E5] px-3.5 py-2.5 text-sm text-[#222] outline-none ring-0 transition-colors focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            />
                            {errors.name && <p className="mt-1.5 text-xs text-[#D32F2F]">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-[#222222]">Slug URL</label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={e => setData('slug', e.target.value)}
                                className="w-full rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-sm font-mono text-[#666] outline-none ring-0 transition-colors focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            />
                            {errors.slug && <p className="mt-1.5 text-xs text-[#D32F2F]">{errors.slug}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-[#222222]">Deskripsi</label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full resize-none rounded-lg border border-[#E5E5E5] px-3.5 py-2.5 text-sm text-[#222] outline-none ring-0 transition-colors focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            />
                        </div>

                        {/* Sort + Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-[#222222]">Urutan Tampil</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={e => setData('sort_order', Number(e.target.value))}
                                    className="w-full rounded-lg border border-[#E5E5E5] px-3.5 py-2.5 text-sm outline-none ring-0 transition-colors focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-[#222222]">Status</label>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-colors ${data.is_active ? 'border-[#22C55E]/40 bg-[#ECFDF5] text-[#16A34A]' : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#999]'}`}
                                >
                                    <span className={`size-2 rounded-full ${data.is_active ? 'bg-[#22C55E]' : 'bg-[#CCC]'}`} />
                                    {data.is_active ? 'Aktif' : 'Non-aktif'}
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-[#F0F0F0] pt-5">
                            <Link
                                href={SubCategoryController.index().url}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-5 text-xs font-semibold text-[#444] transition-colors hover:bg-[#F5F5F5]"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#FF6000] px-5 text-xs font-bold text-white transition-colors hover:bg-[#E05500] disabled:opacity-60"
                            >
                                <Save className="size-3.5" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

SubCategoriesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Sub Kategori', href: '/admin/sub-categories' },
        { title: 'Edit', href: '#' },
    ],
};
