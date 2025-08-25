import { FormSection } from '@/components/admin/form-section';
import { InfoGrid, InfoItem } from '@/components/admin/info-display';
import { LoadingButton } from '@/components/admin/loading-button';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CommunityClub } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, ArrowLeft, Calendar, Edit, Mail, MapPin, Phone, Plus, Users } from 'lucide-react';
import React from 'react';

interface ShowCommunityClubProps {
    communityClub: CommunityClub;
}

export default function ShowCommunityClub({ communityClub }: ShowCommunityClubProps) {
    const [deleting, setDeleting] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Komunitas', href: '/admin/community-clubs' },
        { title: communityClub.name, href: `/admin/community-clubs/${communityClub.slug}` },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${communityClub.name}?`)) {
            setDeleting(true);
            router.delete(route('admin.community-clubs.destroy', communityClub.slug), {
                onFinish: () => setDeleting(false),
            });
        }
    };

    const formatActivities = (activities: string) => {
        if (!activities) return [];
        return activities.split('\n').filter((activity) => activity.trim() !== '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${communityClub.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                            <StatusBadge status={communityClub.type.toLowerCase()} />
                            <StatusBadge status={communityClub.is_active ? 'active' : 'inactive'} />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">{communityClub.name}</h1>

                        {communityClub.description && <p className="mb-4 text-lg leading-relaxed text-zinc-300">{communityClub.description}</p>}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col">
                        <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <Link href={route('admin.community-clubs.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <Link href={route('admin.community-clubs.edit', communityClub.slug)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <LoadingButton
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            loading={deleting}
                            loadingText="Menghapus..."
                            className="border-red-700 bg-red-900/20 text-red-400 hover:bg-red-900/40"
                            icon="delete"
                        >
                            Hapus
                        </LoadingButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <FormSection title="Informasi Dasar" icon={<Users className="h-5 w-5" />}>
                            <InfoGrid>
                                <InfoItem label="Nama Komunitas" value={communityClub.name} />
                                <InfoItem label="Slug URL" value={communityClub.slug} copyable className="font-mono" />
                                <InfoItem label="Tipe Komunitas" value={<StatusBadge status={communityClub.type.toLowerCase()} />} />
                                <InfoItem label="Status" value={<StatusBadge status={communityClub.is_active ? 'active' : 'inactive'} />} />
                            </InfoGrid>

                            {communityClub.description && (
                                <InfoItem label="Deskripsi" value={communityClub.description} type="multiline" className="mt-4" />
                            )}
                        </FormSection>

                        {/* Activities */}
                        {communityClub.activities && (
                            <FormSection title="Aktivitas Komunitas" icon={<Activity className="h-5 w-5" />}>
                                <ul className="space-y-2">
                                    {formatActivities(communityClub.activities).map((activity, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mt-1.5 mr-2 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                                            <span className="text-sm text-zinc-300">{activity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </FormSection>
                        )}

                        {/* Contact Information */}
                        <FormSection title="Informasi Kontak" icon={<Phone className="h-5 w-5" />}>
                            <InfoGrid>
                                {communityClub.contact_person && (
                                    <InfoItem label="Penanggung Jawab" value={communityClub.contact_person} icon={<Users className="h-4 w-4" />} />
                                )}
                                {communityClub.contact_phone && (
                                    <InfoItem
                                        label="Nomor Telepon"
                                        value={communityClub.contact_phone}
                                        type="phone"
                                        icon={<Phone className="h-4 w-4" />}
                                    />
                                )}
                                {communityClub.contact_email && (
                                    <InfoItem label="Email" value={communityClub.contact_email} type="email" icon={<Mail className="h-4 w-4" />} />
                                )}
                            </InfoGrid>
                        </FormSection>

                        {/* Meeting Schedule & Location */}
                        {(communityClub.meeting_schedule || communityClub.location) && (
                            <FormSection title="Jadwal & Lokasi" icon={<Calendar className="h-5 w-5" />}>
                                <InfoGrid>
                                    {communityClub.meeting_schedule && (
                                        <InfoItem
                                            label="Jadwal Pertemuan"
                                            value={communityClub.meeting_schedule}
                                            type="multiline"
                                            icon={<Calendar className="h-4 w-4" />}
                                        />
                                    )}
                                    {communityClub.location && (
                                        <InfoItem
                                            label="Lokasi"
                                            value={communityClub.location}
                                            type="multiline"
                                            icon={<MapPin className="h-4 w-4" />}
                                        />
                                    )}
                                </InfoGrid>
                            </FormSection>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image */}
                        {communityClub.image && (
                            <FormSection title="Gambar Komunitas" className="overflow-hidden">
                                <div className="-mx-6 -mb-4">
                                    <img src={`${communityClub.image}`} alt={communityClub.name} className="h-48 w-full object-cover" />
                                </div>
                            </FormSection>
                        )}

                        {/* Community Info */}
                        <FormSection title="Informasi Komunitas">
                            <InfoGrid cols={1}>
                                <InfoItem label="Tipe" value={<StatusBadge status={communityClub.type.toLowerCase()} />} />
                                <InfoItem label="Status" value={<StatusBadge status={communityClub.is_active ? 'active' : 'inactive'} />} />
                                <InfoItem label="Urutan Tampilan" value={communityClub.sort_order} />
                                <InfoItem label="Dibuat" value={communityClub.created_at} type="datetime" icon={<Calendar className="h-4 w-4" />} />
                                <InfoItem
                                    label="Diperbarui"
                                    value={communityClub.updated_at}
                                    type="datetime"
                                    icon={<Calendar className="h-4 w-4" />}
                                />
                            </InfoGrid>
                        </FormSection>

                        {/* Quick Actions */}
                        <FormSection title="Aksi Cepat">
                            <div className="space-y-3">
                                <Button asChild className="cta-button w-full justify-start">
                                    <Link href={route('admin.community-clubs.edit', communityClub.slug)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Komunitas
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                >
                                    <Link href={route('admin.community-clubs.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Komunitas Baru
                                    </Link>
                                </Button>
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
