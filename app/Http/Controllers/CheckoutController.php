<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Services\DokuService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class CheckoutController extends Controller
{
    public function __construct(protected DokuService $doku) {}

    /**
     * Beli langsung satu produk dari halaman detail produk.
     */
    public function buyNow(Request $request): Response|RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
            'branch' => ['nullable', 'string', 'max:100'],
        ]);

        $product = Product::where('is_active', true)->find($validated['product_id']);

        if (! $product) {
            return back()->withErrors(['checkout' => 'Produk tidak tersedia.']);
        }

        return $this->startCheckout(
            $request->user(),
            collect([['product' => $product, 'quantity' => (int) ($validated['quantity'] ?? 1)]]),
            $validated['branch'] ?? 'Panakkukang',
            clearCart: false,
        );
    }

    /**
     * Proses seluruh isi keranjang belanja menjadi satu pesanan.
     */
    public function processCart(Request $request): Response|RedirectResponse
    {
        $request->validate([
            'branch' => ['nullable', 'string', 'max:100'],
        ]);

        $cartItems = CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->get()
            ->filter(fn (CartItem $item): bool => $item->product !== null && $item->product->is_active);

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['checkout' => 'Keranjang belanja Anda kosong.']);
        }

        $lines = $cartItems->map(fn (CartItem $item): array => [
            'product' => $item->product,
            'quantity' => $item->quantity,
        ])->values();

        $branch = $request->input('branch') ?: ($cartItems->first()->branch ?: 'Panakkukang');

        return $this->startCheckout($request->user(), $lines, $branch, clearCart: true);
    }

    /**
     * @param  Collection<int, array{product: Product, quantity: int}>  $lines
     */
    protected function startCheckout(User $user, Collection $lines, string $branch, bool $clearCart): Response|RedirectResponse
    {
        $order = DB::transaction(function () use ($user, $lines, $branch): Order {
            $total = $lines->sum(fn (array $line): int => (int) $line['product']->price * $line['quantity']);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'branch' => $branch,
                'fulfillment_type' => 'pick_n_go',
                'status' => 'pending_payment',
                'payment_method' => 'DOKU',
                'payment_status' => 'unpaid',
                'total_amount' => $total,
            ]);

            foreach ($lines as $line) {
                /** @var Product $product */
                $product = $line['product'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'price' => (int) $product->price,
                    'quantity' => $line['quantity'],
                    'subtotal' => (int) $product->price * $line['quantity'],
                    'thumbnail' => $product->thumbnail,
                ]);
            }

            return $order;
        });

        try {
            $checkout = $this->doku->createCheckout($order);
        } catch (Throwable $e) {
            Log::error('DOKU checkout gagal', ['order' => $order->order_number, 'error' => $e->getMessage()]);

            $order->update(['status' => 'cancelled', 'payment_status' => 'failed']);

            return back()->withErrors(['checkout' => 'Pembayaran tidak dapat diproses saat ini. Silakan coba lagi.']);
        }

        DB::transaction(function () use ($order, $checkout, $user, $clearCart): void {
            $order->update([
                'payment_url' => $checkout['payment_url'],
                'doku_invoice_number' => $checkout['invoice_number'],
            ]);

            Payment::create([
                'order_id' => $order->id,
                'transaction_reference' => $checkout['invoice_number'],
                'gateway' => 'doku',
                'amount' => $order->total_amount,
                'status' => 'pending',
                'payment_url' => $checkout['payment_url'],
                'raw_payload' => $checkout['raw'],
            ]);

            if ($clearCart) {
                CartItem::where('user_id', $user->id)->delete();
            }
        });

        return Inertia::location($checkout['payment_url']);
    }

    protected function generateOrderNumber(): string
    {
        do {
            $number = 'MKN-'.date('Ymd').'-'.str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
