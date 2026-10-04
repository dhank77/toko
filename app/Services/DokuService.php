<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Layanan integrasi DOKU Checkout (Hosted Payment Page).
 *
 * @see docs/doku-payment-plan.md
 */
class DokuService
{
    public const CHECKOUT_TARGET = '/checkout/v1/payment';

    protected string $baseUrl;

    protected string $clientId;

    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.doku.base_url');
        $this->clientId = (string) config('services.doku.client_id');
        $this->secretKey = (string) config('services.doku.secret_key');
    }

    /**
     * Buat sesi pembayaran DOKU Checkout untuk sebuah pesanan.
     *
     * @return array{invoice_number: string, payment_url: string, raw: array<string, mixed>}
     */
    public function createCheckout(Order $order): array
    {
        $order->loadMissing(['items', 'user']);

        $user = $order->user;
        $returnUrl = route('client.index', ['tab' => 'orders']);

        $payload = [
            'order' => [
                'invoice_number' => $order->order_number,
                'amount' => (int) $order->total_amount,
                'currency' => 'IDR',
                'callback_url' => $returnUrl,
                'auto_redirect' => true,
                'line_items' => $order->items->map(fn ($item): array => [
                    'name' => Str::limit($item->product_name, 90, ''),
                    'price' => (int) $item->price,
                    'quantity' => (int) $item->quantity,
                ])->values()->all(),
            ],
            'payment' => [
                'payment_due_date' => (int) config('services.doku.payment_due_minutes', 60),
            ],
            'customer' => array_filter([
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
            ]),
        ];

        $body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $requestId = (string) Str::uuid();
        $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        $digest = $this->digest($body);

        $response = Http::withHeaders([
            'Client-Id' => $this->clientId,
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $this->signature($requestId, $timestamp, self::CHECKOUT_TARGET, $digest),
        ])
            ->timeout(20)
            ->withBody($body, 'application/json')
            ->post($this->baseUrl.self::CHECKOUT_TARGET);

        $paymentUrl = $response->json('response.payment.url');

        if (! $response->successful() || ! $paymentUrl) {
            throw new RuntimeException('Gagal membuat sesi pembayaran DOKU.');
        }

        return [
            'invoice_number' => $order->order_number,
            'payment_url' => $paymentUrl,
            'raw' => $response->json(),
        ];
    }

    /**
     * Validasi signature notifikasi (webhook) dari DOKU.
     */
    public function verifyNotification(Request $request): bool
    {
        $clientId = (string) $request->header('Client-Id');
        $requestId = (string) $request->header('Request-Id');
        $timestamp = (string) $request->header('Request-Timestamp');
        $signature = (string) $request->header('Signature');

        if ($clientId === '' || $requestId === '' || $timestamp === '' || $signature === '') {
            return false;
        }

        if (! hash_equals($this->clientId, $clientId)) {
            return false;
        }

        $expected = $this->signature(
            $requestId,
            $timestamp,
            '/'.ltrim($request->getPathInfo(), '/'),
            $this->digest($request->getContent()),
        );

        return hash_equals($expected, $signature);
    }

    public function digest(string $body): string
    {
        return base64_encode(hash('sha256', $body, true));
    }

    public function signature(string $requestId, string $timestamp, string $requestTarget, string $digest): string
    {
        $stringToSign = "Client-Id:{$this->clientId}\n"
            ."Request-Id:{$requestId}\n"
            ."Request-Timestamp:{$timestamp}\n"
            ."Request-Target:{$requestTarget}\n"
            ."Digest:{$digest}";

        return 'HMACSHA256='.base64_encode(hash_hmac('sha256', $stringToSign, $this->secretKey, true));
    }
}
