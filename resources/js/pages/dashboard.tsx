import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
    Newspaper,
    Star,
    Calendar,
    Globe,
    ArrowUp,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
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
        articles_count: number;
        last_updated: string;
    }>;
}

const StatCard = ({
                      title,
                      value,
                      icon: Icon,
                      color = "blue",
                      change,
                      changeType = "positive"
                  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color?: "blue" | "green" | "yellow" | "purple";
    change?: string;
    changeType?: "positive" | "negative";
}) => {
    const colorClasses = {
        blue: 'bg-blue-500 text-blue-100',
        green: 'bg-green-500 text-green-100',
        yellow: 'bg-yellow-500 text-yellow-100',
        purple: 'bg-purple-500 text-purple-100',
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {change && (
                        <p className={`flex items-center text-sm ${
                            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            <ArrowUp className="mr-1 h-4 w-4" />
                            {change}
                        </p>
                    )}
                </div>
                <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {children}
    </div>
);

export default function Dashboard({ stats, sourceStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Articles"
                        value={stats.totalArticles.toLocaleString()}
                        icon={Newspaper}
                        color="blue"
                        change="+12% from last month"
                    />
                    <StatCard
                        title="News Sources"
                        value={stats.totalSources}
                        icon={Globe}
                        color="green"
                        change="+2 new sources"
                    />
                    <StatCard
                        title="Featured Articles"
                        value={stats.featuredArticles}
                        icon={Star}
                        color="yellow"
                        change="+8% this week"
                    />
                    <StatCard
                        title="Today's Articles"
                        value={stats.todayArticles}
                        icon={Calendar}
                        color="purple"
                        change="+15 since yesterday"
                    />
                </div>

                {/* Source Statistics */}
                <ChartCard title="News Sources Overview">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Source
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Articles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Last Updated
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {sourceStats.map((source) => (
                                <tr key={source.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <Globe className="mr-3 h-5 w-5 text-gray-400" />
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {source.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {source.type}
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {source.articles_count.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {source.last_updated}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </ChartCard>
            </div>
        </AppLayout>
    );
}
