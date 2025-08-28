import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    superadmin: boolean;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
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
    filters?: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        per_page?: number;
    };
    currentUser: {
        id: number;
        superadmin: boolean;
    };
}

export default function AdminUsersIndex({ users, filters = {}, currentUser }: Props) {
    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard'), title: 'Dashboard' },
        { label: 'Kelola Admin', href: route('admin.users.index'), title: 'Kelola Admin' },
    ];

    const handleDelete = (user: User) => {
        if (confirm(`Apakah Anda yakin ingin menghapus admin "${user.name}"?`)) {
            router.delete(route('admin.users.destroy', user.id), {
                onSuccess: () => {
                    // Success handled by Inertia
                },
            });
        }
    };

    const canEditUser = (user: User) => {
        return currentUser.superadmin || currentUser.id === user.id;
    };

    const canDeleteUser = (user: User) => {
        return currentUser.superadmin && currentUser.id !== user.id;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns: ColumnDef<User>[] = [
        {
            key: 'name',
            header: 'Nama',
            sortable: true,
            render: (user: User) => <div className="font-medium text-white">{user.name}</div>,
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            render: (user: User) => <div className="text-zinc-300">{user.email}</div>,
        },
        {
            key: 'superadmin',
            header: 'Super Admin',
            sortable: true,
            render: (user: User) => (
                <div className="flex items-center">
                    {user.superadmin ? (
                        <>
                            <div className="mr-2 h-2 w-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-blue-400">Ya</span>
                        </>
                    ) : (
                        <>
                            <div className="mr-2 h-2 w-2 rounded-full bg-zinc-400"></div>
                            <span className="text-sm text-zinc-400">Tidak</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            key: 'created_at',
            header: 'Tanggal Dibuat',
            sortable: true,
            render: (user: User) => <div className="text-sm text-zinc-400">{formatDate(user.created_at)}</div>,
        },
    ];

    const emptyState = (
        <div className="py-12 text-center">
            <div className="mb-4 text-zinc-400">Belum ada admin yang dibuat.</div>
            <Link href={route('admin.users.create')}>
                <Button className="cta-button">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Admin Pertama
                </Button>
            </Link>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Admin" />

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900/20 p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                            <span className="text-blue-400">Kelola</span> Admin
                        </h1>
                        <p className="text-lg text-zinc-300">Manajemen akun admin CIGI Global dengan sistem pencarian dan filter yang canggih</p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button className="cta-button">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Admin
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={users?.data || []}
                columns={columns}
                pagination={
                    users && {
                        current_page: users.current_page,
                        last_page: users.last_page,
                        per_page: users.per_page,
                        total: users.total,
                        from: users.from,
                        to: users.to,
                        links: users.links,
                    }
                }
                filters={filters}
                emptyState={emptyState}
                routeName="admin.users.index"
                actions={{
                    view: (user: User) => router.visit(route('admin.users.show', user.id)),
                    edit: (user: User) => (canEditUser(user) ? router.visit(route('admin.users.edit', user.id)) : undefined),
                    delete: (user: User) => (canDeleteUser(user) ? handleDelete(user) : undefined),
                }}
            />
        </AppLayout>
    );
}
