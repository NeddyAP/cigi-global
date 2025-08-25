import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/AdminLayout';
import { BusinessUnit, BusinessUnitService } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Filter, Plus, Search, Trash2 } from 'lucide-react';

interface Props {
    businessUnitServices: BusinessUnitService[];
    businessUnits: BusinessUnit[];
    filters: {
        business_unit_id?: string;
        status?: string;
        featured?: string;
        search?: string;
    };
}

export default function Index({ businessUnitServices, businessUnits, filters }: Props) {
    const handleFilter = (key: string, value: string) => {
        router.get(
            route('admin.business-unit-services.index'),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (search: string) => {
        handleFilter('search', search);
    };

    const clearFilters = () => {
        router.get(route('admin.business-unit-services.index'));
    };

    return (
        <AdminLayout>
            <Head title="Business Unit Services" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Business Unit Services</h1>
                    <Link href={route('admin.business-unit-services.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Service
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Search services..."
                                        defaultValue={filters.search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Business Unit</label>
                                <Select value={filters.business_unit_id} onValueChange={(value) => handleFilter('business_unit_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Units" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Units</SelectItem>
                                        {businessUnits.map((unit) => (
                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                {unit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Status</label>
                                <Select value={filters.status} onValueChange={(value) => handleFilter('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Featured</label>
                                <Select value={filters.featured} onValueChange={(value) => handleFilter('featured', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All</SelectItem>
                                        <SelectItem value="1">Featured</SelectItem>
                                        <SelectItem value="0">Not Featured</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Services List */}
                <div className="grid gap-4">
                    {businessUnitServices.map((service) => (
                        <Card key={service.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-xl font-semibold">{service.title}</h3>
                                            <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>{service.status}</Badge>
                                            {service.featured && <Badge variant="destructive">Featured</Badge>}
                                        </div>

                                        <p className="mb-3 text-gray-600">{service.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Business Unit: {service.business_unit?.name}</span>
                                            {service.price && <span>Price: ${service.price}</span>}
                                            {service.duration && <span>Duration: {service.duration}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={route('admin.business-unit-services.show', service.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.business-unit-services.edit', service.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this service?')) {
                                                    router.delete(route('admin.business-unit-services.destroy', service.id));
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {businessUnitServices.length === 0 && (
                        <Card>
                            <CardContent className="p-6 text-center text-gray-500">No services found matching your criteria.</CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
