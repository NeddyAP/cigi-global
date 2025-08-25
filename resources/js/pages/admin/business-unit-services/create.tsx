import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BusinessUnit } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    businessUnits: BusinessUnit[];
    errors: Record<string, string>;
}

interface ProcessStep {
    title: string;
    description: string;
    order: number;
}

type FormDataValue = string | boolean | File | null | string[] | ProcessStep[];

export default function Create({ businessUnits, errors }: Props) {
    const [formData, setFormData] = useState({
        business_unit_id: '',
        title: '',
        description: '',
        short_description: '',
        price: '',
        duration: '',
        status: 'active',
        featured: false,
        image: null as File | null,
        features: [''],
        technologies: [''],
        process_steps: [{ title: '', description: '', order: 1 }],
    });

    const handleInputChange = (field: string, value: FormDataValue) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as (string | ProcessStep)[]).map((item: string | ProcessStep, i: number) =>
                i === index ? value : item,
            ),
        }));
    };

    const handleProcessStepChange = (index: number, field: keyof ProcessStep, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            process_steps: prev.process_steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
        }));
    };

    const addArrayItem = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [
                ...(prev[field as keyof typeof prev] as (string | ProcessStep)[]),
                field === 'process_steps' ? { title: '', description: '', order: prev.process_steps.length + 1 } : '',
            ],
        }));
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as (string | ProcessStep)[]).filter((_: string | ProcessStep, i: number) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (key === 'features' || key === 'technologies') {
                    data.append(key, JSON.stringify((value as string[]).filter((item: string) => item.trim() !== '')));
                } else if (key === 'process_steps') {
                    data.append(key, JSON.stringify((value as ProcessStep[]).filter((item: ProcessStep) => item.title.trim() !== '')));
                } else if (key === 'image' && value instanceof File) {
                    data.append(key, value);
                } else if (key !== 'image') {
                    data.append(key, value.toString());
                }
            }
        });

        router.post(route('admin.business-unit-services.store'), data);
    };

    return (
        <AppLayout>
            <Head title="Create Business Unit Service" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.business-unit-services.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Services
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Create Business Unit Service</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="business_unit_id">Business Unit *</Label>
                                    <Select value={formData.business_unit_id} onValueChange={(value) => handleInputChange('business_unit_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Business Unit" />
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
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Service title"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Service description"
                                    rows={4}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="short_description">Short Description</Label>
                                <Textarea
                                    id="short_description"
                                    value={formData.short_description}
                                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                                    placeholder="Brief description for listings"
                                    rows={2}
                                />
                                {errors.short_description && <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="price">Price</Label>
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
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        placeholder="e.g., 2 weeks"
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
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked: boolean) => handleInputChange('featured', checked)}
                                />
                                <Label htmlFor="featured">Featured Service</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Service Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="image">Service Image</Label>
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
                            <CardTitle>Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                                        placeholder="Feature description"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('features', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('features')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Feature
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Technologies</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.technologies.map((tech, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={tech}
                                        onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                                        placeholder="Technology name"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('technologies', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('technologies')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Technology
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Process Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.process_steps.map((step, index) => (
                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={step.title}
                                            onChange={(e) => handleProcessStepChange(index, 'title', e.target.value)}
                                            placeholder="Step title"
                                        />
                                        <Input
                                            type="number"
                                            value={step.order}
                                            onChange={(e) => handleProcessStepChange(index, 'order', parseInt(e.target.value))}
                                            placeholder="Order"
                                            className="w-20"
                                        />
                                        <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('process_steps', index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={step.description}
                                        onChange={(e) => handleProcessStepChange(index, 'description', e.target.value)}
                                        placeholder="Step description"
                                        rows={2}
                                    />
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('process_steps')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Process Step
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href={route('admin.business-unit-services.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit">Create Service</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
