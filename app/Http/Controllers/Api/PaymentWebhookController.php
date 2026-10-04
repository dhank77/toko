<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\DokuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentWebhookController extends Controller
{
    public function __construct(protected DokuService $doku) {}

    /**
     * Terima notifikasi pembayaran DOKU secara idempoten.
     */
    public function handleDoku(Request $request): JsonResponse
    {
        if (! $this->doku->verifyNotification($request)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $invoiceNumber = (string) $request->input('order.invoice_number');
        $transactionStatus = strtoupper((string) $request->input('transaction.status'));

        $order = Order::where('order_number', $invoiceNumber)->first();

        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        DB::transaction(function () use ($order, $request, $transactionStatus): void {
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($order->payment_status === 'paid') {
                return;
            }

            $payment = $order->payments()->where('transaction_reference', $order->order_number)->first();

            $paymentData = [
                'payment_channel' => $request->input('channel.id'),
                'va_number' => $request->input('virtual_account_info.virtual_account_number'),
                'raw_payload' => $request->all(),
            ];

            if ($transactionStatus === 'SUCCESS') {
                $payment?->update($paymentData + ['status' => 'success', 'paid_at' => now()]);

                $order->update($this->paidAttributes($order));

                return;
            }

            if (in_array($transactionStatus, ['FAILED', 'EXPIRED'], true)) {
                $payment?->update($paymentData + [
                    'status' => $transactionStatus === 'EXPIRED' ? 'expired' : 'failed',
                ]);

                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => $transactionStatus === 'EXPIRED' ? 'expired' : 'failed',
                ]);
            }
        });

        return response()->json(['message' => 'OK']);
    }

    /**
     * @return array<string, mixed>
     */
    protected function paidAttributes(Order $order): array
    {
        if ($order->fulfillment_type === 'pick_n_go') {
            return [
                'payment_status' => 'paid',
                'status' => 'ready_for_pickup',
                'pickup_pin' => random_int(100, 999).'-'.random_int(100, 999),
                'pickup_rack' => 'Rak '.chr(random_int(65, 70)).'-'.str_pad((string) random_int(1, 20), 2, '0', STR_PAD_LEFT),
            ];
        }

        return ['payment_status' => 'paid', 'status' => 'processing'];
    }
}
