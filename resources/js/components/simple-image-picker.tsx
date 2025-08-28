import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Media } from '@/types';
import { Grid, Grid3X3, Image, Maximize2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SimpleImagePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (imagePath: string | string[]) => void;
    title?: string;
    multiple?: boolean;
}

type GridSize = 'small' | 'medium' | 'large' | 'extra-large';

export default function SimpleImagePicker({ isOpen, onClose, onImageSelect, title = 'Pilih Gambar', multiple = false }: SimpleImagePickerProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [gridSize, setGridSize] = useState<GridSize>('medium');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // Grid size configurations
    const gridConfigs = {
        small: { cols: 'grid-cols-4', gap: 'gap-3', maxWidth: 'max-w-5xl' },
        medium: { cols: 'grid-cols-3', gap: 'gap-4', maxWidth: 'max-w-6xl' },
        large: { cols: 'grid-cols-2', gap: 'gap-6', maxWidth: 'max-w-7xl' },
        'extra-large': { cols: 'grid-cols-1', gap: 'gap-8', maxWidth: 'max-w-7xl' },
    };

    const currentConfig = gridConfigs[gridSize];

    // Load media from the server
    const loadMedia = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/media-picker');
            if (response.ok) {
                const data = await response.json();
                setMedia(data.media?.data || []);
            } else {
                toast.error('Gagal memuat media');
            }
        } catch (error) {
            toast.error('Gagal memuat media' + error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load media when component opens
    useEffect(() => {
        if (isOpen) {
            loadMedia();
            // Reset selection when opening
            setSelectedImages([]);
        }
    }, [isOpen, loadMedia]);

    // Filter media based on search
    const filteredMedia = media.filter(
        (item) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.alt_text?.toLowerCase().includes(search.toLowerCase()),
    );

    // Handle image selection
    const handleImageSelect = (imagePath: string) => {
        if (multiple) {
            // Multiple selection mode
            setSelectedImages((prev) => {
                if (prev.includes(imagePath)) {
                    return prev.filter((path) => path !== imagePath);
                } else {
                    return [...prev, imagePath];
                }
            });
        } else {
            // Single selection mode
            onImageSelect(imagePath);
            onClose();
        }
    };

    // Handle confirm selection for multiple mode
    const handleConfirmSelection = () => {
        if (selectedImages.length > 0) {
            onImageSelect(selectedImages);
            onClose();
        }
    };

    // Clear all selections
    const clearSelection = () => {
        setSelectedImages([]);
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`${
                    isFullscreen ? 'image-picker-fullscreen' : `max-h-[90vh] ${currentConfig.maxWidth}`
                } overflow-hidden transition-all duration-300`}
                style={
                    isFullscreen
                        ? {
                              width: '95vw',
                              height: '95vh',
                              maxWidth: '95vw',
                              maxHeight: '95vh',
                          }
                        : {}
                }
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{title}</span>
                        <div className="flex items-center gap-2">
                            {/* Grid Size Selector */}
                            <Select value={gridSize} onValueChange={(value: GridSize) => setGridSize(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">
                                        <div className="flex items-center gap-2">
                                            <Grid className="h-3 w-3" />
                                            Small
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <div className="flex items-center gap-2">
                                            <Grid3X3 className="h-3 w-3" />
                                            Medium
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="large">
                                        <div className="flex items-center gap-2">
                                            <Grid3X3 className="h-3 w-3" />
                                            Large
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="extra-large">
                                        <div className="flex items-center gap-2">
                                            <Grid3X3 className="h-3 w-3" />
                                            Extra Large
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Fullscreen Toggle */}
                            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                                <Maximize2 className="h-4 w-4" />
                            </Button>

                            {/* Close Button */}
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Cari gambar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                    </div>

                    {/* Media Grid */}
                    <div className={`${isFullscreen ? 'h-[80vh]' : 'h-96'} overflow-y-auto`}>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-sm text-gray-600">Memuat media...</p>
                                </div>
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <Image className="mx-auto h-16 w-16 text-gray-400" />
                                    <p className="mt-4 text-lg font-medium text-gray-900">
                                        {search ? 'Tidak ada gambar ditemukan' : 'Tidak ada gambar'}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">{search ? 'Coba kata kunci lain' : 'Belum ada gambar yang tersedia'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={`grid ${currentConfig.cols} ${currentConfig.gap}`}>
                                {filteredMedia.map((item) => {
                                    const imageSrc = item.thumbnail_url || item.url || '';
                                    const imagePath = item.url || item.path || '';
                                    const isSelected = multiple ? selectedImages.includes(imagePath) : false;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`group relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                                isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-500 hover:shadow-lg'
                                            }`}
                                            onClick={() => handleImageSelect(imagePath)}
                                        >
                                            <img
                                                src={imageSrc}
                                                alt={item.alt_text || item.title || 'Image'}
                                                className="aspect-square w-full rounded-lg object-cover transition-transform duration-200 hover:scale-105"
                                                loading="lazy"
                                                onError={() => {
                                                    toast.error('Gagal memuat gambar');
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all duration-200 group-hover:bg-black/20">
                                                <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <Button size="sm" variant="secondary" className="shadow-lg">
                                                        {isSelected ? 'Deselect' : 'Select'}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Image Info Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <div className="text-xs">
                                                    {item.title && <p className="truncate font-medium">{item.title}</p>}
                                                    {item.alt_text && <p className="truncate opacity-90">{item.alt_text}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Grid Size Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{filteredMedia.length} gambar ditemukan</span>
                        <span>
                            Grid: {gridSize.charAt(0).toUpperCase() + gridSize.slice(1)}
                            {isFullscreen && ' • Fullscreen'}
                        </span>
                    </div>

                    {multiple && (
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={clearSelection}>
                                Clear All
                            </Button>
                            <Button onClick={handleConfirmSelection}>Confirm ({selectedImages.length})</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
