import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface AdminBusinessUnitsIndexProps {
    businessUnits: {
        data: BusinessUnit[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Unit Bisnis', href: '/admin/business-units' },
];

export default function AdminBusinessUnitsIndex({ businessUnits, filters = {} }: AdminBusinessUnitsIndexProps) {
    const handleDelete = (businessUnit: BusinessUnit) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${businessUnit.name}?`)) {
            router.delete(route('admin.business-units.destroy', businessUnit.slug));
        }
    };

    const columns: ColumnDef<BusinessUnit>[] = [
        {
            key: 'name',
            header: 'Unit Bisnis',
            sortable: true,
            searchable: true,
            render: (unit: BusinessUnit) => (
                <div className="flex items-center">
                    {unit.image && (
                        <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-lg object-cover" src={`${unit.image}`} alt={unit.name} />
                        </div>
                    )}
                    <div className={unit.image ? 'ml-4' : ''}>
                        <div className="text-sm font-medium text-white">{unit.name}</div>
                        <div className="text-sm text-zinc-400">{unit.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'contact_info',
            header: 'Kontak',
            render: (unit: BusinessUnit) => (
                <div>
                    <div className="text-sm text-white">{unit.contact_phone || '-'}</div>
                    <div className="text-sm text-zinc-400">{unit.contact_email || '-'}</div>
                </div>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            render: (unit: BusinessUnit) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        unit.is_active
                            ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                            : 'border border-red-500/30 bg-red-500/20 text-red-400'
                    }`}
                >
                    {unit.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
        },
        {
            key: 'sort_order',
            header: 'Urutan',
            sortable: true,
            className: 'text-center',
            render: (unit: BusinessUnit) => <div className="text-center text-zinc-300">{unit.sort_order}</div>,
        },
        {
            key: 'created_at',
            header: 'Dibuat',
            sortable: true,
            render: (unit: BusinessUnit) => (
                <div className="text-sm text-zinc-300">{unit.created_at ? new Date(unit.created_at).toLocaleDateString('id-ID') : '-'}</div>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (unit: BusinessUnit) => (
                <div className="flex items-center justify-end space-x-2">
                    <Link
                        href={route('admin.business-units.show', unit.slug)}
                        className="text-blue-400 transition-colors hover:text-blue-300"
                        title="Lihat Detail"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                        href={route('admin.business-units.edit', unit.slug)}
                        className="text-amber-400 transition-colors hover:text-amber-300"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(unit)} className="text-red-400 transition-colors hover:text-red-300" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    const emptyState = (
        <div className="py-12 text-center">
            <div className="mb-4 text-zinc-400">Belum ada unit bisnis yang terdaftar.</div>
            <Link href={route('admin.business-units.create')}>
                <Button className="cta-button">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Unit Bisnis Pertama
                </Button>
            </Link>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Unit Bisnis" />

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                            <span className="text-amber-400">Kelola</span> Unit Bisnis
                        </h1>
                        <p className="text-lg text-zinc-300">Manajemen unit bisnis CIGI Global dengan sistem pencarian dan filter yang canggih</p>
                    </div>
                    <Link href={route('admin.business-units.create')}>
                        <Button className="cta-button">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Unit Bisnis
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={businessUnits?.data || []}
                columns={columns}
                pagination={
                    businessUnits && {
                        current_page: businessUnits.current_page,
                        last_page: businessUnits.last_page,
                        per_page: businessUnits.per_page,
                        total: businessUnits.total,
                        from: businessUnits.from,
                        to: businessUnits.to,
                        links: businessUnits.links,
                    }
                }
                filters={filters}
                searchPlaceholder="Cari unit bisnis..."
                emptyState={emptyState}
                routeName="admin.business-units.index"
            />
        </AppLayout>
    );
}
