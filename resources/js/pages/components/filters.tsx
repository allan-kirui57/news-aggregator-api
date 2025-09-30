import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Author, Category, NewsSource } from '@/types';

interface FilterProps {
    filters: { search: string; category: string; source: string; author: string };
    categories: Category[];
    sources: NewsSource[];
    authors: Author[];
    loading: boolean;
    onChange: (key: string, value: string) => void;
    onApply: () => void;
    onReset: () => void;
}

export default function Filters({
                                    filters,
                                    categories,
                                    sources,
                                    authors,
                                    loading,
                                    onChange,
                                    onApply,
                                    onReset,
                                }: FilterProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filter Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Input
                        placeholder="Search articles..."
                        value={filters.search}
                        onChange={(e) => onChange("search", e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && onApply()}
                    />

                    <Select
                        value={filters.category || undefined}
                        onValueChange={(v) => onChange("category", v || "")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.source || undefined}
                        onValueChange={(v) => onChange("source", v || "")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Sources" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {sources.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.author || undefined}
                        onValueChange={(v) => onChange("author", v || "")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Authors" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Authors</SelectItem>
                            {authors.map((a) => (
                                <SelectItem key={a.id} value={String(a.id)}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onApply} disabled={loading}>
                        {loading ? "Loading..." : "Apply Filters"}
                    </Button>
                    <Button variant="outline" onClick={onReset}>
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
