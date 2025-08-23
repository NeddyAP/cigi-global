import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, News, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface EditNewsProps {
    news: News;
    auth: {
        user: User;
    };
}

const newsCategories = [
    { value: 'umum', label: 'Umum' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'komunitas', label: 'Komunitas' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'acara', label: 'Acara' },
    { value: 'prestasi', label: 'Prestasi' },
];

export default function EditNews({ news, auth }: EditNewsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Berita', href: '/admin/news' },
        { title: news.title, href: `/admin/news/${news.slug}` },
        { title: 'Edit', href: `/admin/news/${news.slug}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: news.title || '',
        slug: news.slug || '',
        excerpt: news.excerpt || '',
        content: news.content || '',
        featured_image: news.featured_image || '',
        category: news.category || 'umum',
        is_featured: news.is_featured ?? false,
        is_published: news.is_published ?? false,
        published_at: news.published_at ? new Date(news.published_at).toISOString().slice(0, 16) : '',
        author_id: news.author_id || auth.user.id,
        tags: typeof news.tags === 'string' ? news.tags : Array.isArray(news.tags) ? news.tags.join(', ') : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.news.update', news.slug));
    };

    // Auto-generate slug from title if slug is empty
    const handleTitleChange = (value: string) => {
        setData('title', value);
        if (!data.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            setData('slug', slug);
        }
    };

    // Auto-generate excerpt from content if excerpt is empty
    const handleContentChange = (value: string) => {
        setData('content', value);
        if (!data.excerpt && value.length > 0) {
            // Extract first 150 characters as excerpt
            const excerpt = value.replace(/<[^>]*>/g, '').substring(0, 150);
            setData('excerpt', excerpt);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${news.title}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Artikel</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Edit artikel "{news.title}"</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('admin.news.show', news.slug)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Konten Artikel</h3>
                                </div>
                                <div className="space-y-4 px-6 py-4">
                                    <div>
                                        <Label htmlFor="title">Judul Artikel *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="Masukkan judul yang menarik"
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="slug">Slug URL *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="url-artikel-friendly"
                                            className={errors.slug ? 'border-red-500' : ''}
                                        />
                                        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="excerpt">Ringkasan</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="Ringkasan singkat artikel (opsional, akan dibuat otomatis dari konten)"
                                            rows={3}
                                            className={errors.excerpt ? 'border-red-500' : ''}
                                        />
                                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Konten Artikel *</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            placeholder="Tulis konten artikel di sini..."
                                            rows={15}
                                            className={errors.content ? 'border-red-500' : ''}
                                        />
                                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                                        <p className="mt-1 text-sm text-gray-500">Tip: Gunakan markdown atau HTML untuk formatting yang lebih baik</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pengaturan Publish</h3>
                                </div>
                                <div className="space-y-4 px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Toggle
                                            pressed={data.is_published}
                                            onPressedChange={(pressed) => setData('is_published', pressed)}
                                            aria-label="Publikasikan Artikel"
                                        >
                                            {data.is_published ? 'Published' : 'Draft'}
                                        </Toggle>
                                        <Label>Status Publikasi</Label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Toggle
                                            pressed={data.is_featured}
                                            onPressedChange={(pressed) => setData('is_featured', pressed)}
                                            aria-label="Artikel Unggulan"
                                        >
                                            {data.is_featured ? 'Featured' : 'Normal'}
                                        </Toggle>
                                        <Label>Artikel Unggulan</Label>
                                    </div>

                                    {data.is_published && (
                                        <div>
                                            <Label htmlFor="published_at">Tanggal Publikasi</Label>
                                            <Input
                                                id="published_at"
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={(e) => setData('published_at', e.target.value)}
                                                className={errors.published_at ? 'border-red-500' : ''}
                                            />
                                            {errors.published_at && <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>}
                                            <p className="mt-1 text-sm text-gray-500">Kosongkan untuk menggunakan waktu sekarang</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category & Tags */}
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kategori & Tag</h3>
                                </div>
                                <div className="space-y-4 px-6 py-4">
                                    <div>
                                        <Label htmlFor="category">Kategori *</Label>
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.category ? 'border-red-500' : ''}`}
                                        >
                                            {newsCategories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
                                        <Input
                                            id="tags"
                                            value={data.tags}
                                            onChange={(e) => setData('tags', e.target.value as string)}
                                            placeholder="cigi global, komunitas, olahraga"
                                            className={errors.tags ? 'border-red-500' : ''}
                                        />
                                        {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gambar Unggulan</h3>
                                </div>
                                <div className="space-y-4 px-6 py-4">
                                    <ImageInput
                                        label="Gambar Unggulan"
                                        name="featured_image"
                                        value={data.featured_image}
                                        onChange={(value) => setData('featured_image', value ? String(value) : '')}
                                        placeholder="Pilih atau upload gambar artikel"
                                        error={errors.featured_image}
                                        showPreview={true}
                                        autoUpload={true}
                                    />
                                    <p className="text-sm text-gray-500">Gambar akan ditampilkan di halaman listing dan detail artikel</p>
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Penulis</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {news.author?.name || auth.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{news.author?.email || auth.user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Article Stats */}
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statistik</h3>
                                </div>
                                <div className="space-y-3 px-6 py-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{news.views_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {new Date(news.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    {news.updated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Updated</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {new Date(news.updated_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild>
                            <a href={route('admin.news.show', news.slug)}>Batal</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : data.is_published ? 'Update & Publish' : 'Simpan Draft'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
