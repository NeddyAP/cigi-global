import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

export interface ColumnDef<T = unknown> {
    key?: string;
    accessorKey?: string;
    header: string;
    cell?: (props: { getValue: () => unknown; row: { original: T } }) => React.ReactNode;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    searchable?: boolean;
    className?: string;
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface DataTableProps<T = unknown> {
    data: T[];
    columns: ColumnDef<T>[];
    pagination?: PaginationData;
    routeName?: string;
    filters?: Record<string, unknown>;
    searchPlaceholder?: string;
    className?: string;
    showSearch?: boolean;
    showPagination?: boolean;
    emptyMessage?: string;
    emptyState?: React.ReactNode;
    onRowClick?: (item: T) => void;
    actions?: {
        view?: (item: T) => void;
        edit?: (item: T) => void;
        delete?: (item: T) => void;
    };
}

export function DataTable<T = unknown>({
    data = [],
    columns,
    pagination,
    routeName,
    filters = {},
    searchPlaceholder = 'Search...',
    className = '',
    showSearch = true,
    showPagination = true,
    emptyMessage = 'No data available',
    emptyState,
    onRowClick,
    actions,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search as string || '');
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);

    const handleSearch = () => {
        if (routeName) {
            router.get(route(routeName), {
                ...filters,
                search: searchQuery.trim() || undefined,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSort = (columnKey: string) => {
        const newDirection = sortConfig?.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key: columnKey, direction: newDirection });
        
        if (routeName) {
            router.get(route(routeName), {
                ...filters,
                sort: columnKey,
                direction: newDirection,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handlePageChange = (page: number) => {
        if (routeName && page >= 1 && pagination && page <= pagination.last_page) {
            router.get(route(routeName), {
                ...filters,
                page,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handlePerPageChange = (perPage: string) => {
        if (routeName) {
            router.get(route(routeName), {
                ...filters,
                per_page: perPage,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const getCellValue = (item: T, column: ColumnDef<T>): React.ReactNode => {
        if (column.render) {
            return column.render(item);
        }
        
        if (column.cell) {
            const getValue = () => column.accessorKey ? (item as Record<string, unknown>)[column.accessorKey] : '';
            return column.cell({ getValue, row: { original: item } });
        }
        
        return column.accessorKey ? (item as Record<string, unknown>)[column.accessorKey] as React.ReactNode ?? '' : '';
    };

    const generatePageNumbers = () => {
        if (!pagination) return [];
        
        const { current_page, last_page } = pagination;
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, current_page - delta); i <= Math.min(last_page - 1, current_page + delta); i++) {
            range.push(i);
        }

        if (current_page - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (current_page + delta < last_page - 1) {
            rangeWithDots.push('...', last_page);
        } else if (last_page > 1) {
            rangeWithDots.push(last_page);
        }

        return rangeWithDots;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            {showSearch && (
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                        />
                    </div>
                    <Button onClick={handleSearch} className="cta-button">
                        Search
                    </Button>
                </div>
            )}

            {/* Data Table */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-800">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className={`px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider ${
                                            column.sortable ? 'cursor-pointer hover:text-white' : ''
                                        } ${column.className || ''}`}
                                        onClick={column.sortable && column.accessorKey ? () => handleSort(column.accessorKey!) : undefined}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{column.header}</span>
                                            {column.sortable && column.accessorKey && sortConfig?.key === column.accessorKey && (
                                                <span className="text-amber-400">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                            {!data || data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (actions ? 1 : 0)}
                                        className="px-6 py-8 text-center text-zinc-400"
                                    >
                                        {emptyState || emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-zinc-800/50 transition-colors ${
                                            onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                        onClick={onRowClick ? () => onRowClick(item) : undefined}
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`px-6 py-4 whitespace-nowrap text-zinc-300 ${
                                                    column.className || ''
                                                }`}
                                            >
                                                {getCellValue(item, column)}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                                                <div className="flex items-center space-x-2">
                                                    {actions.view && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.view!(item);
                                                            }}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {actions.edit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.edit!(item);
                                                            }}
                                                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {actions.delete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.delete!(item);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {showPagination && pagination && pagination.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results Info */}
                    <div className="text-sm text-zinc-400">
                        Showing {pagination.from || 0} to {pagination.to || 0} of{' '}
                        {pagination.total} results
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                        {/* Per Page Selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-zinc-400">Show</span>
                            <Select
                                value={pagination.per_page.toString()}
                                onValueChange={handlePerPageChange}
                            >
                                <SelectTrigger className="w-20 bg-zinc-800 border-zinc-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {[10, 25, 50, 100].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page <= 1}
                                className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {generatePageNumbers().map((pageNum, index) => (
                                typeof pageNum === 'number' ? (
                                    <Button
                                        key={index}
                                        variant={pageNum === pagination.current_page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        className={
                                            pageNum === pagination.current_page
                                                ? "cta-button"
                                                : "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                        }
                                    >
                                        {pageNum}
                                    </Button>
                                ) : (
                                    <span key={index} className="px-2 text-zinc-400">
                                        {pageNum}
                                    </span>
                                )
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page >= pagination.last_page}
                                className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}