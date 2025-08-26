import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/AdminLayout';
import { BusinessUnit, BusinessUnitService } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    businessUnitService: BusinessUnitService;
    businessUnits: BusinessUnit[];
    errors: Record<string, string>;
}

interface ProcessStep {
    title: string;
    description: string;
    order: number;
}

type FormDataValue = string | boolean | File | null | string[] | ProcessStep[];

export default function Edit({ businessUnitService, businessUnits, errors }: Props) {
    const [formData, setFormData] = useState({
        business_unit_id: businessUnitService.business_unit_id?.toString() || '',
        title: businessUnitService.title || '',
        description: businessUnitService.description || '',
        short_description: businessUnitService.short_description || '',
        price: businessUnitService.price?.toString() || '',
        duration: businessUnitService.duration || '',
        status: businessUnitService.status || 'active',
        featured: businessUnitService.featured || false,
        image: null as File | null,
        features: businessUnitService.features?.length ? businessUnitService.features : [''],
        technologies: businessUnitService.technologies?.length ? businessUnitService.technologies : [''],
        process_steps: businessUnitService.process_steps?.length ? businessUnitService.process_steps : [{ title: '', description: '', order: 1 }],
    });

    const [currentImage] = useState(businessUnitService.image);

    const handleInputChange = (field: string, value: FormDataValue) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field as keyof typeof prev].map((item: string | ProcessStep, i: number) => (i === index ? value : item)),
        }));
    };

    const addArrayItem = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [
                ...prev[field as keyof typeof prev],
                field === 'process_steps' ? { title: '', description: '', order: prev.process_steps.length + 1 } : '',
            ],
        }));
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field as keyof typeof prev].filter((_: string | ProcessStep, i: number) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (key === 'features' || key === 'technologies') {
                    data.append(key, JSON.stringify(value.filter((item: string) => item.trim() !== '')));
                } else if (key === 'process_steps') {
                    data.append(key, JSON.stringify(value.filter((item: ProcessStep) => item.title.trim() !== '')));
                } else if (key === 'image' && value instanceof File) {
                    data.append(key, value);
                } else if (key !== 'image') {
                    data.append(key, value.toString());
                }
            }
        });

        // Add method spoofing for PUT request
        data.append('_method', 'PUT');

        router.post(route('admin.business-unit-services.update', businessUnitService.id), data);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${businessUnitService.title}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.business-unit-services.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Layanan
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Ubah Layanan Unit Bisnis</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="business_unit_id">Unit Bisnis *</Label>
                                    <Select value={formData.business_unit_id} onValueChange={(value) => handleInputChange('business_unit_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Unit Bisnis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessUnits.map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                                    {unit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.business_unit_id && <p className="mt-1 text-sm text-red-600">{errors.business_unit_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="title">Judul *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Judul layanan"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Deskripsi layanan"
                                    rows={4}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="short_description">Deskripsi Singkat</Label>
                                <Textarea
                                    id="short_description"
                                    value={formData.short_description}
                                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                                    placeholder="Deskripsi singkat untuk daftar"
                                    rows={2}
                                />
                                {errors.short_description && <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="price">Harga</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="duration">Durasi</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        placeholder="mis., 2 minggu"
                                    />
                                    {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                                />
                                <Label htmlFor="featured">Layanan Unggulan</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar Layanan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentImage && (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`/storage/${currentImage}`}
                                        alt="Gambar layanan saat ini"
                                        className="h-32 w-32 rounded-lg object-cover"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm text-gray-600">Gambar saat ini</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="image">Perbarui Gambar Layanan</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange('image', e.target.files?.[0] || null)}
                                />
                                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fitur</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                                        placeholder="Deskripsi fitur"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('features', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('features')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Fitur
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Teknologi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.technologies.map((tech, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={tech}
                                        onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                                        placeholder="Nama teknologi"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('technologies', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('technologies')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Teknologi
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Langkah Proses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.process_steps.map((step, index) => (
                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={step.title}
                                            onChange={(e) => handleArrayChange('process_steps', index, { ...step, title: e.target.value })}
                                            placeholder="Judul langkah"
                                        />
                                        <Input
                                            type="number"
                                            value={step.order}
                                            onChange={(e) => handleArrayChange('process_steps', index, { ...step, order: parseInt(e.target.value) })}
                                            placeholder="Urutan"
                                            className="w-20"
                                        />
                                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('process_steps', index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={step.description}
                                        onChange={(e) => handleArrayChange('process_steps', index, { ...step, description: e.target.value })}
                                        placeholder="Deskripsi langkah"
                                        rows={2}
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('process_steps')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Langkah Proses
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href={route('admin.business-unit-services.index')}>
                            <Button variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit">Perbarui Layanan</Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
