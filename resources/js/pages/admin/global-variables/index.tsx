import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Globe, Lock, Plus, Trash2 } from 'lucide-react';

interface AdminGlobalVariablesIndexProps {
    variables: Record<string, GlobalVariable[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Variabel Global', href: '/admin/global-variables' },
];

export default function AdminGlobalVariablesIndex({ variables }: AdminGlobalVariablesIndexProps) {
    const handleDelete = (variable: GlobalVariable) => {
        if (confirm(`Apakah Anda yakin ingin menghapus variabel ${variable.key}?`)) {
            router.delete(route('admin.global-variables.destroy', variable.id));
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

    const truncateValue = (value: string, maxLength: number = 50) => {
        if (!value) return '-';
        return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Variabel Global" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kelola Variabel Global</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola pengaturan dan informasi global website</p>
                    </div>
                    <Link href={route('admin.global-variables.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Variabel
                        </Button>
                    </Link>
                </div>

                {Object.keys(variables).length === 0 ? (
                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="py-12 text-center">
                            <div className="text-gray-500 dark:text-gray-400">Belum ada variabel global yang terdaftar.</div>
                            <Link href={route('admin.global-variables.create')} className="mt-4 inline-block">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Variabel Pertama
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(variables).map(([category, categoryVariables]) => (
                            <div key={category} className="rounded-lg bg-white shadow dark:bg-gray-800">
                                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 capitalize dark:text-white">
                                        {category === 'company' && 'Informasi Perusahaan'}
                                        {category === 'contact' && 'Informasi Kontak'}
                                        {category === 'social' && 'Media Sosial'}
                                        {category === 'general' && 'Umum'}
                                        {!['company', 'contact', 'social', 'general'].includes(category) && category}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Kunci
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Nilai
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Tipe
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Visibilitas
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                            {categoryVariables.map((variable) => (
                                                <tr key={variable.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{variable.key}</div>
                                                        {variable.description && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{variable.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs text-sm text-gray-900 dark:text-white">
                                                            {variable.type === 'boolean' ? (
                                                                <span
                                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                                        variable.value === '1'
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(variable.type)}`}
                                                        >
                                                            {variable.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route('admin.global-variables.show', variable.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.global-variables.edit', variable.id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(variable)}
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
