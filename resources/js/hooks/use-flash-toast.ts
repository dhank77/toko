import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashProps = {
    toast?: FlashToast;
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
};

type InertiaPageProps = {
    props?: {
        flash?: FlashProps;
    };
    flash?: FlashProps;
};

const validTypes: FlashToast['type'][] = [
    'success',
    'info',
    'warning',
    'error',
];

function normalizeType(type: unknown): FlashToast['type'] {
    return validTypes.includes(type as FlashToast['type'])
        ? (type as FlashToast['type'])
        : 'success';
}

function normalizeFlash(flash: FlashProps | undefined): FlashToast | null {
    if (!flash) {
        return null;
    }

    if (flash.toast?.message) {
        return {
            type: normalizeType(flash.toast.type),
            message: flash.toast.message,
        };
    }

    const fallback = (
        [
            ['success', flash.success],
            ['error', flash.error],
            ['info', flash.info],
            ['warning', flash.warning],
        ] as const
    ).find(([, message]) => Boolean(message));

    if (!fallback) {
        return null;
    }

    return { type: fallback[0], message: String(fallback[1]) };
}

/**
 * Baca flash dari initial page (`<div id="app" data-page="...">`).
 * Dipakai karena hook ini berjalan di `withApp()` — di luar provider
 * Inertia, sehingga `usePage()` tidak boleh dipakai di sini.
 */
function getInitialFlash(): FlashProps | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    const el = document.getElementById('app');
    const raw = el?.dataset.page;

    if (!raw) {
        return undefined;
    }

    try {
        const page = JSON.parse(raw) as InertiaPageProps;

        return page.props?.flash ?? page.flash;
    } catch {
        return undefined;
    }
}

function showToast(
    data: FlashToast,
    lastShownKey: React.RefObject<string | null>,
): void {
    const key = `${data.type}:${data.message}`;

    if (lastShownKey.current === key) {
        return;
    }

    lastShownKey.current = key;
    toast[data.type](data.message);
}

export function useFlashToast(): void {
    const lastShownKey = useRef<string | null>(null);

    // Flash dari first load (full-page visit / redirect server).
    useEffect(() => {
        const data = normalizeFlash(getInitialFlash());

        if (data) {
            showToast(data, lastShownKey);
        }
    }, []);

    // Flash dari navigasi Inertia berikutnya (event `flash`).
    // `success` dipakai sebagai cadangan kalau event `flash` terlewat,
    // dengan dedupe agar toast yang sama tidak tampil ganda.
    useEffect(() => {
        const offFlash = router.on('flash', (event) => {
            const data = normalizeFlash(
                (event as CustomEvent).detail?.flash as FlashProps | undefined,
            );

            if (data) {
                showToast(data, lastShownKey);
            }
        });

        const offSuccess = router.on('success', (event: any) => {
            const flash =
                event.detail?.page?.props?.flash ??
                event.detail?.page?.flash;
            const data = normalizeFlash(flash);

            if (data) {
                showToast(data, lastShownKey);
            }
        });

        return () => {
            offFlash();
            offSuccess();
        };
    }, []);
}
