import { useForm } from '@inertiajs/react';
import { X, Key, Save} from 'lucide-react';
import React from 'react';
import axios from 'axios'
import { NewsSource } from '@/types';

const UpdateSourceModal = ({
    source,
    isOpen,
    onClose,
}: {
    source: NewsSource | null;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { data, setData, processing, errors, reset } = useForm({
        name: source?.name || '',
        base_url: source?.base_url || '',
        api_key: source?.api_key || '',
        is_active: source?.is_active ?? true,
    });

    React.useEffect(() => {
        if (source) {
            setData({
                name: source.name ?? '',
                base_url: source.base_url ?? '',
                api_key: source.api_key || '',
                is_active: source.is_active,
            });
        }
    }, [source]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!source) return;

        try {
            await axios.put(`/api/v1/news-sources/${source.id}`, {
                base_url: data.base_url,
                api_key: data.api_key,
                is_active: data.is_active,
            });

            onClose();
            reset();
        } catch (error: any) {
            console.error("Update failed:", error.response?.data || error);
            // Show error message to the user if needed
        }
    };

    if (!isOpen || !source) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-xl dark:border-sidebar-border dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Update News Source
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Source Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Source Name
                        </label>
                        <input
                            type="text"
                            value={data.name ?? ''}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Base URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Base URL
                        </label>
                        <input
                            type="url"
                            value={data.base_url ?? ''}
                            onChange={(e) =>
                                setData('base_url', e.target.value)
                            }
                            placeholder="https://api.example.com"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                        {errors.base_url && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.base_url}
                            </p>
                        )}
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Key className="h-4 w-4" />
                            API Key
                        </label>
                        <input
                            type="password"
                            value={data.api_key ?? ''}
                            onChange={(e) => setData('api_key', e.target.value)}
                            placeholder="Enter API key (optional)"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.api_key && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.api_key}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Leave empty if no API key is required
                        </p>
                    </div>

                    {/* Is Active Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Active (Enable fetching from this source)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UpdateSourceModal;
