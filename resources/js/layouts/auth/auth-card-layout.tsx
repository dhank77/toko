import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogo from '@/components/app-logo';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F7F7F7] p-6 md:p-10 dark:bg-[#111827]">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <AppLogo />
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border border-[#E5E5E5] bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1F2937]">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl font-bold text-[#222222] dark:text-white">{title}</CardTitle>
                            {description && (
                                <CardDescription className="text-xs text-[#666666] dark:text-neutral-400">
                                    {description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center text-xs text-[#888888]">
                    &copy; {new Date().getFullYear()} PT Makassar Notebook Indonesia &bull; #SudahPastiMurahnya
                </div>
            </div>
        </div>
    );
}
