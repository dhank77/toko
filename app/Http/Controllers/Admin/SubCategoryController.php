<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SubCategory::with('category');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Parent Category filter
        if ($categoryId = $request->input('category_id')) {
            if ($categoryId !== 'all') {
                $query->where('category_id', $categoryId);
            }
        }

        // Status filter
        $status = $request->input('status');
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Sorting
        $sort = (string) $request->input('sort', 'sort_order');
        $direction = strtolower((string) $request->input('direction', 'asc'));
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'asc';

        $allowedSorts = ['sort_order', 'name', 'slug', 'category_id', 'is_active', 'created_at'];
        if (in_array($sort, $allowedSorts, true)) {
            $query->orderBy($sort, $direction);
            if ($sort !== 'name') {
                $query->orderBy('name', 'asc');
            }
        } else {
            $sort = 'sort_order';
            $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc');
        }

        // Pagination
        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;

        $subCategories = $query->paginate($perPage)->withQueryString();

        $categories = Category::orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'icon']);

        return Inertia::render('admin/sub-categories/index', [
            'subCategories' => $subCategories,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
                'category_id' => $request->input('category_id', 'all'),
                'status' => $status ?? 'all',
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'stats' => [
                'total' => SubCategory::count(),
                'active' => SubCategory::where('is_active', true)->count(),
                'inactive' => SubCategory::where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/sub-categories/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:120', 'unique:sub_categories,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0', 'max:9999'],
        ]);

        SubCategory::create($validated);

        return redirect()->route('admin.sub-categories.index')
            ->with('success', 'Sub kategori berhasil ditambahkan.');
    }

    public function edit(SubCategory $subCategory): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/sub-categories/edit', [
            'subCategory' => $subCategory,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, SubCategory $subCategory): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:120', "unique:sub_categories,slug,{$subCategory->id}"],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:9999'],
        ]);

        $subCategory->update($validated);

        // If request is partial (e.g. only sort_order or is_active from index page inline action)
        if (! $request->has('name')) {
            return back()->with('success', 'Perubahan sub kategori berhasil disimpan.');
        }

        return redirect()->route('admin.sub-categories.index')
            ->with('success', 'Sub kategori berhasil diperbarui.');
    }

    public function destroy(SubCategory $subCategory): RedirectResponse
    {
        $subCategory->delete();

        return redirect()->route('admin.sub-categories.index')
            ->with('success', 'Sub kategori berhasil dihapus.');
    }
}
