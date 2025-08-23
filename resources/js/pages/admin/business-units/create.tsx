import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Unit Bisnis', href: '/admin/business-units' },
    { title: 'Tambah Baru', href: '/admin/business-units/create' },
];

export default function CreateBusinessUnit() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        services: '',
        image: '',
        contact_phone: '',
        contact_email: '',
        address: '',
        website_url: '',
        operating_hours: '',
        is_active: true,
        sort_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.business-units.store'));
    };

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setData('name', value);
        if (!data.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', slug);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Unit Bisnis" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tambah Unit Bisnis Baru</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Isi form di bawah untuk menambah unit bisnis baru</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('admin.business-units.index')}>
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
                                    <Label htmlFor="name">Nama Unit Bisnis *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Contoh: Cigi Net"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug URL *</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="contoh: cigi-net"
                                        className={errors.slug ? 'border-red-500' : ''}
                                    />
                                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat tentang unit bisnis"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="services">Layanan (pisahkan dengan enter)</Label>
                                <Textarea
                                    id="services"
                                    value={data.services}
                                    onChange={(e) => setData('services', e.target.value)}
                                    placeholder="Internet Rumahan&#10;Internet Bisnis&#10;Layanan WiFi"
                                    rows={4}
                                    className={errors.services ? 'border-red-500' : ''}
                                />
                                {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                            </div>

                            <ImageInput
                                label="Gambar Unit Bisnis"
                                name="image"
                                value={data.image}
                                onChange={(value) => setData('image', value ? String(value) : '')}
                                placeholder="Pilih atau upload gambar unit bisnis"
                                error={errors.image}
                                showPreview={true}
                                autoUpload={true}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Kontak</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="contact_phone">Nomor Telepon</Label>
                                    <Input
                                        id="contact_phone"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        placeholder="+62 21 1234 5678"
                                        className={errors.contact_phone ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="contact_email">Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="info@ciginet.com"
                                        className={errors.contact_email ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Teknologi No. 123, Jakarta Selatan"
                                    rows={2}
                                    className={errors.address ? 'border-red-500' : ''}
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div>
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://ciginet.com"
                                    className={errors.website_url ? 'border-red-500' : ''}
                                />
                                {errors.website_url && <p className="mt-1 text-sm text-red-600">{errors.website_url}</p>}
                            </div>

                            <div>
                                <Label htmlFor="operating_hours">Jam Operasional</Label>
                                <Textarea
                                    id="operating_hours"
                                    value={data.operating_hours}
                                    onChange={(e) => setData('operating_hours', e.target.value)}
                                    placeholder="Senin - Jumat: 08:00 - 17:00&#10;Sabtu: 08:00 - 15:00&#10;Minggu: Tutup"
                                    rows={3}
                                    className={errors.operating_hours ? 'border-red-500' : ''}
                                />
                                {errors.operating_hours && <p className="mt-1 text-sm text-red-600">{errors.operating_hours}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pengaturan</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-center space-x-3">
                                    <Toggle
                                        pressed={data.is_active}
                                        onPressedChange={(pressed) => setData('is_active', pressed)}
                                        aria-label="Unit Bisnis Aktif"
                                    >
                                        {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </Toggle>
                                    <Label>Unit Bisnis Aktif</Label>
                                </div>

                                <div>
                                    <Label htmlFor="sort_order">Urutan Tampilan</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className={errors.sort_order ? 'border-red-500' : ''}
                                    />
                                    {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild>
                            <a href={route('admin.business-units.index')}>Batal</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Unit Bisnis'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
