import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, News } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Edit, Eye, Image, Star, Tag, Trash2, User } from 'lucide-react';

interface ShowNewsProps {
    news: News;
}

export default function ShowNews({ news }: ShowNewsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Berita', href: '/admin/news' },
        { title: news.title, href: `/admin/news/${news.slug}` },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${news.title}"?`)) {
            router.delete(route('admin.news.destroy', news.slug));
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            bisnis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            komunitas: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            umum: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            pengumuman: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            acara: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            prestasi: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        };
        return colors[category as keyof typeof colors] || colors.umum;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTags = (tags: string | string[]): string[] => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        return tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${news.title}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{news.title}</h1>
                            {news.is_featured && <Star className="h-6 w-6 text-yellow-500" />}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Detail artikel dan informasi</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.news.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.news.edit', news.slug)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Article Header */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="px-6 py-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCategoryColor(news.category)}`}>
                                        {news.category}
                                    </span>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Eye className="mr-1 h-4 w-4" />
                                            {news.views_count || 0} views
                                        </div>
                                        <div className="flex items-center">
                                            {news.is_published ? (
                                                <>
                                                    <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                                                    <span className="text-green-600 dark:text-green-400">Published</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                                    <span className="text-yellow-600 dark:text-yellow-400">Draft</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{news.title}</h1>

                                <div className="mb-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <User className="mr-1 h-4 w-4" />
                                        {news.author?.name || 'Unknown Author'}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {news.published_at ? formatDate(news.published_at) : formatDate(news.created_at)}
                                    </div>
                                </div>

                                {news.excerpt && (
                                    <div className="mb-6 border-l-4 border-indigo-500 pl-4 text-lg text-gray-600 dark:text-gray-300">
                                        {news.excerpt}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Featured Image */}
                        {news.featured_image && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                        <Image className="mr-2 h-5 w-5" />
                                        Gambar Unggulan
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    <img
                                        src={`/${news.featured_image}`}
                                        alt={news.title}
                                        className="w-full rounded-lg object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Konten Artikel</h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-900 dark:text-white">{news.content}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {news.tags && formatTags(news.tags).length > 0 && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                        <Tag className="mr-2 h-5 w-5" />
                                        Tags
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {formatTags(news.tags).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statistik</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Eye className="mr-2 h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{news.views_count || 0}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Star className="mr-2 h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Featured</span>
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${news.is_featured ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {news.is_featured ? 'Ya' : 'Tidak'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${news.is_published ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                                    >
                                        {news.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Publication Info */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Publikasi</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penulis</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{news.author?.name || 'Unknown'}</p>
                                    {news.author?.email && <p className="text-xs text-gray-500 dark:text-gray-400">{news.author.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                                    <p className="mt-1 text-sm capitalize text-gray-900 dark:text-white">{news.category}</p>
                                </div>

                                {news.published_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Publikasi</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(news.published_at)}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dibuat</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(news.created_at)}</p>
                                </div>

                                {news.updated_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Terakhir Diupdate</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(news.updated_at)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO Info */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">SEO & URL</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug URL</label>
                                    <p className="mt-1 break-all font-mono text-sm text-gray-900 dark:text-white">{news.slug}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                                    <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{news.id}</p>
                                </div>

                                {news.featured_image && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured Image Path</label>
                                        <p className="mt-1 break-all font-mono text-sm text-gray-900 dark:text-white">{news.featured_image}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aksi Cepat</h3>
                            </div>
                            <div className="space-y-3 px-6 py-4">
                                <Link href={route('admin.news.edit', news.id)} className="block">
                                    <Button className="w-full" variant="outline">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Artikel
                                    </Button>
                                </Link>

                                <Button className="w-full" variant="outline" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Artikel
                                </Button>

                                <Link href={route('admin.news.create')} className="block">
                                    <Button className="w-full">Buat Artikel Baru</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
