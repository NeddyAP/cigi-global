import { FormSection } from '@/components/admin/form-section';
import { LoadingButton } from '@/components/admin/loading-button';
import MediaUploadZone from '@/components/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, FolderOpen, Upload } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Media Manager', href: '/admin/media' },
    { title: 'Upload Files', href: '/admin/media/create' },
];

interface MediaUploadProps {}

export default function MediaUpload({}: MediaUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        files: [] as File[],
        title: '',
        alt_text: '',
        description: '',
    });

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
        setData('files', files);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.media.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Media Files" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Upload Media Files</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Upload multiple files to your media library</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.media.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Media
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Upload Zone */}
                        <div className="lg:col-span-2">
                            <FormSection title="Select Files" description="Choose files to upload" icon={<Upload className="h-5 w-5" />}>
                                <MediaUploadZone
                                    onUpload={handleFilesSelected}
                                    acceptedTypes={['image/*', 'application/pdf', 'text/plain']}
                                    maxFileSize={10}
                                    multiple={true}
                                    disabled={processing}
                                />

                                {errors.files && <p className="mt-2 text-sm text-red-400">{errors.files}</p>}
                            </FormSection>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-6">
                            <FormSection
                                title="File Information"
                                description="Default settings for uploaded files"
                                icon={<FileText className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-zinc-300">
                                            Default Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Optional default title for all files"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        <p className="mt-1 text-xs text-zinc-500">
                                            If provided, this will be used as the default title for all uploaded files
                                        </p>
                                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="alt_text" className="text-zinc-300">
                                            Default Alt Text
                                        </Label>
                                        <Input
                                            id="alt_text"
                                            value={data.alt_text}
                                            onChange={(e) => setData('alt_text', e.target.value)}
                                            placeholder="Optional default alt text for images"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        <p className="mt-1 text-xs text-zinc-500">Alt text for accessibility (images only)</p>
                                        {errors.alt_text && <p className="mt-1 text-sm text-red-400">{errors.alt_text}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-zinc-300">
                                            Default Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Optional default description"
                                            rows={3}
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                    </div>
                                </div>
                            </FormSection>

                            {/* Upload Summary */}
                            {selectedFiles.length > 0 && (
                                <FormSection title="Upload Summary" description="Files ready for upload" icon={<FolderOpen className="h-5 w-5" />}>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-zinc-400">Files selected:</span>
                                            <span className="font-semibold text-amber-400">{selectedFiles.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-zinc-400">Total size:</span>
                                            <span className="font-semibold text-amber-400">
                                                {(selectedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>

                                    <LoadingButton
                                        type="submit"
                                        loading={processing}
                                        loadingText="Uploading..."
                                        disabled={selectedFiles.length === 0}
                                        className="cta-button mt-4 w-full"
                                        icon="save"
                                    >
                                        Upload {selectedFiles.length} Files
                                    </LoadingButton>
                                </FormSection>
                            )}
                        </div>
                    </div>

                    {/* Upload Instructions */}
                    <div className="section-card p-6">
                        <h4 className="mb-3 font-semibold text-amber-400">Upload Guidelines</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Maximum file size: 10MB per file
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Images will be automatically optimized
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Supported: Images, PDF, Text files
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <span className="mr-2 h-2 w-2 rounded-full bg-amber-400"></span>
                                    Edit individual file details after upload
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
