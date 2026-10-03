<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\CategoryPageController;
use App\Http\Controllers\Client\ClientPortalController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeController::class)->name('home');
Route::get('/products/{slug}', [ProductDetailController::class, 'show'])->name('products.show');
Route::get('/categories/{slug}', [CategoryPageController::class, 'show'])->name('categories.show');

// RajaOngkir: wilayah & ongkir (publik agar dropdown alamat bisa dipakai tanpa login)
Route::prefix('shipping')->name('shipping.')->group(function () {
    Route::get('/provinces', [ShippingController::class, 'provinces'])->name('provinces');
    Route::get('/cities/{provinceId}', [ShippingController::class, 'cities'])->name('cities');
    Route::get('/districts/{cityId}', [ShippingController::class, 'districts'])->name('districts');
    Route::post('/calculate', [ShippingController::class, 'calculate'])->name('calculate');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/client', [ClientPortalController::class, 'index'])->name('client.index');
    Route::put('/client/profile', [ClientPortalController::class, 'updateProfile'])->name('client.profile.update');
    Route::post('/client/cart', [ClientPortalController::class, 'addToCart'])->name('client.cart.add');
    Route::patch('/client/cart/{cartItem}', [ClientPortalController::class, 'updateCart'])->name('client.cart.update');
    Route::delete('/client/cart/{cartItem}', [ClientPortalController::class, 'removeCart'])->name('client.cart.remove');
    Route::delete('/client/cart', [ClientPortalController::class, 'clearCart'])->name('client.cart.clear');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        if ($request->user() && $request->user()->isCustomer()) {
            return redirect()->route('client.index');
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('sub-categories', SubCategoryController::class);
        Route::resource('products', ProductController::class);
    });
});

require __DIR__.'/settings.php';
