import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import MediaGrid from '@/components/media-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Media } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Tag, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/admin' },
    { title: 'Manajer Media', href: '/admin/media' },
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
        from: number;
        to: number;
    };
    allTags: string[];
    filters: {
        search?: string;
        tags?: string[];
        show_homepage?: string;
    };
}

export default function MediaIndex({ media, allTags, filters }: MediaPageProps) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Media | null>(null);
    const [processing, setProcessing] = useState(false);

    // Local state for filters
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
    const [homepageFilter, setHomepageFilter] = useState<string>(filters.show_homepage || 'all');

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== filters.search) {
                router.get(
                    route('admin.media.index'),
                    {
                        search: searchQuery,
                        tags: selectedTags,
                        show_homepage: homepageFilter,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters.search, selectedTags, homepageFilter]);

    // Handle tags filter immediately
    useEffect(() => {
        if (JSON.stringify(selectedTags) !== JSON.stringify(filters.tags)) {
            router.get(
                route('admin.media.index'),
                {
                    search: searchQuery,
                    tags: selectedTags,
                    show_homepage: homepageFilter,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [selectedTags, filters.tags, searchQuery, homepageFilter]);

    // Handle homepage filter immediately
    useEffect(() => {
        if (homepageFilter !== filters.show_homepage) {
            router.get(
                route('admin.media.index'),
                {
                    search: searchQuery,
                    tags: selectedTags,
                    show_homepage: homepageFilter,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [homepageFilter, filters.show_homepage, searchQuery, selectedTags]);

    const hasActiveFilters = filters.search || (filters.tags && filters.tags.length > 0) || filters.show_homepage !== 'all';

    const handleApplyFilters = () => {
        setProcessing(true);
        router.get(
            route('admin.media.index'),
            {
                search: searchQuery,
                tags: selectedTags,
                show_homepage: homepageFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedTags([]);
        setHomepageFilter('all');
        router.get(
            route('admin.media.index'),
            {
                search: '',
                tags: [],
                show_homepage: 'all',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleTagToggle = (tag: string) => {
        const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
        setSelectedTags(newTags);
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

    // Use data directly from backend (filtering is handled server-side)
    const filteredMedia = media.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajer Media" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Manajer Media</h1>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">Kelola dan organisir gambar media Anda dengan mudah</p>
                    </div>

                    <Button
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                    >
                        <a href={route('admin.media.create')}>
                            <Upload className="mr-2 h-4 w-4" />
                            Unggah Gambar
                        </a>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="section-card p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredMedia.length}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Gambar</div>
                    </div>
                    <div className="section-card p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {filteredMedia.filter((item) => item.tags && item.tags.length > 0).length}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Dengan Tag</div>
                    </div>
                    <div className="section-card p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {filteredMedia.filter((item) => item.show_homepage).length}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Di Homepage</div>
                    </div>
                </div>

                {/* Search and Filters - Single Row */}
                <div className="section-card p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        {/* Search Bar */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Cari Gambar
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <Input
                                    id="search"
                                    placeholder="Cari berdasarkan nama, judul, atau deskripsi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-zinc-300 bg-white pl-10 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        {/* Tags Filter Dropdown */}
                        {allTags.length > 0 && (
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filter Tag</Label>
                                    {selectedTags.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedTags([])}
                                            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </div>
                                <Select
                                    value=""
                                    onValueChange={(value) => {
                                        if (value && value !== 'all') {
                                            if (!selectedTags.includes(value)) {
                                                setSelectedTags([...selectedTags, value]);
                                            }
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border-zinc-300 bg-white text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white">
                                        <SelectValue placeholder="Pilih tag untuk filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allTags.map((tag) => (
                                            <SelectItem key={tag} value={tag}>
                                                <div className="flex items-center space-x-2">
                                                    <Tag className="h-3 w-3" />
                                                    <span>{tag}</span>
                                                    {selectedTags.includes(tag) && (
                                                        <Badge variant="secondary" className="ml-auto text-xs">
                                                            Dipilih
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Selected Tags Display */}
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {selectedTags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="default"
                                                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={() => handleTagToggle(tag)}
                                            >
                                                {tag}
                                                <X className="ml-1 h-3 w-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Homepage Filter */}
                        <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filter Homepage</Label>
                            <Select value={homepageFilter} onValueChange={(value) => setHomepageFilter(value)}>
                                <SelectTrigger className="border-zinc-300 bg-white text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white">
                                    <SelectValue placeholder="Semua gambar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua gambar</SelectItem>
                                    <SelectItem value="homepage">Hanya di Homepage</SelectItem>
                                    <SelectItem value="not_homepage">Tidak di Homepage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                onClick={handleApplyFilters}
                                disabled={processing}
                                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                {processing ? 'Menerapkan...' : 'Terapkan Filter'}
                            </Button>

                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Bersihkan
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 shadow-sm dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{selectedItems.length}</span>
                                </div>
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                    {selectedItems.length} gambar{selectedItems.length !== 1 ? '' : ''} dipilih
                                </span>
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Terpilih
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Media Grid */}
                <div className="section-card overflow-hidden p-0">
                    <MediaGrid
                        media={filteredMedia}
                        selectedItems={selectedItems}
                        onSelectionChange={handleSelectionChange}
                        onItemEdit={handleItemEdit}
                        onItemDelete={handleItemDelete}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                </div>

                {/* Pagination */}
                {media.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                            {/* Previous Page */}
                            {media.current_page > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            route('admin.media.index'),
                                            {
                                                page: media.current_page - 1,
                                                search: searchQuery,
                                                tags: selectedTags,
                                                show_homepage: homepageFilter,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                    className="h-8 px-3 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                >
                                    &laquo; Sebelumnya
                                </Button>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: Math.min(5, media.last_page) }, (_, i) => {
                                let pageNum;
                                if (media.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (media.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (media.current_page >= media.last_page - 2) {
                                    pageNum = media.last_page - 4 + i;
                                } else {
                                    pageNum = media.current_page - 2 + i;
                                }

                                if (pageNum < 1 || pageNum > media.last_page) return null;

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === media.current_page ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                route('admin.media.index'),
                                                {
                                                    page: pageNum,
                                                    search: searchQuery,
                                                    tags: selectedTags,
                                                    show_homepage: homepageFilter,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    replace: true,
                                                },
                                            )
                                        }
                                        className={cn(
                                            'h-8 w-8 p-0',
                                            pageNum === media.current_page
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700',
                                        )}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}

                            {/* Next Page */}
                            {media.current_page < media.last_page && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            route('admin.media.index'),
                                            {
                                                page: media.current_page + 1,
                                                search: searchQuery,
                                                tags: selectedTags,
                                                show_homepage: homepageFilter,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                    className="h-8 px-3 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                >
                                    Selanjutnya &raquo;
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Pagination Info */}
                {media.total > 0 && (
                    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Menampilkan {media.from} sampai {media.to} dari {media.total} gambar
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Hapus Gambar Media"
                    description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.alt_text || itemToDelete?.original_filename}"? Tindakan ini tidak dapat dibatalkan dan gambar akan dihapus secara permanen.`}
                    confirmText="Ya, Hapus Gambar"
                    itemName={itemToDelete?.alt_text || itemToDelete?.original_filename}
                />
            </div>
        </AppLayout>
    );
}
