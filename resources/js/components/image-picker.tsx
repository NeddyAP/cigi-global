import SimpleImagePicker from '@/components/simple-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Image, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ImagePickerProps {
    label?: string;
    name: string;
    value?: string | number | string[];
    onChange: (value: string | number | null | string[]) => void;
    error?: string;
    showPreview?: boolean;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    multiple?: boolean;
}

export default function ImagePicker({
    label,
    name,
    value,
    onChange,
    error,
    showPreview = false,
    required = false,
    disabled = false,
    className,
    multiple = false,
}: ImagePickerProps) {
    const [showImagePicker, setShowImagePicker] = useState(false);
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

    const handleImageSelect = (imagePath: string | string[]) => {
        if (multiple && Array.isArray(imagePath)) {
            // Multiple selection mode
            onChange(imagePath);
            // For multiple, we don't set preview URL since it's an array
        } else if (!multiple && typeof imagePath === 'string') {
            // Single selection mode
            onChange(imagePath);
            setPreviewUrl(imagePath);
        }
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
                            <Image className="mx-auto h-12 w-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Belum ada gambar dipilih</p>
                        </div>
                    </div>
                )}

                {/* Image Picker Action */}
                <div className="flex space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowImagePicker(true)}
                        disabled={disabled}
                        className="group flex-1 border-zinc-300 bg-white text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                    >
                        <Image className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Pilih dari Galeri
                    </Button>
                </div>

                {/* Hidden Input for Form Submission */}
                <Input type="hidden" name={name} value={value || ''} />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Simple Image Picker Modal */}
            <SimpleImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onImageSelect={handleImageSelect}
                title="Pilih Gambar dari Galeri"
                multiple={multiple}
            />
        </div>
    );
}
