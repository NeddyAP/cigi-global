import { FormSection } from '@/components/admin/form-section';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Database, Info, Settings } from 'lucide-react';

interface EditGlobalVariableProps {
    variable: GlobalVariable;
}

const variableTypes = [
    { value: 'text', label: 'Teks' },
    { value: 'textarea', label: 'Area Teks' },
    { value: 'number', label: 'Angka' },
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
        { title: 'Dasbor', href: '/admin' },
        { title: 'Variabel Global', href: '/admin/global-variables' },
        { title: variable.key, href: `/admin/global-variables/${variable.id}` },
        { title: 'Ubah', href: `/admin/global-variables/${variable.id}/edit` },
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
            text: 'Teks sederhana, maksimum 255 karakter',
            textarea: 'Teks panjang dengan baris baru',
            number: 'Angka (bilangan bulat atau desimal)',
            email: 'Format email yang valid',
            url: 'URL yang valid (http/https)',
            json: 'Data dalam format JSON',
            boolean: 'Benar/Salah (1/0)',
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
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
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
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
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
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
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
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
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
                        className={`border-zinc-700 bg-zinc-800 font-mono text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center space-x-3">
                        <Toggle
                            pressed={data.value === '1'}
                            onPressedChange={(pressed) => setData('value', pressed ? '1' : '0')}
                            aria-label="Nilai Boolean"
                        >
                            {data.value === '1' ? 'Benar' : 'Salah'}
                        </Toggle>
                        <Label className="text-zinc-300">Nilai Boolean</Label>
                    </div>
                );
            default:
                return (
                    <Input
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Masukkan nilai variabel..."
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ubah ${variable.key}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Edit Variabel Global</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Edit variabel "{variable.key}"</p>
                    </div>
                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.global-variables.show', variable.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Detail
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection title="Informasi Dasar" description="Kunci variabel dan detail kategori" icon={<Database className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="key" className="text-zinc-300">
                                    Kunci Variabel *
                                </Label>
                                <Input
                                    id="key"
                                    value={data.key}
                                    onChange={(e) => setData('key', e.target.value)}
                                    placeholder="nama_perusahaan"
                                    className={`border-zinc-700 bg-zinc-800 font-mono text-white placeholder:text-zinc-400 ${errors.key ? 'border-red-500' : ''}`}
                                />
                                {errors.key && <p className="mt-1 text-sm text-red-400">{errors.key}</p>}
                                <p className="mt-1 text-sm text-zinc-500">Gunakan format snake_case (huruf kecil dengan garis bawah)</p>
                            </div>

                            <div>
                                <Label htmlFor="category" className="text-zinc-300">
                                    Kategori *
                                </Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className={`w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${errors.category ? 'border-red-500' : ''}`}
                                >
                                    {variableCategories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-zinc-300">
                                Deskripsi
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi penggunaan variabel ini"
                                className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="type" className="text-zinc-300">
                                Tipe Data *
                            </Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className={`w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${errors.type ? 'border-red-500' : ''}`}
                            >
                                {variableTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-400">{errors.type}</p>}
                            <p className="mt-1 text-sm text-zinc-500">{getTypeDescription(data.type)}</p>
                        </div>
                    </FormSection>

                    <FormSection title="Nilai Variabel" description="Atur nilai variabel" icon={<Settings className="h-5 w-5" />}>
                        <div>
                            <Label htmlFor="value" className="text-zinc-300">
                                Nilai {data.type !== 'boolean' && '*'}
                            </Label>
                            {renderValueInput()}
                            {errors.value && <p className="mt-1 text-sm text-red-400">{errors.value}</p>}
                            {data.type === 'json' && (
                                <p className="mt-1 text-sm text-zinc-500">Pastikan format JSON valid. Contoh: {'{"name": "value", "number": 123}'}</p>
                            )}
                        </div>
                    </FormSection>

                    <FormSection title="Pengaturan Akses" description="Kontrol visibilitas variabel" icon={<Settings className="h-5 w-5" />}>
                        <div className="flex items-start space-x-3">
                            <Toggle pressed={data.is_public} onPressedChange={(pressed) => setData('is_public', pressed)} aria-label="Akses Publik">
                                {data.is_public ? 'Publik' : 'Privat'}
                            </Toggle>
                            <div>
                                <Label className="text-zinc-300">Akses Publik</Label>
                                <div className="mt-1 flex items-start">
                                    <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-400" />
                                    <p className="text-sm text-zinc-400">
                                        {data.is_public
                                            ? 'Variabel ini dapat diakses dari frontend dan API publik'
                                            : 'Variabel ini hanya dapat diakses dari backend/admin'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Current vs New Value Comparison */}
                    {variable.value !== data.value && (
                        <div className="rounded-lg border border-yellow-600/30 bg-yellow-500/10 p-6">
                            <div className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-yellow-400" />
                                <div className="w-full">
                                    <h4 className="text-sm font-medium text-yellow-300">Perubahan Terdeteksi</h4>
                                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-200">Nilai Saat Ini:</p>
                                            <p className="mt-1 rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white">
                                                {variable.type === 'boolean'
                                                    ? variable.value === '1'
                                                        ? 'Benar'
                                                        : 'Salah'
                                                    : variable.value || '(kosong)'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-200">Nilai Baru:</p>
                                            <p className="mt-1 rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white">
                                                {data.type === 'boolean' ? (data.value === '1' ? 'Benar' : 'Salah') : data.value || '(kosong)'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg border border-blue-600/30 bg-blue-500/10 p-6">
                        <div className="flex items-start">
                            <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-400" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-300">Informasi Variabel</h4>
                                <div className="mt-2 text-sm text-blue-200">
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
                                            <strong>Terakhir Diperbarui:</strong>{' '}
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

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.global-variables.show', variable.id)}>Batal</a>
                        </Button>
                        <LoadingButton type="submit" loading={processing} loadingText="Menyimpan..." icon="save" className="cta-button">
                            Simpan Perubahan
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
