import SimpleImagePicker from '@/components/simple-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Edit3, GripVertical, Image as ImageIcon, Trash2 } from 'lucide-react';
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
    const [expandedCaptionIndex, setExpandedCaptionIndex] = useState<number | null>(null);
    const [showAllCaptions, setShowAllCaptions] = useState(false);

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

    const toggleCaptionExpansion = (index: number) => {
        setExpandedCaptionIndex(expandedCaptionIndex === index ? null : index);
    };

    const toggleAllCaptions = () => {
        setShowAllCaptions(!showAllCaptions);
        setExpandedCaptionIndex(null);
    };

    const hasCaptions = value.some((img) => img.alt || img.caption);

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
                                <div className="via-black-40 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                                    <div className="space-y-1">
                                        {image.alt && <p className="text-xs font-medium">{image.alt}</p>}
                                        {image.caption && <p className="text-xs opacity-90">{image.caption}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Quick Edit Indicator */}
                            {showCaptions && (image.alt || image.caption) && (
                                <div className="absolute top-2 left-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-white">
                                        <Edit3 className="h-3 w-3" />
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

            {/* Optimized Caption Editor */}
            {showCaptions && value.length > 0 && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Edit Caption Gambar ({value.length} gambar)</h4>
                        <Button type="button" variant="outline" size="sm" onClick={toggleAllCaptions} className="h-8 text-xs">
                            {showAllCaptions ? (
                                <>
                                    <ChevronDown className="mr-1 h-3 w-3" />
                                    Sembunyikan Semua
                                </>
                            ) : (
                                <>
                                    <ChevronRight className="mr-1 h-3 w-3" />
                                    Tampilkan Semua
                                </>
                            )}
                        </Button>
                    </div>

                    {showAllCaptions ? (
                        // Show all captions in a compact grid
                        <div className="space-y-3">
                            {value.map((image, index) => (
                                <div key={image.id} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                            {index + 1}
                                        </div>
                                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Gambar {index + 1}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Show individual expandable sections
                        <div className="space-y-2">
                            {value.map((image, index) => (
                                <div key={image.id} className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-600 dark:bg-zinc-800">
                                    <button
                                        type="button"
                                        onClick={() => toggleCaptionExpansion(index)}
                                        className="flex w-full items-center justify-between p-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                        aria-expanded={expandedCaptionIndex === index}
                                        aria-controls={`caption-content-${image.id}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                                {index + 1}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gambar {index + 1}</span>
                                                {hasCaptions && (image.alt || image.caption) && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                        Sudah diedit
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {expandedCaptionIndex === index ? (
                                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-zinc-500" />
                                        )}
                                    </button>

                                    {expandedCaptionIndex === index && (
                                        <div id={`caption-content-${image.id}`} className="border-t border-zinc-200 p-3 dark:border-zinc-600">
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-800 dark:text-blue-200">
                            <strong>Tips:</strong> Alt Text untuk accessibility, Caption untuk tampilan. Gunakan tombol di atas untuk mengatur
                            tampilan editor.
                        </p>
                    </div>
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
