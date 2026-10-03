import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderOpen,
    HelpCircle,
    LayoutGrid,
    Package,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Store,
    Tag,
    User,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { useCurrentUrl } from '@/hooks/use-current-url';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as SubCategoryController from '@/actions/App/Http/Controllers/Admin/SubCategoryController';
import type { NavItem, User as UserType } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Ringkasan Toko',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Katalog & Stok Cabang',
        href: '/#katalog',
        icon: Store,
    },
    {
        title: 'Pesanan Pick N Go',
        href: dashboard(),
        icon: ShoppingBag,
    },
    {
        title: 'Dompet Dropship',
        href: dashboard(),
        icon: Wallet,
    },
    {
        title: 'Klaim Garansi & RMA',
        href: dashboard(),
        icon: ShieldCheck,
    },
];

const clientNavItems: NavItem[] = [
    {
        title: 'Profil Saya',
        href: '/client?tab=profile',
        icon: User,
    },
    {
        title: 'Riwayat Pesanan',
        href: '/client?tab=orders',
        icon: Package,
    },
    {
        title: 'Keranjang Belanja',
        href: '/client?tab=cart',
        icon: ShoppingCart,
    },
    {
        title: 'Katalog & Belanja',
        href: '/',
        icon: Store,
    },
];

const masterDataNavItems: NavItem[] = [
    {
        title: 'Produk',
        href: ProductController.index().url,
        icon: Package,
    },
    {
        title: 'Kategori',
        href: CategoryController.index().url,
        icon: FolderOpen,
    },
    {
        title: 'Sub Kategori',
        href: SubCategoryController.index().url,
        icon: Tag,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Panduan Mitra Dropship',
        href: '/#dropship',
        icon: BookOpen,
    },
    {
        title: 'Bantuan & Lokasi Cabang',
        href: '/#cabang',
        icon: HelpCircle,
    },
];

export function AppSidebar() {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage().props as { auth: { user: UserType | null } };
    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'super_admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? dashboard() : '/client'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={isAdmin ? adminNavItems : clientNavItems} />

                {/* Master Data Group only for Admin */}
                {isAdmin && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6000]">
                            <Package className="size-3" />
                            Master Data
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {masterDataNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentOrParentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
