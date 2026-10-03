import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Heart,
    MapPin,
    Package,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';

type FeatureItem = { title: string; description: string };
type SpecItem = { key: string; value: string };

type ProductDetail = {
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
    package_dimension: string | null;
    overview: string | null;
    description: string | null;
    features: FeatureItem[] | null;
    specifications: SpecItem[] | null;
    whats_in_the_box: string[] | null;
    thumbnail: string | null;
    images: string[] | null;
    rating: number;
    review_count: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    category?: { id: number; name: string };
    sub_category?: { id: number; name: string };
};

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ProductsShow({ product }: { product: ProductDetail }) {
    const allImages = [
        ...(product.thumbnail ? [product.thumbnail] : []),
        ...(product.images ?? []),
    ].filter((v, i, a) => a.indexOf(v) === i); // unique

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const activeImage = allImages[activeImageIndex] ?? product.thumbnail;

    function handlePrevImage() {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    }

    function handleNextImage() {
        setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    }

    return (
        <>
            <Head title={`${product.name} – Detail Produk`} />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#F7F7F7] p-4 text-[#222222] sm:p-6 lg:p-8">
                {/* Top Action Bar */}
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
                                Detail Tampilan Produk
                            </h1>
                            <p className="mt-0.5 text-xs text-[#666666]">
                                Layout presisi sesuai standar e-commerce MakassarNotebook
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={ProductController.edit(product.id).url}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0099FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#007ACC]"
                        >
                            <Edit2 className="size-3.5" /> Edit Produk
                        </Link>
                    </div>
                </div>

                {/* Main Product Card */}
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-2xs">
                    {/* Breadcrumbs inside product card */}
                    <div className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[#666]">
                        <span>{product.category?.name ?? 'Kategori'}</span>
                        <span>&gt;</span>
                        <span>{product.sub_category?.name ?? 'Sub Kategori'}</span>
                        <span>&gt;</span>
                        <span className="font-semibold text-[#222]">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Gallery Section (Left: 7 cols) */}
                        <div className="flex gap-4 lg:col-span-7">
                            {/* Thumbnails Column */}
                            {allImages.length > 1 && (
                                <div className="flex flex-col gap-2">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`size-16 overflow-hidden rounded-lg border p-1 transition-all ${
                                                activeImageIndex === idx
                                                    ? 'border-[#0099FF] ring-2 ring-[#0099FF]/20'
                                                    : 'border-[#E5E5E5] hover:border-[#999]'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="size-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Active Image with arrows */}
                            <div className="group relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-6">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="max-h-[400px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-[#BBB]">
                                        <Package className="size-16" />
                                        <span className="mt-2 text-xs">Belum ada foto</span>
                                    </div>
                                )}

                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevImage}
                                            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#333] shadow-md backdrop-blur-xs transition-colors hover:bg-white hover:text-[#0099FF]"
                                        >
                                            <ChevronLeft className="size-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImage}
                                            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#333] shadow-md backdrop-blur-xs transition-colors hover:bg-white hover:text-[#0099FF]"
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Product Summary & Buy Box (Right: 5 cols) */}
                        <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
                            <div>
                                {/* Title & Share */}
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-lg font-bold leading-snug text-[#222222]">
                                        {product.name}
                                    </h2>
                                    <button
                                        type="button"
                                        className="rounded-full p-2 text-[#666] hover:bg-[#F5F5F5] hover:text-[#0099FF]"
                                        title="Bagikan"
                                    >
                                        <Share2 className="size-4" />
                                    </button>
                                </div>

                                {/* Rating, Reviews & SKU */}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#666]">
                                    <div className="flex items-center gap-1 font-semibold text-[#FF6000]">
                                        <Star className="size-3.5 fill-[#FF6000]" />
                                        <span>{product.rating.toFixed(1)}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{product.review_count} Ulasan</span>
                                    <span>•</span>
                                    <span className="font-mono font-medium text-[#444]">
                                        SKU: <strong className="text-[#222]">{product.sku}</strong>
                                    </span>
                                </div>

                                {/* Price block */}
                                <div className="mt-4 flex items-baseline gap-3">
                                    <span className="text-2xl font-black text-[#D32F2F]">
                                        {formatRupiah(product.price)}
                                    </span>
                                    {product.original_price && product.original_price > product.price && (
                                        <>
                                            <span className="text-xs text-[#999] line-through">
                                                {formatRupiah(product.original_price)}
                                            </span>
                                            {product.discount_percent && (
                                                <span className="rounded bg-[#FFE6E6] px-1.5 py-0.5 text-xs font-bold text-[#D32F2F]">
                                                    {product.discount_percent}%
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Color / Variant selector */}
                                {product.color && (
                                    <div className="mt-4 border-t border-[#F0F0F0] pt-3">
                                        <div className="text-xs font-semibold text-[#444]">
                                            Pilihan Warna:
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0099FF] bg-[#E6F5FF] px-3 py-1 text-xs font-bold text-[#0099FF]">
                                                <Check className="size-3" />
                                                {product.color}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons matching detail.png */}
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex h-10 w-24 items-center justify-between rounded-lg border border-[#E5E5E5] px-2 text-xs font-bold text-[#333]">
                                        <button type="button" className="text-base text-[#888]">-</button>
                                        <span>1</span>
                                        <button type="button" className="text-base text-[#888]">+</button>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#0099FF] bg-white text-xs font-bold text-[#0099FF] transition-colors hover:bg-[#E6F5FF]"
                                    >
                                        <ShoppingCart className="size-4" /> Keranjang
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#0099FF] text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#007ACC]"
                                    >
                                        Beli Sekarang
                                    </button>
                                    <button
                                        type="button"
                                        className="flex size-10 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#666] hover:bg-[#F5F5F5]"
                                    >
                                        <Heart className="size-4" />
                                    </button>
                                </div>

                                {/* Store Stock Information box from detail.png */}
                                <div className="mt-6 rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] p-4 text-xs">
                                    <div className="flex items-center justify-between font-bold text-[#222]">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="size-3.5 text-[#0099FF]" />
                                            <span>Informasi Stok Cabang Makassar</span>
                                        </div>
                                        <span className="text-[11px] font-semibold text-[#0099FF] hover:underline cursor-pointer">
                                            Pilih Lokasi
                                        </span>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                                        <div className="rounded-lg border border-[#E5E5E5] bg-white p-2">
                                            <div className="font-semibold text-[#333]">Gudang Utama</div>
                                            <div className="font-bold text-[#16A34A]">
                                                {product.stock > 0 ? `Tersedia (${product.stock} pcs)` : 'Habis'}
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-[#E5E5E5] bg-white p-2">
                                            <div className="font-semibold text-[#333]">Pick N Go Pettarani</div>
                                            <div className="font-bold text-[#16A34A]">Tersedia</div>
                                        </div>
                                        <div className="rounded-lg border border-[#E5E5E5] bg-white p-2">
                                            <div className="font-semibold text-[#333]">Pick N Go Panakkukang</div>
                                            <div className="font-bold text-[#FF6000]">Pre-Order</div>
                                        </div>
                                        <div className="rounded-lg border border-[#E5E5E5] bg-white p-2">
                                            <div className="font-semibold text-[#333]">Cabang Perintis</div>
                                            <div className="font-bold text-[#16A34A]">Tersedia</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#666]">
                                        <Truck className="size-3.5 text-[#16A34A]" />
                                        <span>Tersedia bayar di tempat (COD) & Pick N Go di Toko</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Below-Fold Specs & Details matching detail.png */}
                    <div className="mt-10 border-t border-[#F0F0F0] pt-8">
                        {/* 1. Rincian Produk */}
                        <div>
                            <h3 className="text-base font-bold text-[#222222]">Rincian Produk</h3>
                            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 rounded-xl bg-[#FAFAFA] p-4 text-xs sm:grid-cols-4">
                                <div>
                                    <span className="text-[#888]">Brand:</span>{' '}
                                    <strong className="font-semibold text-[#222]">{product.brand}</strong>
                                </div>
                                <div>
                                    <span className="text-[#888]">Berat Produk:</span>{' '}
                                    <strong className="font-semibold text-[#222]">
                                        {(product.weight_grams / 1000).toFixed(1)} kg
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-[#888]">Garansi:</span>{' '}
                                    <strong className="font-semibold text-[#222]">{product.warranty}</strong>
                                </div>
                                <div>
                                    <span className="text-[#888]">Dimensi Kemasan:</span>{' '}
                                    <strong className="font-semibold text-[#222]">
                                        {product.package_dimension || '—'}
                                    </strong>
                                </div>
                            </div>

                            {product.overview && (
                                <p className="mt-4 text-xs leading-relaxed text-[#444]">
                                    {product.overview}
                                </p>
                            )}

                            {/* Fitur Section */}
                            {product.features && product.features.length > 0 && (
                                <div className="mt-5 space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0099FF]">
                                        Fitur
                                    </h4>
                                    {product.features.map((feat, i) => (
                                        <div key={i} className="text-xs">
                                            <div className="font-bold text-[#222]">{feat.title}</div>
                                            <p className="mt-0.5 leading-relaxed text-[#555]">
                                                {feat.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Spesifikasi Teknis */}
                        {product.specifications && product.specifications.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-base font-bold text-[#222222]">Spesifikasi</h3>
                                <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E5E5]">
                                    <table className="w-full text-left text-xs">
                                        <tbody className="divide-y divide-[#F0F0F0]">
                                            {product.specifications.map((spec, i) => (
                                                <tr
                                                    key={i}
                                                    className={i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
                                                >
                                                    <td className="w-1/3 px-4 py-3 font-semibold text-[#555]">
                                                        {spec.key}
                                                    </td>
                                                    <td className="px-4 py-3 text-[#222]">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. Kelengkapan Produk */}
                        {product.whats_in_the_box && product.whats_in_the_box.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-base font-bold text-[#222222]">Kelengkapan Produk</h3>
                                <ul className="mt-3 space-y-1.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-4 text-xs text-[#333]">
                                    {product.whats_in_the_box.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="size-3.5 text-[#16A34A]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 4. Galeri Foto Tambahan */}
                        {product.images && product.images.length > 0 && (
                            <div className="mt-8">
                                <h3 className="mb-4 text-base font-bold text-[#222222]">Galeri Foto</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {product.images.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-4"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Galeri ${i + 1}`}
                                                className="max-h-80 w-full object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ProductsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Data', href: '#' },
        { title: 'Produk', href: '/admin/products' },
        { title: 'Detail Produk', href: '#' },
    ],
};
