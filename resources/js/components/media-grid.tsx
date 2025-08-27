import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { type Media } from '@/types';
import { Download, Edit, Eye, Grid, List, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MediaGridProps {
    media: Media[];
    loading?: boolean;
    selectedItems?: number[];
    onSelectionChange?: (selectedIds: number[]) => void;
    onItemEdit?: (media: Media) => void;
    onItemDelete?: (media: Media) => void;
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function MediaGrid({
    media,
    loading = false,
    selectedItems = [],
    onSelectionChange,
    onItemEdit,
    onItemDelete,
    viewMode = 'grid',
    onViewModeChange,
}: MediaGridProps) {
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            onSelectionChange?.(media.map((item) => item.id));
        } else {
            onSelectionChange?.([]);
        }
    };

    const handleItemSelect = (id: number, selected: boolean) => {
        let newSelection = [...selectedItems];

        if (selected) {
            newSelection.push(id);
        } else {
            newSelection = newSelection.filter((item) => item !== id);
        }

        onSelectionChange?.(newSelection);
        setSelectAll(newSelection.length === media.length);
    };

    const renderGridView = () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {media.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        'group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 hover:shadow-lg dark:bg-zinc-800',
                        selectedItems.includes(item.id)
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600',
                    )}
                >
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-20">
                        <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                            className="h-5 w-5 border-2 border-white bg-white/90 shadow-lg data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                    </div>

                    {/* Media Preview with Overlay */}
                    <div className="relative aspect-square overflow-hidden">
                        <img
                            src={item.thumbnail_url || item.url}
                            alt={item.alt_text || item.original_filename}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />

                        {/* Overlay Actions - Only on image area */}
                        <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/20">
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-full bg-white/90 p-0 text-zinc-700 shadow-lg hover:bg-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(item.url, '_blank');
                                    }}
                                    title="View"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-full bg-white/90 p-0 text-zinc-700 shadow-lg hover:bg-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Create a temporary link for download
                                        const link = document.createElement('a');
                                        link.href = item.url || '';
                                        link.download = item.original_filename || 'download';
                                        link.target = '_blank';
                                        link.click();
                                    }}
                                    title="Download"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Media Info - Now outside the overlay */}
                    <div className="relative z-10 flex flex-1 flex-col p-4">
                        <div className="mb-2">
                            <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white">{item.title || item.original_filename}</h3>
                            {item.alt_text && <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{item.alt_text}</p>}
                        </div>

                        {/* Tags */}
                        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-zinc-100 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                                    >
                                        <Tag className="mr-1 h-2 w-2" />
                                        {tag}
                                    </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{item.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Homepage Indicator */}
                        {item.show_homepage && (
                            <div className="mb-2">
                                <Badge variant="default" className="bg-green-600 text-xs text-white">
                                    🏠 Homepage
                                </Badge>
                            </div>
                        )}

                        {/* Flexible content area that pushes buttons to bottom */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                <span className="font-medium">{item.human_size}</span>
                                <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                            </div>

                            {item.dimensions && (
                                <div className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                                    {item.dimensions.width} × {item.dimensions.height}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Now properly clickable */}
                        <div className="mt-3 flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onItemEdit?.(item);
                                }}
                                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            >
                                <Edit className="mr-1 h-3 w-3" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onItemDelete?.(item);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-3">
            {media.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        'group flex items-center space-x-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md',
                        selectedItems.includes(item.id)
                            ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 dark:bg-blue-950/30'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600',
                    )}
                >
                    <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                        className="h-5 w-5 border-2 border-zinc-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />

                    {/* Media Thumbnail */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                            src={item.thumbnail_url || item.url}
                            alt={item.alt_text || item.original_filename}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Media Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-medium text-zinc-900 dark:text-white">{item.title || item.original_filename}</h3>
                        {item.alt_text && <p className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">{item.alt_text}</p>}

                        {/* Tags */}
                        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-zinc-100 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                                    >
                                        <Tag className="mr-1 h-2 w-2" />
                                        {tag}
                                    </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{item.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Homepage Indicator */}
                        {item.show_homepage && (
                            <div className="mb-2">
                                <Badge variant="default" className="bg-green-600 text-xs text-white">
                                    🏠 Homepage
                                </Badge>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium">{item.human_size}</span>
                            <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                            {item.dimensions && (
                                <span>
                                    {item.dimensions.width} × {item.dimensions.height}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.url, '_blank');
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.url, '_blank');
                            }}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Main Actions */}
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onItemEdit?.(item);
                            }}
                            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onItemDelete?.(item);
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Hapus
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkeletons = () => {
        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                                <div className="flex space-x-2">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 flex-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 rounded-xl border p-4">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-16 w-16 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="flex space-x-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    if (loading) {
        return renderSkeletons();
    }

    if (media.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-center">
                <div className="space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <svg className="h-8 w-8 translate-x-2 translate-y-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-zinc-900 dark:text-white">Belum ada gambar media</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Mulai dengan mengunggah gambar pertama Anda</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            className="h-5 w-5 border-2 border-zinc-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pilih Semua ({media.length} gambar)</Label>
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {selectedItems.length} gambar{selectedItems.length !== 1 ? '' : ''} dipilih
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
                    <Button
                        size="sm"
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        onClick={() => onViewModeChange?.('grid')}
                        className={cn(
                            'h-8 px-3',
                            viewMode === 'grid'
                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700',
                        )}
                    >
                        <Grid className="mr-2 h-4 w-4" />
                        Grid
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        onClick={() => onViewModeChange?.('list')}
                        className={cn(
                            'h-8 px-3',
                            viewMode === 'list'
                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700',
                        )}
                    >
                        <List className="mr-2 h-4 w-4" />
                        List
                    </Button>
                </div>
            </div>

            {/* Media Grid/List */}
            {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>
    );
}
