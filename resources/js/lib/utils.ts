import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Format standard Indonesian Rupiah with thousand dot separator (e.g. 50.000 or Rp 50.000)
 */
export function formatRupiah(value: number | string | null | undefined, withPrefix = true): string {
    if (value === null || value === undefined || value === '') {
        return withPrefix ? 'Rp 0' : '0';
    }
    const num = typeof value === 'number' ? value : Number(String(value).replace(/\D/g, ''));
    if (isNaN(num)) {
        return withPrefix ? 'Rp 0' : '0';
    }
    const formatted = num.toLocaleString('id-ID');
    return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format pure numeric string/number with thousand dot separator (e.g. 50000 -> "50.000")
 */
export function formatNumberWithDots(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return '';
    }
    const numericStr = String(value).replace(/\D/g, '');
    if (!numericStr) {
        return '';
    }
    return Number(numericStr).toLocaleString('id-ID');
}

/**
 * Parse a rupiah string with dots/letters to pure integer for database payload (e.g. "50.000" -> 50000)
 */
export function parseRupiah(value: string | number | null | undefined): number | '' {
    if (value === null || value === undefined || value === '') {
        return '';
    }
    const cleanDigits = String(value).replace(/\D/g, '');
    if (!cleanDigits) {
        return '';
    }
    return parseInt(cleanDigits, 10);
}

