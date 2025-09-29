import { ArrowUp } from 'lucide-react';
import React from 'react';

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    change,
    changeType = 'positive',
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color?: 'blue' | 'green' | 'yellow' | 'purple';
    change?: string;
    changeType?: 'positive' | 'negative';
}) => {
    const colorClasses = {
        blue: 'bg-blue-800 text-blue-100',
        green: 'bg-green-800 text-green-100',
        yellow: 'bg-yellow-800 text-yellow-100',
        purple: 'bg-purple-800 text-purple-100',
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {change && (
                        <p
                            className={`flex items-center text-sm ${
                                changeType === 'positive'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }`}
                        >
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

export default StatCard;
