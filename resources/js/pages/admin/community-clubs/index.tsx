import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CommunityClub } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AdminCommunityClubsIndexProps {
    communityClubs: {
        data: CommunityClub[];
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
    { title: 'Komunitas', href: '/admin/community-clubs' },
];

export default function AdminCommunityClubsIndex({ communityClubs, filters = {} }: AdminCommunityClubsIndexProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<CommunityClub | null>(null);

    const handleDelete = (club: CommunityClub) => {
        setItemToDelete(club);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            router.delete(route('admin.community-clubs.destroy', itemToDelete.slug), {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const getTypeColor = (type: string) => {
        const colors = {
            Olahraga: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            Keagamaan: 'bg-green-500/20 text-green-400 border-green-500/30',
            Lingkungan: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            Sosial: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            Budaya: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        };
        return colors[type as keyof typeof colors] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    };

    const columns: ColumnDef<CommunityClub>[] = [
        {
            key: 'name',
            header: 'Komunitas',
            sortable: true,
            render: (club: CommunityClub) => (
                <div className="flex items-center">
                    {club.image && (
                        <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-lg object-cover" src={`${club.image}`} alt={club.name} />
                        </div>
                    )}
                    <div className={club.image ? 'ml-4' : ''}>
                        <div className="text-sm font-medium text-white">{club.name}</div>
                        <div className="text-sm text-zinc-400">{club.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Tipe',
            sortable: true,
            render: (club: CommunityClub) => (
                <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getTypeColor(club.type)}`}>{club.type}</span>
            ),
        },
        {
            key: 'contact_person',
            header: 'Kontak',
            sortable: true,
            render: (club: CommunityClub) => (
                <div>
                    <div className="text-sm text-white">{club.contact_person || '-'}</div>
                    <div className="text-sm text-zinc-400">{club.contact_phone || '-'}</div>
                </div>
            ),
        },
        {
            key: 'location',
            header: 'Lokasi',
            render: (club: CommunityClub) => <div className="max-w-xs truncate text-sm text-zinc-300">{club.location || '-'}</div>,
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            render: (club: CommunityClub) => (
                <span
                    className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${
                        club.is_active ? 'border-green-500/30 bg-green-500/20 text-green-400' : 'border-red-500/30 bg-red-500/20 text-red-400'
                    }`}
                >
                    {club.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
        },
        {
            key: 'sort_order',
            header: 'Urutan',
            sortable: true,
            className: 'text-center',
            render: (club: CommunityClub) => <div className="text-center text-zinc-300">{club.sort_order}</div>,
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (club: CommunityClub) => (
                <div className="flex items-center justify-end space-x-2">
                    <Link
                        href={route('admin.community-clubs.show', club.slug)}
                        className="text-blue-400 transition-colors hover:text-blue-300"
                        title="Lihat Detail"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                        href={route('admin.community-clubs.edit', club.slug)}
                        className="text-amber-400 transition-colors hover:text-amber-300"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(club)} className="text-red-400 transition-colors hover:text-red-300" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    const emptyState = (
        <div className="py-12 text-center">
            <div className="mb-4 text-zinc-400">Belum ada komunitas yang terdaftar.</div>
            <Link href={route('admin.community-clubs.create')}>
                <Button className="cta-button">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Komunitas Pertama
                </Button>
            </Link>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Komunitas" />

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-amber-900/20 p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                            <span className="text-amber-400">Kelola</span> Komunitas
                        </h1>
                        <p className="text-lg text-zinc-300">
                            Manajemen komunitas dan klub CIGI Global dengan sistem pencarian dan filter yang canggih
                        </p>
                    </div>
                    <Link href={route('admin.community-clubs.create')}>
                        <Button className="cta-button">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Komunitas
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={communityClubs?.data || []}
                columns={columns}
                pagination={
                    communityClubs && {
                        current_page: communityClubs.current_page,
                        last_page: communityClubs.last_page,
                        per_page: communityClubs.per_page,
                        total: communityClubs.total,
                        from: communityClubs.from,
                        to: communityClubs.to,
                        links: communityClubs.links,
                    }
                }
                filters={filters}
                searchPlaceholder="Cari komunitas..."
                emptyState={emptyState}
                routeName="admin.community-clubs.index"
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Hapus Komunitas"
                description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus Komunitas"
                itemName={itemToDelete?.name}
            />
        </AppLayout>
    );
}
