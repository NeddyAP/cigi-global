import MediaGrid from '@/components/media-grid';
import MediaUploadZone from '@/components/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';
import { type Media } from '@/types';
import { Search, Upload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media | Media[]) => void;
    multiple?: boolean;
    acceptedTypes?: string[];
    title?: string;
}

interface MediaData {
    data: Media[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect, multiple = false, title = 'Select Media' }: MediaPickerModalProps) {
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
    const [media, setMedia] = useState<MediaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all-types');

    const debouncedSearch = useDebounce(search, 300);

    const loadMedia = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
            });

            if (debouncedSearch) {
                params.append('search', debouncedSearch);
            }
            if (selectedType && selectedType !== 'all-types') {
                params.append('type', selectedType);
            }

            const response = await fetch(`/admin/media-picker?${params}`);
            const data = await response.json();

            setMedia(data.media);
        } catch (error) {
            console.error('Failed to load media:', error);
        }
        setLoading(false);
    }, [currentPage, debouncedSearch, selectedType]);

    useEffect(() => {
        if (isOpen) {
            loadMedia();
        }
    }, [isOpen, currentPage, debouncedSearch, selectedType, loadMedia]);

    const handleSelect = (selectedIds: number[]) => {
        setSelectedItems(selectedIds);
    };

    const handleConfirmSelection = () => {
        if (!media) return;

        const selectedMedia = media.data.filter((item) => selectedItems.includes(item.id));

        if (multiple) {
            onSelect(selectedMedia);
        } else {
            onSelect(selectedMedia[0] || null);
        }

        onClose();
        setSelectedItems([]);
    };

    const handleUploadComplete = useCallback(
        async (files: File[]) => {
            // After upload, refresh the media list and switch to gallery tab
            setActiveTab('gallery');
            await loadMedia();
        },
        [loadMedia],
    );

    const handleFileUploadComplete = useCallback(
        async (fileId: string, success: boolean, error?: string, mediaId?: number, mediaUrl?: string) => {
            if (success && mediaId && mediaUrl) {
                // Automatically select the newly uploaded image
                setSelectedItems([mediaId]);

                // Switch to gallery tab to show the selection
                setActiveTab('gallery');

                // Refresh the media list to include the new upload
                await loadMedia();
            }
        },
        [loadMedia],
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-7xl overflow-hidden" aria-describedby="media-picker-description">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <div id="media-picker-description" className="sr-only">
                        Modal for selecting or uploading media files. Use the tabs to browse existing media or upload new files.
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gallery' | 'upload')} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="gallery" className="flex-1">
                            <Search className="mr-2 h-4 w-4" />
                            Browse Gallery
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex-1">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="gallery" className="space-y-4">
                        {/* Filters */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input id="search" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="type">File Type</Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-types">All types</SelectItem>
                                        <SelectItem value="image">Images</SelectItem>
                                        <SelectItem value="application">Documents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Media Grid */}
                        <div className="h-96 overflow-y-auto">
                            {loading ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="aspect-square w-full" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : media ? (
                                <MediaGrid media={media.data} selectedItems={selectedItems} onSelectionChange={handleSelect} viewMode="grid" />
                            ) : null}
                        </div>

                        {/* Pagination */}
                        {media && media.last_page > 1 && (
                            <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                                    Previous
                                </Button>
                                <span className="flex items-center px-3 text-sm">
                                    Page {currentPage} of {media.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === media.last_page}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="h-96">
                            <MediaUploadZone
                                onUpload={handleUploadComplete}
                                onFileUploadComplete={handleFileUploadComplete}
                                acceptedTypes={['image/*']}
                                maxFileSize={10}
                                multiple={true}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {selectedItems.length > 0 && (
                                <span>
                                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>

                        <div className="space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmSelection} disabled={selectedItems.length === 0}>
                                Select {selectedItems.length > 0 && `(${selectedItems.length})`}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
