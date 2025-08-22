import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, BusinessUnit } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface AdminBusinessUnitsIndexProps {
    businessUnits: BusinessUnit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Unit Bisnis', href: '/admin/business-units' },
];

export default function AdminBusinessUnitsIndex({ businessUnits }: AdminBusinessUnitsIndexProps) {
    const handleDelete = (businessUnit: BusinessUnit) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${businessUnit.name}?`)) {
            router.delete(route('admin.business-units.destroy', businessUnit.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Unit Bisnis" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kelola Unit Bisnis</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola semua unit bisnis Cigi Global</p>
                    </div>
                    <Link href={route('admin.business-units.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Unit Bisnis
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Unit Bisnis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {businessUnits.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {unit.image && (
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-lg object-cover" src={`/${unit.image}`} alt={unit.name} />
                                                    </div>
                                                )}
                                                <div className={unit.image ? 'ml-4' : ''}>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{unit.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{unit.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{unit.contact_phone}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{unit.contact_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    unit.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                            >
                                                {unit.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{unit.sort_order}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('admin.business-units.show', unit.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.business-units.edit', unit.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(unit)}
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

                        {businessUnits.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="text-gray-500 dark:text-gray-400">Belum ada unit bisnis yang terdaftar.</div>
                                <Link href={route('admin.business-units.create')} className="mt-4 inline-block">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Unit Bisnis Pertama
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
