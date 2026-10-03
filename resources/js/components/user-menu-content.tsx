import { Link, router } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Package, Settings, ShoppingCart, User as UserIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer flex items-center"
                        href="/client?tab=profile"
                        prefetch
                        onClick={cleanup}
                    >
                        <UserIcon className="mr-2 size-4 text-[#0099FF]" />
                        Profil Saya
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer flex items-center"
                        href="/client?tab=orders"
                        prefetch
                        onClick={cleanup}
                    >
                        <Package className="mr-2 size-4 text-[#FF6000]" />
                        Riwayat Pesanan
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer flex items-center"
                        href="/client?tab=cart"
                        prefetch
                        onClick={cleanup}
                    >
                        <ShoppingCart className="mr-2 size-4 text-[#0099FF]" />
                        Keranjang Belanja
                    </Link>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer flex items-center text-[#FF6000]"
                            href="/admin/products"
                            prefetch
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="mr-2 size-4" />
                            Panel Admin
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer flex items-center text-gray-600"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 size-4" />
                        Pengaturan Keamanan
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
