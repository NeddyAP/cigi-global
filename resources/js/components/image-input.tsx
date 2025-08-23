import MediaPickerModal from '@/components/media-picker-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { Image, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ImageInputProps {
    label?: string;
    name: string;
    value?: string | number; // Can be URL string or media ID
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    showPreview?: boolean;
    autoUpload?: boolean; // Whether to auto-upload dropped/selected files
    accept?: string;
}

export default function ImageInput({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    showPreview = true,
    autoUpload = true,
    accept = 'image/*',
}: ImageInputProps) {
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determine the current preview URL
    const currentPreviewUrl = React.useMemo(() => {
        if (previewUrl) return previewUrl;
        if (typeof value === 'string' && value.startsWith('http')) return value;
        return null;
    }, [value, previewUrl]);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        if (autoUpload) {
            await uploadFile(file);
        } else {
            // Create preview URL for local display
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onChange(url);
        }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);

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
                const media = result.media;
                onChange(media.id); // Use media ID as value
                setPreviewUrl(media.url);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (disabled || uploading) return;

        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMediaSelect = (media: Media | Media[]) => {
        if (Array.isArray(media) && media.length > 0) {
            const selectedMedia = media[0];
            onChange(selectedMedia.id);
            setPreviewUrl(selectedMedia.url || null);
        } else if (!Array.isArray(media) && media) {
            onChange(media.id);
            setPreviewUrl(media.url || null);
        }
        setShowMediaPicker(false);
    };

    const clearSelection = () => {
        onChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
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
                        size="sm"
                        onClick={() => setShowMediaPicker(true)}
                        disabled={disabled || uploading}
                        className="flex-1"
                    >
                        <Image className="mr-2 h-4 w-4" />
                        Choose from Gallery
                    </Button>

                    <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={disabled || uploading} className="flex-1">
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload New'}
                    </Button>
                </div>

                {/* Drop Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={cn(
                        'rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors dark:border-gray-700',
                        'hover:border-gray-400 dark:hover:border-gray-600',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">{uploading ? 'Uploading...' : 'Or drag and drop an image here'}</p>
                </div>

                {/* Hidden File Input */}
                <input ref={fileInputRef} type="file" accept={accept} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />

                {/* Hidden Input for Form Submission */}
                <Input type="hidden" name={name} value={value || ''} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                multiple={false}
                acceptedTypes={['image/*']}
                title="Select Image"
            />
        </div>
    );
}
