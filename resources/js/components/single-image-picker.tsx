import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface SingleImagePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (imagePath: string) => void;
    title?: string;
}

interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    mediaId?: number;
    mediaUrl?: string;
}

interface UploadMetadata {
    title: string;
    alt_text: string;
    description: string;
    tags: string[];
}

interface GlobalData {
    navBusinessUnits: Array<{ id: number; name: string; slug: string; image?: string }>;
    navCommunityClubs: Array<{ id: number; name: string; slug: string; image?: string; type?: string }>;
}

interface ControllerData {
    businessUnits: Array<{ id: number; name: string; slug: string; type?: string }>;
    communityClubs: Array<{ id: number; name: string; slug: string; type?: string }>;
}

export default function SingleImagePicker({ isOpen, onClose, onImageSelect, title = 'Pilih Gambar' }: SingleImagePickerProps) {
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [uploadMetadata, setUploadMetadata] = useState<UploadMetadata>({
        title: '',
        alt_text: '',
        description: '',
        tags: [],
    });
    const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
    const [controllerData, setControllerData] = useState<ControllerData>({
        businessUnits: [],
        communityClubs: [],
    });

    // Access global data from Inertia (fallback)
    const getGlobalData = useCallback(() => {
        // Try multiple ways to access global data
        const data = (window as any).initialPage?.props || (window as any).__INERTIA__?.props || (window as any).page?.props;

        return {
            navBusinessUnits: data?.navBusinessUnits || [],
            navCommunityClubs: data?.navCommunityClubs || [],
        };
    }, []);

    // Get global data with fallback
    const { navBusinessUnits, navCommunityClubs } = getGlobalData();
    const businessUnits = controllerData.businessUnits.length > 0 ? controllerData.businessUnits : navBusinessUnits || [];
    const communityClubs = controllerData.communityClubs.length > 0 ? controllerData.communityClubs : navCommunityClubs || [];

    // Debug global data access
    useEffect(() => {
        console.log('SingleImagePicker - Global data access:');
        console.log('- window.initialPage?.props:', (window as any).initialPage?.props);
        console.log('- window.__INERTIA__?.props:', (window as any).__INERTIA__?.props);
        console.log('- window.page?.props:', (window as any).page?.props);
        console.log('- Global Business Units:', navBusinessUnits);
        console.log('- Global Community Clubs:', navCommunityClubs);
        console.log('- Final businessUnits:', businessUnits);
        console.log('- Final communityClubs:', communityClubs);
    }, [businessUnits, communityClubs, navBusinessUnits, navCommunityClubs]);

    // Load media from the server
    const loadMedia = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Fetching media from /admin/media-picker...');
            const response = await fetch('/admin/media-picker');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('Media data received:', data);
                console.log('Media array structure:', data.media);
                console.log('Media data array:', data.media?.data);
                console.log('Business Units from controller:', data.businessUnits);
                console.log('Community Clubs from controller:', data.communityClubs);

                if (data.media?.data && data.media.data.length > 0) {
                    console.log('First media item:', data.media.data[0]);
                    console.log('First media item path:', data.media.data[0].path);
                    console.log('First media item url:', data.media.data[0].url);
                }

                setMedia(data.media?.data || []);

                // Set controller data for business units and community clubs
                if (data.businessUnits || data.communityClubs) {
                    setControllerData({
                        businessUnits: data.businessUnits || [],
                        communityClubs: data.communityClubs || [],
                    });
                }
            } else {
                console.error('Media fetch failed with status:', response.status);
                const text = await response.text();
                console.error('Response text:', text);
            }
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset upload metadata
    const resetUploadMetadata = useCallback(() => {
        setUploadMetadata({
            title: '',
            alt_text: '',
            description: '',
            tags: [],
        });
    }, []);

    // Load media when component opens
    useEffect(() => {
        if (isOpen) {
            loadMedia();
            resetUploadMetadata();
        }
    }, [isOpen, loadMedia, resetUploadMetadata]);

    // Handle file upload
    const uploadFile = useCallback(
        async (uploadFile: UploadFile) => {
            setUploadFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'uploading', progress: 0 } : file)));

            const formData = new FormData();
            formData.append('file', uploadFile.file);

            // Add metadata fields
            if (uploadMetadata.title) {
                formData.append('title', uploadMetadata.title);
            }
            if (uploadMetadata.alt_text) {
                formData.append('alt_text', uploadMetadata.alt_text);
            }
            if (uploadMetadata.description) {
                formData.append('description', uploadMetadata.description);
            }
            if (uploadMetadata.tags.length > 0) {
                uploadMetadata.tags.forEach((tag) => {
                    formData.append('tags[]', tag);
                });
            }

            // Debug CSRF token
            const csrfToken = (window as any).csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log('CSRF Token sources:');
            console.log('- window.csrfToken:', (window as any).csrfToken);
            console.log('- meta[name="csrf-token"] content:', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
            console.log('- Final CSRF Token:', csrfToken);
            console.log('Uploading file:', uploadFile.file.name);
            console.log('Upload metadata:', uploadMetadata);

            try {
                const response = await fetch('/admin/media/ajax-upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken || '',
                        Accept: 'application/json',
                    },
                    body: formData,
                });

                console.log('Upload response status:', response.status);
                console.log('Upload response headers:', response.headers);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Upload error response:', errorData);
                    throw new Error(errorData.message || 'Upload failed');
                }

                const result = await response.json();
                console.log('Upload success result:', result);

                if (result.success && result.media) {
                    setUploadFiles((prev) =>
                        prev.map((file) =>
                            file.id === uploadFile.id
                                ? {
                                      ...file,
                                      status: 'success',
                                      progress: 100,
                                      mediaId: result.media.id,
                                      mediaUrl: result.media.path || result.media.url,
                                  }
                                : file,
                        ),
                    );

                    // Automatically select the newly uploaded image
                    if (result.media.path) {
                        onImageSelect(result.media.path);
                        onClose();
                    }
                } else {
                    throw new Error(result.message || 'Upload failed');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Upload failed';
                console.error('Upload error:', errorMessage);
                setUploadFiles((prev) => prev.map((file) => (file.id === uploadFile.id ? { ...file, status: 'error', error: errorMessage } : file)));
            }
        },
        [onImageSelect, onClose, uploadMetadata],
    );

    // Handle upload confirmation
    const handleUploadConfirm = useCallback(() => {
        setShowUploadConfirmation(false);
        // Start uploading all pending files
        uploadFiles.forEach((file) => {
            if (file.status === 'pending') {
                uploadFile(file);
            }
        });
    }, [uploadFiles, uploadFile]);

    // Handle file selection
    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files) return;

        const newUploadFiles: UploadFile[] = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            progress: 0,
            status: 'pending',
        }));

        setUploadFiles((prev) => [...prev, ...newUploadFiles]);
        setShowUploadConfirmation(true);
    }, []);

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files);
            }
        },
        [handleFileSelect],
    );

    // Handle image selection from gallery
    const handleImageSelect = useCallback(
        (imagePath: string) => {
            onImageSelect(imagePath);
            onClose();
        },
        [onImageSelect, onClose],
    );

    console.log('data:media', media);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden" aria-describedby="single-image-picker-description">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div id="single-image-picker-description" className="sr-only">
                    Modal untuk memilih atau mengupload gambar tunggal
                </div>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gallery' | 'upload')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="gallery">Pilih dari Galeri</TabsTrigger>
                        <TabsTrigger value="upload">Upload Baru</TabsTrigger>
                    </TabsList>

                    {/* Gallery Tab */}
                    <TabsContent value="gallery" className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-sm text-gray-600">Memuat media...</p>
                                </div>
                            </div>
                        ) : media.length === 0 ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="mt-4 text-lg font-medium text-gray-900">Tidak ada gambar</p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Belum ada gambar yang tersedia di galeri. Gunakan tab "Upload Baru" untuk menambah gambar.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                                {media.map((item) => {
                                    // Use thumbnail_url if available, otherwise fall back to url
                                    const imageSrc = item.thumbnail_url || item.url || '';
                                    console.log('Image item:', item);
                                    console.log('Image src:', imageSrc);

                                    return (
                                        <div
                                            key={item.id}
                                            className="group relative cursor-pointer rounded-lg border-2 border-transparent transition-colors hover:border-blue-500"
                                            onClick={() => handleImageSelect(item.url || item.path || '')}
                                        >
                                            <img
                                                src={imageSrc}
                                                alt={item.alt_text || item.title || 'Image'}
                                                className="h-24 w-full rounded-lg object-cover"
                                                crossOrigin="anonymous"
                                                loading="lazy"
                                                onLoad={() => {
                                                    console.log('Image loaded successfully:', imageSrc);
                                                }}
                                                onError={(e) => {
                                                    console.error('Image failed to load:', imageSrc);
                                                    console.error('Image element:', e.target);
                                                    console.error('Network response:', e);
                                                    // Try to fetch the URL directly to check if it's accessible
                                                    fetch(imageSrc)
                                                        .then((response) => {
                                                            console.log('Direct fetch response:', response.status, response.statusText);
                                                        })
                                                        .catch((fetchError) => {
                                                            console.error('Direct fetch failed:', fetchError);
                                                        });
                                                }}
                                            />
                                            <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-lg bg-black transition-all">
                                                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button size="sm" variant="secondary">
                                                        Pilih
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Upload Tab */}
                    <TabsContent value="upload" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Upload Zone */}
                            <div className="space-y-4">
                                <div
                                    className={cn(
                                        'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                                        dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
                                    )}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <Label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="font-medium text-blue-600 hover:text-blue-500">Klik untuk upload</span>
                                            <span className="text-gray-500"> atau drag and drop</span>
                                        </Label>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple={false}
                                            className="sr-only"
                                            onChange={(e) => handleFileSelect(e.target.files)}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF, WEBP hingga 2MB</p>
                                </div>

                                {/* Upload Progress */}
                                {uploadFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Upload Progress</h4>
                                        {uploadFiles.map((file) => (
                                            <div key={file.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                                {/* Image Preview */}
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                                                    {file.file.type.startsWith('image/') ? (
                                                        <img
                                                            src={URL.createObjectURL(file.file)}
                                                            alt={file.file.name}
                                                            className="h-full w-full object-cover"
                                                            onLoad={(e) => {
                                                                // Clean up the object URL to prevent memory leaks
                                                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                            <span className="text-xs text-gray-500">
                                                                {file.file.name.split('.').pop()?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-center justify-between">
                                                        <span className="truncate text-sm font-medium">{file.file.name}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {file.status === 'success' ? '100%' : `${file.progress}%`}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className={cn(
                                                                'h-2 rounded-full transition-all duration-300',
                                                                file.status === 'success'
                                                                    ? 'bg-green-500'
                                                                    : file.status === 'error'
                                                                      ? 'bg-red-500'
                                                                      : 'bg-blue-500',
                                                            )}
                                                            style={{ width: `${file.progress}%` }}
                                                        />
                                                    </div>
                                                    {file.error && <p className="mt-1 text-sm text-red-600">{file.error}</p>}
                                                </div>

                                                {file.status === 'error' && (
                                                    <Button size="sm" variant="outline" onClick={() => uploadFile(file)}>
                                                        Retry
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Metadata Fields */}
                            <div className="space-y-4">
                                <h4 className="font-medium">File Information</h4>

                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="upload-title">Title</Label>
                                        <Input
                                            id="upload-title"
                                            value={uploadMetadata.title}
                                            onChange={(e) => setUploadMetadata((prev) => ({ ...prev, title: e.target.value }))}
                                            placeholder="Optional title for the image"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="upload-alt-text">Alt Text</Label>
                                        <Input
                                            id="upload-alt-text"
                                            value={uploadMetadata.alt_text}
                                            onChange={(e) => setUploadMetadata((prev) => ({ ...prev, alt_text: e.target.value }))}
                                            placeholder="Alt text for accessibility"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="upload-description">Description</Label>
                                        <Textarea
                                            id="upload-description"
                                            value={uploadMetadata.description}
                                            onChange={(e) => setUploadMetadata((prev) => ({ ...prev, description: e.target.value }))}
                                            placeholder="Optional description"
                                            rows={3}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="upload-tags">Tags</Label>
                                        <Select
                                            value={uploadMetadata.tags.length > 0 ? uploadMetadata.tags[0] : 'no-tags'}
                                            onValueChange={(value) => {
                                                const tags = value === 'no-tags' ? [] : [value];
                                                setUploadMetadata((prev) => ({ ...prev, tags }));
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select business unit or community club" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no-tags">No tags</SelectItem>

                                                {/* Business Units */}
                                                {businessUnits.length > 0 && (
                                                    <>
                                                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                            Business Units
                                                        </div>
                                                        {businessUnits.map((unit: { id: number; name: string; slug: string; image?: string }) => (
                                                            <SelectItem key={`bu-${unit.id}`} value={unit.name}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}

                                                {/* Community Clubs */}
                                                {communityClubs.length > 0 && (
                                                    <>
                                                        <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                            Community Clubs
                                                        </div>
                                                        {communityClubs.map(
                                                            (club: { id: number; name: string; slug: string; image?: string; type?: string }) => (
                                                                <SelectItem key={`cc-${club.id}`} value={club.name}>
                                                                    {club.name} {club.type && `(${club.type})`}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className="mt-1 text-xs text-gray-500">Select a business unit or community club to tag the image</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Confirmation Button */}
                        {uploadFiles.length > 0 && uploadFiles.some((file) => file.status === 'pending') && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={handleUploadConfirm}
                                    className="px-8 py-2"
                                    disabled={uploadFiles.every((file) => file.status !== 'pending')}
                                >
                                    Upload Image
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
