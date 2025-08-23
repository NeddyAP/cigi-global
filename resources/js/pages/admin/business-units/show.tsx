import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{businessUnit.name}</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Detail informasi unit bisnis</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="outline" asChild>
                            <a href={route('admin.business-units.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </a>
                        </Button>
                        <Button asChild>
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
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Dasar</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{businessUnit.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug URL</dt>
                                    <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                                        {businessUnit.slug}
                                        <Link
                                            href={route('business-units.show', businessUnit.slug)}
                                            className="ml-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                        >
                                            <ExternalLink className="inline h-4 w-4" />
                                        </Link>
                                    </dd>
                                </div>
                                {businessUnit.description && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</dt>
                                        <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{businessUnit.description}</dd>
                                    </div>
                                )}
                                {services.length > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Layanan</dt>
                                        <dd className="mt-1">
                                            <ul className="list-disc space-y-1 pl-5">
                                                {services.map((service, index) => (
                                                    <li key={index} className="text-sm text-gray-900 dark:text-white">
                                                        {service}
                                                    </li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Kontak</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                {businessUnit.contact_phone && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Telepon</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{businessUnit.contact_phone}</dd>
                                    </div>
                                )}
                                {businessUnit.contact_email && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{businessUnit.contact_email}</dd>
                                    </div>
                                )}
                                {businessUnit.address && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</dt>
                                        <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{businessUnit.address}</dd>
                                    </div>
                                )}
                                {businessUnit.website_url && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
                                        <dd className="mt-1 text-sm">
                                            <a
                                                href={businessUnit.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                            >
                                                {businessUnit.website_url}
                                                <ExternalLink className="ml-1 inline h-4 w-4" />
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {businessUnit.operating_hours && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Jam Operasional</dt>
                                        <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                                            {businessUnit.operating_hours}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image */}
                        {businessUnit.image && (
                            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gambar</h3>
                                </div>
                                <div className="p-6">
                                    <img src={`/${businessUnit.image}`} alt={businessUnit.name} className="h-48 w-full rounded-lg object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Settings */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pengaturan</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                                    <dd className="mt-1">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                businessUnit.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                        >
                                            {businessUnit.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Urutan Tampilan</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{businessUnit.sort_order}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(businessUnit.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Diperbarui</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(businessUnit.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
