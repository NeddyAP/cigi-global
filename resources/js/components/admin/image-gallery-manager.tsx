import SimpleImagePicker from '@/components/simple-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxImages;

    const handleImageSelect = (imagePath: string | string[]) => {
        if (Array.isArray(imagePath)) {
            // Multiple selection mode
            const newImages: GalleryImage[] = imagePath.map((path) => ({
                id: Math.random().toString(36).substr(2, 9),
                url: path,
                alt: '',
                caption: '',
                mediaId: undefined,
            }));

            const updatedImages = [...value, ...newImages].slice(0, maxImages);
            onChange(updatedImages);
        } else {
            // Single selection mode (fallback)
            const newImage: GalleryImage = {
                id: Math.random().toString(36).substr(2, 9),
                url: imagePath,
                alt: '',
                caption: '',
                mediaId: undefined,
            };

            const updatedImages = [...value, newImage].slice(0, maxImages);
            onChange(updatedImages);
        }
    };

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
            const [draggedImage] = updatedImages.splice(draggedIndex, 1);
            updatedImages.splice(dropIndex, 0, draggedImage);

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
                <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            {/* Gallery Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {value.map((image, index) => (
                        <div
                            key={image.id}
                            className={cn(
                                'group relative overflow-hidden rounded-lg border-2 border-transparent bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-800',
                                dragOverIndex === index && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
                                draggedIndex === index && 'opacity-50',
                            )}
                            draggable={!disabled}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            {/* Drag Handle */}
                            {!disabled && (
                                <div className="absolute top-2 left-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/20 text-white backdrop-blur-sm active:cursor-grabbing">
                                        <GripVertical className="h-3 w-3" />
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.alt || 'Gallery image'}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>

                            {/* Remove Button */}
                            {!disabled && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => removeImage(index)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}

                            {/* Caption Overlay */}
                            {showCaptions && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                                    <div className="space-y-1">
                                        {image.alt && <p className="text-xs font-medium">{image.alt}</p>}
                                        {image.caption && <p className="text-xs opacity-90">{image.caption}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Image Button */}
            {canAddMore && (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowImagePicker(true)}
                        disabled={disabled}
                        className="group border-zinc-300 bg-white text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                    >
                        <ImageIcon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Tambah Gambar dari Galeri
                    </Button>
                </div>
            )}

            {/* Max Images Warning */}
            {!canAddMore && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-700 dark:bg-yellow-900/20">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">Maksimal {maxImages} gambar telah dipilih</p>
                </div>
            )}

            {/* Caption Editor */}
            {showCaptions && value.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Edit Caption Gambar</h4>
                    {value.map((image, index) => (
                        <div key={image.id} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <Label htmlFor={`alt-${image.id}`} className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Alt Text
                                </Label>
                                <Input
                                    id={`alt-${image.id}`}
                                    value={image.alt || ''}
                                    onChange={(e) => updateImageAlt(index, e.target.value)}
                                    placeholder="Deskripsi gambar untuk accessibility"
                                    disabled={disabled}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`caption-${image.id}`} className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Caption
                                </Label>
                                <Input
                                    id={`caption-${image.id}`}
                                    value={image.caption || ''}
                                    onChange={(e) => updateImageCaption(index, e.target.value)}
                                    placeholder="Caption yang ditampilkan"
                                    disabled={disabled}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Simple Image Picker Modal */}
            <SimpleImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onImageSelect={handleImageSelect}
                title="Pilih Gambar untuk Galeri"
                multiple={true}
            />
        </div>
    );
}
