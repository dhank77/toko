<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryPageController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->firstOrFail();

        $subCategorySlug = $request->query('sub_category');
        $sort = $request->query('sort', 'latest');

        $productsQuery = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->with(['category:id,name,slug', 'subCategory:id,name,slug']);

        if ($subCategorySlug && $subCategorySlug !== 'all') {
            $productsQuery->whereHas('subCategory', function ($q) use ($subCategorySlug) {
                $q->where('slug', $subCategorySlug);
            });
        }

        match ($sort) {
            'price_low' => $productsQuery->orderBy('price', 'asc'),
            'price_high' => $productsQuery->orderBy('price', 'desc'),
            'discount' => $productsQuery->orderByDesc('discount_percent'),
            'name' => $productsQuery->orderBy('name', 'asc'),
            default => $productsQuery->latest('id'),
        };

        $products = $productsQuery->paginate(24)->withQueryString();

        $allCategories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('categories/show', [
            'category' => $category,
            'products' => $products,
            'selectedSubCategory' => $subCategorySlug ?? 'all',
            'selectedSort' => $sort,
            'categories' => $allCategories,
        ]);
    }
}
