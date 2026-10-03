<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductDetailController extends Controller
{
    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category', 'subCategory'])
            ->firstOrFail();

        $relatedProducts = Product::where('is_active', true)
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->latest('id')
            ->take(8)
            ->get();

        if ($relatedProducts->count() < 4) {
            $extra = Product::where('is_active', true)
                ->where('id', '!=', $product->id)
                ->whereNotIn('id', $relatedProducts->pluck('id'))
                ->latest('id')
                ->take(8 - $relatedProducts->count())
                ->get();
            $relatedProducts = $relatedProducts->concat($extra);
        }

        $categories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'categories' => $categories,
        ]);
    }
}
