import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CommunityClub } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface AdminCommunityClubsIndexProps {
    communityClubs: CommunityClub[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Komunitas', href: '/admin/community-clubs' },
];

export default function AdminCommunityClubsIndex({ communityClubs }: AdminCommunityClubsIndexProps) {
    const handleDelete = (club: CommunityClub) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${club.name}?`)) {
            router.delete(route('admin.community-clubs.destroy', club.slug));
        }
    };

    const getTypeColor = (type: string) => {
        const colors = {
            Olahraga: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            Keagamaan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            Lingkungan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            Sosial: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            Budaya: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Komunitas" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kelola Komunitas</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola semua komunitas Cigi Global</p>
                    </div>
                    <Link href={route('admin.community-clubs.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Komunitas
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Komunitas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {communityClubs.map((club) => (
                                    <tr key={club.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                {club.image && (
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-lg object-cover" src={`/${club.image}`} alt={club.name} />
                                                    </div>
                                                )}
                                                <div className={club.image ? 'ml-4' : ''}>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{club.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{club.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(club.type)}`}>
                                                {club.type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">{club.contact_person}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{club.contact_phone}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    club.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                            >
                                                {club.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{club.sort_order}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('admin.community-clubs.show', club.slug)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.community-clubs.edit', club.slug)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(club)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {communityClubs.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="text-gray-500 dark:text-gray-400">Belum ada komunitas yang terdaftar.</div>
                                <Link href={route('admin.community-clubs.create')} className="mt-4 inline-block">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Komunitas Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
