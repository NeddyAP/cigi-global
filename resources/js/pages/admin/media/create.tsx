import MediaUploadZone from '@/components/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Media Manager', href: '/admin/media' },
    { title: 'Upload Files', href: '/admin/media/create' },
];

interface Folder {
    id: number;
    name: string;
}

interface MediaUploadProps {
    folders: Folder[];
    selectedFolderId?: string;
}

export default function MediaUpload({ folders, selectedFolderId }: MediaUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        files: [] as File[],
        folder_id: selectedFolderId || 'root',
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
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload Media Files</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Upload multiple files to your media library</p>
                    </div>

                    <Button variant="outline" asChild>
                        <a href={route('admin.media.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Media
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Upload Zone */}
                        <div className="lg:col-span-2">
                            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Select Files</h3>

                                <MediaUploadZone
                                    onUpload={handleFilesSelected}
                                    acceptedTypes={['image/*', 'application/pdf', 'text/plain']}
                                    maxFileSize={10}
                                    multiple={true}
                                    disabled={processing}
                                />

                                {errors.files && <p className="mt-2 text-sm text-red-600">{errors.files}</p>}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-6">
                            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">File Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="folder_id">Destination Folder</Label>
                                        <Select value={data.folder_id} onValueChange={(value) => setData('folder_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select folder (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="root">Root Folder</SelectItem>
                                                {folders.map((folder) => (
                                                    <SelectItem key={folder.id} value={folder.id.toString()}>
                                                        {folder.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.folder_id && <p className="mt-1 text-sm text-red-600">{errors.folder_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="title">Default Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Optional default title for all files"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            If provided, this will be used as the default title for all uploaded files
                                        </p>
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="alt_text">Default Alt Text</Label>
                                        <Input
                                            id="alt_text"
                                            value={data.alt_text}
                                            onChange={(e) => setData('alt_text', e.target.value)}
                                            placeholder="Optional default alt text for images"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Alt text for accessibility (images only)</p>
                                        {errors.alt_text && <p className="mt-1 text-sm text-red-600">{errors.alt_text}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Default Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Optional default description"
                                            rows={3}
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Upload Summary */}
                            {selectedFiles.length > 0 && (
                                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Upload Summary</h3>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">{selectedFiles.length}</span> files selected
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total size:{' '}
                                            <span className="font-medium">
                                                {(selectedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </p>
                                    </div>

                                    <Button type="submit" disabled={processing || selectedFiles.length === 0} className="mt-4 w-full">
                                        {processing ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Instructions */}
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Upload Guidelines</h4>
                        <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                            <li>• Maximum file size: 10MB per file</li>
                            <li>• Supported formats: Images (JPEG, PNG, GIF, WebP, SVG), PDF, Text files</li>
                            <li>• Images will be automatically optimized and thumbnails generated</li>
                            <li>• You can edit individual file details after upload</li>
                        </ul>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
