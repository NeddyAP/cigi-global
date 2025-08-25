import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/AdminLayout';
import { CommunityClub, CommunityClubActivity } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    communityClubActivity: CommunityClubActivity;
    communityClubs: CommunityClub[];
    errors: Record<string, string>;
}

type FormDataValue = string | boolean | File | null | string[];

export default function Edit({ communityClubActivity, communityClubs, errors }: Props) {
    const [formData, setFormData] = useState({
        community_club_id: communityClubActivity.community_club_id?.toString() || '',
        title: communityClubActivity.title || '',
        description: communityClubActivity.description || '',
        short_description: communityClubActivity.short_description || '',
        max_participants: communityClubActivity.max_participants?.toString() || '',
        duration: communityClubActivity.duration || '',
        status: communityClubActivity.status || 'active',
        featured: communityClubActivity.featured || false,
        image: null as File | null,
        benefits: communityClubActivity.benefits?.length ? communityClubActivity.benefits : [''],
        requirements: communityClubActivity.requirements?.length ? communityClubActivity.requirements : [''],
        schedule: communityClubActivity.schedule || '',
        location: communityClubActivity.location || '',
        contact_info: communityClubActivity.contact_info || '',
    });

    const [currentImage] = useState(communityClubActivity.image);

    const handleInputChange = (field: string, value: FormDataValue) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field as keyof typeof prev].map((item: string, i: number) => (i === index ? value : item)),
        }));
    };

    const addArrayItem = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field as keyof typeof prev], ''],
        }));
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (key === 'benefits' || key === 'requirements') {
                    data.append(key, JSON.stringify(value.filter((item: string) => item.trim() !== '')));
                } else if (key === 'image' && value instanceof File) {
                    data.append(key, value);
                } else if (key !== 'image') {
                    data.append(key, value.toString());
                }
            }
        });

        // Add method spoofing for PUT request
        data.append('_method', 'PUT');

        router.post(route('admin.community-club-activities.update', communityClubActivity.id), data);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${communityClubActivity.title}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.community-club-activities.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Activities
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Community Club Activity</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="community_club_id">Community Club *</Label>
                                    <Select
                                        value={formData.community_club_id}
                                        onValueChange={(value) => handleInputChange('community_club_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Community Club" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {communityClubs.map((club) => (
                                                <SelectItem key={club.id} value={club.id.toString()}>
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.community_club_id && <p className="mt-1 text-sm text-red-600">{errors.community_club_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Activity title"
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
                                    placeholder="Activity description"
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
                                    <Label htmlFor="max_participants">Max Participants</Label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        value={formData.max_participants}
                                        onChange={(e) => handleInputChange('max_participants', e.target.value)}
                                        placeholder="e.g., 20"
                                    />
                                    {errors.max_participants && <p className="mt-1 text-sm text-red-600">{errors.max_participants}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        placeholder="e.g., 2 hours"
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
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                                />
                                <Label htmlFor="featured">Featured Activity</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="schedule">Schedule</Label>
                                    <Input
                                        id="schedule"
                                        value={formData.schedule}
                                        onChange={(e) => handleInputChange('schedule', e.target.value)}
                                        placeholder="e.g., Every Tuesday at 7 PM"
                                    />
                                    {errors.schedule && <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="e.g., Community Center"
                                    />
                                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="contact_info">Contact Information</Label>
                                <Input
                                    id="contact_info"
                                    value={formData.contact_info}
                                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                                    placeholder="e.g., john@example.com or (555) 123-4567"
                                />
                                {errors.contact_info && <p className="mt-1 text-sm text-red-600">{errors.contact_info}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentImage && (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`/storage/${currentImage}`}
                                        alt="Current activity image"
                                        className="h-32 w-32 rounded-lg object-cover"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm text-gray-600">Current image</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="image">Update Activity Image</Label>
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
                            <CardTitle>Benefits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={benefit}
                                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                        placeholder="Benefit description"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('benefits', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('benefits')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Benefit
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.requirements.map((requirement, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={requirement}
                                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                        placeholder="Requirement description"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('requirements', index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('requirements')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Requirement
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href={route('admin.community-club-activities.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit">Update Activity</Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
