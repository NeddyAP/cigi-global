import MediaPickerModal from '@/components/media-picker-modal';
import SingleImagePicker from '@/components/single-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { Image, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ImageInputProps {
    label?: string;
    name: string;
    value?: string | number;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    error?: string;
    showPreview?: boolean;
    autoUpload?: boolean;
    multiple?: boolean; // New prop to determine picker type
    required?: boolean;
    disabled?: boolean;
    className?: string;
    accept?: string;
}

export default function ImageInput({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    showPreview = false,
    autoUpload = false,
    multiple = false,
    required = false,
    disabled = false,
    className,
    accept = 'image/*',
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
        console.log('Media selected (multiple):', media);
        if (Array.isArray(media) && media.length > 0) {
            const selectedMedia = media[0];
            console.log('Setting media path (multiple):', selectedMedia.path || selectedMedia.url);
            // Store the full storage path for display purposes
            onChange(selectedMedia.path || selectedMedia.url || selectedMedia.id);
            setPreviewUrl(selectedMedia.path || selectedMedia.url || null);
        } else if (!Array.isArray(media) && media) {
            console.log('Setting media path (multiple):', media.path || media.url);
            // Store the full storage path for display purposes
            onChange(media.path || media.url || media.id);
            setPreviewUrl(media.path || media.url || null);
        }
        setShowMediaPicker(false);
    };

    const handleSingleImageSelect = (imagePath: string) => {
        console.log('Single image selected:', imagePath);
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
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            <div className="space-y-2">
                {/* Preview */}
                {showPreview && currentPreviewUrl && (
                    <div className="relative inline-block">
                        <img src={currentPreviewUrl} alt="Preview" className="h-32 w-32 rounded-lg border object-cover" />
                        {!disabled && (
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={clearSelection}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Input Actions */}
                <div className="flex space-x-2">
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
                        className="w-full"
                    >
                        <Image className="mr-2 h-4 w-4" />
                        {multiple ? 'Pilih dari Galeri' : 'Pilih Gambar'}
                    </Button>
                </div>

                {/* Hidden Input for Form Submission */}
                <Input type="hidden" name={name} value={value || ''} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

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
