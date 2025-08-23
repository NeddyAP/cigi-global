import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Media } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import React from 'react';

interface MediaEditProps {
    media: Media;
}

export default function MediaEdit({ media }: MediaEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Media Manager', href: '/admin/media' },
        { title: media.title || media.original_filename, href: `/admin/media/${media.id}` },
        { title: 'Edit', href: `/admin/media/${media.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: media.title || '',
        alt_text: media.alt_text || '',
        description: media.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.media.update', media.id), {
            onSuccess: () => {
                // Redirect to show page after successful update
                router.visit(route('admin.media.show', media.id));
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
            <Head title={`Edit - ${media.title || media.original_filename}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Edit Media</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Update media file details and properties</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <Link href={route('admin.media.show', media.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Preview */}
                    <div className="lg:col-span-1">
                        <div className="section-card p-6">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Preview</h3>
                            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Current media file preview</p>
                            {renderPreview()}

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">File name:</span>
                                    <span className="font-medium text-white">{media.original_filename}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-zinc-400">File size:</span>
                                    <span className="font-medium text-amber-400">{media.human_size}</span>
                                </div>

                                {media.url && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">URL:</span>
                                        <span className="truncate text-xs font-medium text-blue-400">{media.url}</span>
                                    </div>
                                )}

                                {media.dimensions && (
                                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                        <span className="text-zinc-400">Dimensions:</span>
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
                            <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Edit Details</h3>
                            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                                Update the media file information. Note: The actual file cannot be changed, only the metadata.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title" className="text-zinc-300">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter a descriptive title"
                                        className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                    <p className="mt-1 text-xs text-zinc-500">A human-readable title for this media file</p>
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
                                        <p className="mt-1 text-xs text-zinc-500">Alternative text for screen readers and accessibility</p>
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
                                        placeholder="Enter a detailed description of the media file"
                                        rows={4}
                                        className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                    <p className="mt-1 text-xs text-zinc-500">Optional detailed description of the media content</p>
                                </div>

                                <div className="flex space-x-4 pt-6">
                                    <Button type="submit" disabled={processing} className="cta-button flex-1">
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                    >
                                        <Link href={route('admin.media.show', media.id)}>Cancel</Link>
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
