import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Info, Save } from 'lucide-react';

interface EditGlobalVariableProps {
    variable: GlobalVariable;
}

const variableTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'json', label: 'JSON' },
    { value: 'boolean', label: 'Boolean' },
];

const variableCategories = [
    { value: 'company', label: 'Informasi Perusahaan' },
    { value: 'contact', label: 'Informasi Kontak' },
    { value: 'social', label: 'Media Sosial' },
    { value: 'general', label: 'Umum' },
    { value: 'seo', label: 'SEO' },
    { value: 'config', label: 'Konfigurasi' },
];

export default function EditGlobalVariable({ variable }: EditGlobalVariableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Variabel Global', href: '/admin/global-variables' },
        { title: variable.key, href: `/admin/global-variables/${variable.id}` },
        { title: 'Edit', href: `/admin/global-variables/${variable.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        key: variable.key || '',
        value: variable.value || '',
        type: variable.type || 'text',
        category: variable.category || 'general',
        description: variable.description || '',
        is_public: variable.is_public ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.global-variables.update', variable.id));
    };

    const getTypeDescription = (type: string) => {
        const descriptions = {
            text: 'Teks sederhana, maksimal 255 karakter',
            textarea: 'Teks panjang dengan line breaks',
            number: 'Angka (integer atau decimal)',
            email: 'Format email yang valid',
            url: 'URL yang valid (http/https)',
            json: 'Data dalam format JSON',
            boolean: 'True/False (1/0)',
        };
        return descriptions[type as keyof typeof descriptions] || '';
    };

    const renderValueInput = () => {
        switch (data.type) {
            case 'textarea':
                return (
                    <Textarea
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Masukkan nilai variabel..."
                        rows={4}
                        className={errors.value ? 'border-red-500' : ''}
                    />
                );
            case 'number':
                return (
                    <Input
                        id="value"
                        type="number"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="0"
                        className={errors.value ? 'border-red-500' : ''}
                    />
                );
            case 'email':
                return (
                    <Input
                        id="value"
                        type="email"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="user@example.com"
                        className={errors.value ? 'border-red-500' : ''}
                    />
                );
            case 'url':
                return (
                    <Input
                        id="value"
                        type="url"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="https://example.com"
                        className={errors.value ? 'border-red-500' : ''}
                    />
                );
            case 'json':
                return (
                    <Textarea
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder='{"key": "value"}'
                        rows={6}
                        className={`font-mono ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center space-x-3">
                        <Toggle
                            pressed={data.value === '1'}
                            onPressedChange={(pressed) => setData('value', pressed ? '1' : '0')}
                            aria-label="Boolean Value"
                        >
                            {data.value === '1' ? 'True' : 'False'}
                        </Toggle>
                        <Label>Nilai Boolean</Label>
                    </div>
                );
            default:
                return (
                    <Input
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Masukkan nilai variabel..."
                        className={errors.value ? 'border-red-500' : ''}
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${variable.key}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Variabel Global</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Edit variabel "{variable.key}"</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('admin.global-variables.show', variable.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Dasar</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="key">Kunci Variabel *</Label>
                                    <Input
                                        id="key"
                                        value={data.key}
                                        onChange={(e) => setData('key', e.target.value)}
                                        placeholder="company_name"
                                        className={`font-mono ${errors.key ? 'border-red-500' : ''}`}
                                    />
                                    {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
                                    <p className="mt-1 text-sm text-gray-500">Gunakan format snake_case (huruf kecil dengan underscore)</p>
                                </div>

                                <div>
                                    <Label htmlFor="category">Kategori *</Label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.category ? 'border-red-500' : ''}`}
                                    >
                                        {variableCategories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi penggunaan variabel ini"
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="type">Tipe Data *</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.type ? 'border-red-500' : ''}`}
                                >
                                    {variableTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                <p className="mt-1 text-sm text-gray-500">{getTypeDescription(data.type)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nilai Variabel</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div>
                                <Label htmlFor="value">Nilai {data.type !== 'boolean' && '*'}</Label>
                                {renderValueInput()}
                                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                                {data.type === 'json' && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pastikan format JSON valid. Contoh: {'{'}"name": "value", "number": 123{'}'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pengaturan Akses</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div className="flex items-start space-x-3">
                                <Toggle
                                    pressed={data.is_public}
                                    onPressedChange={(pressed) => setData('is_public', pressed)}
                                    aria-label="Akses Publik"
                                >
                                    {data.is_public ? 'Publik' : 'Privat'}
                                </Toggle>
                                <div>
                                    <Label>Akses Publik</Label>
                                    <div className="mt-1 flex items-start">
                                        <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-500" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {data.is_public
                                                ? 'Variabel ini dapat diakses dari frontend dan API publik'
                                                : 'Variabel ini hanya dapat diakses dari backend/admin'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current vs New Value Comparison */}
                    {variable.value !== data.value && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                            <div className="px-6 py-4">
                                <div className="flex items-start">
                                    <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-yellow-500" />
                                    <div className="w-full">
                                        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Perubahan Terdeteksi</h4>
                                        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Nilai Saat Ini:</p>
                                                <p className="mt-1 rounded border bg-white p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-white">
                                                    {variable.type === 'boolean'
                                                        ? variable.value === '1'
                                                            ? 'True'
                                                            : 'False'
                                                        : variable.value || '(kosong)'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Nilai Baru:</p>
                                                <p className="mt-1 rounded border bg-white p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-white">
                                                    {data.type === 'boolean' ? (data.value === '1' ? 'True' : 'False') : data.value || '(kosong)'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="px-6 py-4">
                            <div className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-500" />
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Informasi Variabel</h4>
                                    <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                                        <p>
                                            <strong>ID:</strong> {variable.id}
                                        </p>
                                        <p>
                                            <strong>Dibuat:</strong>{' '}
                                            {new Date(variable.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        {variable.updated_at && (
                                            <p>
                                                <strong>Terakhir Diupdate:</strong>{' '}
                                                {new Date(variable.updated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild>
                            <a href={route('admin.global-variables.show', variable.id)}>Batal</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
