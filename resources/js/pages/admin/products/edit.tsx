import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Image,
    Package,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';

type SubCategory = { id: number; name: string };
type Category = { id: number; name: string; icon: string | null; sub_categories?: SubCategory[] };

type FeatureItem = { title: string; description: string };
type SpecItem = { key: string; value: string };

type ProductData = {
    id: number;
    sku: string;
    name: string;
    slug: string;
    category_id: number;
    sub_category_id: number | null;
    brand: string;
    color: string | null;
    price: number;
    original_price: number | null;
    discount_percent: number | null;
    stock: number;
    weight_grams: number;
    warranty: string;
    package_dimension: string | null;
    overview: string | null;
    description: string | null;
    features: FeatureItem[] | null;
    specifications: SpecItem[] | null;
    whats_in_the_box: string[] | null;
    thumbnail: string | null;
    images: string[] | null;
    is_active: boolean;
    is_featured: boolean;
};

export default function ProductsEdit({
    product,
    categories,
    presetBrands,
    presetWarranties,
}: {
    product: ProductData;
    categories: Category[];
    presetBrands: string[];
    presetWarranties: string[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        category_id: String(product.category_id),
        sub_category_id: product.sub_category_id ? String(product.sub_category_id) : '',
        brand: product.brand,
        color: product.color ?? '',
        price: product.price,
        original_price: product.original_price ?? '',
        stock: product.stock,
        weight_grams: product.weight_grams,
        warranty: product.warranty,
        package_dimension: product.package_dimension ?? '',
        overview: product.overview ?? '',
        description: product.description ?? '',
        features: (product.features ?? []) as FeatureItem[],
        specifications: (product.specifications ?? []) as SpecItem[],
        whats_in_the_box: (product.whats_in_the_box ?? []) as string[],
        thumbnail: product.thumbnail ?? '',
        images: (product.images ?? []) as string[],
        is_active: product.is_active,
        is_featured: product.is_featured,
    });

    const [newBoxItem, setNewBoxItem] = useState('');
    const [newGalleryUrl, setNewGalleryUrl] = useState('');

    const selectedCategory = categories.find((c) => String(c.id) === String(data.category_id));
    const availableSubCategories = selectedCategory?.sub_categories || [];

    const discountPercent =
        data.original_price && Number(data.original_price) > data.price
            ? Math.round(((Number(data.original_price) - data.price) / Number(data.original_price)) * 100)
            : 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(ProductController.update(product.id).url);
    }

    function addFeature() {
        setData('features', [...data.features, { title: '', description: '' }]);
    }
    function updateFeature(index: number, field: 'title' | 'description', value: string) {
        const updated = [...data.features];
        updated[index][field] = value;
        setData('features', updated);
    }
    function removeFeature(index: number) {
        setData('features', data.features.filter((_, i) => i !== index));
    }

    function addSpec() {
        setData('specifications', [...data.specifications, { key: '', value: '' }]);
    }
    function updateSpec(index: number, field: 'key' | 'value', value: string) {
        const updated = [...data.specifications];
        updated[index][field] = value;
        setData('specifications', updated);
    }
    function removeSpec(index: number) {
        setData('specifications', data.specifications.filter((_, i) => i !== index));
    }

    function addBoxItem() {
        if (!newBoxItem.trim()) return;
        setData('whats_in_the_box', [...data.whats_in_the_box, newBoxItem.trim()]);
        setNewBoxItem('');
    }
    function removeBoxItem(index: number) {
        setData('whats_in_the_box', data.whats_in_the_box.filter((_, i) => i !== index));
    }

    function addGalleryImage() {
        if (!newGalleryUrl.trim()) return;
        setData('images', [...data.images, newGalleryUrl.trim()]);
        setNewGalleryUrl('');
    }
    function removeGalleryImage(index: number) {
        setData('images', data.images.filter((_, i) => i !== index));
    }

    return (
        <>
            <Head title={`Edit Produk – ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={ProductController.index().url}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#555] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#222222]">
                                Edit Produk
                            </h1>
                            <p className="mt-0.5 text-xs text-[#666666]">
                                Memperbarui informasi produk #{product.sku} ({product.name})
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* 1. Identitas */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#222222]">
                                <Package className="size-4 text-[#0099FF]" />
                                Informasi Utama Produk
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Nama Produk <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none transition-all focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-[#D32F2F]">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#333]">
                                            SKU Produk <span className="text-[#D32F2F]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 font-mono text-xs uppercase text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                            required
                                        />
                                        {errors.sku && <p className="mt-1 text-xs text-[#D32F2F]">{errors.sku}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#333]">
                                            Brand / Merek <span className="text-[#D32F2F]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            list="brand-list"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                            required
                                        />
                                        <datalist id="brand-list">
                                            {presetBrands.map((b) => (
                                                <option key={b} value={b} />
                                            ))}
                                        </datalist>
                                        {errors.brand && <p className="mt-1 text-xs text-[#D32F2F]">{errors.brand}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#333]">
                                            Varian Warna
                                        </label>
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#333]">
                                            Kategori Induk <span className="text-[#D32F2F]">*</span>
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    category_id: e.target.value,
                                                    sub_category_id: '',
                                                }));
                                            }}
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                            required
                                        >
                                            <option value="">Pilih Kategori...</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.icon ?? '📦'} {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#333]">
                                            Sub Kategori
                                        </label>
                                        <select
                                            value={data.sub_category_id}
                                            onChange={(e) => setData('sub_category_id', e.target.value)}
                                            disabled={availableSubCategories.length === 0}
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF] disabled:opacity-50"
                                        >
                                            <option value="">Pilih Sub Kategori...</option>
                                            {availableSubCategories.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Harga & Stok */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-4 text-sm font-bold text-[#222222]">
                                Harga Jual & Inventaris
                            </h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Harga Jual (Rp) <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 font-semibold text-[#D32F2F] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.price && <p className="mt-1 text-xs text-[#D32F2F]">{errors.price}</p>}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-[#333]">
                                            Harga Coret (Rp)
                                        </label>
                                        {discountPercent > 0 && (
                                            <span className="rounded bg-[#FFE6E6] px-1 text-[10px] font-bold text-[#D32F2F]">
                                                Diskon -{discountPercent}%
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.original_price}
                                        onChange={(e) => setData('original_price', Number(e.target.value))}
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#666] line-through outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Jumlah Stok <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', Number(e.target.value))}
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 font-mono text-xs font-semibold text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Berat Produk (Gram) <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.weight_grams}
                                        onChange={(e) => setData('weight_grams', Number(e.target.value))}
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    <span className="mt-1 block text-[10px] text-[#888]">
                                        = {(data.weight_grams / 1000).toFixed(1)} kg
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Deskripsi & Rincian */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-4 text-sm font-bold text-[#222222]">
                                Rincian & Deskripsi Produk
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Ringkasan Singkat (Overview)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.overview}
                                        onChange={(e) => setData('overview', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] p-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Deskripsi Lengkap
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] p-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Fitur */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-[#222222]">Fitur Unggulan</h2>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="inline-flex h-7 items-center gap-1 rounded-md border border-[#0099FF] bg-[#F0F8FF] px-2.5 text-xs font-semibold text-[#0099FF] hover:bg-[#E6F5FF]"
                                >
                                    <Plus className="size-3" /> Tambah Fitur
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.features.map((feat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] p-3"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={feat.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                className="h-8 w-full rounded border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#222] outline-none focus:border-[#0099FF]"
                                            />
                                            <textarea
                                                rows={2}
                                                value={feat.description}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                className="w-full rounded border border-[#E5E5E5] bg-white p-2 text-xs text-[#444] outline-none focus:border-[#0099FF]"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-[#999] hover:text-[#D32F2F]"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Spesifikasi */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-[#222222]">Spesifikasi Teknis</h2>
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="inline-flex h-7 items-center gap-1 rounded-md border border-[#0099FF] bg-[#F0F8FF] px-2.5 text-xs font-semibold text-[#0099FF] hover:bg-[#E6F5FF]"
                                >
                                    <Plus className="size-3" /> Tambah Spek
                                </button>
                            </div>

                            <div className="space-y-2">
                                {data.specifications.map((spec, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={spec.key}
                                            onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                            className="h-8 w-1/3 rounded border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#333] outline-none focus:border-[#0099FF]"
                                        />
                                        <input
                                            type="text"
                                            value={spec.value}
                                            onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                            className="h-8 flex-1 rounded border border-[#E5E5E5] bg-white px-2.5 text-xs text-[#444] outline-none focus:border-[#0099FF]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpec(index)}
                                            className="text-[#999] hover:text-[#D32F2F]"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6. Kelengkapan */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-2 text-sm font-bold text-[#222222]">Kelengkapan Produk</h2>

                            <div className="mb-3 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newBoxItem}
                                    onChange={(e) => setNewBoxItem(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addBoxItem();
                                        }
                                    }}
                                    placeholder="Contoh: 1 x Kotak Organizer..."
                                    className="h-8 flex-1 rounded border border-[#E5E5E5] bg-white px-2.5 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                />
                                <button
                                    type="button"
                                    onClick={addBoxItem}
                                    className="h-8 rounded bg-[#0099FF] px-3 text-xs font-semibold text-white hover:bg-[#007ACC]"
                                >
                                    Tambah
                                </button>
                            </div>

                            <ul className="space-y-1.5 text-xs text-[#444]">
                                {data.whats_in_the_box.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between rounded bg-[#FAFAFA] px-3 py-1.5"
                                    >
                                        <span>• {item}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeBoxItem(index)}
                                            className="text-[#999] hover:text-[#D32F2F]"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Media */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#222222]">
                                <Image className="size-4 text-[#0099FF]" />
                                Foto Produk
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-[#333]">
                                    URL Foto Utama (Thumbnail)
                                </label>
                                <input
                                    type="url"
                                    value={data.thumbnail}
                                    onChange={(e) => setData('thumbnail', e.target.value)}
                                    className="mt-1.5 h-8 w-full rounded border border-[#E5E5E5] bg-[#FBFBFB] px-2.5 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                />
                                {data.thumbnail && (
                                    <div className="mt-2.5 flex justify-center rounded-lg border border-[#E5E5E5] bg-white p-2">
                                        <img
                                            src={data.thumbnail}
                                            alt="Preview Utama"
                                            className="h-36 w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 border-t border-[#F0F0F0] pt-3">
                                <label className="block text-xs font-semibold text-[#333]">
                                    Foto Galeri Tambahan
                                </label>
                                <div className="mt-1.5 flex gap-1.5">
                                    <input
                                        type="url"
                                        value={newGalleryUrl}
                                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addGalleryImage();
                                            }
                                        }}
                                        placeholder="https://..."
                                        className="h-8 flex-1 rounded border border-[#E5E5E5] bg-[#FBFBFB] px-2 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                    />
                                    <button
                                        type="button"
                                        onClick={addGalleryImage}
                                        className="h-8 rounded bg-[#444] px-2.5 text-xs font-semibold text-white hover:bg-[#222]"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {data.images.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative size-20 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white p-1"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Galeri ${idx + 1}`}
                                                className="size-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute right-1 top-1 rounded bg-[#D32F2F] p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Garansi & Dimensi */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-3 text-sm font-bold text-[#222222]">
                                Garansi & Dimensi Kemasan
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Masa Garansi
                                    </label>
                                    <input
                                        type="text"
                                        list="warranty-list"
                                        value={data.warranty}
                                        onChange={(e) => setData('warranty', e.target.value)}
                                        className="mt-1 h-8 w-full rounded border border-[#E5E5E5] bg-[#FBFBFB] px-2.5 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                    />
                                    <datalist id="warranty-list">
                                        {presetWarranties.map((w) => (
                                            <option key={w} value={w} />
                                        ))}
                                    </datalist>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Dimensi Kemasan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.package_dimension}
                                        onChange={(e) => setData('package_dimension', e.target.value)}
                                        className="mt-1 h-8 w-full rounded border border-[#E5E5E5] bg-[#FBFBFB] px-2.5 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-3 text-sm font-bold text-[#222222]">
                                Status & Visibilitas
                            </h2>

                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#F0F0F0] p-2.5 hover:bg-[#FAFAFA]">
                                    <div>
                                        <div className="text-xs font-semibold text-[#222]">Publikasikan Produk</div>
                                        <div className="text-[10px] text-[#888]">Tampil di katalog toko</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="size-4 rounded accent-[#0099FF]"
                                    />
                                </label>

                                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#F0F0F0] p-2.5 hover:bg-[#FAFAFA]">
                                    <div>
                                        <div className="text-xs font-semibold text-[#222]">Produk Unggulan (Hot Deals)</div>
                                        <div className="text-[10px] text-[#888]">Prioritaskan di banner</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="size-4 rounded accent-[#FF6000]"
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0099FF] text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#007ACC] disabled:opacity-50"
                            >
                                <Save className="size-4" />
                                {processing ? 'Menyimpan...' : 'Perbarui Produk'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Produk', href: '/admin/products' },
        { title: 'Edit Produk', href: '#' },
    ],
};
