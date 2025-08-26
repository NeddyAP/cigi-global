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
        original_filename: string;
        mime_type: string;
        size: number;
        human_size: string;
        url: string;
        thumbnail_url?: string;
        is_image: boolean;
        title?: string;
        alt_text?: string;
        description?: string;
        tags?: string[];
        created_at: string;
        updated_at: string;
        dimensions?: {
            width: number;
            height: number;
        };
        metadata?: Record<string, unknown>;
        uploader?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function MediaShow({ media }: MediaShowProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dasbor', href: '/admin' },
        { title: 'Manajer Media', href: '/admin/media' },
        { title: media.title || media.original_filename, href: `/admin/media/${media.id}` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: media.title || '',
        alt_text: media.alt_text || '',
        description: media.description || '',
        tags: media.tags || [],
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
            tags: media.tags || [],
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
                        alt={media.alt_text || media.title || media.original_filename}
                        className="max-h-96 w-full rounded-lg bg-zinc-800 object-contain"
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
            <div className="flex h-64 items-center justify-center rounded-lg bg-zinc-800">
                <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-zinc-400" />
                    <p className="mt-2 text-sm text-zinc-300">{media.original_filename?.split('.').pop()?.toUpperCase()} File</p>
                    <p className="text-xs text-zinc-500">{media.human_size}</p>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={media.title || media.original_filename} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{media.title || media.original_filename}</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Detail dan properti file media</p>
                    </div>

                    <div className="flex space-x-3">
                        <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.media.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Media
                            </a>
                        </Button>

                        {!isEditing && (
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        )}

                        <Button variant="outline" asChild className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
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
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Preview</h3>
                            {renderPreview()}
                        </div>
                    </div>

                    {/* Details and Edit Form */}
                    <div className="space-y-6">
                        {/* File Information */}
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">File Information</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">File name:</span>
                                    <span className="font-medium text-white">{media.original_filename}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">File size:</span>
                                    <span className="font-medium text-amber-400">{media.human_size}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">MIME type:</span>
                                    <span className="font-medium text-white">{media.mime_type}</span>
                                </div>

                                {media.dimensions && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">Dimensions:</span>
                                        <span className="font-medium text-white">
                                            {media.dimensions.width} × {media.dimensions.height}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">Uploaded:</span>
                                    <span className="font-medium text-white">{formatDate(media.created_at)}</span>
                                </div>

                                {media.uploader && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">Uploader:</span>
                                        <span className="font-medium text-white">{media.uploader.name}</span>
                                    </div>
                                )}

                                {media.tags && media.tags.length > 0 && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">Tags:</span>
                                        <span className="font-medium text-white">
                                            {media.tags.map((tag, index) => (
                                                <span key={index} className="mr-1 text-zinc-300">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* URL Copy */}
                            <div className="mt-6 border-t border-zinc-700 pt-6">
                                <Label className="text-sm text-zinc-400">File URL</Label>
                                <div className="mt-2 flex">
                                    <Input value={media.url} readOnly className="flex-1 border-zinc-700 bg-zinc-800 text-xs text-white" />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={copyUrl}
                                        className="ml-2 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                    >
                                        {copiedUrl ? 'Copied!' : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button size="sm" variant="outline" asChild className="ml-1 border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                                        <a href={media.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{isEditing ? 'Edit Details' : 'Details'}</h3>

                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-zinc-300">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter title"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                    </div>

                                    {media.is_image && (
                                        <div>
                                            <Label htmlFor="alt_text" className="text-zinc-300">
                                                Alt Text
                                            </Label>
                                            <Input
                                                id="alt_text"
                                                value={data.alt_text}
                                                onChange={(e) => setData('alt_text', e.target.value)}
                                                placeholder="Describe the image for accessibility"
                                                className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                            />
                                            {errors.alt_text && <p className="mt-1 text-sm text-red-400">{errors.alt_text}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="description" className="text-zinc-300">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter description"
                                            rows={3}
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="tags" className="text-zinc-300">
                                            Tags
                                        </Label>
                                        <Input
                                            id="tags"
                                            value={data.tags.join(', ')}
                                            onChange={(e) =>
                                                setData(
                                                    'tags',
                                                    e.target.value
                                                        .split(',')
                                                        .map((tag) => tag.trim())
                                                        .filter(Boolean),
                                                )
                                            }
                                            placeholder="Enter tags separated by commas"
                                            className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                        />
                                        {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
                                        <p className="mt-1 text-xs text-zinc-500">Separate multiple tags with commas</p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button type="submit" disabled={processing} className="cta-button flex-1">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-zinc-800 p-3">
                                        <span className="text-sm text-zinc-400">Title:</span>
                                        <p className="mt-1 font-medium text-white">{media.title || <em className="text-zinc-500">No title</em>}</p>
                                    </div>

                                    {media.is_image && (
                                        <div className="rounded-lg bg-zinc-800 p-3">
                                            <span className="text-sm text-zinc-400">Alt Text:</span>
                                            <p className="mt-1 font-medium text-white">
                                                {media.alt_text || <em className="text-zinc-500">No alt text</em>}
                                            </p>
                                        </div>
                                    )}

                                    <div className="rounded-lg bg-zinc-800 p-3">
                                        <span className="text-sm text-zinc-400">Description:</span>
                                        <p className="mt-1 font-medium text-white">
                                            {media.description || <em className="text-zinc-500">No description</em>}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-zinc-800 p-3">
                                        <span className="text-sm text-zinc-400">Tags:</span>
                                        <p className="mt-1 font-medium text-white">
                                            {media.tags && media.tags.length > 0 ? (
                                                media.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="mr-2 inline-block rounded bg-amber-400/20 px-2 py-1 text-xs text-amber-400"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <em className="text-zinc-500">No tags</em>
                                            )}
                                        </p>
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
                            <AlertDialogTitle className="text-zinc-900 dark:text-white">Delete Media File</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
                                Are you sure you want to delete "{media.title || media.original_filename}"? This action cannot be undone and the file
                                will be permanently removed from storage.
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
