import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";

interface ArticlesGridProps {
    articles: Article[];
    loading: boolean;
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function ArticlesGrid({
                                         articles,
                                         loading,
                                         currentPage,
                                         lastPage,
                                         onPageChange,
                                     }: ArticlesGridProps) {
    const formatDate = (date?: string) =>
        date
            ? new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : "";

    if (loading) {
        return (
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
        );
    }

    if (articles.length === 0) {
        return (
            <Card className="py-12 text-center shadow-sm">
                <CardContent>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        No articles found
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Page {currentPage} of {lastPage} — {articles.length} articles
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-md dark:border-slate-700">
                        {article.image_url && (
                            <div className="relative">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="h-32 w-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                                {article.is_featured && (
                                    <Badge className="absolute top-2 left-2 text-xs">Featured</Badge>
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

                            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] dark:border-slate-600">
                                <span className="truncate">
                                    {article.author?.name || "Unknown Author"}
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

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
