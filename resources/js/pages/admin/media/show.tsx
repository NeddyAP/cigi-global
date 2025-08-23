import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Copy, Download, Edit, ExternalLink, FileText, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface MediaShowProps {
    media: {
        id: number;
        filename: string;
        original_name: string;
        mime_type: string;
        size: number;
        human_size: string;
        url: string;
        thumbnail_url?: string;
        is_image: boolean;
        title?: string;
        alt_text?: string;
        description?: string;
        created_at: string;
        updated_at: string;
        dimensions?: {
            width: number;
            height: number;
        };
        metadata?: Record<string, unknown>;
        folder?: {
            id: number;
            name: string;
            slug: string;
        };
        uploader?: {
            id: number;
            name: string;
            email: string;
        };
    };
    folders?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export default function MediaShow({ media, folders = [] }: MediaShowProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Media Manager', href: '/admin/media' },
        { title: media.title || media.original_name, href: `/admin/media/${media.id}` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: media.title || '',
        alt_text: media.alt_text || '',
        description: media.description || '',
        folder_id: media.folder?.id?.toString() || '',
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.media.update', media.id), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setData({
            title: media.title || '',
            alt_text: media.alt_text || '',
            description: media.description || '',
            folder_id: media.folder?.id?.toString() || '',
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.media.destroy', media.id), {
            onSuccess: () => {
                router.visit(route('admin.media.index'));
            },
        });
    };

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(media.url);
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const renderPreview = () => {
        if (media.is_image) {
            return (
                <div className="relative">
                    <img
                        src={media.url}
                        alt={media.alt_text || media.title || media.original_name}
                        className="max-h-96 w-full rounded-lg object-contain"
                    />
                    {media.dimensions && (
                        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                            {media.dimensions.width} × {media.dimensions.height}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">{media.original_name.split('.').pop()?.toUpperCase()} File</p>
                    <p className="text-xs text-gray-400">{media.human_size}</p>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={media.title || media.original_name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{media.title || media.original_name}</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Media file details and properties</p>
                    </div>

                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <a href={route('admin.media.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Media
                            </a>
                        </Button>

                        {!isEditing && (
                            <Button variant="outline" onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        )}

                        <Button variant="outline" asChild>
                            <a href={media.url} download target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>

                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Preview */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
                            {renderPreview()}
                        </div>
                    </div>

                    {/* Details and Edit Form */}
                    <div className="space-y-6">
                        {/* File Information */}
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">File Information</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">File name:</span>
                                    <span className="font-medium">{media.original_name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">File size:</span>
                                    <span className="font-medium">{media.human_size}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">MIME type:</span>
                                    <span className="font-medium">{media.mime_type}</span>
                                </div>

                                {media.dimensions && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
                                        <span className="font-medium">
                                            {media.dimensions.width} × {media.dimensions.height}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                                    <span className="font-medium">{formatDate(media.created_at)}</span>
                                </div>

                                {media.uploader && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Uploader:</span>
                                        <span className="font-medium">{media.uploader.name}</span>
                                    </div>
                                )}

                                {media.folder && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Folder:</span>
                                        <span className="font-medium">{media.folder.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* URL Copy */}
                            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                <Label className="text-sm text-gray-500 dark:text-gray-400">File URL</Label>
                                <div className="mt-1 flex">
                                    <Input value={media.url} readOnly className="flex-1 text-xs" />
                                    <Button size="sm" variant="outline" onClick={copyUrl} className="ml-2">
                                        {copiedUrl ? 'Copied!' : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button size="sm" variant="outline" asChild className="ml-1">
                                        <a href={media.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{isEditing ? 'Edit Details' : 'Details'}</h3>

                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter title"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    {media.is_image && (
                                        <div>
                                            <Label htmlFor="alt_text">Alt Text</Label>
                                            <Input
                                                id="alt_text"
                                                value={data.alt_text}
                                                onChange={(e) => setData('alt_text', e.target.value)}
                                                placeholder="Describe the image for accessibility"
                                            />
                                            {errors.alt_text && <p className="mt-1 text-sm text-red-600">{errors.alt_text}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter description"
                                            rows={3}
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="folder_id">Folder</Label>
                                        <Select value={data.folder_id} onValueChange={(value) => setData('folder_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select folder" />
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

                                    <div className="flex space-x-2">
                                        <Button type="submit" disabled={processing} className="flex-1">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Title:</span>
                                        <p className="mt-1 font-medium">{media.title || <em className="text-gray-400">No title</em>}</p>
                                    </div>

                                    {media.is_image && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Alt Text:</span>
                                            <p className="mt-1 font-medium">{media.alt_text || <em className="text-gray-400">No alt text</em>}</p>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Description:</span>
                                        <p className="mt-1 font-medium">{media.description || <em className="text-gray-400">No description</em>}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Media File</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{media.title || media.original_name}"? This action cannot be undone and the file will
                                be permanently removed from storage.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
