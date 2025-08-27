import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building2, Globe, Image, LayoutGrid, Mail, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'Business',
        href: '/admin/business-units',
        icon: Building2,
    },
    {
        title: 'Community',
        href: '/admin/community-clubs',
        icon: Users,
    },
    {
        title: 'News',
        href: '/admin/news',
        icon: BookOpen,
    },
    {
        title: 'Contact Messages',
        href: '/admin/contact-messages',
        icon: Mail,
    },
    {
        title: 'Media Manager',
        href: '/admin/media',
        icon: Image,
    },
    {
        title: 'Global Variables',
        href: '/admin/global-variables',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Website',
        href: 'https://cigiglobal.com',
        icon: Globe,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                                <div className="flex flex-col">
                                    <div className="text-sm font-medium">CIGI Global</div>
                                    <span className="text-xs text-zinc-500">Admin Panel</span>
                                </div>
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
