import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    Shield,
    ShoppingBag,
    ShoppingCart,
    User,
    UserCheck,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { login, logout, register } from '@/routes';
import type { User as UserType } from '@/types';

export function StoreAccountMenu() {
    const { auth } = usePage().props as { auth: { user: UserType | null } };
    const user = auth?.user;

    const handleLogout = () => {
        router.post(logout.url());
    };

    if (!user) {
        return (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                    href={login()}
                    className="flex items-center gap-1 sm:gap-1.5 text-[#333333] hover:text-[#0099FF] dark:text-gray-300 dark:hover:text-[#0099FF] text-xs font-semibold py-1 px-1.5 sm:px-0 rounded transition-colors"
                    title="Masuk ke Akun"
                >
                    <User className="size-3.5 text-gray-500 dark:text-gray-400" />
                    <span>Masuk</span>
                </Link>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">/</span>
                <Link
                    href={register()}
                    className="hidden sm:inline-block rounded-md bg-[#0099FF] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#007ACC] transition-colors"
                >
                    Daftar
                </Link>
            </div>
        );
    }

    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-[#0099FF] px-2 sm:px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#007ACC] transition-all shadow-xs active:scale-98 cursor-pointer shrink-0"
                    aria-label="Menu Akun Saya"
                >
                    <User className="size-3.5" />
                    <span className="hidden sm:inline">Akun Saya</span>
                    <ChevronDown className="size-3 opacity-70 hidden sm:inline" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 max-w-[calc(100vw-24px)] z-50 bg-white dark:bg-gray-900 border border-[#e5e5e5] dark:border-gray-800 shadow-xl"
                align="end"
                sideOffset={8}
                collisionPadding={12}
            >
                {/* User Greeting Header */}
                <DropdownMenuLabel className="font-normal p-2.5">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#222222] dark:text-white truncate">
                                {user.name}
                            </span>
                            <span className="rounded bg-[#E6F5FF] dark:bg-blue-950/60 px-1.5 py-0.2 text-[9px] font-bold text-[#0099FF] dark:text-blue-400 uppercase tracking-wider">
                                {isAdmin ? 'Admin' : 'Client'}
                            </span>
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#f0f0f0] dark:bg-gray-800" />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=profile"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-gray-700 dark:text-gray-200 hover:text-[#0099FF] dark:hover:text-blue-400 dark:focus:bg-gray-800"
                        >
                            <User className="size-3.5 text-[#0099FF]" />
                            <span>Profil Saya</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=orders"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-gray-700 dark:text-gray-200 hover:text-[#FF6000] dark:hover:text-[#FF6000] dark:focus:bg-gray-800"
                        >
                            <Package className="size-3.5 text-[#FF6000]" />
                            <span>Riwayat Pesanan</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=cart"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-gray-700 dark:text-gray-200 hover:text-[#0099FF] dark:hover:text-blue-400 dark:focus:bg-gray-800"
                        >
                            <ShoppingCart className="size-3.5 text-[#0099FF]" />
                            <span>Keranjang Belanja</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-[#f0f0f0] dark:bg-gray-800" />

                <DropdownMenuGroup>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link
                                href="/admin/products"
                                className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-[#FF6000] dark:focus:bg-gray-800"
                            >
                                <LayoutDashboard className="size-3.5" />
                                <span>Panel Admin</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                        <Link
                            href="/settings/profile"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:focus:bg-gray-800"
                        >
                            <Settings className="size-3.5" />
                            <span>Pengaturan Akun</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-[#f0f0f0] dark:bg-gray-800" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 text-xs font-semibold py-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/40"
                >
                    <LogOut className="size-3.5" />
                    <span>Keluar (Logout)</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
