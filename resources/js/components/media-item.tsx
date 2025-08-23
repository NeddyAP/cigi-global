import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { type Media } from '@/types';
import { Edit, Eye, FileText, Image, Trash2 } from 'lucide-react';

interface MediaItemProps {
    media: Media & {
        original_name?: string;
        thumbnail_url?: string;
        human_size?: string;
        is_image?: boolean;
    };
    selected?: boolean;
    onSelect?: (id: number, selected: boolean) => void;
    onView?: (media: Media) => void;
    onEdit?: (media: Media) => void;
    onDelete?: (media: Media) => void;
    size?: 'small' | 'medium' | 'large';
    selectable?: boolean;
}

export default function MediaItem({
    media,
    selected = false,
    onSelect,
    onView,
    onEdit,
    onDelete,
    size = 'medium',
    selectable = true,
}: MediaItemProps) {
    const sizeClasses = {
        small: 'h-24 w-24',
        medium: 'h-32 w-32',
        large: 'h-40 w-40',
    };

    const handleSelect = (checked: boolean) => {
        onSelect?.(media.id, checked);
    };

    const renderThumbnail = () => {
        if (media.is_image) {
            return (
                <img
                    src={media.thumbnail_url || media.url}
                    alt={media.alt_text || media.title || media.original_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            );
        }

        // Show file type icon for non-images
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                <FileText className="h-8 w-8 text-gray-400" />
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    className={cn(
                        'group relative cursor-pointer overflow-hidden rounded-lg border transition-all duration-200',
                        'hover:shadow-md hover:shadow-gray-200 dark:hover:shadow-gray-800',
                        selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
                        size === 'small' && 'p-1',
                        size === 'medium' && 'p-2',
                        size === 'large' && 'p-3',
                    )}
                    onClick={() => onView?.(media)}
                >
                    {/* Selection Checkbox */}
                    {selectable && (
                        <div className="absolute left-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                            <Checkbox
                                checked={selected}
                                onCheckedChange={handleSelect}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white shadow-md"
                            />
                        </div>
                    )}

                    {/* Image Type Badge */}
                    {media.is_image && (
                        <div className="absolute right-2 top-2 z-10">
                            <div className="rounded bg-black/50 p-1">
                                <Image className="h-3 w-3 text-white" />
                            </div>
                        </div>
                    )}

                    {/* Media Thumbnail */}
                    <div className={cn('overflow-hidden rounded', sizeClasses[size])}>{renderThumbnail()}</div>

                    {/* Media Info */}
                    <div className="mt-2 space-y-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white" title={media.title || media.original_name}>
                            {media.title || media.original_name}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{media.human_size}</span>
                            <span>{formatDate(media.created_at)}</span>
                        </div>
                    </div>

                    {/* Action Buttons - Show on Hover */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.(media);
                            }}
                            className="h-6 w-6 p-0"
                        >
                            <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(media);
                            }}
                            className="h-6 w-6 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(media);
                            }}
                            className="h-6 w-6 p-0"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem onClick={() => onView?.(media)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit?.(media)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onDelete?.(media)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
