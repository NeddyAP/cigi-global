import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit, CommunityClub, Media } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import React, { useState } from 'react';

interface MediaEditProps {
    media: Media;
    businessUnits: BusinessUnit[];
    communityClubs: CommunityClub[];
}

export default function MediaEdit({ media, businessUnits, communityClubs }: MediaEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Manajer Media', href: '/admin/media' },
        { title: media.title || media.original_filename, href: `/admin/media/${media.id}` },
        { title: 'Ubah', href: `/admin/media/${media.id}/edit` },
    ];

    const [selectedTags, setSelectedTags] = useState<string[]>(media.tags || []);

    const { data, setData, put, processing, errors } = useForm({
        title: media.title || '',
        alt_text: media.alt_text || '',
        description: media.description || '',
        tags: media.tags || [],
        show_homepage: media.show_homepage || false,
    });

    const handleTagToggle = (tag: string) => {
        const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];

        setSelectedTags(newTags);
        setData('tags', newTags);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.media.update', media.id), {
            onSuccess: () => {
                // Redirect to media index after successful update
                router.visit(route('admin.media.index'));
            },
        });
    };

    const renderPreview = () => {
        if (media.is_image) {
            return (
                <div className="relative">
                    <img
                        src={media.url || media.thumbnail_url}
                        alt={media.alt_text || media.title || media.original_filename}
                        className="max-h-64 w-full rounded-lg bg-zinc-800 object-contain"
                        onError={(e) => {
                            console.error('Image failed to load:', media.url);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    {media.dimensions && (
                        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-3 py-1 text-sm text-white backdrop-blur">
                            {media.dimensions.width} × {media.dimensions.height}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="flex h-48 items-center justify-center rounded-lg bg-zinc-800">
                <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-zinc-400" />
                    <p className="mt-2 text-sm text-zinc-300">{media.original_filename?.split('.').pop()?.toUpperCase()} File</p>
                    <p className="text-xs text-zinc-500">{media.human_size}</p>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ubah - ${media.title || media.original_filename}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Ubah Media</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Perbarui detail dan properti file media</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <Link href={route('admin.media.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Media
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Preview */}
                    <div className="lg:col-span-1">
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Pratinjau</h3>
                            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Pratinjau file media saat ini</p>
                            {renderPreview()}

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">Nama file:</span>
                                    <span className="font-medium text-white">{media.original_filename}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">Ukuran file:</span>
                                    <span className="font-medium text-amber-400">{media.human_size}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">Status Homepage:</span>
                                    <span className={`font-medium ${media.show_homepage ? 'text-green-400' : 'text-red-400'}`}>
                                        {media.show_homepage ? 'Ditampilkan' : 'Tidak Ditampilkan'}
                                    </span>
                                </div>

                                {media.url && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">URL:</span>
                                        <span className="truncate text-xs font-medium text-blue-400">{media.url}</span>
                                    </div>
                                )}

                                {media.dimensions && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">Dimensi:</span>
                                        <span className="font-medium text-white">
                                            {media.dimensions.width} × {media.dimensions.height}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Ubah Detail</h3>
                            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                                Perbarui informasi file media. Catatan: File sebenarnya tidak dapat diubah, hanya metadata.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title" className="text-zinc-300">
                                        Judul
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Masukkan judul yang deskriptif"
                                        className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                    <p className="mt-1 text-xs text-zinc-500">Judul yang mudah dibaca untuk file media ini</p>
                                </div>

                                {media.is_image && (
                                    <div>
                                        <Label htmlFor="alt_text" className="text-zinc-300">
                                            Teks Alt
                                        </Label>
                                        <Input
                                            id="alt_text"
                                            value={data.alt_text}
                                            onChange={(e) => setData('alt_text', e.target.value)}
                                            placeholder="Jelaskan gambar untuk aksesibilitas"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        {errors.alt_text && <p className="mt-1 text-sm text-red-400">{errors.alt_text}</p>}
                                        <p className="mt-1 text-xs text-zinc-500">Teks alternatif untuk pembaca layar dan aksesibilitas</p>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="description" className="text-zinc-300">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Masukkan deskripsi detail file media"
                                        rows={4}
                                        className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                    <p className="mt-1 text-xs text-zinc-500">Deskripsi detail opsional dari konten media</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="show_homepage"
                                        checked={data.show_homepage}
                                        onCheckedChange={(checked) => setData('show_homepage', !!checked)}
                                        className="border-zinc-600 bg-zinc-800 text-amber-400"
                                    />
                                    <Label htmlFor="show_homepage" className="text-zinc-500">
                                        Tampilkan di Halaman Home
                                    </Label>
                                </div>
                                <p className="text-xs text-zinc-500">Jika dicentang, gambar ini akan ditampilkan di galeri halaman home</p>
                                <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                                    <p className="text-xs text-amber-400">
                                        💡 <strong>Tips:</strong> Gunakan fitur ini untuk menampilkan gambar terbaik dan representatif di halaman
                                        utama website
                                    </p>
                                </div>

                                {/* Tag Selection */}
                                <div>
                                    <Label className="text-zinc-300">Tags</Label>
                                    <div className="mt-2 space-y-4">
                                        {/* Business Units */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium text-amber-400">Business Units</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {businessUnits.map((unit) => (
                                                    <label key={unit.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={selectedTags.includes(unit.name)}
                                                            onCheckedChange={() => handleTagToggle(unit.name)}
                                                            className="border-zinc-600 bg-zinc-800 text-amber-400"
                                                        />
                                                        <span className="text-sm text-zinc-300">{unit.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Community Clubs */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium text-amber-400">Community Clubs</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {communityClubs.map((club) => (
                                                    <label key={club.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={selectedTags.includes(club.name)}
                                                            onCheckedChange={() => handleTagToggle(club.name)}
                                                            className="border-zinc-600 bg-zinc-800 text-amber-400"
                                                        />
                                                        <span className="text-sm text-zinc-300">{club.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
                                        <p className="text-xs text-zinc-500">Pilih unit bisnis dan komunitas yang relevan untuk media ini</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-6">
                                    <Button type="submit" disabled={processing} className="cta-button flex-1">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                    >
                                        <Link href={route('admin.media.index')}>Batal</Link>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
