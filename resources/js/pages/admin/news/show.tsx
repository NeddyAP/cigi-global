import { FormSection } from '@/components/admin/form-section';
import { InfoGrid, InfoItem } from '@/components/admin/info-display';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, News } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Edit, Eye, Plus, Star, Tag, Trash2, User, Users } from 'lucide-react';
import React from 'react';

interface ShowNewsProps {
    news: News;
}

export default function ShowNews({ news }: ShowNewsProps) {
    const [deleting, setDeleting] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Berita', href: '/admin/news' },
        { title: news.title, href: `/admin/news/${news.slug}` },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${news.title}"?`)) {
            setDeleting(true);
            router.delete(route('admin.news.destroy', news.slug), {
                onFinish: () => setDeleting(false),
            });
        }
    };

    const handleShare = async () => {
        const url = route('news.show', news.slug);
        if (navigator.share) {
            await navigator.share({
                title: news.title,
                text: news.excerpt,
                url: url,
            });
        } else {
            await navigator.clipboard.writeText(url);
            // Could add toast notification here
        }
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
                        {/* Featured Image */}
                        {news.featured_image && (
                            <FormSection title="Gambar Unggulan" className="overflow-hidden">
                                <div className="-mx-6 -mb-4">
                                    <img
                                        src={`/${news.featured_image}`}
                                        alt={news.title}
                                        className="h-64 w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </FormSection>
                        )}

                        {/* Article Content */}
                        <FormSection title="Konten Artikel">
                            <div className="prose prose-zinc dark:prose-invert max-w-none">
                                <div className="leading-relaxed whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">{news.content}</div>
                            </div>
                        </FormSection>

                        {/* Tags */}
                        {news.tags && formatTags(news.tags).length > 0 && (
                            <FormSection title="Tags">
                                <div className="flex flex-wrap gap-2">
                                    {formatTags(news.tags).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400"
                                        >
                                            <Tag className="mr-1 h-3 w-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </FormSection>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <FormSection title="Aksi Cepat">
                            <div className="space-y-3">
                                <Button asChild className="cta-button w-full justify-start">
                                    <Link href={route('admin.news.edit', news.slug)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Artikel
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                >
                                    <a href={route('news.show', news.slug)} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat di Website
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                >
                                    <Link href={route('admin.news.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Artikel Baru
                                    </Link>
                                </Button>
                            </div>
                        </FormSection>

                        {/* Article Stats */}
                        <FormSection title="Statistik & Info">
                            <InfoGrid cols={1}>
                                <InfoItem label="Views" value={news.views_count || 0} icon={<Users className="h-4 w-4" />} />
                                <InfoItem
                                    label="Status"
                                    value={<StatusBadge status={news.is_published ? 'published' : 'draft'} />}
                                    icon={<Clock className="h-4 w-4" />}
                                />
                                <InfoItem label="Kategori" value={<StatusBadge status={news.category} />} icon={<Tag className="h-4 w-4" />} />
                                {news.is_featured && (
                                    <InfoItem label="Featured" value={<StatusBadge status="featured" />} icon={<Star className="h-4 w-4" />} />
                                )}
                                <InfoItem label="Penulis" value={news.author?.name || 'Admin'} icon={<User className="h-4 w-4" />} />
                                <InfoItem label="Dibuat" value={news.created_at} type="datetime" icon={<Calendar className="h-4 w-4" />} />
                                {news.published_at && (
                                    <InfoItem label="Dipublikasi" value={news.published_at} type="datetime" icon={<Calendar className="h-4 w-4" />} />
                                )}
                                <InfoItem label="Slug URL" value={news.slug} copyable className="font-mono text-xs" />
                            </InfoGrid>
                        </FormSection>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
