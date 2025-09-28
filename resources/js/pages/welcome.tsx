import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        source: "",
        author: ""
    });

    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [authors, setAuthors] = useState([]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // Clean up filters to remove empty values
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value && value !== "" && value !== "all") {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const queryParams = new URLSearchParams(cleanFilters);
            const response = await fetch(`/api/v1/articles?${queryParams}`);
            const data = await response.json();
            setArticles(data.data || []);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const [catRes, srcRes, authRes] = await Promise.all([
                fetch("/api/v1/categories").then(res => res.json()),
                fetch("/api/v1/news-sources").then(res => res.json()),
                fetch("/api/v1/authors").then(res => res.json())
            ]);
            setCategories(catRes.data || catRes || []);
            setSources(srcRes.data || srcRes || []);
            setAuthors(authRes.data || authRes || []);
        } catch (error) {
            console.error("Error fetching filters:", error);
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
            search: "",
            category: "",
            source: "",
            author: ""
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                News Aggregator Hub
                            </h1>
                        </div>

                        <nav className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Welcome back!
                  </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => console.log('Navigate to dashboard')}
                                    >
                                        Dashboard
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsAuthenticated(false)}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsAuthenticated(true)}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => console.log('Navigate to register')}
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-6">
                    {/* 🔎 Filters */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Filter Articles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    placeholder="Search articles..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                />

                                <Select
                                    value={filters.category || undefined}
                                    onValueChange={(value) => handleFilterChange("category", value || "")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.slug || c.id.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.source || undefined}
                                    onValueChange={(value) => handleFilterChange("source", value || "")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sources</SelectItem>
                                        {sources.map((s) => (
                                            <SelectItem key={s.id} value={s.slug || s.name || s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.author || undefined}
                                    onValueChange={(value) => handleFilterChange("author", value || "")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Authors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Authors</SelectItem>
                                        {authors.map((a) => (
                                            <SelectItem key={a.id} value={a.slug || a.name || a.id.toString()}>
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={applyFilters} disabled={loading}>
                                    {loading ? "Loading..." : "Apply Filters"}
                                </Button>
                                <Button variant="outline" onClick={resetFilters}>
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 📰 Articles */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="rounded-xl shadow-sm">
                                    <CardHeader className="p-3">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <Skeleton className="h-28 w-full mx-3 rounded" />
                                    <CardContent className="p-3 space-y-2">
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
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Found {articles.length} article{articles.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {articles.map((article) => (
                                            <Card
                                                key={article.id}
                                                className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-slate-200 dark:border-slate-700"
                                            >
                                                {article.image_url && (
                                                    <div className="relative">
                                                        <img
                                                            src={article.image_url}
                                                            alt={article.title}
                                                            className="w-full h-32 object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
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
                                                    <CardTitle className="text-sm font-semibold line-clamp-3 leading-tight">
                                                        <a
                                                            href={article.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-blue-600 transition-colors"
                                                        >
                                                            {article.title}
                                                        </a>
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="p-3 pt-0 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                                    {article.summary && (
                                                        <p className="line-clamp-3 text-slate-500 dark:text-slate-400">
                                                            {article.summary}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {article.category?.name && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {article.category.name}
                                                            </Badge>
                                                        )}
                                                        {article.source?.name && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {article.source.name}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
                        <span className="truncate flex-1">
                          {article.author?.name || 'Unknown Author'}
                        </span>
                                                        {article.published_at && (
                                                            <span className="ml-2 flex-shrink-0">
                            {formatDate(article.published_at)}
                          </span>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Card className="text-center py-12 shadow-sm">
                                    <CardContent>
                                        <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                                            Try adjusting your search criteria or reset filters
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
