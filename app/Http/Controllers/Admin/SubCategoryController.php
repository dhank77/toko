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
    public function index(): Response
    {
        $subCategories = SubCategory::with('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/sub-categories/index', [
            'subCategories' => $subCategories,
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
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:120', "unique:sub_categories,slug,{$subCategory->id}"],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0', 'max:9999'],
        ]);

        $subCategory->update($validated);

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
