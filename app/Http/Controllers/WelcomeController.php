<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $categories = Category::where('is_active', true)
            ->with(['subCategories' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon']);

        $selectedCategory = $request->query('category', 'all');

        $productsQuery = Product::where('is_active', true)
            ->with(['category:id,name,slug', 'subCategory:id,name,slug'])
            ->latest('id');

        if ($selectedCategory && $selectedCategory !== 'all') {
            if (is_numeric($selectedCategory)) {
                $productsQuery->where('category_id', (int) $selectedCategory);
            } else {
                $productsQuery->whereHas('category', function ($q) use ($selectedCategory) {
                    $q->where('slug', $selectedCategory);
                });
            }
        }

        $products = $productsQuery->get();

        $flashSaleProducts = Product::where('is_active', true)
            ->whereNotNull('discount_percent')
            ->where('discount_percent', '>', 0)
            ->with('category:id,name,slug')
            ->orderByDesc('discount_percent')
            ->take(8)
            ->get();

        if ($flashSaleProducts->count() < 8) {
            $remaining = 8 - $flashSaleProducts->count();
            $moreProducts = Product::where('is_active', true)
                ->whereNotIn('id', $flashSaleProducts->pluck('id'))
                ->with('category:id,name,slug')
                ->latest('id')
                ->take($remaining)
                ->get();

            $flashSaleProducts = $flashSaleProducts->concat($moreProducts);
        }

        return Inertia::render('welcome', [
            'categories' => $categories,
            'products' => $products,
            'flashSaleProducts' => $flashSaleProducts,
            'selectedCategory' => $selectedCategory,
        ]);
    }
}
