import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ArticlesList() {
    const { auth } = usePage<SharedData>().props;
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        source: '',
        author: '',
    });

    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [authors, setAuthors] = useState([]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // Clean up filters to remove empty values
            const cleanFilters = Object.entries(filters).reduce(
                (acc, [key, value]) => {
                    if (value && value !== '' && value !== 'all') {
                        acc[key] = value;
                    }
                    return acc;
                },
                {},
            );

            const queryParams = new URLSearchParams(cleanFilters);
            const response = await fetch(`/api/v1/articles?${queryParams}`);
            const data = await response.json();
            setArticles(data.data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const [catRes, srcRes, authRes] = await Promise.all([
                fetch('/api/v1/categories').then((res) => res.json()),
                fetch('/api/v1/news-sources').then((res) => res.json()),
                fetch('/api/v1/authors').then((res) => res.json()),
            ]);
            setCategories(catRes.data || catRes || []);
            setSources(srcRes.data || srcRes || []);
            setAuthors(authRes.data || authRes || []);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    useEffect(() => {
        fetchFilters();
        fetchArticles();
    }, []);

    const handleFilterChange = (key, value) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const applyFilters = () => fetchArticles();

    const resetFilters = () => {
        setFilters({
            search: '',
            category: '',
            source: '',
            author: '',
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                News Aggregator Hub
                            </h1>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-6">
                    {/* 🔎 Filters */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                                Filter Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <Input
                                    placeholder="Search articles..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'search',
                                            e.target.value,
                                        )
                                    }
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && applyFilters()
                                    }
                                />

                                <Select
                                    value={filters.category || undefined}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            'category',
                                            value || '',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={
                                                    c.slug || c.id.toString()
                                                }
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.source || undefined}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            'source',
                                            value || '',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Sources
                                        </SelectItem>
                                        {sources.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={
                                                    s.slug ||
                                                    s.name ||
                                                    s.id.toString()
                                                }
                                            >
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.author || undefined}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            'author',
                                            value || '',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Authors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Authors
                                        </SelectItem>
                                        {authors.map((a) => (
                                            <SelectItem
                                                key={a.id}
                                                value={
                                                    a.slug ||
                                                    a.name ||
                                                    a.id.toString()
                                                }
                                            >
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={applyFilters}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Apply Filters'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 📰 Articles */}
                    {loading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="rounded-xl shadow-sm">
                                    <CardHeader className="p-3">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <Skeleton className="mx-3 h-28 w-full rounded" />
                                    <CardContent className="space-y-2 p-3">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                        <div className="flex justify-between">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {articles.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Found {articles.length} article
                                            {articles.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {articles.map((article) => (
                                            <Card
                                                key={article.id}
                                                className="overflow-hidden rounded-xl border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700"
                                            >
                                                {article.image_url && (
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                article.image_url
                                                            }
                                                            alt={article.title}
                                                            className="h-32 w-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display =
                                                                    'none';
                                                            }}
                                                        />
                                                        {article.is_featured && (
                                                            <Badge className="absolute top-2 left-2 text-xs">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                <CardHeader className="p-3">
                                                    <CardTitle className="line-clamp-3 text-sm leading-tight font-semibold">
                                                        <a
                                                            href={article.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="transition-colors hover:text-blue-600"
                                                        >
                                                            {article.title}
                                                        </a>
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="space-y-2 p-3 pt-0 text-xs text-slate-600 dark:text-slate-400">
                                                    {article.summary && (
                                                        <p className="line-clamp-3 text-slate-500 dark:text-slate-400">
                                                            {article.summary}
                                                        </p>
                                                    )}

                                                    <div className="mb-2 flex flex-wrap gap-1">
                                                        {article.category
                                                            ?.name && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    article
                                                                        .category
                                                                        .name
                                                                }
                                                            </Badge>
                                                        )}
                                                        {article.source
                                                            ?.name && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    article
                                                                        .source
                                                                        .name
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-500 dark:border-slate-600 dark:text-slate-400">
                                                        <span className="flex-1 truncate">
                                                            {article.author
                                                                ?.name ||
                                                                'Unknown Author'}
                                                        </span>
                                                        {article.published_at && (
                                                            <span className="ml-2 flex-shrink-0">
                                                                {formatDate(
                                                                    article.published_at,
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Card className="py-12 text-center shadow-sm">
                                    <CardContent>
                                        <p className="text-lg text-slate-500 dark:text-slate-400">
                                            No articles found
                                        </p>
                                        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                                            Try adjusting your search criteria
                                            or reset filters
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
