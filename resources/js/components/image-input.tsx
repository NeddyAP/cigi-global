import MediaPickerModal from '@/components/media-picker-modal';
import SingleImagePicker from '@/components/single-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { Image, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ImageInputProps {
    label?: string;
    name: string;
    value?: string | number;
    onChange: (value: string | number | null) => void;
    error?: string;
    showPreview?: boolean;
    multiple?: boolean; // New prop to determine picker type
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function ImageInput({
    label,
    name,
    value,
    onChange,
    error,
    showPreview = false,
    multiple = false,
    required = false,
    disabled = false,
    className,
}: ImageInputProps) {
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [showSingleImagePicker, setShowSingleImagePicker] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Set preview URL when component mounts with existing value
    useEffect(() => {
        if (value && typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
            setPreviewUrl(value);
        }
    }, [value]);

    // Determine the current preview URL
    const currentPreviewUrl = React.useMemo(() => {
        if (previewUrl) return previewUrl;
        // If value is a URL string, use it directly
        if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) return value;
        // If value is a media ID (number), we need to get the URL from the previewUrl state
        return null;
    }, [value, previewUrl]);

    const handleMediaSelect = (media: Media | Media[]) => {
        if (Array.isArray(media) && media.length > 0) {
            const selectedMedia = media[0];

            // Store the full storage path for display purposes
            onChange(selectedMedia.path || selectedMedia.url || selectedMedia.id);
            setPreviewUrl(selectedMedia.path || selectedMedia.url || null);
        } else if (!Array.isArray(media) && media) {
            // Store the full storage path for display purposes
            onChange(media.path || media.url || media.id);
            setPreviewUrl(media.path || media.url || null);
        }
        setShowMediaPicker(false);
    };

    const handleSingleImageSelect = (imagePath: string) => {
        // Store the full storage path
        onChange(imagePath);
        setPreviewUrl(imagePath);
        setShowSingleImagePicker(false);
    };

    const clearSelection = () => {
        onChange(null);
        setPreviewUrl(null);
    };

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label htmlFor={name} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            <div className="space-y-4">
                {/* Preview */}
                {showPreview && currentPreviewUrl ? (
                    <div className="relative inline-block overflow-hidden rounded-xl border-2 border-zinc-200 shadow-lg transition-all hover:shadow-xl dark:border-zinc-600">
                        <img src={currentPreviewUrl} alt="Preview" className="h-40 w-40 object-cover" />
                        {!disabled && (
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-8 w-8 rounded-full border-2 border-white p-0 shadow-lg transition-all hover:scale-110 dark:border-zinc-800"
                                onClick={clearSelection}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                    </div>
                ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100 transition-all hover:border-zinc-400 hover:from-zinc-100 hover:to-zinc-200 dark:border-zinc-600 dark:from-zinc-800/50 dark:to-zinc-700/50 dark:hover:border-zinc-500 dark:hover:from-zinc-700/50 dark:hover:to-zinc-600/50">
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Belum ada gambar dipilih</p>
                        </div>
                    </div>
                )}

                {/* Input Actions */}
                <div className="flex space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (multiple) {
                                setShowMediaPicker(true);
                            } else {
                                setShowSingleImagePicker(true);
                            }
                        }}
                        disabled={disabled}
                        className="group flex-1 border-zinc-300 bg-white text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                    >
                        <Image className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        {multiple ? 'Pilih dari Galeri' : 'Pilih Gambar'}
                    </Button>
                </div>

                {/* Hidden Input for Form Submission */}
                <Input type="hidden" name={name} value={value || ''} />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Media Picker Modal for multiple images */}
            {showMediaPicker && (
                <MediaPickerModal
                    isOpen={showMediaPicker}
                    onClose={() => setShowMediaPicker(false)}
                    onSelect={handleMediaSelect}
                    title="Pilih Media"
                    multiple={true}
                />
            )}

            {/* Single Image Picker Modal for single images */}
            {showSingleImagePicker && (
                <SingleImagePicker
                    isOpen={showSingleImagePicker}
                    onClose={() => setShowSingleImagePicker(false)}
                    onImageSelect={handleSingleImageSelect}
                    title="Pilih Gambar"
                />
            )}
        </div>
    );
}
