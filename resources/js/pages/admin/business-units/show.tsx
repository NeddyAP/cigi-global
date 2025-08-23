import { FormSection } from '@/components/admin/form-section';
import { InfoGrid, InfoItem } from '@/components/admin/info-display';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, Clock, Edit, Globe, Phone } from 'lucide-react';

interface ShowBusinessUnitProps {
    businessUnit: BusinessUnit;
}

export default function ShowBusinessUnit({ businessUnit }: ShowBusinessUnitProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Unit Bisnis', href: '/admin/business-units' },
        { title: businessUnit.name, href: `/admin/business-units/${businessUnit.id}` },
    ];

    const services = businessUnit.services?.split('\n').filter((service) => service.trim()) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${businessUnit.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                            <StatusBadge status={businessUnit.is_active ? 'active' : 'inactive'} />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">{businessUnit.name}</h1>

                        {businessUnit.description && <p className="mb-4 text-lg leading-relaxed text-zinc-300">{businessUnit.description}</p>}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col">
                        <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <Link href={route('admin.business-units.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="cta-button">
                            <Link href={route('admin.business-units.edit', businessUnit.slug)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <FormSection title="Informasi Dasar" icon={<Building2 className="h-5 w-5" />}>
                            <InfoGrid>
                                <InfoItem label="Nama" value={businessUnit.name} />
                                <InfoItem label="Slug URL" value={businessUnit.slug} copyable className="font-mono" />
                            </InfoGrid>

                            {businessUnit.description && (
                                <InfoItem label="Deskripsi" value={businessUnit.description} type="multiline" className="mt-4" />
                            )}

                            {services.length > 0 && (
                                <div className="mt-4">
                                    <label className="mb-2 block text-sm font-medium text-zinc-400">Layanan</label>
                                    <ul className="list-disc space-y-1 pl-5">
                                        {services.map((service, index) => (
                                            <li key={index} className="text-sm text-zinc-300">
                                                {service}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </FormSection>

                        {/* Contact Information */}
                        <FormSection title="Informasi Kontak" icon={<Phone className="h-5 w-5" />}>
                            <InfoGrid>
                                {businessUnit.contact_phone && <InfoItem label="Telepon" value={businessUnit.contact_phone} type="phone" />}
                                {businessUnit.contact_email && <InfoItem label="Email" value={businessUnit.contact_email} type="email" />}
                                {businessUnit.website_url && <InfoItem label="Website" value={businessUnit.website_url} type="url" />}
                            </InfoGrid>

                            {businessUnit.address && <InfoItem label="Alamat" value={businessUnit.address} type="multiline" className="mt-4" />}

                            {businessUnit.operating_hours && (
                                <InfoItem
                                    label="Jam Operasional"
                                    value={businessUnit.operating_hours}
                                    type="multiline"
                                    className="mt-4"
                                    icon={<Clock className="h-4 w-4" />}
                                />
                            )}
                        </FormSection>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image */}
                        {businessUnit.image && (
                            <FormSection title="Gambar" className="overflow-hidden">
                                <div className="-mx-6 -mb-4">
                                    <img src={`/${businessUnit.image}`} alt={businessUnit.name} className="h-48 w-full object-cover" />
                                </div>
                            </FormSection>
                        )}

                        {/* Settings & Info */}
                        <FormSection title="Informasi & Pengaturan">
                            <InfoGrid cols={1}>
                                <InfoItem label="Status" value={<StatusBadge status={businessUnit.is_active ? 'active' : 'inactive'} />} />
                                <InfoItem label="Urutan Tampilan" value={businessUnit.sort_order} />
                                <InfoItem label="Dibuat" value={businessUnit.created_at} type="datetime" icon={<Calendar className="h-4 w-4" />} />
                                <InfoItem
                                    label="Diperbarui"
                                    value={businessUnit.updated_at}
                                    type="datetime"
                                    icon={<Calendar className="h-4 w-4" />}
                                />
                            </InfoGrid>
                        </FormSection>

                        {/* Quick Actions */}
                        <FormSection title="Aksi Cepat">
                            <div className="space-y-3">
                                <Button asChild className="cta-button w-full justify-start">
                                    <Link href={route('admin.business-units.edit', businessUnit.slug)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Unit Bisnis
                                    </Link>
                                </Button>
                                {businessUnit.website_url && (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="w-full justify-start border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                    >
                                        <a href={businessUnit.website_url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Kunjungi Website
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                                >
                                    <Link href={route('admin.business-units.create')}>
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Tambah Unit Bisnis Baru
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
