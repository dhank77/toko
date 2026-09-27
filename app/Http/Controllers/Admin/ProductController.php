<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'subCategory']);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($categoryId = $request->input('category_id')) {
            if ($categoryId !== 'all') {
                $query->where('category_id', $categoryId);
            }
        }

        // Sub Category filter
        if ($subCategoryId = $request->input('sub_category_id')) {
            if ($subCategoryId !== 'all') {
                $query->where('sub_category_id', $subCategoryId);
            }
        }

        // Status filter
        $status = $request->input('status');
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'out_of_stock') {
            $query->where('stock', '<=', 0);
        }

        // Sorting
        $sort = (string) $request->input('sort', 'created_at');
        $direction = strtolower((string) $request->input('direction', 'desc'));
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $allowedSorts = ['name', 'price', 'original_price', 'stock', 'sku', 'brand', 'discount_percent', 'created_at', 'is_active'];
        if (in_array($sort, $allowedSorts, true)) {
            $query->orderBy($sort, $direction);
        } else {
            $sort = 'created_at';
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;

        $products = $query->paginate($perPage)->withQueryString();

        $categories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'icon']);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
                'category_id' => $request->input('category_id', 'all'),
                'sub_category_id' => $request->input('sub_category_id', 'all'),
                'status' => $status ?? 'all',
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'stats' => [
                'total' => Product::count(),
                'active' => Product::where('is_active', true)->count(),
                'out_of_stock' => Product::where('stock', '<=', 0)->count(),
                'total_stock' => (int) Product::sum('stock'),
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'icon']);

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
            'presetBrands' => ['Lainnya', 'Taffware', 'Xiaomi', 'Baseus', 'Orico', 'Ugreen', 'CARPRIE', 'CHN', 'Striveday', 'RoboTool'],
            'presetWarranties' => ['7 Hari', '14 Hari', '1 Bulan', '3 Bulan', '6 Bulan', '1 Tahun', 'Tidak Ada Garansi'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'brand' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'price' => ['required', 'integer', 'min:0'],
            'original_price' => ['nullable', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['required', 'integer', 'min:1'],
            'warranty' => ['required', 'string', 'max:100'],
            'package_dimension' => ['nullable', 'string', 'max:100'],
            'overview' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required_with:features', 'string', 'max:255'],
            'features.*.description' => ['required_with:features', 'string'],
            'specifications' => ['nullable', 'array'],
            'specifications.*.key' => ['required_with:specifications', 'string', 'max:100'],
            'specifications.*.value' => ['required_with:specifications', 'string'],
            'whats_in_the_box' => ['nullable', 'array'],
            'whats_in_the_box.*' => ['string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:500'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']).'-'.strtolower($validated['sku']);
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'subCategory']);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'subCategory']);

        $categories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'icon']);

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'presetBrands' => ['Lainnya', 'Taffware', 'Xiaomi', 'Baseus', 'Orico', 'Ugreen', 'CARPRIE', 'CHN', 'Striveday', 'RoboTool'],
            'presetWarranties' => ['7 Hari', '14 Hari', '1 Bulan', '3 Bulan', '6 Bulan', '1 Tahun', 'Tidak Ada Garansi'],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => ['sometimes', 'required', 'string', 'max:50', "unique:products,sku,{$product->id}"],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', "unique:products,slug,{$product->id}"],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'brand' => ['sometimes', 'required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'price' => ['sometimes', 'required', 'integer', 'min:0'],
            'original_price' => ['nullable', 'integer', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'weight_grams' => ['sometimes', 'required', 'integer', 'min:1'],
            'warranty' => ['sometimes', 'required', 'string', 'max:100'],
            'package_dimension' => ['nullable', 'string', 'max:100'],
            'overview' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required_with:features', 'string', 'max:255'],
            'features.*.description' => ['required_with:features', 'string'],
            'specifications' => ['nullable', 'array'],
            'specifications.*.key' => ['required_with:specifications', 'string', 'max:100'],
            'specifications.*.value' => ['required_with:specifications', 'string'],
            'whats_in_the_box' => ['nullable', 'array'],
            'whats_in_the_box.*' => ['string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ]);

        $product->update($validated);

        // If request is partial (e.g. quick toggle is_active or quick update stock from index page)
        if (! $request->has('name')) {
            return back()->with('success', 'Perubahan produk berhasil disimpan.');
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
