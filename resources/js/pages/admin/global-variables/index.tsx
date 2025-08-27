import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Globe, Lock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AdminGlobalVariablesIndexProps {
    variables: Record<string, GlobalVariable[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/admin' },
    { title: 'Variabel Global', href: '/admin/global-variables' },
];

export default function AdminGlobalVariablesIndex({ variables }: AdminGlobalVariablesIndexProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GlobalVariable | null>(null);

    const handleDelete = (variable: GlobalVariable) => {
        setItemToDelete(variable);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            router.delete(route('admin.global-variables.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const getTypeColor = (type: string) => {
        const colors = {
            text: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            textarea: 'bg-green-500/20 text-green-400 border-green-500/30',
            number: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            email: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            url: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
            json: 'bg-red-500/20 text-red-400 border-red-500/30',
            boolean: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        };
        return colors[type as keyof typeof colors] || colors.text;
    };

    const truncateValue = (value: string, maxLength: number = 50) => {
        if (!value) return '-';
        return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Variabel Global" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Variabel Global</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Kelola pengaturan global dan informasi situs web</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <Link href={route('admin.global-variables.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Variabel
                        </Link>
                    </Button>
                </div>

                {Object.keys(variables).length === 0 ? (
                    <div className="section-card p-12">
                        <div className="text-center">
                            <div className="text-zinc-500 dark:text-zinc-400">Belum ada variabel global yang terdaftar.</div>
                            <Button variant="outline" asChild className="mt-4 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                                <Link href={route('admin.global-variables.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Variabel Pertama
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(variables).map(([category, categoryVariables]) => (
                            <div key={category} className="section-card">
                                <div className="border-b border-zinc-700 px-6 py-4">
                                    <h3 className="text-lg font-medium text-zinc-900 capitalize dark:text-white">
                                        {category === 'company' && 'Informasi Perusahaan'}
                                        {category === 'contact' && 'Informasi Kontak'}
                                        {category === 'homepage' && 'Halaman Utama'}
                                        {category === 'about_us' && 'Tentang Kami'}
                                        {category === 'social' && 'Media Sosial'}
                                        {category === 'general' && 'Umum'}
                                        {!['company', 'contact', 'social', 'general', 'homepage', 'about_us'].includes(category) && category}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-700">
                                        <thead className="bg-zinc-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Kunci
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Nilai
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Tipe
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Visibilitas
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Tindakan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-700">
                                            {categoryVariables.map((variable) => (
                                                <tr key={variable.id} className="hover:bg-zinc-800/50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{variable.key}</div>
                                                        {variable.description && (
                                                            <div className="text-sm text-zinc-500 dark:text-zinc-400">{variable.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs text-sm text-zinc-900 dark:text-white">
                                                            {variable.type === 'boolean' ? (
                                                                <span
                                                                    className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${
                                                                        variable.value === '1'
                                                                            ? 'border-green-500/30 bg-green-500/20 text-green-400'
                                                                            : 'border-red-500/30 bg-red-500/20 text-red-400'
                                                                    }`}
                                                                >
                                                                    {variable.value === '1' ? 'Ya' : 'Tidak'}
                                                                </span>
                                                            ) : (
                                                                <span className={variable.type === 'textarea' ? 'whitespace-pre-wrap' : ''}>
                                                                    {truncateValue(variable.value || '')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getTypeColor(variable.type)}`}
                                                        >
                                                            {variable.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {variable.is_public ? (
                                                                <>
                                                                    <Globe className="mr-1 h-4 w-4 text-green-400" />
                                                                    <span className="text-sm text-green-400">Publik</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="mr-1 h-4 w-4 text-red-400" />
                                                                    <span className="text-sm text-red-400">Privat</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route('admin.global-variables.show', variable.id)}
                                                                className="text-blue-400 transition-colors hover:text-blue-300"
                                                                title="Lihat Detail"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.global-variables.edit', variable.id)}
                                                                className="text-amber-400 transition-colors hover:text-amber-300"
                                                                title="Ubah"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(variable)}
                                                                className="text-red-400 transition-colors hover:text-red-300"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Hapus Variabel Global"
                    description={`Apakah Anda yakin ingin menghapus variabel "${itemToDelete?.key}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus Variabel"
                    itemName={itemToDelete?.key}
                />
            </div>
        </AppLayout>
    );
}
