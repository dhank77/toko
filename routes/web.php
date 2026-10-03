<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\CategoryPageController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');
Route::get('/products/{slug}', [ProductDetailController::class, 'show'])->name('products.show');
Route::get('/categories/{slug}', [CategoryPageController::class, 'show'])->name('categories.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('sub-categories', SubCategoryController::class);
        Route::resource('products', ProductController::class);
    });
});

require __DIR__.'/settings.php';
