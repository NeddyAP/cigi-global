import ActivityManager from '@/components/admin/activity-manager';
import { FormSection } from '@/components/admin/form-section';
import ImageGalleryManager from '@/components/admin/image-gallery-manager';
import { LoadingButton } from '@/components/admin/loading-button';
import TestimonialManager from '@/components/admin/testimonial-manager';
import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CommunityClub } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, Globe, Image, Phone, Settings, Star, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';

interface EditCommunityClubProps {
    communityClub: CommunityClub;
}

const clubTypes = [
    { value: 'Olahraga', label: 'Olahraga' },
    { value: 'Keagamaan', label: 'Keagamaan' },
    { value: 'Lingkungan', label: 'Lingkungan' },
    { value: 'Sosial', label: 'Sosial' },
    { value: 'Budaya', label: 'Budaya' },
    { value: 'Pendidikan', label: 'Pendidikan' },
    { value: 'Kesehatan', label: 'Kesehatan' },
];

export default function EditCommunityClub({ communityClub }: EditCommunityClubProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Komunitas', href: '/admin/community-clubs' },
        { title: communityClub.name, href: `/admin/community-clubs/${communityClub.slug}` },
        { title: 'Edit', href: `/admin/community-clubs/${communityClub.slug}/edit` },
    ];

    // Transform data to match expected types
    const transformGalleryImages = (
        images:
            | string[]
            | Array<{
                  id?: string;
                  url: string | { id: string; url: string; alt?: string; caption?: string; mediaId?: number };
                  alt?: string;
                  caption?: string;
                  mediaId?: number;
              }>
            | null
            | undefined,
    ): Array<{
        id: string;
        url: string;
        alt?: string;
        caption?: string;
        mediaId?: number;
    }> => {
        if (!images) return [];
        if (Array.isArray(images)) {
            return images.map((img, index) =>
                typeof img === 'string'
                    ? { id: `img_${index}`, url: img, alt: '', caption: '' }
                    : {
                          id: img.id || `img_${index}`,
                          url: typeof img.url === 'string' ? img.url : img.url?.url || '',
                          alt: img.alt || '',
                          caption: img.caption || '',
                          mediaId: img.mediaId,
                      },
            );
        }
        return [];
    };

    const transformTestimonials = (
        testimonials:
            | Array<{
                  id?: string;
                  name?: string;
                  role?: string;
                  company?: string;
                  content?: string;
                  image?: string | number;
                  rating?: number;
                  featured?: boolean;
              }>
            | null
            | undefined,
    ): Array<{
        id: string;
        name: string;
        role?: string;
        company?: string;
        content: string;
        image?: string | number;
        rating?: number;
        featured?: boolean;
    }> => {
        if (!testimonials) return [];
        if (Array.isArray(testimonials)) {
            return testimonials.map((testimonial, index) => ({
                id: testimonial.id || `testimonial_${index}`,
                name: testimonial.name || '',
                role: testimonial.role || '',
                company: testimonial.company || '',
                content: testimonial.content || '',
                image: testimonial.image || '',
                rating: testimonial.rating || 5,
                featured: testimonial.featured || false,
            }));
        }
        return [];
    };

    const transformSocialMediaLinks = (
        links: Array<{ platform: string; url: string }> | Record<string, string> | null | undefined,
    ): Array<{ platform: string; url: string }> => {
        if (!links) return [];
        if (Array.isArray(links)) {
            return links;
        }
        // Handle old format
        if (typeof links === 'object') {
            return Object.entries(links)
                .filter(([, url]) => url)
                .map(([platform, url]) => ({ platform, url: url as string }));
        }
        return [];
    };

    const { data, setData, put, processing, errors, hasErrors, clearErrors } = useForm({
        name: communityClub.name || '',
        slug: communityClub.slug || '',
        description: communityClub.description || '',
        type: communityClub.type || '',
        activities: communityClub.activities || '',
        image: communityClub.image || '',
        contact_person: communityClub.contact_person || '',
        contact_phone: communityClub.contact_phone || '',
        contact_email: communityClub.contact_email || '',
        meeting_schedule: communityClub.meeting_schedule || '',
        location: communityClub.location || '',
        is_active: communityClub.is_active ?? true,
        sort_order: communityClub.sort_order || 0,
        // Enhanced fields
        gallery_images: transformGalleryImages(communityClub.gallery_images),
        testimonials: transformTestimonials(communityClub.testimonials),
        social_media_links: transformSocialMediaLinks(communityClub.social_media_links),
        founded_year: communityClub.founded_year || '',
        member_count: communityClub.member_count || '',
        upcoming_events:
            communityClub.upcoming_events ||
            ([] as Array<{
                title: string;
                date: string;
                description: string;
                image?: string;
            }>),
        achievements:
            communityClub.achievements ||
            ([] as Array<{
                title: string;
                date: string;
                description: string;
                image?: string;
            }>),
        hero_subtitle: communityClub.hero_subtitle || '',
        hero_cta_text: communityClub.hero_cta_text || '',
        hero_cta_link: communityClub.hero_cta_link || '',
        more_about: communityClub.more_about || [],
    });

    const [activeTab, setActiveTab] = useState('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.community-clubs.update', communityClub.slug));
    };

    // Auto-generate slug from name if slug is empty
    const handleNameChange = (value: string) => {
        setData('name', value);
        if (!data.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            setData('slug', slug);
        }
    };

    // Parse activities from string to array for ActivityManager
    const parseActivities = (activitiesString: string) => {
        if (!activitiesString) return [];
        try {
            return JSON.parse(activitiesString);
        } catch {
            // If not JSON, treat as simple text and create basic structure
            return activitiesString
                .split('\n')
                .filter((line) => line.trim())
                .map((line, index) => ({
                    id: `activity_${index}`,
                    title: line.trim(),
                    description: '',
                    image: '',
                    duration: '',
                    max_participants: undefined,
                    requirements: '',
                    benefits: [],
                    featured: false,
                    active: true,
                }));
        }
    };

    const activitiesArray = parseActivities(data.activities);

    const handleActivitiesChange = (
        activities: Array<{
            id: string;
            title: string;
            description: string;
            image?: string | number;
            duration?: string;
            max_participants?: number;
            requirements?: string;
            benefits?: string[];
            featured?: boolean;
            active?: boolean;
        }>,
    ) => {
        // Convert back to JSON string format for storage
        const activitiesString = JSON.stringify(activities);
        setData('activities', activitiesString);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${communityClub.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Edit Komunitas</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Edit informasi komunitas {communityClub.name}</p>
                    </div>
                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.community-clubs.show', communityClub.slug)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </a>
                    </Button>
                </div>

                {/* Error Summary */}
                {hasErrors && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex items-center justify-between">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        Ada kesalahan dalam form. Silakan periksa dan perbaiki.
                                    </p>
                                    {/* Show specific errors */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <p key={field} className="text-sm text-red-600 dark:text-red-300">
                                                    <span className="font-medium capitalize">{field.replace(/_/g, ' ')}:</span> {error}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => clearErrors()}
                                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Welcome Header */}
                    <div className="mb-8 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 text-center dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                            <Users className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">✏️ Edit Komunitas</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">Edit informasi komunitas {communityClub.name}</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-5 grid h-fit w-full grid-cols-6 rounded-xl bg-gradient-to-r from-zinc-100 via-zinc-50 to-zinc-100 p-2 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
                            <TabsTrigger
                                value="basic"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-700"
                            >
                                <Users className="h-4 w-4" />
                                Dasar
                            </TabsTrigger>
                            <TabsTrigger
                                value="activities"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-green-600 dark:data-[state=active]:to-emerald-700"
                            >
                                <Calendar className="h-4 w-4" />
                                Aktivitas
                            </TabsTrigger>
                            <TabsTrigger
                                value="media"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-red-700"
                            >
                                <Image className="h-4 w-4" />
                                Media
                            </TabsTrigger>
                            <TabsTrigger
                                value="social"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-pink-600 dark:data-[state=active]:to-rose-700"
                            >
                                <Globe className="h-4 w-4" />
                                Sosial
                            </TabsTrigger>
                            <TabsTrigger
                                value="contact"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-indigo-600 dark:data-[state=active]:to-blue-700"
                            >
                                <Phone className="h-4 w-4" />
                                Kontak
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:from-slate-600 dark:data-[state=active]:to-gray-700"
                            >
                                <Settings className="h-4 w-4" />
                                Pengaturan
                            </TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-6">
                            <FormSection title="Informasi Dasar" description="Detail utama komunitas" icon={<Users className="h-5 w-5" />}>
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
                                            className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white ${errors.type ? 'border-red-500' : ''}`}
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

                                    <ImageInput
                                        label="Gambar Utama Komunitas"
                                        name="image"
                                        value={data.image}
                                        onChange={(value) => setData('image', value?.toString() || '')}
                                        error={errors.image}
                                        showPreview={true}
                                        multiple={false}
                                    />
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

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="founded_year">Tahun Berdiri</Label>
                                        <Input
                                            id="founded_year"
                                            type="number"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            value={data.founded_year}
                                            onChange={(e) => setData('founded_year', e.target.value ? parseInt(e.target.value) : '')}
                                            placeholder="2020"
                                            className={errors.founded_year ? 'border-red-500' : ''}
                                        />
                                        {errors.founded_year && <p className="mt-1 text-sm text-red-600">{errors.founded_year}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="member_count">Jumlah Anggota</Label>
                                        <Input
                                            id="member_count"
                                            type="number"
                                            min="1"
                                            value={data.member_count}
                                            onChange={(e) => setData('member_count', e.target.value ? parseInt(e.target.value) : '')}
                                            placeholder="50"
                                            className={errors.member_count ? 'border-red-500' : ''}
                                        />
                                        {errors.member_count && <p className="mt-1 text-sm text-red-600">{errors.member_count}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="hero_subtitle">Subtitle Hero</Label>
                                        <Input
                                            id="hero_subtitle"
                                            value={data.hero_subtitle}
                                            onChange={(e) => setData('hero_subtitle', e.target.value)}
                                            placeholder="Subtitle untuk halaman utama"
                                            className={errors.hero_subtitle ? 'border-red-500' : ''}
                                        />
                                        {errors.hero_subtitle && <p className="mt-1 text-sm text-red-600">{errors.hero_subtitle}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="hero_cta_text">Teks CTA</Label>
                                        <Input
                                            id="hero_cta_text"
                                            value={data.hero_cta_text}
                                            onChange={(e) => setData('hero_cta_text', e.target.value)}
                                            placeholder="Bergabung Sekarang"
                                            className={errors.hero_cta_text ? 'border-red-500' : ''}
                                        />
                                        {errors.hero_cta_text && <p className="mt-1 text-sm text-red-600">{errors.hero_cta_text}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="hero_cta_link">Link CTA</Label>
                                        <Input
                                            id="hero_cta_link"
                                            value={data.hero_cta_link}
                                            onChange={(e) => setData('hero_cta_link', e.target.value)}
                                            placeholder="/daftar atau https://..."
                                            className={errors.hero_cta_link ? 'border-red-500' : ''}
                                        />
                                        {errors.hero_cta_link && <p className="mt-1 text-sm text-red-600">{errors.hero_cta_link}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label>Informasi Tambahan</Label>
                                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                        Tambahkan informasi tambahan seperti misi, visi, nilai-nilai, dll. dalam bentuk card
                                    </p>
                                    <div className="space-y-3">
                                        {data.more_about.map((item, index) => (
                                            <div key={index} className="space-y-3 rounded-lg border p-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Card {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newItems = [...data.more_about];
                                                            newItems.splice(index, 1);
                                                            setData('more_about', newItems);
                                                        }}
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <Label htmlFor={`more_about_title_${index}`}>Judul</Label>
                                                        <Input
                                                            id={`more_about_title_${index}`}
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newItems = [...data.more_about];
                                                                newItems[index].title = e.target.value;
                                                                setData('more_about', newItems);
                                                            }}
                                                            placeholder="Contoh: Misi Komunitas"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`more_about_description_${index}`}>Deskripsi</Label>
                                                        <Textarea
                                                            id={`more_about_description_${index}`}
                                                            value={item.description}
                                                            onChange={(e) => {
                                                                const newItems = [...data.more_about];
                                                                newItems[index].description = e.target.value;
                                                                setData('more_about', newItems);
                                                            }}
                                                            placeholder="Deskripsi singkat..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setData('more_about', [...data.more_about, { title: '', description: '' }]);
                                            }}
                                            className="w-full border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                                        >
                                            + Tambah Card Baru
                                        </Button>
                                    </div>
                                </div>
                            </FormSection>
                        </TabsContent>

                        {/* Activities Tab */}
                        <TabsContent value="activities" className="space-y-6">
                            <FormSection
                                title="Manajemen Aktivitas"
                                description="Kelola aktivitas komunitas dengan detail lengkap"
                                icon={<Calendar className="h-5 w-5" />}
                            >
                                <ActivityManager
                                    label="Aktivitas Komunitas"
                                    name="activities"
                                    value={activitiesArray}
                                    onChange={handleActivitiesChange}
                                    error={errors.activities}
                                    required={false}
                                    maxActivities={20}
                                />
                            </FormSection>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="space-y-6">
                            <FormSection title="Galeri Gambar" description="Kelola galeri foto komunitas" icon={<Image className="h-5 w-5" />}>
                                <ImageGalleryManager
                                    label="Galeri Gambar"
                                    name="gallery_images"
                                    value={data.gallery_images}
                                    onChange={(value) => setData('gallery_images', value)}
                                    error={errors.gallery_images}
                                    maxImages={20}
                                />
                            </FormSection>

                            <FormSection title="Testimoni Anggota" description="Testimoni dari anggota komunitas" icon={<Star className="h-5 w-5" />}>
                                <TestimonialManager
                                    label="Testimoni Anggota"
                                    name="testimonials"
                                    value={data.testimonials}
                                    onChange={(value) => setData('testimonials', value)}
                                    error={errors.testimonials}
                                    maxTestimonials={10}
                                />
                            </FormSection>
                        </TabsContent>

                        {/* Social Tab */}
                        <TabsContent value="social" className="space-y-6">
                            <FormSection title="Media Sosial" description="Link media sosial komunitas" icon={<Globe className="h-5 w-5" />}>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Link Media Sosial</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                            Tambahkan link media sosial komunitas (opsional)
                                        </p>
                                        <div className="space-y-3">
                                            {['facebook', 'instagram', 'twitter', 'youtube', 'website'].map((platform) => {
                                                const existingLink = data.social_media_links?.find((link) => link.platform === platform);
                                                return (
                                                    <div key={platform} className="flex items-center space-x-3">
                                                        <Label htmlFor={`social_${platform}`} className="w-24 capitalize">
                                                            {platform}
                                                        </Label>
                                                        <Input
                                                            id={`social_${platform}`}
                                                            type="url"
                                                            value={existingLink?.url || ''}
                                                            onChange={(e) => {
                                                                const links = [...(data.social_media_links || [])];
                                                                const linkIndex = links.findIndex((link) => link.platform === platform);
                                                                if (linkIndex >= 0) {
                                                                    links[linkIndex].url = e.target.value;
                                                                } else {
                                                                    links.push({ platform, url: e.target.value });
                                                                }
                                                                setData('social_media_links', links);
                                                            }}
                                                            placeholder={`https://${platform}.com/username`}
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection
                                title="Prestasi & Pencapaian"
                                description="Pencapaian dan prestasi komunitas"
                                icon={<Trophy className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label>Pencapaian Komunitas</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Tambahkan pencapaian dan prestasi komunitas</p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="space-y-3 rounded-lg border p-4">
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`achievement_title_${item}`}>Judul Pencapaian</Label>
                                                            <Input
                                                                id={`achievement_title_${item}`}
                                                                value={data.achievements?.[item - 1]?.title || ''}
                                                                onChange={(e) => {
                                                                    const achievements = [...(data.achievements || [])];
                                                                    if (!achievements[item - 1]) {
                                                                        achievements[item - 1] = { title: '', date: '', description: '' };
                                                                    }
                                                                    achievements[item - 1].title = e.target.value;
                                                                    setData('achievements', achievements);
                                                                }}
                                                                placeholder="Juara 1 Turnamen Regional"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`achievement_date_${item}`}>Tanggal</Label>
                                                            <Input
                                                                id={`achievement_date_${item}`}
                                                                type="date"
                                                                value={data.achievements?.[item - 1]?.date || ''}
                                                                onChange={(e) => {
                                                                    const achievements = [...(data.achievements || [])];
                                                                    if (!achievements[item - 1]) {
                                                                        achievements[item - 1] = { title: '', date: '', description: '' };
                                                                    }
                                                                    achievements[item - 1].date = e.target.value;
                                                                    setData('achievements', achievements);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`achievement_description_${item}`}>Deskripsi</Label>
                                                        <Textarea
                                                            id={`achievement_description_${item}`}
                                                            value={data.achievements?.[item - 1]?.description || ''}
                                                            onChange={(e) => {
                                                                const achievements = [...(data.achievements || [])];
                                                                if (!achievements[item - 1]) {
                                                                    achievements[item - 1] = { title: '', date: '', description: '' };
                                                                }
                                                                achievements[item - 1].description = e.target.value;
                                                                setData('achievements', achievements);
                                                            }}
                                                            placeholder="Deskripsi pencapaian ini..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection
                                title="Event Mendatang"
                                description="Event dan kegiatan yang akan datang"
                                icon={<Calendar className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label>Event Mendatang</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Tambahkan event dan kegiatan yang akan datang</p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((index) => (
                                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`event_title_${index}`}>Judul Event</Label>
                                                            <Input
                                                                id={`event_title_${index}`}
                                                                value={data.upcoming_events?.[index - 1]?.title || ''}
                                                                onChange={(e) => {
                                                                    const events = [...(data.upcoming_events || [])];
                                                                    if (!events[index - 1]) {
                                                                        events[index - 1] = { title: '', date: '', description: '' };
                                                                    }
                                                                    events[index - 1].title = e.target.value;
                                                                    setData('upcoming_events', events);
                                                                }}
                                                                placeholder="Turnamen Bulutangkis"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`event_date_${index}`}>Tanggal Event</Label>
                                                            <Input
                                                                id={`event_date_${index}`}
                                                                type="date"
                                                                value={data.upcoming_events?.[index - 1]?.date || ''}
                                                                onChange={(e) => {
                                                                    const events = [...(data.upcoming_events || [])];
                                                                    if (!events[index - 1]) {
                                                                        events[index - 1] = { title: '', date: '', description: '' };
                                                                    }
                                                                    events[index - 1].date = e.target.value;
                                                                    setData('upcoming_events', events);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`event_description_${index}`}>Deskripsi Event</Label>
                                                        <Textarea
                                                            id={`event_description_${index}`}
                                                            value={data.upcoming_events?.[index - 1]?.description || ''}
                                                            onChange={(e) => {
                                                                const events = [...(data.upcoming_events || [])];
                                                                if (!events[index - 1]) {
                                                                    events[index - 1] = { title: '', date: '', description: '' };
                                                                }
                                                                events[index - 1].description = e.target.value;
                                                                setData('upcoming_events', events);
                                                            }}
                                                            placeholder="Deskripsi event ini..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormSection>
                        </TabsContent>

                        {/* Contact Tab */}
                        <TabsContent value="contact" className="space-y-6">
                            <FormSection title="Informasi Kontak" description="Detail kontak dan jadwal" icon={<Phone className="h-5 w-5" />}>
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
                            </FormSection>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings" className="space-y-6">
                            <FormSection title="Pengaturan" description="Status dan urutan tampilan" icon={<Settings className="h-5 w-5" />}>
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
                            </FormSection>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end space-x-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            <a href={route('admin.community-clubs.show', communityClub.slug)}>Batal</a>
                        </Button>
                        <LoadingButton
                            type="submit"
                            loading={processing}
                            loadingText="Menyimpan..."
                            icon="save"
                            className="transform bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                        >
                            Simpan Perubahan
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
