import MediaItem from '@/components/media-item';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { type Media } from '@/types';
import { Grid, List } from 'lucide-react';
import { useState } from 'react';

interface MediaGridProps {
    media: Media[];
    loading?: boolean;
    selectedItems?: number[];
    onSelectionChange?: (selectedIds: number[]) => void;
    onItemView?: (media: Media) => void;
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
    onItemView,
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
            {media.map((item) => (
                <MediaItem
                    key={item.id}
                    media={item}
                    selected={selectedItems.includes(item.id)}
                    onSelect={handleItemSelect}
                    onView={onItemView}
                    onEdit={onItemEdit}
                    onDelete={onItemDelete}
                    size="large"
                />
            ))}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-2">
            {media.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        'flex items-center space-x-4 rounded-lg border p-4 transition-colors',
                        selectedItems.includes(item.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
                    )}
                >
                    <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)} />

                    <div className="h-12 w-12 flex-shrink-0">
                        {item.is_image ? (
                            <img
                                src={item.thumbnail_url || item.url}
                                alt={item.alt_text || item.original_filename}
                                className="h-full w-full rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                                <span className="text-xs text-gray-500">{item.original_filename.split('.').pop()?.toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900 dark:text-white">{item.title || item.original_filename}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{item.human_size}</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            {item.dimensions && (
                                <span>
                                    {item.dimensions.width} × {item.dimensions.height}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onItemView?.(item)}>
                            View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onItemEdit?.(item)}>
                            Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onItemDelete?.(item)}>
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkeletons = () => {
        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-12 w-12" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="flex space-x-2">
                                <Skeleton className="h-8 w-16" />
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
                <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No media files found</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload some files to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                        <Label className="text-sm text-gray-600 dark:text-gray-400">Select all ({media.length} items)</Label>
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Button size="sm" variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => onViewModeChange?.('grid')}>
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => onViewModeChange?.('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Media Grid/List */}
            {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>
    );
}
