import MediaPickerModal from '@/components/media-picker-modal';
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
        <div className={cn('space-y-6', className)}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={name} className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {value.length}/{maxImages}
                        </span>
                    </div>
                </div>
            )}

            {/* Add Images Button */}
            {canAddMore && (
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setShowMediaPicker(true)}
                    disabled={disabled}
                    className="group w-full border-2 border-dashed border-zinc-300 bg-white py-6 text-zinc-600 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all group-hover:bg-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400">
                            <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Tambah Gambar</div>
                            <div className="text-sm text-zinc-500">Klik untuk menambah gambar ke galeri</div>
                        </div>
                    </div>
                </Button>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {value.map((image, index) => (
                        <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                'group relative cursor-move overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg dark:border-zinc-600 dark:bg-zinc-800',
                                draggedIndex === index && 'scale-95 opacity-50',
                                dragOverIndex === index && 'border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
                            )}
                        >
                            {/* Drag Handle */}
                            <div className="absolute top-2 left-2 z-10 opacity-0 transition-all duration-200 group-hover:opacity-100">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/90 text-zinc-400 shadow-sm backdrop-blur-sm dark:bg-zinc-800/90">
                                    <GripVertical className="h-3 w-3" />
                                </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2 z-10 h-6 w-6 rounded-lg p-0 opacity-0 transition-all duration-200 group-hover:opacity-100"
                                onClick={() => removeImage(index)}
                                disabled={disabled}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>

                            {/* Image */}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.alt || `Image ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                            </div>

                            {/* Image Info Overlay */}
                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <div className="text-xs">
                                    <div className="font-medium">Image {index + 1}</div>
                                    {image.alt && <div className="truncate opacity-80">{image.alt}</div>}
                                </div>
                            </div>

                            {/* Caption Inputs */}
                            {showCaptions && (
                                <div className="space-y-2 p-3">
                                    <Input
                                        placeholder="Alt text"
                                        value={image.alt || ''}
                                        onChange={(e) => updateImageAlt(index, e.target.value)}
                                        className="h-8 rounded-lg border-zinc-300 bg-white px-2 text-xs text-zinc-900 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                        disabled={disabled}
                                    />
                                    <Input
                                        placeholder="Caption"
                                        value={image.caption || ''}
                                        onChange={(e) => updateImageCaption(index, e.target.value)}
                                        className="h-8 rounded-lg border-zinc-300 bg-white px-2 text-xs text-zinc-900 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                        disabled={disabled}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {value.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100 p-12 text-center dark:border-zinc-600 dark:from-zinc-800/50 dark:to-zinc-700/50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <ImageIcon className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Belum ada gambar</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Tambahkan gambar untuk membuat galeri yang menarik</p>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Max Images Warning */}
            {!canAddMore && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <span className="font-medium">Maksimal {maxImages} gambar.</span> Hapus beberapa gambar untuk menambah yang baru.
                    </p>
                </div>
            )}

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                multiple={true}
                acceptedTypes={['image/*']}
                title="Pilih Gambar"
            />
        </div>
    );
}
