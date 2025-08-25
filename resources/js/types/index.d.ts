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
    // Enhanced fields
    team_members?: Array<{
        name: string;
        role: string;
        bio: string;
        image?: string;
        social_links?: {
            linkedin?: string;
            twitter?: string;
            github?: string;
        };
    }>;
    client_testimonials?: Array<{
        name: string;
        company: string;
        content: string;
        image?: string;
        rating: number;
    }>;
    portfolio_items?: Array<{
        title: string;
        description: string;
        image?: string;
        technologies: string[];
        client: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
        image?: string;
        description: string;
    }>;
    company_stats?: {
        years_in_business?: number;
        projects_completed?: number;
        clients_served?: number;
        team_size?: number;
    };
    gallery_images?: string[];
    achievements?: Array<{
        title: string;
        date: string;
        description: string;
        image?: string;
    }>;
    core_values?: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    hero_subtitle?: string;
    hero_cta_text?: string;
    hero_cta_link?: string;
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
    // Enhanced fields
    gallery_images?: string[];
    testimonials?: Array<{
        name: string;
        role: string;
        content: string;
        image?: string;
        rating?: number;
    }>;
    social_media_links?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        website?: string;
    };
    founded_year?: number;
    member_count?: number;
    upcoming_events?: Array<{
        title: string;
        date: string;
        description: string;
        image?: string;
    }>;
    achievements?: Array<{
        title: string;
        date: string;
        description: string;
        image?: string;
    }>;
    hero_subtitle?: string;
    hero_cta_text?: string;
    hero_cta_link?: string;
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

export interface Media {
    id: number;
    filename: string;
    original_filename: string;
    mime_type: string;
    size: number;
    path: string;
    url?: string;
    thumbnail_url?: string;
    alt_text?: string;
    title?: string;
    description?: string;
    caption?: string;
    uploaded_by?: number;
    is_image?: boolean;
    human_size?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    created_at: string;
    updated_at: string;
    uploader?: User;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
    read_at?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
    // Computed attributes
    status_color?: string;
    status_label?: string;
    excerpt?: string;
    is_unread?: boolean;
    is_read?: boolean;
    is_archived?: boolean;
}

export interface CommunityClubActivity {
    id: number;
    community_club_id: number;
    title: string;
    description: string;
    short_description?: string;
    image?: string;
    duration: string;
    max_participants?: number;
    requirements?: string;
    benefits: string[];
    status?: string;
    schedule?: string;
    location?: string;
    contact_info?: string;
    featured?: boolean;
    active?: boolean;
    created_at: string;
    updated_at: string;
    community_club?: CommunityClub;
}

export interface BusinessUnitService {
    id: number;
    business_unit_id: number;
    title: string;
    description: string;
    short_description?: string;
    image?: string;
    price?: string;
    price_range: string;
    duration: string;
    status?: string;
    features: string[];
    technologies: string[];
    process_steps: ProcessStep[];
    featured?: boolean;
    active?: boolean;
    created_at: string;
    updated_at: string;
    business_unit?: BusinessUnit;
}

export interface ProcessStep {
    title: string;
    description: string;
    order: number;
}
