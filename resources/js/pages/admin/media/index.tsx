import MediaGrid from '@/components/media-grid';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Media } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Media Manager', href: '/admin/media' },
];

interface PageLink {
    url: string | null;
    active: boolean;
    label: string;
}

interface MediaPageProps {
    media: {
        data: Media[];
        current_page: number;
        last_page: number;
        total: number;
        links: PageLink[];
    };
    filters: {
        search?: string;
        type?: string;
    };
}

export default function MediaIndex({ media, filters }: MediaPageProps) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Media | null>(null);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        type: filters.type || '',
    });

    const handleSearch = () => {
        get(route('admin.media.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedItems(selectedIds);
    };

    const handleItemEdit = (media: Media) => {
        router.visit(route('admin.media.edit', media.id));
    };

    const handleItemDelete = (media: Media) => {
        setItemToDelete(media);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            router.delete(route('admin.media.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        router.post(
            route('admin.media.bulk-delete'),
            {
                ids: selectedItems,
            },
            {
                onSuccess: () => {
                    setSelectedItems([]);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Manager" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Media Manager</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage your media files</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.media.create')}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Files
                        </a>
                    </Button>
                </div>

                {/* Filters */}
                <div className="section-card p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="search" className="text-zinc-300">
                                Search
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <Input
                                    id="search"
                                    placeholder="Search files..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="type" className="text-zinc-300">
                                File Type
                            </Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-types">All types</SelectItem>
                                    <SelectItem value="image">Images</SelectItem>
                                    <SelectItem value="application">Documents</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button onClick={handleSearch} disabled={processing} className="cta-button flex-1">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>

                        <div className="flex space-x-2">
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                )}

                {/* Media Grid */}
                <MediaGrid
                    media={media.data}
                    selectedItems={selectedItems}
                    onSelectionChange={handleSelectionChange}
                    onItemEdit={handleItemEdit}
                    onItemDelete={handleItemDelete}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {/* Pagination */}
                {media.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            {media.links.map((link: { url: string | null; active: boolean; label: string }) => (
                                <Button
                                    key={link.url || Math.random()}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-zinc-900 dark:text-white">Delete Media File</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
                                Are you sure you want to delete "{itemToDelete?.alt_text || itemToDelete?.original_filename}"? This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
