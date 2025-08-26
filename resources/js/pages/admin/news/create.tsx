import { FormSection } from '@/components/admin/form-section';
import { LoadingButton } from '@/components/admin/loading-button';
import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Image, Tag, User as UserIcon } from 'lucide-react';

interface CreateNewsProps {
    auth: {
        user: User;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Berita', href: '/admin/news' },
    { title: 'Tulis Baru', href: '/admin/news/create' },
];

const newsCategories = [
    { value: 'umum', label: 'Umum' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'komunitas', label: 'Komunitas' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'acara', label: 'Acara' },
    { value: 'prestasi', label: 'Prestasi' },
];

export default function CreateNews({ auth }: CreateNewsProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        category: 'umum',
        is_featured: false,
        is_published: false,
        published_at: '',
        author_id: auth.user.id,
        tags: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.news.store'));
    };

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setData('title', value);
        if (!data.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', slug);
        }
    };

    // Auto-generate excerpt from content
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
            <Head title="Tulis Berita Baru" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tulis Berita Baru</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Buat artikel atau berita baru untuk website</p>
                    </div>
                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.news.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            <FormSection title="Konten Artikel" description="Informasi utama artikel" icon={<UserIcon className="h-5 w-5" />}>
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
                                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                        Tip: Gunakan markdown atau HTML untuk formatting yang lebih baik
                                    </p>
                                </div>
                            </FormSection>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <FormSection title="Pengaturan Publish" description="Status dan jadwal publikasi" icon={<Calendar className="h-5 w-5" />}>
                                <div className="flex items-center space-x-3">
                                    <Toggle
                                        pressed={data.is_published}
                                        onPressedChange={(pressed) => setData('is_published', pressed)}
                                        aria-label="Publikasikan Artikel"
                                    >
                                        {data.is_published ? 'Terbitkan' : 'Draf'}
                                    </Toggle>
                                    <Label>Status Publikasi</Label>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Toggle
                                        pressed={data.is_featured}
                                        onPressedChange={(pressed) => setData('is_featured', pressed)}
                                        aria-label="Artikel Unggulan"
                                    >
                                        {data.is_featured ? 'Unggulan' : 'Normal'}
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
                            </FormSection>

                            {/* Category & Tags */}
                            <FormSection title="Kategori & Tag" description="Organisasi dan kategorisasi artikel" icon={<Tag className="h-5 w-5" />}>
                                <div>
                                    <Label htmlFor="category">Kategori *</Label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.category ? 'border-red-500' : ''}`}
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
                                        onChange={(e) => setData('tags', e.target.value)}
                                        placeholder="cigi global, komunitas, olahraga"
                                        className={errors.tags ? 'border-red-500' : ''}
                                    />
                                    {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                                </div>
                            </FormSection>

                            {/* Featured Image */}
                            <FormSection title="Gambar Unggulan" description="Gambar utama artikel" icon={<Image className="h-5 w-5" />}>
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
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Gambar akan ditampilkan di halaman listing dan detail artikel
                                </p>
                            </FormSection>

                            {/* Author Info */}
                            <FormSection title="Penulis" description="Informasi penulis artikel" icon={<UserIcon className="h-5 w-5" />}>
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{auth.user.name}</div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{auth.user.email}</div>
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.news.index')}>Batal</a>
                        </Button>
                        <LoadingButton type="submit" loading={processing} loadingText="Menyimpan..." icon="save" className="cta-button">
                            {data.is_published ? 'Publish Artikel' : 'Simpan Draft'}
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
