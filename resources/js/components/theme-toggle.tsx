import { Check, Monitor, Moon, Sun } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
    variant?: 'topbar' | 'header' | 'compact';
}

export function ThemeToggle({ className, variant = 'header' }: ThemeToggleProps) {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();

    const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
        { value: 'light', label: 'Terang', icon: Sun },
        { value: 'dark', label: 'Gelap', icon: Moon },
        { value: 'system', label: 'Sistem', icon: Monitor },
    ];

    const isDark = resolvedAppearance === 'dark';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex items-center gap-1.5 rounded-lg transition-all cursor-pointer select-none',
                        variant === 'topbar' &&
                            'text-[#666666] hover:text-[#0099ff] dark:text-gray-400 dark:hover:text-blue-400 text-[11px] font-medium py-0.5 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                        variant === 'header' &&
                            'h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg border border-[#cccccc] dark:border-gray-700 bg-[#fafafa] dark:bg-gray-800 text-[#444444] dark:text-gray-200 hover:bg-[#f0f0f0] dark:hover:bg-gray-700 hover:border-[#999999] dark:hover:border-gray-600 shadow-xs',
                        variant === 'compact' &&
                            'size-8 p-0 justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                        className
                    )}
                    aria-label="Pilih Mode Tema (Light/Dark)"
                    title="Ubah Tema: Terang / Gelap / Sistem"
                >
                    {isDark ? (
                        <Moon className="size-3.5 text-blue-400 shrink-0" />
                    ) : (
                        <Sun className="size-3.5 text-amber-500 shrink-0" />
                    )}

                    {variant !== 'compact' && (
                        <span className="hidden sm:inline">
                            {appearance === 'system'
                                ? 'Sistem'
                                : appearance === 'dark'
                                  ? 'Gelap'
                                  : 'Terang'}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-34 z-50 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-xl text-xs"
            >
                {options.map(({ value, label, icon: Icon }) => {
                    const isSelected = appearance === value;
                    return (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => updateAppearance(value)}
                            className={cn(
                                'flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors',
                                isSelected
                                    ? 'bg-blue-50 text-[#0099ff] font-bold dark:bg-blue-950/60 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        'size-3.5',
                                        value === 'dark' && 'text-blue-400',
                                        value === 'light' && 'text-amber-500',
                                        value === 'system' && 'text-gray-400'
                                    )}
                                />
                                <span>{label}</span>
                            </div>
                            {isSelected && <Check className="size-3 text-[#0099ff] dark:text-blue-400" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

