import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface UploadFile {
    file: File;
    id: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    mediaId?: number;
    mediaUrl?: string;
}

interface MediaUploadZoneProps {
    onUpload?: (files: File[]) => void;
    onFileUploadProgress?: (fileId: string, progress: number) => void;
    onFileUploadComplete?: (fileId: string, success: boolean, error?: string, mediaId?: number, mediaUrl?: string) => void;
    acceptedTypes?: string[];
    maxFileSize?: number; // in MB
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function MediaUploadZone({
    onUpload,
    onFileUploadProgress,
    onFileUploadComplete,
    acceptedTypes = ['image/*'],
    maxFileSize = 10,
    multiple = true,
    disabled = false,
    className,
}: MediaUploadZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

    const validateFile = useCallback(
        (file: File): string | null => {
            // Check file size
            const maxSizeBytes = maxFileSize * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                return `File size exceeds ${maxFileSize}MB limit`;
            }

            // Check file type
            const isValidType = acceptedTypes.some((type) => {
                if (type.endsWith('/*')) {
                    const category = type.split('/')[0];
                    return file.type.startsWith(category + '/');
                }
                return file.type === type;
            });

            if (!isValidType) {
                return 'File type not supported';
            }

            return null;
        },
        [maxFileSize, acceptedTypes],
    );

    const uploadFile = useCallback(
        async (uploadFile: UploadFile) => {
            const formData = new FormData();
            formData.append('file', uploadFile.file);

            try {
                setUploadFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'uploading' } : file)));

                const response = await fetch('/admin/media/ajax-upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': (window as any).csrfToken || '',
                        Accept: 'application/json',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Upload failed');
                }

                const result = await response.json();

                if (result.success && result.media) {
                    setUploadFiles((prev) =>
                        prev.map((file) =>
                            file.id === uploadFile.id
                                ? {
                                      ...file,
                                      status: 'success',
                                      progress: 100,
                                      mediaId: result.media.id,
                                      mediaUrl: result.media.url || result.media.path,
                                  }
                                : file,
                        ),
                    );

                    // Call the completion callback with media info
                    onFileUploadComplete?.(uploadFile.id, true, undefined, result.media.id, result.media.url || result.media.path);
                } else {
                    throw new Error(result.message || 'Upload failed');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                setUploadFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'error', error: errorMessage } : file)));

                // Call the completion callback with error
                onFileUploadComplete?.(uploadFile.id, false, errorMessage);
            }
        },
        [onFileUploadComplete],
    );

    const processFiles = useCallback(
        (files: FileList | File[]) => {
            const fileArray = Array.from(files);
            const validFiles: File[] = [];
            const newUploadFiles: UploadFile[] = [];

            fileArray.forEach((file) => {
                const error = validateFile(file);
                const uploadFile: UploadFile = {
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    progress: 0,
                    status: error ? 'error' : 'pending',
                    error: error || undefined,
                };

                newUploadFiles.push(uploadFile);

                if (!error) {
                    validFiles.push(file);
                }
            });

            setUploadFiles((prev) => [...prev, ...newUploadFiles]);

            // Start uploading valid files
            validFiles.forEach((file) => {
                const uploadFileItem = newUploadFiles.find((uf) => uf.file === file);
                if (uploadFileItem) {
                    uploadFile(uploadFileItem);
                }
            });

            if (validFiles.length > 0) {
                onUpload?.(validFiles);
            }
        },
        [validateFile, onUpload, uploadFile],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) {
                setIsDragOver(true);
            }
        },
        [disabled],
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            if (disabled) return;

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFiles(files);
            }
        },
        [disabled, processFiles],
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeUploadFile = (id: string) => {
        setUploadFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const clearAllFiles = () => {
        setUploadFiles([]);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                    isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-700',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-600',
                )}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    disabled={disabled}
                    className="absolute inset-0 cursor-pointer opacity-0"
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Upload className={cn('h-12 w-12', isDragOver ? 'text-blue-500' : 'text-gray-400')} />
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{isDragOver ? 'Drop files here' : 'Upload files'}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag and drop files here, or click to select files</p>
                        <p className="mt-1 text-xs text-gray-400">
                            {acceptedTypes.join(', ')} • Max {maxFileSize}MB
                        </p>
                    </div>

                    <Button type="button" variant="outline" disabled={disabled}>
                        Select Files
                    </Button>
                </div>
            </div>

            {/* Upload Progress */}
            {uploadFiles.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Upload Progress ({uploadFiles.length} files)</h4>
                        <Button size="sm" variant="outline" onClick={clearAllFiles}>
                            Clear All
                        </Button>
                    </div>

                    <div className="max-h-64 space-y-2 overflow-y-auto">
                        {uploadFiles.map((uploadFile) => (
                            <div key={uploadFile.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{uploadFile.file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>

                                    {uploadFile.status === 'uploading' && <Progress value={uploadFile.progress} className="mt-1 h-1" />}

                                    {uploadFile.status === 'error' && <p className="mt-1 text-xs text-red-500">{uploadFile.error}</p>}

                                    {uploadFile.status === 'success' && (
                                        <div className="mt-1 space-y-1">
                                            <p className="text-xs text-green-500">Upload complete</p>
                                            {uploadFile.mediaId && <p className="text-xs text-blue-500">Media ID: {uploadFile.mediaId}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    {uploadFile.status === 'uploading' && <span className="text-xs text-blue-500">{uploadFile.progress}%</span>}

                                    <Button size="sm" variant="ghost" onClick={() => removeUploadFile(uploadFile.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
