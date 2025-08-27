import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Copy, Edit, Eye, EyeOff, Globe, Lock, Plus, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ShowGlobalVariableProps {
    variable: GlobalVariable;
}

export default function ShowGlobalVariable({ variable }: ShowGlobalVariableProps) {
    const [showValue, setShowValue] = useState(variable.type !== 'json');
    const [copied, setCopied] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dasbor', href: '/admin' },
        { title: 'Variabel Global', href: '/admin/global-variables' },
        { title: variable.key, href: `/admin/global-variables/${variable.id}` },
    ];

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.global-variables.destroy', variable.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Gagal menyalin: ', err);
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

    const getCategoryLabel = (category: string) => {
        const labels = {
            company: 'Informasi Perusahaan',
            contact: 'Informasi Kontak',
            social: 'Media Sosial',
            general: 'Umum',
            seo: 'SEO',
            config: 'Konfigurasi',
        };
        return labels[category as keyof typeof labels] || category;
    };

    const formatValue = (value: string, type: string) => {
        if (!value) return '(kosong)';

        switch (type) {
            case 'boolean':
                return value === '1' ? 'Benar' : 'Salah';
            case 'json':
                try {
                    return JSON.stringify(JSON.parse(value), null, 2);
                } catch {
                    return value;
                }
            case 'textarea':
                return value;
            default:
                return value;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${variable.key}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{variable.key}</h1>
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
                        </div>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{variable.description || 'Detail variabel global'}</p>
                    </div>

                    <div className="flex space-x-3">
                        <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <Link href={route('admin.global-variables.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white">
                            <Link href={route('admin.global-variables.edit', variable.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Ubah
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Variable Info */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Informasi Variabel</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-300">Kunci</label>
                                        <div className="flex items-center space-x-2">
                                            <p className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-white">
                                                {variable.key}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(variable.key)}
                                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                            >
                                                {copied ? 'Disalin!' : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-300">Tipe Data</label>
                                        <div>
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getTypeColor(variable.type)}`}
                                            >
                                                {variable.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-300">Kategori</label>
                                        <div>
                                            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300">
                                                <Tag className="mr-1 h-3 w-3" />
                                                {getCategoryLabel(variable.category)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-300">Akses</label>
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
                                    </div>
                                </div>

                                {variable.description && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-300">Deskripsi</label>
                                        <p className="mt-1 text-sm text-zinc-300">{variable.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variable Value */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Nilai Variabel</h3>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowValue(!showValue)}
                                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                        >
                                            {showValue ? (
                                                <>
                                                    <EyeOff className="mr-1 h-3 w-3" />
                                                    Sembunyikan
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    Tampilkan
                                                </>
                                            )}
                                        </Button>
                                        {variable.value && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(variable.value || '')}
                                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                            >
                                                <Copy className="mr-1 h-3 w-3" />
                                                {copied ? 'Disalin!' : 'Salin'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {showValue ? (
                                    <div className="space-y-4">
                                        {variable.type === 'boolean' ? (
                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${
                                                        variable.value === '1'
                                                            ? 'border-green-500/30 bg-green-500/20 text-green-400'
                                                            : 'border-red-500/30 bg-red-500/20 text-red-400'
                                                    }`}
                                                >
                                                    {variable.value === '1' ? 'Benar' : 'Salah'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                className={`rounded-lg border border-zinc-700 p-4 ${
                                                    variable.type === 'json' ? 'bg-zinc-800 font-mono text-sm' : 'bg-zinc-800'
                                                }`}
                                            >
                                                <pre className={`whitespace-pre-wrap ${variable.type === 'json' ? 'text-xs' : 'text-sm'} text-white`}>
                                                    {formatValue(variable.value || '', variable.type)}
                                                </pre>
                                            </div>
                                        )}

                                        {variable.type === 'url' && variable.value && (
                                            <div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                                >
                                                    <a href={variable.value} target="_blank" rel="noopener noreferrer">
                                                        Kunjungi URL
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-zinc-500">
                                        <Lock className="mx-auto mb-2 h-8 w-8" />
                                        <p>Nilai disembunyikan</p>
                                        <p className="text-sm">Klik "Tampilkan" untuk melihat nilai</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Usage Examples */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Contoh Penggunaan</h3>
                            </div>
                            <div className="space-y-4">
                                {variable.is_public ? (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium text-zinc-300">Frontend (React/JavaScript)</h4>
                                        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
                                            <code className="text-sm text-zinc-300">
                                                {`// Menggunakan helper global\nconst value = globalVar('${variable.key}');\n\n// Atau dari props\nconst value = globalVariables.${variable.key};`}
                                            </code>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-yellow-600/30 bg-yellow-500/10 p-4">
                                        <p className="text-sm text-yellow-400">
                                            <Lock className="mr-1 inline h-4 w-4" />
                                            Variabel ini privat dan hanya dapat diakses dari backend/controller.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-zinc-300">Backend (Laravel/PHP)</h4>
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
                                        <code className="text-sm text-zinc-300">
                                            {`// Menggunakan helper\n$value = globalVar('${variable.key}');\n\n// Atau model GlobalVariable\n$value = GlobalVariable::getValue('${variable.key}');`}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Statistik</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-sm text-zinc-400">ID</span>
                                    <span className="font-mono text-sm font-medium text-white">{variable.id}</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-sm text-zinc-400">Panjang Nilai</span>
                                    <span className="text-sm font-medium text-white">{variable.value ? variable.value.length : 0} karakter</span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                                    <span className="text-sm text-zinc-400">Tingkat Akses</span>
                                    <span className={`text-sm font-medium ${variable.is_public ? 'text-green-400' : 'text-red-400'}`}>
                                        {variable.is_public ? 'Publik' : 'Privat'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Metadata</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-lg bg-zinc-800 p-3">
                                    <label className="mb-1 block text-sm font-medium text-zinc-400">Dibuat</label>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-zinc-500" />
                                        <p className="text-sm text-white">{formatDate(variable.created_at)}</p>
                                    </div>
                                </div>

                                {variable.updated_at && (
                                    <div className="rounded-lg bg-zinc-800 p-3">
                                        <label className="mb-1 block text-sm font-medium text-zinc-400">Terakhir Diperbarui</label>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-zinc-500" />
                                            <p className="text-sm text-white">{formatDate(variable.updated_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="section-card p-6">
                            <div className="mb-6 border-b border-zinc-700 pb-4">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Tindakan Cepat</h3>
                            </div>
                            <div className="space-y-3">
                                <Button variant="outline" asChild className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                                    <Link href={route('admin.global-variables.edit', variable.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Variabel
                                    </Link>
                                </Button>

                                <Button variant="destructive" onClick={handleDelete} className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Variabel
                                </Button>

                                <Button variant="outline" asChild className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-700">
                                    <Link href={route('admin.global-variables.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Variabel Baru
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Hapus Variabel Global"
                    description={`Apakah Anda yakin ingin menghapus variabel "${variable.key}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus Variabel"
                    itemName={variable.key}
                />
            </div>
        </AppLayout>
    );
}
