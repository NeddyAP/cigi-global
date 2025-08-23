import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'text';
    options?: FilterOption[];
    placeholder?: string;
}

export interface AdvancedFiltersProps {
    filters: Record<string, any>;
    fields: FilterField[];
    onFilterChange?: (filters: Record<string, any>) => void;
    routeName?: string;
    searchPlaceholder?: string;
    className?: string;
    preserveState?: boolean;
    showFilterToggle?: boolean;
}

export function AdvancedFilters({
    filters = {},
    fields,
    onFilterChange,
    routeName,
    searchPlaceholder = 'Search...',
    className = '',
    preserveState = true,
    showFilterToggle = true,
}: AdvancedFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [localFilters, setLocalFilters] = useState(filters);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    
    // Check if any advanced filters are active
    const hasActiveFilters = Object.keys(localFilters).some(
        key => key !== 'search' && key !== 'page' && localFilters[key]
    );

    const handleSearch = () => {
        const updatedFilters = {
            ...localFilters,
            search: searchQuery.trim() || undefined,
            page: 1, // Reset to first page on search
        };
        
        // Remove empty filters
        Object.keys(updatedFilters).forEach((key) => {
            if (!updatedFilters[key as keyof typeof updatedFilters]) {
                delete (updatedFilters as any)[key];
            }
        });

        if (onFilterChange) {
            onFilterChange(updatedFilters);
        } else if (routeName) {
            router.get(route(routeName), updatedFilters, { 
                preserveState,
                preserveScroll: true,
            });
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        const updatedFilters = {
            ...localFilters,
            [field]: value === 'all' || !value ? undefined : value,
            page: 1, // Reset to first page on filter change
        };
        
        setLocalFilters(updatedFilters);
        
        // Auto-apply filter changes
        if (onFilterChange) {
            onFilterChange(updatedFilters);
        } else if (routeName) {
            // Remove empty filters before sending to server
            const cleanFilters = { ...updatedFilters };
            Object.keys(cleanFilters).forEach((key) => {
                if (!cleanFilters[key as keyof typeof cleanFilters]) {
                    delete (cleanFilters as any)[key];
                }
            });
            
            router.get(route(routeName), cleanFilters, { 
                preserveState,
                preserveScroll: true,
            });
        }
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setLocalFilters({});
        
        if (onFilterChange) {
            onFilterChange({});
        } else if (routeName) {
            router.get(route(routeName), {}, { 
                preserveState,
                preserveScroll: true,
            });
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Primary Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                    />
                </div>
                
                <div className="flex gap-2">
                    <Button onClick={handleSearch} className="cta-button">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                    
                    {showFilterToggle && fields.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 ${
                                hasActiveFilters ? 'border-amber-500/50 text-amber-400' : ''
                            }`}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 rounded-full bg-amber-500 px-2 py-1 text-xs text-amber-950">
                                    {Object.keys(localFilters).filter(key => key !== 'search' && key !== 'page' && localFilters[key]).length}
                                </span>
                            )}
                        </Button>
                    )}
                    
                    {(hasActiveFilters || searchQuery) && (
                        <Button
                            variant="outline"
                            onClick={clearAllFilters}
                            className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && fields.length > 0 && (
                <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white">Advanced Filters</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    {field.label}
                                </label>
                                
                                {field.type === 'select' && field.options ? (
                                    <Select
                                        value={localFilters[field.key] || 'all'}
                                        onValueChange={(value) => handleFilterChange(field.key, value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="all">All {field.label}</SelectItem>
                                            {field.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        placeholder={field.placeholder || `Filter by ${field.label.toLowerCase()}`}
                                        value={localFilters[field.key] || ''}
                                        onChange={(e) => handleFilterChange(field.key, e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {(hasActiveFilters || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-zinc-400">Active filters:</span>
                    
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400">
                            Search: "{searchQuery}"
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    handleFilterChange('search', '');
                                }}
                                className="text-amber-400 hover:text-amber-300"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    
                    {Object.entries(localFilters).map(([key, value]) => {
                        if (key === 'search' || key === 'page' || !value) return null;
                        
                        const field = fields.find(f => f.key === key);
                        const displayValue = field?.options?.find(opt => opt.value === value)?.label || value;
                        
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400"
                            >
                                {field?.label}: {displayValue}
                                <button
                                    onClick={() => handleFilterChange(key, '')}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}