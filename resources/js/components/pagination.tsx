import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
    perPage?: number;
    onPerPageChange?: (perPage: number) => void;
    className?: string;
};

export function Pagination({
    links,
    from,
    to,
    total,
    perPage,
    onPerPageChange,
    className = '',
}: PaginationProps) {
    if (total === 0 || links.length <= 3 && total <= (perPage ?? 10)) {
        return null;
    }

    // Clean html entities in label (e.g. &laquo; Previous -> Previous)
    function cleanLabel(label: string): string {
        return label
            .replace('&laquo;', '')
            .replace('&raquo;', '')
            .replace('Previous', 'Sebelumnya')
            .replace('Next', 'Selanjutnya')
            .trim();
    }

    return (
        <div
            className={`flex flex-col items-center justify-between gap-4 border-t border-[#F0F0F0] px-5 py-3.5 sm:flex-row ${className}`}
        >
            {/* Info & Per Page */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#666666]">
                <span>
                    Menampilkan{' '}
                    <strong className="font-semibold text-[#222222]">
                        {from ?? 0}
                    </strong>{' '}
                    -{' '}
                    <strong className="font-semibold text-[#222222]">
                        {to ?? 0}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-[#222222]">
                        {total}
                    </strong>{' '}
                    data
                </span>

                {onPerPageChange && perPage && (
                    <div className="flex items-center gap-1.5 pl-2">
                        <span>Tampilkan:</span>
                        <select
                            value={perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="h-7 rounded-md border border-[#E5E5E5] bg-white px-2 text-xs font-medium text-[#222222] shadow-2xs outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>per halaman</span>
                    </div>
                )}
            </div>

            {/* Pagination Links */}
            <nav
                role="navigation"
                aria-label="Navigasi Halaman"
                className="flex items-center gap-1"
            >
                {links.map((link, index) => {
                    const isPrev = index === 0;
                    const isNext = index === links.length - 1;
                    const cleaned = cleanLabel(link.label);

                    if (isPrev) {
                        return link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                                title="Halaman Sebelumnya"
                            >
                                <ChevronLeft className="size-3.5" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="inline-flex h-8 cursor-not-allowed items-center gap-1 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 text-xs font-semibold text-[#BBB] shadow-2xs"
                            >
                                <ChevronLeft className="size-3.5" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </span>
                        );
                    }

                    if (isNext) {
                        return link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs font-semibold text-[#444444] shadow-2xs transition-colors hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]"
                                title="Halaman Selanjutnya"
                            >
                                <span className="hidden sm:inline">Selanjutnya</span>
                                <ChevronRight className="size-3.5" />
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="inline-flex h-8 cursor-not-allowed items-center gap-1 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 text-xs font-semibold text-[#BBB] shadow-2xs"
                            >
                                <span className="hidden sm:inline">Selanjutnya</span>
                                <ChevronRight className="size-3.5" />
                            </span>
                        );
                    }

                    // Dots or non-clickable
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="inline-flex h-8 min-w-8 items-center justify-center px-1 text-xs text-[#999]"
                            >
                                {link.label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
                                link.active
                                    ? 'bg-[#0099FF] text-white shadow-xs'
                                    : 'border border-[#E5E5E5] bg-white text-[#444444] shadow-2xs hover:border-[#0099FF] hover:bg-[#F0F8FF] hover:text-[#0099FF]'
                            }`}
                        >
                            {cleaned}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
