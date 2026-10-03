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
        router.post(logout());
    };

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href={login()}
                    className="flex items-center gap-1.5 text-[#333333] hover:text-[#0099FF] text-xs font-semibold transition-colors"
                >
                    <User className="size-3.5 text-gray-500" />
                    <span>Masuk</span>
                </Link>
                <span className="text-gray-300">/</span>
                <Link
                    href={register()}
                    className="rounded-md bg-[#0099FF] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#007ACC] transition-colors"
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
                    className="flex items-center gap-1.5 rounded-lg bg-[#0099FF] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#007ACC] transition-all shadow-xs active:scale-98"
                >
                    <User className="size-3.5" />
                    <span>Akun Saya</span>
                    <ChevronDown className="size-3 opacity-70" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" sideOffset={6}>
                {/* User Greeting Header */}
                <DropdownMenuLabel className="font-normal p-2.5">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#222222] truncate">
                                {user.name}
                            </span>
                            <span className="rounded bg-[#E6F5FF] px-1.5 py-0.2 text-[9px] font-bold text-[#0099FF] uppercase tracking-wider">
                                {isAdmin ? 'Admin' : 'Client'}
                            </span>
                        </div>
                        <span className="text-[11px] text-gray-500 truncate">
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=profile"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2"
                        >
                            <User className="size-3.5 text-[#0099FF]" />
                            <span>Profil Saya</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=orders"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2"
                        >
                            <Package className="size-3.5 text-[#FF6000]" />
                            <span>Riwayat Pesanan</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/client?tab=cart"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2"
                        >
                            <ShoppingCart className="size-3.5 text-[#0099FF]" />
                            <span>Keranjang Belanja</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link
                                href="/admin/products"
                                className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-[#FF6000]"
                            >
                                <LayoutDashboard className="size-3.5" />
                                <span>Panel Admin</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                        <Link
                            href="/settings/profile"
                            className="flex cursor-pointer items-center gap-2 text-xs font-medium py-2 text-gray-600"
                        >
                            <Settings className="size-3.5" />
                            <span>Pengaturan Akun</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 text-xs font-semibold py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <LogOut className="size-3.5" />
                    <span>Keluar (Logout)</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
