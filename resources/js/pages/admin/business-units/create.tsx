import { FormSection } from '@/components/admin/form-section';
import ImageGalleryManager from '@/components/admin/image-gallery-manager';
import { LoadingButton } from '@/components/admin/loading-button';
import ServiceManager from '@/components/admin/service-manager';
import TeamMemberManager from '@/components/admin/team-member-manager';
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
import { AlertTriangle, ArrowLeft, Award, BarChart3, Building2, CheckCircle, Image, Phone, Settings, Star, Target, Users } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Unit Bisnis', href: '/admin/business-units' },
    { title: 'Tambah Baru', href: '/admin/business-units/create' },
];

export default function CreateBusinessUnit() {
    const { data, setData, post, processing, errors, hasErrors, clearErrors, isDirty, recentlySuccessful, transform } = useForm({
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
        // Enhanced fields
        team_members: [] as Array<{
            id: string;
            name: string;
            role: string;
            bio?: string;
            image?: string | number;
            social_links_linkedin?: string;
            social_links_twitter?: string;
            social_links_github?: string;
        }>,
        client_testimonials: [] as Array<{
            id: string;
            name: string;
            company?: string;
            content: string;
            image?: string | number;
            rating?: number;
        }>,
        portfolio_items: [] as Array<{
            title: string;
            description: string;
            image?: string;
            technologies: string[];
            client: string;
        }>,
        certifications: [] as Array<{
            name: string;
            issuer: string;
            date: string;
            image?: string;
            description: string;
        }>,
        company_stats: {
            years_in_business: '',
            projects_completed: '',
            clients_served: '',
            team_size: '',
        },
        gallery_images: [] as Array<{
            id: string;
            url: string;
            alt?: string;
            caption?: string;
            mediaId?: number;
        }>,
        achievements: [] as Array<{
            title: string;
            date: string;
            description: string;
            image?: string;
        }>,
        core_values: [] as Array<{
            title: string;
            description: string;
            icon?: string;
        }>,
        hero_subtitle: '',
        hero_cta_text: '',
        hero_cta_link: '',
        more_about: [] as Array<{
            title: string;
            description: string;
        }>,
    });

    const [activeTab, setActiveTab] = useState('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Form data before submission:', data);

        // Transform data before submission if needed
        transform((data) => ({
            ...data,
            // Ensure all required fields are properly formatted
            team_members: data.team_members.map((member) => ({
                ...member,
                bio: member.bio || '',
                social_links: [
                    ...(member.social_links_linkedin
                        ? [
                              {
                                  platform: 'linkedin',
                                  url: member.social_links_linkedin,
                              },
                          ]
                        : []),
                    ...(member.social_links_twitter
                        ? [
                              {
                                  platform: 'twitter',
                                  url: member.social_links_twitter,
                              },
                          ]
                        : []),
                    ...(member.social_links_github
                        ? [
                              {
                                  platform: 'github',
                                  url: member.social_links_github,
                              },
                          ]
                        : []),
                ],
            })),
            client_testimonials: data.client_testimonials.map((testimonial) => ({
                ...testimonial,
                company: testimonial.company || '',
                rating: testimonial.rating || 5,
            })),
            company_stats: [
                ...(data.company_stats.years_in_business
                    ? [
                          {
                              label: 'Years in Business',
                              value: data.company_stats.years_in_business,
                              icon: '📅',
                          },
                      ]
                    : []),
                ...(data.company_stats.projects_completed
                    ? [
                          {
                              label: 'Projects Completed',
                              value: data.company_stats.projects_completed,
                              icon: '🚀',
                          },
                      ]
                    : []),
                ...(data.company_stats.clients_served
                    ? [
                          {
                              label: 'Clients Served',
                              value: data.company_stats.clients_served,
                              icon: '👥',
                          },
                      ]
                    : []),
                ...(data.company_stats.team_size
                    ? [
                          {
                              label: 'Team Size',
                              value: data.company_stats.team_size,
                              icon: '👨‍💼',
                          },
                      ]
                    : []),
            ],
        }));

        console.log('Form data after transform:', data);

        post(route('admin.business-units.store'), {
            onSuccess: () => {
                // Form was successful, could show success message
                console.log('Form submitted successfully');
            },
            onError: (errors) => {
                // Handle errors if needed
                console.error('Form submission errors:', errors);
            },
            preserveScroll: true,
        });
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

    // Parse services from string to array for ServiceManager
    const parseServices = (servicesString: string) => {
        if (!servicesString) return [];
        try {
            return JSON.parse(servicesString);
        } catch {
            // If not JSON, treat as simple text and create basic structure
            return servicesString
                .split('\n')
                .filter((line) => line.trim())
                .map((line, index) => ({
                    id: `service_${index}`,
                    title: line.trim(),
                    description: '',
                    image: '',
                    price_range: '',
                    duration: '',
                    features: [],
                    technologies: [],
                    process_steps: [],
                    featured: false,
                    active: true,
                }));
        }
    };

    const servicesArray = parseServices(data.services);

    const handleServicesChange = (services: Array<{ title: string }>) => {
        // Convert back to string format for backward compatibility
        const servicesString = services.map((service) => service.title).join('\n');
        setData('services', servicesString);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Unit Bisnis" />

            <div className="space-y-6">
                {/* Success Message */}
                {recentlySuccessful && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">Unit bisnis berhasil dibuat!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Unsaved Changes Warning */}
                {isDirty && (
                    <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Ada perubahan yang belum disimpan</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tambah Unit Bisnis Baru</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Isi form di bawah untuk menambah unit bisnis baru</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                // Reset form to initial values
                                setData({
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
                                    team_members: [],
                                    client_testimonials: [],
                                    portfolio_items: [],
                                    certifications: [],
                                    company_stats: {
                                        years_in_business: '',
                                        projects_completed: '',
                                        clients_served: '',
                                        team_size: '',
                                    },
                                    gallery_images: [],
                                    achievements: [],
                                    core_values: [],
                                    hero_subtitle: '',
                                    hero_cta_text: '',
                                    hero_cta_link: '',
                                    more_about: [],
                                });
                                clearErrors();
                            }}
                            disabled={processing}
                            className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                        >
                            Reset
                        </Button>
                        <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.business-units.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </a>
                        </Button>
                    </div>
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

                <form onSubmit={handleSubmit} className="space-y-6" data-form-key="CreateBusinessUnit">
                    {/* Progress Bar */}
                    {processing && (
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-2 rounded-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: '100%' }}></div>
                        </div>
                    )}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-7">
                            <TabsTrigger value="basic">Dasar</TabsTrigger>
                            <TabsTrigger value="services">Layanan</TabsTrigger>
                            <TabsTrigger value="team">Tim</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                            <TabsTrigger value="contact">Kontak</TabsTrigger>
                            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-6">
                            <FormSection title="Informasi Dasar" description="Detail utama unit bisnis" icon={<Building2 className="h-5 w-5" />}>
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
                                            placeholder="Hubungi Kami"
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
                                            placeholder="/kontak atau https://..."
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
                                                            placeholder="Contoh: Misi Kami"
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

                                <div>
                                    <ImageInput
                                        label="Gambar Unit Bisnis"
                                        name="image"
                                        value={data.image}
                                        onChange={(value) => setData('image', value?.toString() || '')}
                                        error={errors.image}
                                        showPreview={true}
                                        multiple={false}
                                    />
                                </div>
                            </FormSection>
                        </TabsContent>

                        {/* Services Tab */}
                        <TabsContent value="services" className="space-y-6">
                            <FormSection
                                title="Manajemen Layanan"
                                description="Kelola layanan unit bisnis dengan detail lengkap"
                                icon={<Target className="h-5 w-5" />}
                            >
                                <ServiceManager
                                    label="Layanan Unit Bisnis"
                                    name="services"
                                    value={servicesArray}
                                    onChange={handleServicesChange}
                                    error={errors.services}
                                    required={false}
                                    maxServices={20}
                                />
                            </FormSection>
                        </TabsContent>

                        {/* Team Tab */}
                        <TabsContent value="team" className="space-y-6">
                            <FormSection title="Tim Kami" description="Kelola profil anggota tim" icon={<Users className="h-5 w-5" />}>
                                <TeamMemberManager
                                    label="Anggota Tim"
                                    name="team_members"
                                    value={data.team_members.map((member) => ({
                                        id: member.id,
                                        name: member.name,
                                        role: member.role,
                                        bio: member.bio,
                                        image: member.image,
                                        social_links: [
                                            { platform: 'linkedin', url: member.social_links_linkedin || '' },
                                            { platform: 'twitter', url: member.social_links_twitter || '' },
                                            { platform: 'github', url: member.social_links_github || '' },
                                        ].filter((link) => link.url),
                                    }))}
                                    onChange={(value) => {
                                        const transformedValue = value.map((member) => ({
                                            id: member.id,
                                            name: member.name,
                                            role: member.role,
                                            bio: member.bio || '',
                                            image: member.image,
                                            social_links_linkedin: member.social_links?.[0]?.url || '',
                                            social_links_twitter: member.social_links?.[1]?.url || '',
                                            social_links_github: member.social_links?.[2]?.url || '',
                                        }));
                                        setData('team_members', transformedValue);
                                    }}
                                    error={errors.team_members}
                                    maxMembers={20}
                                />
                            </FormSection>

                            <FormSection
                                title="Statistik Perusahaan"
                                description="Data statistik perusahaan"
                                icon={<BarChart3 className="h-5 w-5" />}
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="years_in_business">Tahun Beroperasi</Label>
                                        <Input
                                            id="years_in_business"
                                            type="number"
                                            min="1"
                                            value={data.company_stats.years_in_business}
                                            onChange={(e) => setData('company_stats', { ...data.company_stats, years_in_business: e.target.value })}
                                            placeholder="5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="projects_completed">Proyek Selesai</Label>
                                        <Input
                                            id="projects_completed"
                                            type="number"
                                            min="0"
                                            value={data.company_stats.projects_completed}
                                            onChange={(e) => setData('company_stats', { ...data.company_stats, projects_completed: e.target.value })}
                                            placeholder="100"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="clients_served">Klien Dilayani</Label>
                                        <Input
                                            id="clients_served"
                                            type="number"
                                            min="0"
                                            value={data.company_stats.clients_served}
                                            onChange={(e) => setData('company_stats', { ...data.company_stats, clients_served: e.target.value })}
                                            placeholder="50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="team_size">Ukuran Tim</Label>
                                        <Input
                                            id="team_size"
                                            type="number"
                                            min="1"
                                            value={data.company_stats.team_size}
                                            onChange={(e) => setData('company_stats', { ...data.company_stats, team_size: e.target.value })}
                                            placeholder="25"
                                        />
                                    </div>
                                </div>
                            </FormSection>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="space-y-6">
                            <FormSection title="Galeri Gambar" description="Kelola galeri foto perusahaan" icon={<Image className="h-5 w-5" />}>
                                <ImageGalleryManager
                                    label="Galeri Gambar"
                                    name="gallery_images"
                                    value={data.gallery_images}
                                    onChange={(value) => setData('gallery_images', value)}
                                    error={errors.gallery_images}
                                    maxImages={20}
                                />
                            </FormSection>

                            <FormSection title="Testimoni Klien" description="Testimoni dari klien" icon={<Star className="h-5 w-5" />}>
                                <TestimonialManager
                                    label="Testimoni Klien"
                                    name="client_testimonials"
                                    value={data.client_testimonials.map((testimonial) => ({
                                        id: testimonial.id,
                                        name: testimonial.name,
                                        company: testimonial.company,
                                        content: testimonial.content,
                                        image: testimonial.image,
                                        rating: testimonial.rating,
                                    }))}
                                    onChange={(value) => {
                                        const transformedValue = value.map((testimonial) => ({
                                            id: testimonial.id,
                                            name: testimonial.name,
                                            company: testimonial.company || '',
                                            content: testimonial.content,
                                            image: testimonial.image,
                                            rating: testimonial.rating || 5,
                                        }));
                                        setData('client_testimonials', transformedValue);
                                    }}
                                    error={errors.client_testimonials}
                                    maxTestimonials={10}
                                    showCompany={true}
                                />
                            </FormSection>
                        </TabsContent>

                        {/* Portfolio Tab */}
                        <TabsContent value="portfolio" className="space-y-6">
                            <FormSection
                                title="Portfolio & Pencapaian"
                                description="Portfolio proyek dan pencapaian"
                                icon={<Award className="h-5 w-5" />}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Label>Portfolio Proyek</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                            Tambahkan portfolio proyek yang telah diselesaikan
                                        </p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((index) => (
                                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`portfolio_title_${index}`}>Judul Proyek</Label>
                                                            <Input
                                                                id={`portfolio_title_${index}`}
                                                                value={data.portfolio_items?.[index - 1]?.title || ''}
                                                                onChange={(e) => {
                                                                    const items = [...(data.portfolio_items || [])];
                                                                    if (!items[index - 1]) {
                                                                        items[index - 1] = {
                                                                            title: '',
                                                                            description: '',
                                                                            technologies: [],
                                                                            client: '',
                                                                        };
                                                                    }
                                                                    items[index - 1].title = e.target.value;
                                                                    setData('portfolio_items', items);
                                                                }}
                                                                placeholder="Website E-commerce"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`portfolio_client_${index}`}>Klien</Label>
                                                            <Input
                                                                id={`portfolio_client_${index}`}
                                                                value={data.portfolio_items?.[index - 1]?.client || ''}
                                                                onChange={(e) => {
                                                                    const items = [...(data.portfolio_items || [])];
                                                                    if (!items[index - 1]) {
                                                                        items[index - 1] = {
                                                                            title: '',
                                                                            description: '',
                                                                            technologies: [],
                                                                            client: '',
                                                                        };
                                                                    }
                                                                    items[index - 1].client = e.target.value;
                                                                    setData('portfolio_items', items);
                                                                }}
                                                                placeholder="Nama Klien"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`portfolio_description_${index}`}>Deskripsi Proyek</Label>
                                                        <Textarea
                                                            id={`portfolio_description_${index}`}
                                                            value={data.portfolio_items?.[index - 1]?.description || ''}
                                                            onChange={(e) => {
                                                                const items = [...(data.portfolio_items || [])];
                                                                if (!items[index - 1]) {
                                                                    items[index - 1] = { title: '', description: '', technologies: [], client: '' };
                                                                }
                                                                items[index - 1].description = e.target.value;
                                                                setData('portfolio_items', items);
                                                            }}
                                                            placeholder="Deskripsi proyek ini..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="Sertifikasi" description="Sertifikasi dan akreditasi perusahaan" icon={<Award className="h-5 w-5" />}>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Sertifikasi Perusahaan</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Tambahkan sertifikasi dan akreditasi</p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((index) => (
                                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`cert_name_${index}`}>Nama Sertifikasi</Label>
                                                            <Input
                                                                id={`cert_name_${index}`}
                                                                value={data.certifications?.[index - 1]?.name || ''}
                                                                onChange={(e) => {
                                                                    const certs = [...(data.certifications || [])];
                                                                    if (!certs[index - 1]) {
                                                                        certs[index - 1] = { name: '', issuer: '', date: '', description: '' };
                                                                    }
                                                                    certs[index - 1].name = e.target.value;
                                                                    setData('certifications', certs);
                                                                }}
                                                                placeholder="ISO 9001:2015"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`cert_issuer_${index}`}>Penerbit</Label>
                                                            <Input
                                                                id={`cert_issuer_${index}`}
                                                                value={data.certifications?.[index - 1]?.issuer || ''}
                                                                onChange={(e) => {
                                                                    const certs = [...(data.certifications || [])];
                                                                    if (!certs[index - 1]) {
                                                                        certs[index - 1] = { name: '', issuer: '', date: '', description: '' };
                                                                    }
                                                                    certs[index - 1].issuer = e.target.value;
                                                                    setData('certifications', certs);
                                                                }}
                                                                placeholder="Badan Sertifikasi"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`cert_date_${index}`}>Tanggal Sertifikasi</Label>
                                                            <Input
                                                                id={`cert_date_${index}`}
                                                                type="date"
                                                                value={data.certifications?.[index - 1]?.date || ''}
                                                                onChange={(e) => {
                                                                    const certs = [...(data.certifications || [])];
                                                                    if (!certs[index - 1]) {
                                                                        certs[index - 1] = { name: '', issuer: '', date: '', description: '' };
                                                                    }
                                                                    certs[index - 1].date = e.target.value;
                                                                    setData('certifications', certs);
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`cert_description_${index}`}>Deskripsi</Label>
                                                            <Input
                                                                id={`cert_description_${index}`}
                                                                value={data.certifications?.[index - 1]?.description || ''}
                                                                onChange={(e) => {
                                                                    const certs = [...(data.certifications || [])];
                                                                    if (!certs[index - 1]) {
                                                                        certs[index - 1] = { name: '', issuer: '', date: '', description: '' };
                                                                    }
                                                                    certs[index - 1].description = e.target.value;
                                                                    setData('certifications', certs);
                                                                }}
                                                                placeholder="Deskripsi sertifikasi"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="Nilai-Nilai Inti" description="Nilai-nilai inti perusahaan" icon={<Target className="h-5 w-5" />}>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Nilai-Nilai Inti</Label>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Tambahkan nilai-nilai inti perusahaan</p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((index) => (
                                                <div key={index} className="space-y-3 rounded-lg border p-4">
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`value_title_${index}`}>Judul Nilai</Label>
                                                            <Input
                                                                id={`value_title_${index}`}
                                                                value={data.core_values?.[index - 1]?.title || ''}
                                                                onChange={(e) => {
                                                                    const values = [...(data.core_values || [])];
                                                                    if (!values[index - 1]) {
                                                                        values[index - 1] = { title: '', description: '' };
                                                                    }
                                                                    values[index - 1].title = e.target.value;
                                                                    setData('core_values', values);
                                                                }}
                                                                placeholder="Inovasi"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`value_icon_${index}`}>Icon (opsional)</Label>
                                                            <Input
                                                                id={`value_icon_${index}`}
                                                                value={data.core_values?.[index - 1]?.icon || ''}
                                                                onChange={(e) => {
                                                                    const values = [...(data.core_values || [])];
                                                                    if (!values[index - 1]) {
                                                                        values[index - 1] = { title: '', description: '' };
                                                                    }
                                                                    values[index - 1].icon = e.target.value;
                                                                    setData('core_values', values);
                                                                }}
                                                                placeholder="🚀 atau nama icon"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`value_description_${index}`}>Deskripsi Nilai</Label>
                                                        <Textarea
                                                            id={`value_description_${index}`}
                                                            value={data.core_values?.[index - 1]?.description || ''}
                                                            onChange={(e) => {
                                                                const values = [...(data.core_values || [])];
                                                                if (!values[index - 1]) {
                                                                    values[index - 1] = { title: '', description: '' };
                                                                }
                                                                values[index - 1].description = e.target.value;
                                                                setData('core_values', values);
                                                            }}
                                                            placeholder="Deskripsi nilai ini..."
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
                            <FormSection title="Informasi Kontak" description="Detail kontak dan alamat" icon={<Phone className="h-5 w-5" />}>
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
                            </FormSection>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.business-units.index')}>Batal</a>
                        </Button>
                        <LoadingButton type="submit" loading={processing} loadingText="Menyimpan..." icon="save" className="cta-button">
                            Simpan Unit Bisnis
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
