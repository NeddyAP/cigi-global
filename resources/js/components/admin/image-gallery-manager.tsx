import MediaPickerModal from '@/components/media-picker-modal';
import MediaUploadZone from '@/components/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { GripVertical, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface GalleryImage {
    id: string;
    url: string;
    alt?: string;
    caption?: string;
    mediaId?: number;
}

interface ImageGalleryManagerProps {
    label?: string;
    name: string;
    value?: GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    maxImages?: number;
    showCaptions?: boolean;
}

export default function ImageGalleryManager({
    label,
    name,
    value = [],
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    maxImages = 10,
    showCaptions = true,
}: ImageGalleryManagerProps) {
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [showUploadZone, setShowUploadZone] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxImages;

    const handleMediaSelect = useCallback(
        (media: Media | Media[]) => {
            const mediaArray = Array.isArray(media) ? media : [media];
            const newImages: GalleryImage[] = mediaArray.map((item) => ({
                id: Math.random().toString(36).substr(2, 9),
                url: item.url || '',
                alt: item.alt_text || '',
                caption: '',
                mediaId: item.id,
            }));

            const updatedImages = [...value, ...newImages].slice(0, maxImages);
            onChange(updatedImages);
            setShowMediaPicker(false);
        },
        [value, onChange, maxImages],
    );

    const handleFileUpload = useCallback(
        async (files: File[]) => {
            const uploadPromises = files.map(async (file) => {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('/admin/media/ajax-upload', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                    });

                    const result = await response.json();

                    if (result.success) {
                        return {
                            id: Math.random().toString(36).substr(2, 9),
                            url: result.media.url,
                            alt: result.media.alt || '',
                            caption: '',
                            mediaId: result.media.id,
                        };
                    }
                    throw new Error(result.message || 'Upload failed');
                } catch (error) {
                    console.error('Upload error:', error);
                    return null;
                }
            });

            const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as GalleryImage[];
            const updatedImages = [...value, ...uploadedImages].slice(0, maxImages);
            onChange(updatedImages);
            setShowUploadZone(false);
        },
        [value, onChange, maxImages],
    );

    const removeImage = useCallback(
        (index: number) => {
            const updatedImages = value.filter((_, i) => i !== index);
            onChange(updatedImages);
        },
        [value, onChange],
    );

    const updateImageCaption = useCallback(
        (index: number, caption: string) => {
            const updatedImages = value.map((img, i) => (i === index ? { ...img, caption } : img));
            onChange(updatedImages);
        },
        [value, onChange],
    );

    const updateImageAlt = useCallback(
        (index: number, alt: string) => {
            const updatedImages = value.map((img, i) => (i === index ? { ...img, alt } : img));
            onChange(updatedImages);
        },
        [value, onChange],
    );

    // Drag and drop reordering
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newImages = [...value];
        const draggedImage = newImages[draggedIndex];

        // Remove dragged item
        newImages.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newImages.splice(insertIndex, 0, draggedImage);

        onChange(newImages);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                    <span className="ml-2 text-sm text-gray-500">
                        ({value.length}/{maxImages})
                    </span>
                </Label>
            )}

            {/* Action Buttons */}
            {canAddMore && (
                <div className="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowMediaPicker(true)} disabled={disabled}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choose from Gallery
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowUploadZone(true)} disabled={disabled}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New
                    </Button>
                </div>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {value.map((image, index) => (
                        <div
                            key={image.id}
                            draggable={!disabled}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={cn(
                                'group relative rounded-lg border bg-white p-3 shadow-sm transition-all dark:bg-zinc-800',
                                dragOverIndex === index && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                                !disabled && 'cursor-move hover:shadow-md',
                            )}
                        >
                            {/* Drag Handle */}
                            {!disabled && (
                                <div className="absolute top-1 left-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                            )}

                            {/* Delete Button */}
                            {!disabled && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => removeImage(index)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}

                            {/* Image Preview */}
                            <div className="aspect-square overflow-hidden rounded-md">
                                <img src={image.url} alt={image.alt || `Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                            </div>

                            {/* Image Details */}
                            <div className="mt-2 space-y-2">
                                <div>
                                    <Label htmlFor={`${name}_alt_${index}`} className="text-xs">
                                        Alt Text
                                    </Label>
                                    <Input
                                        id={`${name}_alt_${index}`}
                                        type="text"
                                        value={image.alt || ''}
                                        onChange={(e) => updateImageAlt(index, e.target.value)}
                                        placeholder="Describe the image"
                                        disabled={disabled}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                {showCaptions && (
                                    <div>
                                        <Label htmlFor={`${name}_caption_${index}`} className="text-xs">
                                            Caption
                                        </Label>
                                        <Input
                                            id={`${name}_caption_${index}`}
                                            type="text"
                                            value={image.caption || ''}
                                            onChange={(e) => updateImageCaption(index, e.target.value)}
                                            placeholder="Optional caption"
                                            disabled={disabled}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {value.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No images added yet</p>
                    <p className="text-xs text-gray-400">Add images using the buttons above</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                multiple={true}
                acceptedTypes={['image/*']}
                title="Select Images for Gallery"
            />

            {/* Upload Zone Modal */}
            {showUploadZone && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-zinc-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium">Upload Images</h3>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowUploadZone(false)}>
                                ×
                            </Button>
                        </div>
                        <MediaUploadZone onUpload={handleFileUpload} acceptedTypes={['image/*']} multiple={true} maxFileSize={10} />
                    </div>
                </div>
            )}
        </div>
    );
}
