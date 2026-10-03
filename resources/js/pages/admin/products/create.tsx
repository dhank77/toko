import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    FolderOpen,
    Image,
    Package,
    Plus,
    Save,
    Tag,
    Trash2,
    Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import { formatNumberWithDots } from '@/lib/utils';

type SubCategory = { id: number; name: string };
type Category = { id: number; name: string; icon: string | null; sub_categories?: SubCategory[] };

type FeatureItem = { title: string; description: string };
type SpecItem = { key: string; value: string };

export default function ProductsCreate({
    categories,
    presetBrands,
    presetWarranties,
}: {
    categories: Category[];
    presetBrands: string[];
    presetWarranties: string[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        sku: '',
        name: '',
        slug: '',
        category_id: '',
        sub_category_id: '',
        brand: '',
        color: '',
        price: '' as unknown as number,
        original_price: '' as unknown as number,
        stock: '' as unknown as number,
        weight_grams: '' as unknown as number,
        warranty: '',
        package_dimension: '',
        overview: '',
        description: '',
        features: [] as FeatureItem[],
        specifications: [] as SpecItem[],
        whats_in_the_box: [] as string[],
        thumbnail: null as File | null,
        images: [] as File[],
        is_active: true,
        is_featured: false,
    });

    const [newBoxItem, setNewBoxItem] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<{ id: string; file: File; url: string }[]>([]);
    const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Selected category to get sub categories
    const selectedCategory = categories.find((c) => String(c.id) === String(data.category_id));
    const availableSubCategories = selectedCategory?.sub_categories || [];

    // Calculate discount preview
    const numOriginalPrice = Number(data.original_price) || 0;
    const numPrice = Number(data.price) || 0;
    const discountPercent =
        numOriginalPrice > numPrice && numPrice > 0
            ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
            : 0;

    function handleGenerateSku() {
        const prefix = 'OM';
        const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase();
        const generated = prefix + randomLetters;
        setData('sku', generated);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(ProductController.store().url);
    }

    // Dynamic Features handler
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

    // Dynamic Specs handler
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

    // Dynamic Whats in the box
    function addBoxItem() {
        if (!newBoxItem.trim()) return;
        setData('whats_in_the_box', [...data.whats_in_the_box, newBoxItem.trim()]);
        setNewBoxItem('');
    }
    function removeBoxItem(index: number) {
        setData('whats_in_the_box', data.whats_in_the_box.filter((_, i) => i !== index));
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function handleThumbnailFile(file?: File) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Harap pilih file gambar (JPG, PNG, WEBP, GIF)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file foto utama melebihi 5MB');
            return;
        }
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setData('thumbnail', file);
        setThumbnailPreview(URL.createObjectURL(file));
    }

    function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        handleThumbnailFile(file);
        e.target.value = '';
    }

    function removeThumbnail() {
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setData('thumbnail', null);
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    }

    function handleGalleryFiles(files?: FileList | File[]) {
        if (!files || files.length === 0) return;
        const validFiles = Array.from(files).filter((file) => {
            if (!file.type.startsWith('image/')) {
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} melebihi batas 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            url: URL.createObjectURL(file),
        }));

        const updated = [...galleryPreviews, ...newPreviews];
        setGalleryPreviews(updated);
        setData('images', updated.map((item) => item.file));
    }

    function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleGalleryFiles(e.target.files ?? undefined);
        e.target.value = '';
    }

    function removeGalleryImage(index: number) {
        const itemToRemove = galleryPreviews[index];
        if (itemToRemove?.url) {
            URL.revokeObjectURL(itemToRemove.url);
        }
        const updated = galleryPreviews.filter((_, i) => i !== index);
        setGalleryPreviews(updated);
        setData('images', updated.map((item) => item.file));
    }

    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
            galleryPreviews.forEach((item) => {
                URL.revokeObjectURL(item.url);
            });
        };
    }, []);

    return (
        <>
            <Head title="Tambah Produk – Master Data" />

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
                                Tambah Produk Baru
                            </h1>
                            <p className="mt-0.5 text-xs text-[#666666]">
                                Lengkapi detail spesifikasi, harga coret, diskon, dan galeri produk
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: Main Fields */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* 1. Identitas Produk */}
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
                                        placeholder="Contoh: Kotak Organizer Kabel Charger Wire Cable Management Box Dustproof - FT-400"
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none transition-all focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-[#D32F2F]">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs font-semibold text-[#333]">
                                                SKU Produk <span className="text-[#D32F2F]">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleGenerateSku}
                                                className="text-[10px] font-semibold text-[#0099FF] hover:underline"
                                            >
                                                Auto Generate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                            placeholder="Contoh: OMSCYTWH"
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
                                            placeholder="Pilih atau ketik brand..."
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
                                            placeholder="Contoh: White, Gray, Black"
                                            className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        />
                                        {errors.color && <p className="mt-1 text-xs text-[#D32F2F]">{errors.color}</p>}
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
                                        {errors.category_id && <p className="mt-1 text-xs text-[#D32F2F]">{errors.category_id}</p>}
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
                                        {errors.sub_category_id && <p className="mt-1 text-xs text-[#D32F2F]">{errors.sub_category_id}</p>}
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
                                    <div className="relative mt-1.5 flex rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] focus-within:border-[#0099FF] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0099FF]">
                                        <span className="inline-flex items-center pl-3 text-xs font-bold text-[#888]">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={formatNumberWithDots(data.price)}
                                            onChange={(e) => {
                                                const cleanDigits = e.target.value.replace(/\D/g, '');
                                                setData('price', cleanDigits ? parseInt(cleanDigits, 10) : ('' as unknown as number));
                                            }}
                                            placeholder="0"
                                            className="h-9 w-full rounded-r-lg bg-transparent px-2.5 font-semibold text-[#D32F2F] outline-none"
                                            required
                                        />
                                    </div>
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
                                    <div className="relative mt-1.5 flex rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] focus-within:border-[#0099FF] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0099FF]">
                                        <span className="inline-flex items-center pl-3 text-xs font-semibold text-[#999]">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={formatNumberWithDots(data.original_price)}
                                            onChange={(e) => {
                                                const cleanDigits = e.target.value.replace(/\D/g, '');
                                                setData('original_price', cleanDigits ? parseInt(cleanDigits, 10) : ('' as unknown as number));
                                            }}
                                            placeholder="0"
                                            className="h-9 w-full rounded-r-lg bg-transparent px-2.5 text-xs text-[#666] outline-none"
                                        />
                                    </div>
                                    {errors.original_price && <p className="mt-1 text-xs text-[#D32F2F]">{errors.original_price}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Jumlah Stok <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
                                        placeholder="0"
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 font-mono text-xs font-semibold text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {errors.stock && <p className="mt-1 text-xs text-[#D32F2F]">{errors.stock}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Berat Produk (Gram) <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.weight_grams}
                                        onChange={(e) => setData('weight_grams', e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
                                        placeholder="Contoh: 1000"
                                        className="mt-1.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] px-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                        required
                                    />
                                    {data.weight_grams ? (
                                        <span className="mt-1 block text-[10px] text-[#888]">
                                            = {(Number(data.weight_grams) / 1000).toFixed(1)} kg
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* 3. Deskripsi & Rincian Produk */}
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
                                        placeholder="Contoh: Kotak ini berfungsi untuk mengorganisir dan mengatur kabel agar terlihat lebih rapi dan tidak berantakan..."
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
                                        placeholder="Penjelasan fitur lengkap, bahan material, dan kegunaan produk..."
                                        className="mt-1.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FBFBFB] p-3 text-xs text-[#222] outline-none focus:border-[#0099FF] focus:bg-white focus:ring-1 focus:ring-[#0099FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Fitur Produk (Dinamis) */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-[#222222]">Fitur Unggulan</h2>
                                    <p className="text-[11px] text-[#888]">
                                        Poin-poin keunggulan produk (seperti di detail.png)
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="inline-flex h-7 items-center gap-1 rounded-md border border-[#0099FF] bg-[#F0F8FF] px-2.5 text-xs font-semibold text-[#0099FF] hover:bg-[#E6F5FF]"
                                >
                                    <Plus className="size-3" /> Tambah Fitur
                                </button>
                            </div>

                            {data.features.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-4 text-center">
                                    <p className="text-xs text-[#888]">Belum ada fitur unggulan yang ditambahkan.</p>
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#0099FF] hover:underline"
                                    >
                                        <Plus className="size-3" /> Tambah Fitur Pertama
                                    </button>
                                </div>
                            ) : (
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
                                                    placeholder="Judul Fitur (mis. Kotak Manajemen Kabel Serbaguna)"
                                                    className="h-8 w-full rounded border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#222] outline-none focus:border-[#0099FF]"
                                                />
                                                <textarea
                                                    rows={2}
                                                    value={feat.description}
                                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                    placeholder="Penjelasan fitur..."
                                                    className="w-full rounded border border-[#E5E5E5] bg-white p-2 text-xs text-[#444] outline-none focus:border-[#0099FF]"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="text-[#999] hover:text-[#D32F2F]"
                                                title="Hapus Fitur"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. Spesifikasi Teknis (Dinamis) */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-[#222222]">Spesifikasi Teknis</h2>
                                    <p className="text-[11px] text-[#888]">
                                        Tabel spesifikasi (Material, Dimensi, dll)
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="inline-flex h-7 items-center gap-1 rounded-md border border-[#0099FF] bg-[#F0F8FF] px-2.5 text-xs font-semibold text-[#0099FF] hover:bg-[#E6F5FF]"
                                >
                                    <Plus className="size-3" /> Tambah Spek
                                </button>
                            </div>

                            {data.specifications.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-4 text-center">
                                    <p className="text-xs text-[#888]">Belum ada spesifikasi teknis yang ditambahkan.</p>
                                    <button
                                        type="button"
                                        onClick={addSpec}
                                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#0099FF] hover:underline"
                                    >
                                        <Plus className="size-3" /> Tambah Spek Pertama
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.specifications.map((spec, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={spec.key}
                                                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                                placeholder="Label (mis. Material)"
                                                className="h-8 w-1/3 rounded border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#333] outline-none focus:border-[#0099FF]"
                                            />
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                                placeholder="Nilai (mis. Plastik ABS)"
                                                className="h-8 flex-1 rounded border border-[#E5E5E5] bg-white px-2.5 text-xs text-[#444] outline-none focus:border-[#0099FF]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpec(index)}
                                                className="text-[#999] hover:text-[#D32F2F]"
                                                title="Hapus Spek"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 6. Kelengkapan Produk */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-2 text-sm font-bold text-[#222222]">Kelengkapan Produk</h2>
                            <p className="mb-3 text-[11px] text-[#888]">
                                Barang yang didapat dalam kemasan (What's in the box)
                            </p>

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
                                    placeholder="Contoh: 1 x Kotak Organizer Kabel Charger FT-400"
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

                            {data.whats_in_the_box.length === 0 ? (
                                <p className="py-2 text-center text-xs text-[#888]">
                                    Belum ada kelengkapan produk yang ditambahkan.
                                </p>
                            ) : (
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
                            )}
                        </div>
                    </div>

                    {/* Right 1 Column: Media & Publish Settings */}
                    <div className="space-y-6">
                        {/* Media / Foto Produk */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <div className="mb-3.5 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-sm font-bold text-[#222222]">
                                    <Image className="size-4 text-[#0099FF]" />
                                    Foto Produk
                                </h2>
                                <span className="rounded bg-[#E6F5FF] px-2 py-0.5 text-[10px] font-semibold text-[#0099FF]">
                                    Upload File
                                </span>
                            </div>

                            {/* Foto Utama (Thumbnail) */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Foto Utama (Thumbnail) <span className="text-[#D32F2F]">*</span>
                                    </label>
                                    <span className="text-[10px] text-[#888]">Maks 5MB</span>
                                </div>

                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/jpg,image/gif"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />

                                {thumbnailPreview ? (
                                    <div className="mt-2 overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3">
                                        <div className="relative flex items-center justify-center rounded-md border border-[#EBEBEB] bg-white p-2">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Preview Foto Utama"
                                                className="h-40 w-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md bg-white/90 text-[#D32F2F] shadow-xs transition-colors hover:bg-[#D32F2F] hover:text-white"
                                                title="Hapus foto utama"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                        <div className="mt-2.5 flex items-center justify-between px-0.5">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <p className="truncate text-xs font-medium text-[#222]">
                                                    {data.thumbnail?.name}
                                                </p>
                                                <p className="text-[10px] text-[#888]">
                                                    {data.thumbnail ? formatFileSize(data.thumbnail.size) : ''}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                                className="rounded border border-[#E5E5E5] bg-white px-2.5 py-1 text-[11px] font-medium text-[#444] shadow-2xs transition-colors hover:border-[#0099FF] hover:text-[#0099FF]"
                                            >
                                                Ganti Foto
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingThumbnail(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDraggingThumbnail(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDraggingThumbnail(false);
                                            const file = e.dataTransfer.files?.[0];
                                            handleThumbnailFile(file);
                                        }}
                                        className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                            isDraggingThumbnail
                                                ? 'border-[#0099FF] bg-[#F0F8FF]'
                                                : 'border-[#D9D9D9] bg-[#FAFAFA] hover:border-[#0099FF] hover:bg-[#F9FCFF]'
                                        }`}
                                    >
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-[#E6F5FF] text-[#0099FF]">
                                            <Upload className="size-5" />
                                        </div>
                                        <p className="text-xs font-semibold text-[#222]">
                                            Pilih atau geser foto utama ke sini
                                        </p>
                                        <p className="mt-1 text-[10px] text-[#888]">
                                            Format PNG, JPG, JPEG, WEBP hingga 5MB
                                        </p>
                                    </div>
                                )}
                                {errors.thumbnail && (
                                    <p className="mt-1 text-[11px] text-[#D32F2F]">{errors.thumbnail}</p>
                                )}
                            </div>

                            {/* Foto Galeri Tambahan */}
                            <div className="mt-5 border-t border-[#F0F0F0] pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-[#333]">
                                        Foto Galeri Tambahan
                                    </label>
                                    <span className="text-[10px] text-[#888]">
                                        {galleryPreviews.length} foto terpilih
                                    </span>
                                </div>

                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    multiple
                                    accept="image/png,image/jpeg,image/webp,image/jpg,image/gif"
                                    onChange={handleGalleryChange}
                                    className="hidden"
                                />

                                <div
                                    onClick={() => galleryInputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDraggingGallery(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setIsDraggingGallery(false);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDraggingGallery(false);
                                        handleGalleryFiles(e.dataTransfer.files);
                                    }}
                                    className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-center transition-colors ${
                                        isDraggingGallery
                                            ? 'border-[#0099FF] bg-[#F0F8FF]'
                                            : 'border-[#D9D9D9] bg-[#FAFAFA] hover:border-[#0099FF] hover:bg-[#F9FCFF]'
                                    }`}
                                >
                                    <Plus className="size-4 text-[#0099FF]" />
                                    <span className="text-xs font-medium text-[#333]">
                                        Upload Foto Galeri (Bisa Banyak)
                                    </span>
                                </div>

                                {galleryPreviews.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {galleryPreviews.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className="group relative flex flex-col overflow-hidden rounded-lg border border-[#E5E5E5] bg-white p-1 shadow-2xs"
                                            >
                                                <div className="relative aspect-square w-full overflow-hidden rounded bg-[#FAFAFA]">
                                                    <img
                                                        src={item.url}
                                                        alt={`Galeri ${idx + 1}`}
                                                        className="size-full object-contain"
                                                    />
                                                    <span className="absolute left-1 top-1 rounded bg-[#222]/70 px-1 py-0.2 text-[9px] font-bold text-white">
                                                        #{idx + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-[#D32F2F] text-white opacity-0 transition-opacity hover:bg-[#b71c1c] group-hover:opacity-100"
                                                        title="Hapus foto galeri ini"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </button>
                                                </div>
                                                <div className="mt-1 px-0.5">
                                                    <p className="truncate text-[10px] font-medium text-[#333]" title={item.file.name}>
                                                        {item.file.name}
                                                    </p>
                                                    <p className="text-[9px] text-[#888]">
                                                        {formatFileSize(item.file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.images && (
                                    <p className="mt-1 text-[11px] text-[#D32F2F]">{errors.images}</p>
                                )}
                            </div>
                        </div>

                        {/* Garansi & Kemasan */}
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
                                        placeholder="Pilih atau ketik..."
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
                                        placeholder="Contoh: 33 x 14 x 12 cm"
                                        className="mt-1 h-8 w-full rounded border border-[#E5E5E5] bg-[#FBFBFB] px-2.5 text-xs text-[#222] outline-none focus:border-[#0099FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status & Publikasi */}
                        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                            <h2 className="mb-3 text-sm font-bold text-[#222222]">
                                Status & Visibilitas
                            </h2>

                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#F0F0F0] p-2.5 hover:bg-[#FAFAFA]">
                                    <div>
                                        <div className="text-xs font-semibold text-[#222]">Publikasikan Produk</div>
                                        <div className="text-[10px] text-[#888]">Tampil di katalog dan pencarian toko</div>
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
                                        <div className="text-[10px] text-[#888]">Prioritaskan di banner dan rekomendasi</div>
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
                                {processing ? 'Menyimpan...' : 'Simpan Produk Baru'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Produk', href: '/admin/products' },
        { title: 'Tambah Produk', href: '/admin/products/create' },
    ],
};
