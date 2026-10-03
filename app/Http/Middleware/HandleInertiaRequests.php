<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'storeCategories' => fn () => Category::where('is_active', true)
                ->with(['subCategories' => function ($q) {
                    $q->where('is_active', true)->orderBy('sort_order')->orderBy('name');
                }])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'icon']),
            'cartCount' => fn () => $request->user()
                ? (int) CartItem::where('user_id', $request->user()->id)->sum('quantity')
                : 0,
            // Sonner: jembatani session flash Laravel lama (->with('success', ...))
            // menjadi prop Inertia `flash` agar otomatis jadi toast.
            'flash' => fn () => $this->resolveToastFlash($request),
        ];
    }

    /**
     * @return array{toast?: array{type: string, message: string}}
     */
    private function resolveToastFlash(Request $request): array
    {
        if (! $request->hasSession()) {
            return [];
        }

        $toast = $request->session()->get('toast');

        if (is_array($toast) && isset($toast['message'])) {
            return ['toast' => [
                'type' => (string) ($toast['type'] ?? 'success'),
                'message' => (string) $toast['message'],
            ]];
        }

        foreach (['success', 'error', 'info', 'warning'] as $type) {
            if ($request->session()->has($type)) {
                return ['toast' => [
                    'type' => $type,
                    'message' => (string) $request->session()->get($type),
                ]];
            }
        }

        return [];
    }
}
