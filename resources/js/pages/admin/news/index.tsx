import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, News } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2, Star, Clock, Users } from 'lucide-react';

interface AdminNewsIndexProps {
    news: {
        data: News[];
        links: any;
        meta: any;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Berita', href: '/admin/news' },
];

export default function AdminNewsIndex({ news }: AdminNewsIndexProps) {
    const handleDelete = (newsItem: News) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${newsItem.title}"?`)) {
            router.delete(route('admin.news.destroy', newsItem.id));
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'bisnis': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'komunitas': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'umum': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            'pengumuman': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'acara': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        };
        return colors[category as keyof typeof colors] || colors.umum;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Berita" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kelola Berita</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola semua artikel dan berita Cigi Global</p>
                    </div>
                    <Link href={route('admin.news.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tulis Berita
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Artikel
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {news.data.map((newsItem) => (
                                    <tr key={newsItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                {newsItem.featured_image && (
                                                    <div className="h-12 w-16 flex-shrink-0 mr-4">
                                                        <img 
                                                            className="h-12 w-16 rounded object-cover" 
                                                            src={`/${newsItem.featured_image}`} 
                                                            alt={newsItem.title} 
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                            {newsItem.title}
                                                        </div>
                                                        {newsItem.is_featured && (
                                                            <Star className="ml-2 h-4 w-4 text-yellow-500 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    {newsItem.excerpt && (
                                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                            {newsItem.excerpt}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                        {newsItem.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCategoryColor(newsItem.category)}`}>
                                                {newsItem.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {newsItem.author?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {newsItem.is_published ? (
                                                    <>
                                                        <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                                                        <span className="text-sm text-green-600 dark:text-green-400">Dipublikasi</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                                        <span className="text-sm text-yellow-600 dark:text-yellow-400">Draft</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {newsItem.published_at ? formatDate(newsItem.published_at) : formatDate(newsItem.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Users className="h-4 w-4 mr-1" />
                                                {newsItem.views_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('admin.news.show', newsItem.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.news.edit', newsItem.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(newsItem)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {news.data.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="text-gray-500 dark:text-gray-400">Belum ada berita yang terdaftar.</div>
                                <Link href={route('admin.news.create')} className="mt-4 inline-block">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tulis Berita Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {news.data.length > 0 && news.meta && news.meta.last_page > 1 && (
                        <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    {news.links.prev && (
                                        <Link
                                            href={news.links.prev}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Sebelumnya
                                        </Link>
                                    )}
                                    {news.links.next && (
                                        <Link
                                            href={news.links.next}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Selanjutnya
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Menampilkan <span className="font-medium">{news.meta.from}</span> sampai{' '}
                                            <span className="font-medium">{news.meta.to}</span> dari{' '}
                                            <span className="font-medium">{news.meta.total}</span> hasil
                                        </p>
                                    </div>
                                    <div className="flex space-x-1">
                                        {news.links.prev && (
                                            <Link
                                                href={news.links.prev}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                            >
                                                ←
                                            </Link>
                                        )}
                                        {news.links.next && (
                                            <Link
                                                href={news.links.next}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                            >
                                                →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
