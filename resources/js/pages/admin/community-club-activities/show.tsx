import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { CommunityClubActivity } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react';

interface Props {
    communityClubActivity: CommunityClubActivity;
}

export default function Show({ communityClubActivity }: Props) {
    return (
        <AdminLayout>
            <Head title={communityClubActivity.title} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.community-club-activities.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Aktivitas
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">{communityClubActivity.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('admin.community-club-activities.edit', communityClubActivity.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Ubah
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
                                    // Handle delete
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Aktivitas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Komunitas</label>
                                        <p className="text-lg">{communityClubActivity.community_club?.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={communityClubActivity.status === 'active' ? 'default' : 'secondary'}>
                                                {communityClubActivity.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {communityClubActivity.max_participants && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Jumlah Peserta Maks</label>
                                            <p className="text-lg">{communityClubActivity.max_participants}</p>
                                        </div>
                                    )}

                                    {communityClubActivity.duration && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Durasi</label>
                                            <p className="text-lg">{communityClubActivity.duration}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                    <p className="mt-1 text-gray-700">{communityClubActivity.description}</p>
                                </div>

                                {communityClubActivity.short_description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Deskripsi Singkat</label>
                                        <p className="mt-1 text-gray-700">{communityClubActivity.short_description}</p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-500">Aktivitas Unggulan</label>
                                    <Badge variant={communityClubActivity.featured ? 'destructive' : 'secondary'}>
                                        {communityClubActivity.featured ? 'Ya' : 'Tidak'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Details */}
                        {(communityClubActivity.schedule || communityClubActivity.location || communityClubActivity.contact_info) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Aktivitas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {communityClubActivity.schedule && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Jadwal</label>
                                            <p className="mt-1 text-gray-700">{communityClubActivity.schedule}</p>
                                        </div>
                                    )}

                                    {communityClubActivity.location && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Lokasi</label>
                                            <p className="mt-1 text-gray-700">{communityClubActivity.location}</p>
                                        </div>
                                    )}

                                    {communityClubActivity.contact_info && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Informasi Kontak</label>
                                            <p className="mt-1 text-gray-700">{communityClubActivity.contact_info}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits */}
                        {communityClubActivity.benefits && communityClubActivity.benefits.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manfaat</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {communityClubActivity.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Requirements */}
                        {communityClubActivity.requirements && communityClubActivity.requirements.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Persyaratan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {communityClubActivity.requirements.map((requirement, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                <span>{requirement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Activity Image */}
                        {communityClubActivity.image && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gambar Aktivitas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <img
                                            src={`/storage/${communityClubActivity.image}`}
                                            alt={communityClubActivity.title}
                                            className="h-48 w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Link href={`/storage/${communityClubActivity.image}`} target="_blank">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={route('admin.community-club-activities.edit', communityClubActivity.id)} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Ubah Aktivitas
                                    </Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
                                            // Handle delete
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Aktivitas
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Activity Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Aktivitas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Dibuat</span>
                                    <span className="text-sm">{new Date(communityClubActivity.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Terakhir Diperbarui</span>
                                    <span className="text-sm">{new Date(communityClubActivity.updated_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">ID</span>
                                    <span className="font-mono text-sm">{communityClubActivity.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
