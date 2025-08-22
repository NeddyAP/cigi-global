import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Copy, Edit, Eye, EyeOff, Globe, Lock, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ShowGlobalVariableProps {
    variable: GlobalVariable;
}

export default function ShowGlobalVariable({ variable }: ShowGlobalVariableProps) {
    const [showValue, setShowValue] = useState(variable.type !== 'json');
    const [copied, setCopied] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Variabel Global', href: '/admin/global-variables' },
        { title: variable.key, href: `/admin/global-variables/${variable.id}` },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus variabel ${variable.key}?`)) {
            router.delete(route('admin.global-variables.destroy', variable.id));
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const getTypeColor = (type: string) => {
        const colors = {
            text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            textarea: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            number: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            email: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            url: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            json: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            boolean: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
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
                return value === '1' ? 'True' : 'False';
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
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{variable.key}</h1>
                            <div className="flex items-center">
                                {variable.is_public ? (
                                    <>
                                        <Globe className="mr-1 h-4 w-4 text-green-500" />
                                        <span className="text-sm text-green-600 dark:text-green-400">Publik</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-1 h-4 w-4 text-red-500" />
                                        <span className="text-sm text-red-600 dark:text-red-400">Privat</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{variable.description || 'Detail variabel global'}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.global-variables.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.global-variables.edit', variable.id)}>
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
                        {/* Variable Info */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Variabel</h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kunci</label>
                                        <div className="mt-1 flex items-center">
                                            <p className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-gray-700 dark:text-white">
                                                {variable.key}
                                            </p>
                                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(variable.key)} className="ml-2">
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Data</label>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(variable.type)}`}
                                            >
                                                {variable.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                <Tag className="mr-1 h-3 w-3" />
                                                {getCategoryLabel(variable.category)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Akses</label>
                                        <div className="mt-1 flex items-center">
                                            {variable.is_public ? (
                                                <>
                                                    <Globe className="mr-1 h-4 w-4 text-green-500" />
                                                    <span className="text-sm text-green-600 dark:text-green-400">Publik</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="mr-1 h-4 w-4 text-red-500" />
                                                    <span className="text-sm text-red-600 dark:text-red-400">Privat</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {variable.description && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{variable.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variable Value */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nilai Variabel</h3>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowValue(!showValue)}>
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
                                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(variable.value || '')}>
                                                <Copy className="mr-1 h-3 w-3" />
                                                {copied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4">
                                {showValue ? (
                                    <div className="space-y-4">
                                        {variable.type === 'boolean' ? (
                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                                                        variable.value === '1'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}
                                                >
                                                    {variable.value === '1' ? 'True' : 'False'}
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                className={`rounded-lg border p-4 ${
                                                    variable.type === 'json'
                                                        ? 'bg-gray-50 font-mono text-sm dark:bg-gray-900'
                                                        : 'bg-gray-50 dark:bg-gray-900'
                                                }`}
                                            >
                                                <pre
                                                    className={`whitespace-pre-wrap ${
                                                        variable.type === 'json' ? 'text-xs' : 'text-sm'
                                                    } text-gray-900 dark:text-white`}
                                                >
                                                    {formatValue(variable.value || '', variable.type)}
                                                </pre>
                                            </div>
                                        )}

                                        {variable.type === 'url' && variable.value && (
                                            <div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={variable.value} target="_blank" rel="noopener noreferrer">
                                                        Kunjungi URL
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        <Lock className="mx-auto mb-2 h-8 w-8" />
                                        <p>Nilai disembunyikan</p>
                                        <p className="text-sm">Klik "Tampilkan" untuk melihat nilai</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Usage Examples */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contoh Penggunaan</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                {variable.is_public ? (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Frontend (React/JavaScript)</h4>
                                        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900">
                                            <code className="text-sm text-gray-900 dark:text-white">
                                                {`// Menggunakan helper global\nconst value = globalVar('${variable.key}');\n\n// Atau dari props\nconst value = globalVariables.${variable.key};`}
                                            </code>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <Lock className="mr-1 inline h-4 w-4" />
                                            Variabel ini bersifat privat dan hanya dapat diakses dari backend/controller.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Backend (Laravel/PHP)</h4>
                                    <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900">
                                        <code className="text-sm text-gray-900 dark:text-white">
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
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statistik</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">ID</span>
                                    <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">{variable.id}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Panjang Nilai</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {variable.value ? variable.value.length : 0} karakter
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Akses Level</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            variable.is_public ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {variable.is_public ? 'Publik' : 'Privat'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Metadata</h3>
                            </div>
                            <div className="space-y-4 px-6 py-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dibuat</label>
                                    <div className="mt-1 flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(variable.created_at)}</p>
                                    </div>
                                </div>

                                {variable.updated_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Terakhir Diupdate</label>
                                        <div className="mt-1 flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                            <p className="text-sm text-gray-900 dark:text-white">{formatDate(variable.updated_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aksi Cepat</h3>
                            </div>
                            <div className="space-y-3 px-6 py-4">
                                <Link href={route('admin.global-variables.edit', variable.id)} className="block">
                                    <Button className="w-full" variant="outline">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Variabel
                                    </Button>
                                </Link>

                                <Button className="w-full" variant="outline" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Variabel
                                </Button>

                                <Link href={route('admin.global-variables.create')} className="block">
                                    <Button className="w-full">Buat Variabel Baru</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
