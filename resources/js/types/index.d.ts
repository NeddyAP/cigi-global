import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface BusinessUnit {
    id: number;
    name: string;
    slug: string;
    description?: string;
    services?: string;
    image?: string;
    contact_phone?: string;
    contact_email?: string;
    address?: string;
    website_url?: string;
    operating_hours?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface CommunityClub {
    id: number;
    name: string;
    slug: string;
    description?: string;
    type: string;
    activities?: string;
    image?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    meeting_schedule?: string;
    location?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface News {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    category: string;
    is_featured: boolean;
    is_published: boolean;
    published_at: string;
    author_id: number;
    author?: User;
    views_count: number;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface GlobalVariable {
    id: number;
    key: string;
    value?: string;
    type: string;
    category: string;
    description?: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface GlobalVars {
    [key: string]: string;
}
