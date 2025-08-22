import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CommunityClub } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, ArrowLeft, Calendar, Edit, Mail, MapPin, Phone, Trash2, Users } from 'lucide-react';

interface ShowCommunityClubProps {
    communityClub: CommunityClub;
}

export default function ShowCommunityClub({ communityClub }: ShowCommunityClubProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Komunitas', href: '/admin/community-clubs' },
        { title: communityClub.name, href: `/admin/community-clubs/${communityClub.slug}` },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${communityClub.name}?`)) {
            router.delete(route('admin.community-clubs.destroy', communityClub.slug));
        }
    };

    const getTypeColor = (type: string) => {
        const colors = {
            Olahraga: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            Keagamaan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            Lingkungan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            Sosial: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            Budaya: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            Pendidikan: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
            Kesehatan: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    const formatActivities = (activities: string) => {
        if (!activities) return [];
        return activities.split('\n').filter((activity) => activity.trim() !== '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${communityClub.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{communityClub.name}</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Detail informasi komunitas</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.community-clubs.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.community-clubs.edit', communityClub.slug)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Dasar</h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Komunitas</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{communityClub.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug URL</label>
                                        <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{communityClub.slug}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Komunitas</label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(communityClub.type)}`}
                                            >
                                                {communityClub.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    communityClub.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                            >
                                                {communityClub.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {communityClub.description && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                                        <p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-white">{communityClub.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activities */}
                        {communityClub.activities && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                        <Activity className="mr-2 h-5 w-5" />
                                        Aktivitas Komunitas
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    <ul className="space-y-2">
                                        {formatActivities(communityClub.activities).map((activity, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mt-1.5 mr-2 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                                <span className="text-sm text-gray-900 dark:text-white">{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                    <Users className="mr-2 h-5 w-5" />
                                    Informasi Kontak
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    {communityClub.contact_person && (
                                        <div className="flex items-center">
                                            <Users className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penanggung Jawab</label>
                                                <p className="text-sm text-gray-900 dark:text-white">{communityClub.contact_person}</p>
                                            </div>
                                        </div>
                                    )}

                                    {communityClub.contact_phone && (
                                        <div className="flex items-center">
                                            <Phone className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                                                <p className="text-sm text-gray-900 dark:text-white">{communityClub.contact_phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {communityClub.contact_email && (
                                        <div className="flex items-center">
                                            <Mail className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                                <p className="text-sm text-gray-900 dark:text-white">{communityClub.contact_email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Meeting Schedule & Location */}
                        {(communityClub.meeting_schedule || communityClub.location) && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Jadwal & Lokasi
                                    </h3>
                                </div>
                                <div className="space-y-4 px-6 py-4">
                                    {communityClub.meeting_schedule && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal Pertemuan</label>
                                            <p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                                                {communityClub.meeting_schedule}
                                            </p>
                                        </div>
                                    )}

                                    {communityClub.location && (
                                        <div className="flex items-start">
                                            <MapPin className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lokasi</label>
                                                <p className="mt-1 text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                                                    {communityClub.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image */}
                        {communityClub.image && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Foto Komunitas</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <img
                                        src={`/${communityClub.image}`}
                                        alt={communityClub.name}
                                        className="w-full rounded-lg object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Metadata</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                                    <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{communityClub.id}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urutan Tampilan</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{communityClub.sort_order}</p>
                                </div>

                                {communityClub.created_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dibuat</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {new Date(communityClub.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}

                                {communityClub.updated_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Terakhir Diupdate</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {new Date(communityClub.updated_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
