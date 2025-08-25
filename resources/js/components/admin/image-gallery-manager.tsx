import MediaPickerModal from '@/components/media-picker-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { GripVertical, Image as ImageIcon, Trash2 } from 'lucide-react';
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

    const removeImage = useCallback(
        (index: number) => {
            const updatedImages = value.filter((_, i) => i !== index);
            onChange(updatedImages);
        },
        [value, onChange],
    );

    const updateImageCaption = useCallback(
        (index: number, caption: string) => {
            const updatedImages = [...value];
            updatedImages[index] = { ...updatedImages[index], caption };
            onChange(updatedImages);
        },
        [value, onChange],
    );

    const updateImageAlt = useCallback(
        (index: number, alt: string) => {
            const updatedImages = [...value];
            updatedImages[index] = { ...updatedImages[index], alt };
            onChange(updatedImages);
        },
        [value, onChange],
    );

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, dropIndex: number) => {
            e.preventDefault();
            if (draggedIndex === null || draggedIndex === dropIndex) return;

            const updatedImages = [...value];
            const [draggedItem] = updatedImages.splice(draggedIndex, 1);
            updatedImages.splice(dropIndex, 0, draggedItem);

            onChange(updatedImages);
            setDraggedIndex(null);
            setDragOverIndex(null);
        },
        [value, onChange, draggedIndex],
    );

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    }, []);

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            {/* Add Images Button */}
            {canAddMore && (
                <Button type="button" variant="outline" onClick={() => setShowMediaPicker(true)} disabled={disabled} className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Add Images
                </Button>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {value.map((image, index) => (
                        <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                'group relative cursor-move rounded-lg border bg-white p-2 transition-all dark:bg-gray-800',
                                draggedIndex === index && 'opacity-50',
                                dragOverIndex === index && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                            )}
                        >
                            {/* Drag Handle */}
                            <div className="absolute top-1 left-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>

                            {/* Remove Button */}
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeImage(index)}
                                disabled={disabled}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>

                            {/* Image */}
                            <div className="aspect-square overflow-hidden rounded">
                                <img src={image.url} alt={image.alt || `Image ${index + 1}`} className="h-full w-full object-cover" />
                            </div>

                            {/* Caption Input */}
                            {showCaptions && (
                                <div className="mt-2 space-y-2">
                                    <Input
                                        placeholder="Alt text"
                                        value={image.alt || ''}
                                        onChange={(e) => updateImageAlt(index, e.target.value)}
                                        className="text-xs"
                                        disabled={disabled}
                                    />
                                    <Input
                                        placeholder="Caption"
                                        value={image.caption || ''}
                                        onChange={(e) => updateImageCaption(index, e.target.value)}
                                        className="text-xs"
                                        disabled={disabled}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Max Images Warning */}
            {!canAddMore && (
                <p className="text-sm text-amber-600 dark:text-amber-400">Maximum {maxImages} images allowed. Remove some images to add more.</p>
            )}

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                multiple={true}
                acceptedTypes={['image/*']}
                title="Select Images"
            />
        </div>
    );
}
