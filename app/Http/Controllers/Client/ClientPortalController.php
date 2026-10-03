<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientPortalController extends Controller
{
    /**
     * Render the main client portal page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get or initialize customer orders
        $orders = Order::with(['items.product'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        // If user has zero orders, generate a realistic initial Pick N Go sample order
        // so the user can immediately experience the Pick N Go PIN, Locker rack, and tracking
        if ($orders->isEmpty()) {
            $sampleProduct = Product::first();
            if ($sampleProduct) {
                $order = Order::create([
                    'order_number' => 'MKN-'.date('Ymd').'-'.str_pad((string) rand(10, 9999), 4, '0', STR_PAD_LEFT),
                    'user_id' => $user->id,
                    'branch' => 'Panakkukang',
                    'fulfillment_type' => 'pick_n_go',
                    'status' => 'ready_for_pickup',
                    'pickup_pin' => rand(100, 999).'-'.rand(100, 999),
                    'pickup_rack' => 'Rak B-02',
                    'payment_method' => 'QRIS',
                    'payment_status' => 'paid',
                    'total_amount' => $sampleProduct->price,
                    'notes' => 'Pesanan siap diambil di loker Pick N Go Cabang Panakkukang.',
                ]);

                $order->items()->create([
                    'product_id' => $sampleProduct->id,
                    'product_name' => $sampleProduct->name,
                    'sku' => $sampleProduct->sku,
                    'price' => $sampleProduct->price,
                    'quantity' => 1,
                    'subtotal' => $sampleProduct->price,
                    'thumbnail' => $sampleProduct->thumbnail,
                ]);

                $orders = Order::with(['items.product'])
                    ->where('user_id', $user->id)
                    ->latest()
                    ->get();
            }
        }

        // Get user cart items
        $cartItems = CartItem::with('product')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $activeTab = $request->query('tab', 'profile');
        if (! in_array($activeTab, ['profile', 'orders', 'cart'], true)) {
            $activeTab = 'profile';
        }

        return Inertia::render('client/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'customer',
                'phone' => $user->phone ?? '',
                'address' => $user->address ?? '',
                'province' => $user->province ?? '',
                'province_id' => $user->province_id ?? '',
                'city' => $user->city ?? 'Makassar',
                'city_id' => $user->city_id ?? '',
                'district' => $user->district ?? '',
                'district_id' => $user->district_id ?? '',
                'subdistrict' => $user->subdistrict ?? '',
                'subdistrict_id' => $user->subdistrict_id ?? '',
                'postal_code' => $user->postal_code ?? '90222',
                'created_at' => $user->created_at?->format('d M Y') ?? '',
            ],
            'storeOrigin' => [
                'district_id' => (int) config('services.rajaongkir.origin_district_id', 6736),
                'district_name' => (string) config('services.rajaongkir.origin_district_name', 'Panakkukang'),
            ],
            'orders' => $orders,
            'cartItems' => $cartItems,
            'activeTab' => $activeTab,
        ]);
    }

    /**
     * Update customer profile details.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:500'],
            'province' => ['nullable', 'string', 'max:100'],
            'province_id' => ['nullable', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'city_id' => ['nullable', 'string', 'max:20'],
            'district' => ['nullable', 'string', 'max:100'],
            'district_id' => ['nullable', 'string', 'max:20'],
            'subdistrict' => ['nullable', 'string', 'max:100'],
            'subdistrict_id' => ['nullable', 'string', 'max:20'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil pembeli berhasil diperbarui.');
    }

    /**
     * Add an item to user cart.
     */
    public function addToCart(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
            'branch' => ['nullable', 'string', 'max:100'],
        ]);

        $userId = $request->user()->id;
        $productId = (int) $validated['product_id'];
        $quantity = (int) ($validated['quantity'] ?? 1);
        $branch = $validated['branch'] ?? 'Panakkukang';

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'branch' => $branch,
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang belanja.');
    }

    /**
     * Update quantity of a cart item.
     */
    public function updateCart(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        return back()->with('success', 'Jumlah produk diperbarui.');
    }

    /**
     * Remove a single item from cart.
     */
    public function removeCart(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Produk dihapus dari keranjang belanja.');
    }

    /**
     * Clear all items in cart.
     */
    public function clearCart(Request $request): RedirectResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return back()->with('success', 'Keranjang belanja berhasil dikosongkan.');
    }
}
