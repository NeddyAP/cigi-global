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
    { title: 'Global Variables', href: '/admin/global-variables' },
];

export default function AdminGlobalVariablesIndex({ variables }: AdminGlobalVariablesIndexProps) {
    const handleDelete = (variable: GlobalVariable) => {
        if (confirm(`Are you sure you want to delete variable ${variable.key}?`)) {
            router.delete(route('admin.global-variables.destroy', variable.id));
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
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Global Variables</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage global settings and website information</p>
                    </div>

                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <Link href={route('admin.global-variables.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Variable
                        </Link>
                    </Button>
                </div>

                {Object.keys(variables).length === 0 ? (
                    <div className="section-card p-12">
                        <div className="text-center">
                            <div className="text-zinc-500 dark:text-zinc-400">No global variables registered yet.</div>
                            <Button variant="outline" asChild className="mt-4 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                                <Link href={route('admin.global-variables.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Variable
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
                                        {category === 'company' && 'Company Information'}
                                        {category === 'contact' && 'Contact Information'}
                                        {category === 'social' && 'Social Media'}
                                        {category === 'general' && 'General'}
                                        {!['company', 'contact', 'social', 'general'].includes(category) && category}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-700">
                                        <thead className="bg-zinc-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Key
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Value
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Visibility
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-zinc-300 uppercase">
                                                    Actions
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
                                                                    {variable.value === '1' ? 'Yes' : 'No'}
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
                                                                    <span className="text-sm text-green-400">Public</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="mr-1 h-4 w-4 text-red-400" />
                                                                    <span className="text-sm text-red-400">Private</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route('admin.global-variables.show', variable.id)}
                                                                className="text-blue-400 transition-colors hover:text-blue-300"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.global-variables.edit', variable.id)}
                                                                className="text-amber-400 transition-colors hover:text-amber-300"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(variable)}
                                                                className="text-red-400 transition-colors hover:text-red-300"
                                                                title="Delete"
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
