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
import { FolderPlus, Move, Search, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Media Manager', href: '/admin/media' },
];

interface Folder {
    id: number;
    name: string;
    slug: string;
    breadcrumbs?: Array<{ id: number; name: string }>;
}

interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface MediaPageProps {
    media: {
        data: Media[];
        current_page: number;
        last_page: number;
        total: number;
        links: PageLink[];
    };
    folders: Folder[];
    currentFolder?: Folder;
    filters: {
        search?: string;
        folder_id?: string;
        type?: string;
    };
}

export default function MediaIndex({ media, folders, currentFolder, filters }: MediaPageProps) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Media | null>(null);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        folder_id: filters.folder_id || '',
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

    const handleItemView = (media: Media) => {
        router.visit(route('admin.media.show', media.id));
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

    const handleBulkMove = (folderId: string) => {
        if (selectedItems.length === 0) return;

        router.post(
            route('admin.media.bulk-move'),
            {
                ids: selectedItems,
                folder_id: folderId || null,
            },
            {
                onSuccess: () => {
                    setSelectedItems([]);
                    setShowMoveDialog(false);
                },
            },
        );
    };

    const renderFolderBreadcrumbs = () => {
        if (!currentFolder) return null;

        return (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Button variant="link" size="sm" onClick={() => router.visit(route('admin.media.index'))} className="h-auto p-0">
                    Root
                </Button>
                {currentFolder.breadcrumbs?.map((crumb: { id: number; name: string }) => (
                    <React.Fragment key={crumb.id}>
                        <span>/</span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => router.visit(route('admin.media.index', { folder_id: crumb.id }))}
                            className="h-auto p-0"
                        >
                            {crumb.name}
                        </Button>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Manager" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Manager</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your media files and folders</p>
                        {renderFolderBreadcrumbs()}
                    </div>

                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <a href={route('admin.media.create')}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Files
                            </a>
                        </Button>
                        <Button variant="outline">
                            <FolderPlus className="mr-2 h-4 w-4" />
                            New Folder
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Search files..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="folder">Folder</Label>
                            <Select value={data.folder_id} onValueChange={(value) => setData('folder_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All folders" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-folders">All folders</SelectItem>
                                    {folders.map((folder) => (
                                        <SelectItem key={folder.id} value={folder.id.toString()}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="type">File Type</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
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

                        <div className="flex items-end space-x-2">
                            <Button onClick={handleSearch} disabled={processing} className="flex-1">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>

                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setShowMoveDialog(true)}>
                                <Move className="mr-2 h-4 w-4" />
                                Move
                            </Button>
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
                    onItemView={handleItemView}
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
                            <AlertDialogTitle>Delete Media File</AlertDialogTitle>
                            <AlertDialogDescription>
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

                {/* Move Dialog */}
                <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Move Files</AlertDialogTitle>
                            <AlertDialogDescription>Select a destination folder for the selected files.</AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="py-4">
                            <Select onValueChange={handleBulkMove}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="root">Root Folder</SelectItem>
                                    {folders.map((folder) => (
                                        <SelectItem key={folder.id} value={folder.id.toString()}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
