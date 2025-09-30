import ArticlesGrid from '@/pages/components/articles-grid';
import Filters from '@/pages/components/filters';
import { dashboard, login, register } from '@/routes';
import { Article, Author, Category, NewsSource, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function ArticlesList() {
    const { auth } = usePage<SharedData>().props;
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sources, setSources] = useState<NewsSource[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        source: '',
        author: '',
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchArticles = async (p = 1) => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v && v !== 'all'),
            );
            const query = new URLSearchParams({
                ...cleanFilters,
                page: p.toString(),
            });
            const res = await fetch(`/api/v1/articles?${query}`);
            const data = await res.json();
            setArticles(data.data || []);
            setPage(data.meta?.current_page || p);
            setLastPage(data.meta?.last_page || 1);
        } catch (e) {
            console.error(e);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const [catRes, srcRes, authRes] = await Promise.all([
                fetch('/api/v1/categories').then((r) => r.json()),
                fetch('/api/v1/news-sources').then((r) => r.json()),
                fetch('/api/v1/authors').then((r) => r.json()),
            ]);
            setCategories(catRes.data || catRes);
            setSources(srcRes.data || srcRes);
            setAuthors(authRes.data || authRes);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFilters();
        fetchArticles();
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        console.log(key)
        console.log(value)
        setFilters((prev) => ({ ...prev, [key]: value }));

    }

    const applyFilters = () => fetchArticles(1);

    const resetFilters = () => {
        setFilters({ search: '', category: '', source: '', author: '' });
        fetchArticles(1);
    };

    const handleLogout = () => {
        router.post(route('logout'));
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
                                auth.user.is_admin ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 px-5 py-1.5 text-sm text-[#1b1b18] bg-gray-200 rounded-2xl">
                                        <User className="h-4 w-4" />
                                        <span>{auth.user.name}</span>
                                        <button
                                            onClick={() =>
                                                handleLogout()
                                            }
                                            className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="h-3 w-3" />
                                            Logout
                                        </button>
                                    </div>
                                )
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

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <Filters
                    filters={filters}
                    categories={categories}
                    sources={sources}
                    authors={authors}
                    loading={loading}
                    onChange={handleFilterChange}
                    onApply={applyFilters}
                    onReset={resetFilters}
                />

                {/*TODO - Add trending Articles*/}
                {/*TODO - Add featured Articles*/}

                <ArticlesGrid
                    articles={articles}
                    loading={loading}
                    currentPage={page}
                    lastPage={lastPage}
                    onPageChange={fetchArticles}
                />
            </div>
        </div>
    );
}
