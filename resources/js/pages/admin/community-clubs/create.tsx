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
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, Globe, Image, Phone, Settings, Star, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';

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
    const { data, setData, post, processing, errors, clearErrors, hasErrors } = useForm({
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
        // Enhanced fields
        gallery_images: [] as Array<{
            id: string;
            url: string;
            alt?: string;
            caption?: string;
            mediaId?: number;
        }>,
        testimonials: [] as Array<{
            id: string;
            name: string;
            role?: string;
            company?: string;
            content: string;
            image?: string | number;
            rating?: number;
            featured?: boolean;
        }>,
        social_media_links: [] as Array<{
            platform: string;
            url: string;
        }>,
        founded_year: '' as string | number,
        member_count: '' as string | number,
        upcoming_events: [] as Array<{
            title: string;
            date: string;
            description: string;
            image?: string;
        }>,
        achievements: [] as Array<{
            title: string;
            date: string;
            description: string;
            image?: string;
        }>,
        hero_subtitle: '',
        hero_cta_text: '',
        hero_cta_link: '',
    });

    const [activeTab, setActiveTab] = useState('basic');

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
                .replace(/^-+|-+$/g, '');
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

    const handleActivitiesChange = (activities: Array<{ title: string }>) => {
        // Convert back to string format for backward compatibility
        const activitiesString = activities.map((activity) => activity.title).join('\n');
        setData('activities', activitiesString);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Komunitas" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tambah Komunitas Baru</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Isi form di bawah untuk menambah komunitas baru</p>
                    </div>
                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.community-clubs.index')}>
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
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="basic">Dasar</TabsTrigger>
                            <TabsTrigger value="activities">Aktivitas</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                            <TabsTrigger value="social">Sosial</TabsTrigger>
                            <TabsTrigger value="contact">Kontak</TabsTrigger>
                            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
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
                                        placeholder="Pilih atau upload gambar utama komunitas"
                                        error={errors.image}
                                        showPreview={true}
                                        autoUpload={true}
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

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.community-clubs.index')}>Batal</a>
                        </Button>
                        <LoadingButton type="submit" loading={processing} loadingText="Menyimpan..." icon="save" className="cta-button">
                            Simpan Komunitas
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
