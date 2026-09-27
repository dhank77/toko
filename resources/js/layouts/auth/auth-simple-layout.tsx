import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F7F7F7] p-6 md:p-10 dark:bg-[#111827]">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-2">
                                <AppLogo />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>
                    </div>

                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#1F2937]">
                        <div className="mb-6 space-y-1 text-center">
                            <h1 className="text-xl font-bold text-[#222222] dark:text-white">{title}</h1>
                            {description && (
                                <p className="text-center text-xs text-[#666666] dark:text-neutral-400">
                                    {description}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>

                    <div className="text-center text-xs text-[#888888]">
                        &copy; {new Date().getFullYear()} PT Makassar Notebook Indonesia &bull; #SudahPastiMurahnya
                    </div>
                </div>
            </div>
        </div>
    );
}
