import { FormSection } from '@/components/admin/form-section';
import { LoadingButton } from '@/components/admin/loading-button';
import MediaUploadZone from '@/components/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit, CommunityClub } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileText, FolderOpen, Tags, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/admin' },
    { title: 'Manajer Media', href: '/admin/media' },
    { title: 'Unggah Berkas', href: '/admin/media/create' },
];

interface MediaUploadProps {
    businessUnits: BusinessUnit[];
    communityClubs: CommunityClub[];
}

export default function MediaUpload({ businessUnits, communityClubs }: MediaUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const MAX_FILES = 20;
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [altText, setAltText] = useState('');
    const [description, setDescription] = useState('');
    const [showHomepage, setShowHomepage] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (files: File[]) => {
        // Append new files but enforce a global maximum
        setError(null); // Clear any previous errors
        setSelectedFiles((prev) => {
            const remaining = MAX_FILES - prev.length;
            if (remaining <= 0) {
                setError(`Maksimal ${MAX_FILES} berkas dapat diunggah.`);
                return prev;
            }

            if (files.length > remaining) {
                setError(
                    `Hanya ${remaining} dari ${files.length} berkas yang akan tersimpan. batas maksimum berkas yang dapat diunggah adalah ${MAX_FILES}.`,
                );
                return [...prev, ...files.slice(0, remaining)];
            }

            return [...prev, ...files];
        });
    };

    // Clear any limit-related error once the selected files are strictly below the allowed limit
    // (keep the warning visible when a batch add is truncated to exactly MAX_FILES)
    useEffect(() => {
        if (selectedFiles.length < MAX_FILES) {
            setError(null);
        }
    }, [selectedFiles]);

    const handleTagToggle = (tag: string) => {
        const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];

        setSelectedTags(newTags);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            setError('Mohon pilih setidaknya satu berkas untuk diunggah.');
            return;
        }

        if (selectedFiles.length > MAX_FILES) {
            setError(`Maksimal ${MAX_FILES} berkas yang dapat diunggah.`);
            return;
        }

        setProcessing(true);
        setError(null);

        // Create FormData to properly handle file uploads
        const formData = new FormData();

        // Add files
        selectedFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        // Add other form data
        formData.append('title', title);
        formData.append('alt_text', altText);
        formData.append('description', description);
        formData.append('show_homepage', showHomepage ? '1' : '0');

        // Add tags
        selectedTags.forEach((tag) => {
            formData.append('tags[]', tag);
        });

        // Use router to post the form data
        router.post(route('admin.media.store'), formData, {
            onSuccess: () => {
                toast.success('Unggah berhasil');
                setProcessing(false);
            },
            onError: (errors) => {
                toast.error('Gagal mengunggah' + errors);
                setProcessing(false);
                setError('Gagal mengunggah. Mohon periksa konsol untuk detail.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unggah Berkas Media" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Unggah Berkas Media</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Unggah beberapa berkas ke pustaka media Anda</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.media.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Media
                        </a>
                    </Button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Upload Zone */}
                        <div className="lg:col-span-2">
                            <div className="mb-3">
                                <FormSection title="Pilih Berkas" description="Pilih berkas untuk diunggah" icon={<Upload className="h-5 w-5" />}>
                                    <MediaUploadZone
                                        onUpload={handleFilesSelected}
                                        acceptedTypes={['image/*']}
                                        maxFileSize={10}
                                        multiple={true}
                                        disabled={processing}
                                    />
                                </FormSection>
                            </div>

                            {/* File Preview */}
                            {selectedFiles.length > 0 && (
                                <FormSection title="Berkas Terpilih" description="Berkas siap diunggah" icon={<FolderOpen className="h-5 w-5" />}>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="group relative rounded-lg border border-zinc-700 bg-zinc-800 p-3">
                                                {file.type.startsWith('image/') ? (
                                                    <div className="aspect-square overflow-hidden rounded bg-zinc-900">
                                                        <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="flex aspect-square items-center justify-center rounded bg-zinc-900">
                                                        <FileText className="h-8 w-8 text-zinc-400" />
                                                    </div>
                                                )}
                                                <div className="mt-2">
                                                    <p className="truncate text-xs text-zinc-300">{file.name}</p>
                                                    <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedFiles((prev) => {
                                                            const next = prev.filter((_, i) => i !== index);
                                                            if (next.length < MAX_FILES) setError(null);
                                                            return next;
                                                        })
                                                    }
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </FormSection>
                            )}
                        </div>

                        {/* Metadata and Tags */}
                        <div className="space-y-6">
                            <FormSection
                                title="Informasi Berkas"
                                description="Pengaturan default untuk berkas yang diunggah"
                                icon={<FileText className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-zinc-300">
                                            Judul Default
                                        </Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Judul default opsional untuk semua berkas"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Jika disediakan, ini akan digunakan sebagai judul default untuk semua berkas yang diunggah
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="alt_text" className="text-zinc-300">
                                            Teks Alt Default
                                        </Label>
                                        <Input
                                            id="alt_text"
                                            value={altText}
                                            onChange={(e) => setAltText(e.target.value)}
                                            placeholder="Teks alt default opsional untuk gambar"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        <p className="mt-1 text-xs text-zinc-500">Teks alt untuk aksesibilitas (hanya gambar)</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-zinc-300">
                                            Deskripsi Default
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Deskripsi default opsional"
                                            rows={3}
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_homepage"
                                            checked={showHomepage}
                                            onCheckedChange={(checked) => setShowHomepage(!!checked)}
                                            className="border-zinc-600 bg-zinc-800 text-amber-400"
                                        />
                                        <Label htmlFor="show_homepage" className="text-zinc-300">
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
                                </div>
                            </FormSection>

                            {/* Tag Selection */}
                            <FormSection
                                title="Tag"
                                description="Pilih unit bisnis dan klub komunitas yang relevan"
                                icon={<Tags className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    {/* Unit Bisnis */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-medium text-amber-400">Unit Bisnis</h4>
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

                                    {/* Klub Komunitas */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-medium text-amber-400">Klub Komunitas</h4>
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
                                </div>
                            </FormSection>

                            {/* Upload Button */}
                            {selectedFiles.length > 0 && (
                                <div className="pt-4">
                                    <LoadingButton
                                        type="submit"
                                        loading={processing}
                                        loadingText="Mengunggah..."
                                        disabled={selectedFiles.length === 0 || processing}
                                        className="cta-button w-full"
                                        icon="save"
                                    >
                                        {processing ? 'Mengunggah...' : `Unggah ${selectedFiles.length} Berkas`}
                                    </LoadingButton>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Instructions */}
                    <div className="section-card p-6">
                        <h4 className="mb-3 font-semibold text-amber-400">Panduan Unggah</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Ukuran berkas maksimum: 10MB per berkas
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Gambar akan dioptimalkan secara otomatis
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Didukung: Gambar, JPG, JPEG, PNG, Webp
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Edit detail berkas individual setelah diunggah
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
