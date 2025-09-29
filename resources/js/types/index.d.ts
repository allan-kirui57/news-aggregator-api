import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_admin?: boolean;
    is_user?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
interface NewsSource {
    id: number;
    name: string;
    slug: string;
    type: string;
    base_url: string;
    api_key: string | null;
    articles_count: number;
    last_updated: string;
    is_active: boolean;
}
interface DashboardProps {
    stats: {
        totalArticles: number;
        totalSources: number;
        featuredArticles: number;
        todayArticles: number;
    };
    charts: {
        articlesBySource: Array<{ name: string; count: number; type: string }>;
        articlesLast7Days: Array<{ date: string; count: number }>;
        articlesByCategory: Array<{ name: string; count: number }>;
    };
    recentArticles: Array<{
        id: number;
        title: string;
        source: string;
        published_at: string;
        is_featured: boolean;
    }>;
    sourceStats: Array<{
        id: number;
        name: string;
        type: string;
        api_key: string;
        base_url: string;
        articles_count: number;
        last_updated: string;
    }>;
}
export interface Category {
    id: number;
    name: string;
    slug?: string;
}

export interface Author {
    id: number;
    name: string;
    slug?: string;
}

export interface Article {
    id: number;
    title: string;
    url: string;
    image_url?: string;
    summary?: string;
    category?: Category;
    source?: Source;
    author?: Author;
    published_at?: string;
    is_featured?: boolean;
}
