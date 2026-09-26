import { Link } from '@inertiajs/react';
import {
    BookOpen,
    HelpCircle,
    LayoutGrid,
    Package,
    ShieldCheck,
    ShoppingBag,
    Store,
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
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
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
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
