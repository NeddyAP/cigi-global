import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Komunitas', href: '/admin/community-clubs' },
    { title: 'Tambah Baru', href: '/admin/community-clubs/create' },
];

const clubTypes = [
    { value: 'Olahraga', label: 'Olahraga' },
    { value: 'Keagamaan', label: 'Keagamaan' },
    { value: 'Lingkungan', label: 'Lingkungan' },
    { value: 'Sosial', label: 'Sosial' },
    { value: 'Budaya', label: 'Budaya' },
    { value: 'Pendidikan', label: 'Pendidikan' },
    { value: 'Kesehatan', label: 'Kesehatan' },
];

export default function CreateCommunityClub() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        type: '',
        activities: '',
        image: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        meeting_schedule: '',
        location: '',
        is_active: true,
        sort_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.community-clubs.store'));
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
                .trim('-');
            setData('slug', slug);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Komunitas" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tambah Komunitas Baru</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Isi form di bawah untuk menambah komunitas baru</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('admin.community-clubs.index')}>
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
                                    <Label htmlFor="name">Nama Komunitas *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Contoh: PB Cigi"
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
                                        placeholder="contoh: pb-cigi"
                                        className={errors.slug ? 'border-red-500' : ''}
                                    />
                                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="type">Tipe Komunitas *</Label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.type ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Pilih Tipe Komunitas</option>
                                        {clubTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="image">Path Gambar</Label>
                                    <Input
                                        id="image"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="assets/community/pb-cigi.jpg"
                                        className={errors.image ? 'border-red-500' : ''}
                                    />
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat tentang komunitas"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="activities">Aktivitas (pisahkan dengan enter)</Label>
                                <Textarea
                                    id="activities"
                                    value={data.activities}
                                    onChange={(e) => setData('activities', e.target.value)}
                                    placeholder="Latihan Rutin&#10;Turnamen Bulutangkis&#10;Kelas Pelatihan"
                                    rows={4}
                                    className={errors.activities ? 'border-red-500' : ''}
                                />
                                {errors.activities && <p className="mt-1 text-sm text-red-600">{errors.activities}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informasi Kontak</h3>
                        </div>
                        <div className="space-y-4 px-6 py-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="contact_person">Nama Kontak</Label>
                                    <Input
                                        id="contact_person"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        placeholder="Nama penanggung jawab"
                                        className={errors.contact_person ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="contact_phone">Nomor Telepon</Label>
                                    <Input
                                        id="contact_phone"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        placeholder="+62 812 3456 7890"
                                        className={errors.contact_phone ? 'border-red-500' : ''}
                                    />
                                    {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="contact_email">Email</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    placeholder="pbcigi@gmail.com"
                                    className={errors.contact_email ? 'border-red-500' : ''}
                                />
                                {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="meeting_schedule">Jadwal Pertemuan</Label>
                                <Textarea
                                    id="meeting_schedule"
                                    value={data.meeting_schedule}
                                    onChange={(e) => setData('meeting_schedule', e.target.value)}
                                    placeholder="Selasa & Kamis: 19:00 - 21:00&#10;Sabtu: 16:00 - 18:00"
                                    rows={3}
                                    className={errors.meeting_schedule ? 'border-red-500' : ''}
                                />
                                {errors.meeting_schedule && <p className="mt-1 text-sm text-red-600">{errors.meeting_schedule}</p>}
                            </div>

                            <div>
                                <Label htmlFor="location">Lokasi</Label>
                                <Textarea
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="GOR Bulutangkis Cigi, Jl. Olahraga No. 123"
                                    rows={2}
                                    className={errors.location ? 'border-red-500' : ''}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
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
                                        aria-label="Komunitas Aktif"
                                    >
                                        {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </Toggle>
                                    <Label>Komunitas Aktif</Label>
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
                            <a href={route('admin.community-clubs.index')}>Batal</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Komunitas'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
