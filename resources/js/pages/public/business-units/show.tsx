import { AchievementsSection, EventsPortfolioSection, GallerySection, HeroSection, TeamSection, TestimonialsSection } from '@/components/landing';
import MoreAboutCards from '@/components/landing/MoreAboutCards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BusinessUnitShowProps {
    businessUnit: BusinessUnit;
    relatedUnits?: BusinessUnit[];
    globalVariables?: Record<string, string>;
}

export default function BusinessUnitShow({ businessUnit, relatedUnits = [], globalVariables = {} }: BusinessUnitShowProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(route('contact.store'), formData, {
            onSuccess: () => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                });
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Parse services from JSON string or fallback to comma-separated
    const parseServices = (servicesString: string | undefined) => {
        if (!servicesString) return [];

        try {
            // Try to parse as JSON first (new format)
            const services = JSON.parse(servicesString);
            if (Array.isArray(services)) {
                return services.map((service) => ({
                    id: service.id || `service_${Math.random()}`,
                    title: service.title || 'Layanan',
                    description: service.description || '',
                    image: service.image || '',
                    price_range: service.price_range || '',
                    duration: service.duration || '',
                    features: service.features || [],
                    technologies: service.technologies || [],
                    process_steps: service.process_steps || [],
                    featured: service.featured || false,
                    active: service.active !== false,
                }));
            }
        } catch {
            toast.error('Gagal memuat layanan');
        }

        // Fallback: treat as comma-separated string
        return servicesString.split(',').map((s, index) => ({
            id: `service_${index}`,
            title: s.trim(),
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
    };

    const services = parseServices(businessUnit.services);

    // Transform gallery images for the GallerySection component
    const galleryImages =
        businessUnit.gallery_images?.map((image: unknown, index: number) => {
            // gallery_images may be an array of strings (urls) or objects { id, url, alt, caption }
            if (typeof image === 'string') {
                return {
                    id: `img-${index + 1}`,
                    url: image,
                    alt: `${businessUnit.name} - Image ${index + 1}`,
                    caption: `${businessUnit.name} community activities and events`,
                    thumbnail: { url: image },
                };
            }

            // If image is an object, safely read properties
            const imageObj = image as { url?: string; id?: string | number; alt?: string; caption?: string };
            const imgUrl = imageObj?.url ?? (typeof image === 'string' ? image : '');
            return {
                id: imageObj?.id ?? `img-${index + 1}`,
                url: imgUrl,
                alt: imageObj?.alt ?? `${businessUnit.name} - Image ${index + 1}`,
                caption: imageObj?.caption ?? `${businessUnit.name} community activities and events`,
                thumbnail: { url: imgUrl },
            };
        }) || [];

    // Transform client testimonials for the TestimonialsSection component
    const testimonials =
        businessUnit.client_testimonials?.map((testimonial, index) => ({
            id: index + 1,
            name: testimonial.name,
            role: 'Client',
            company: testimonial.company,
            content: testimonial.content,
            rating: testimonial.rating || 5,
            image: testimonial.image,
            date: new Date().toISOString().split('T')[0], // Use current date as fallback
            verified: true,
        })) || [];

    // Transform team members for the TeamSection component
    const teamMembers =
        businessUnit.team_members?.map((member, index) => ({
            id: index + 1,
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image,
            email: '',
            phone: '',
            location: '',
            joinDate: '',
            expertise: [],
            achievements: [],
            education: [],
            experience: [],
            socialLinks: member.social_links
                ? [
                      ...(member.social_links.linkedin ? [{ platform: 'linkedin' as const, url: member.social_links.linkedin }] : []),
                      ...(member.social_links.twitter ? [{ platform: 'twitter' as const, url: member.social_links.twitter }] : []),
                      ...(member.social_links.github ? [{ platform: 'website' as const, url: member.social_links.github }] : []),
                  ]
                : [],
            isActive: true,
            isFeatured: index === 0,
        })) || [];

    // Transform portfolio items for the EventsPortfolioSection component
    const portfolioItems =
        businessUnit.portfolio_items?.map((item, index) => ({
            id: index + 1,
            title: item.title,
            description: item.description,
            image: item.image,
            client: item.client,
            technologies: item.technologies,
            category: 'Layanan Bisnis',
            completionDate: new Date().toISOString().split('T')[0], // Use current date as fallback
            projectUrl: '#',
            caseStudyUrl: '#',
            results: ['Pengiriman proyek berhasil', 'Kepuasan klien tercapai', 'Tujuan bisnis terpenuhi'],
            challenges: ['Persyaratan kompleks', 'Jadwal ketat', 'Kendala teknis'],
            solutions: ['Metodologi agile', 'Penempatan tim ahli', 'Solusi inovatif'],
            isFeatured: index === 0,
            isHighlighted: index === 0,
        })) || [];

    // Transform achievements for the AchievementsSection component
    const achievements =
        businessUnit.achievements?.map((achievement, index) => ({
            id: index + 1,
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            category: 'achievement' as const,
            icon: '🏆',
            image: achievement.image,
            location: '',
            issuer: 'Industry Recognition',
            level: 'gold' as const,
            isHighlighted: index === 0,
        })) || [];

    // Create statistics for the AchievementsSection
    const statistics = [
        {
            id: 1,
            label: 'Tahun Beroperasi',
            value: businessUnit.company_stats?.years_in_business || 0,
            suffix: '+',
            icon: '⏰',
            color: 'text-amber-600',
            description: 'Pengalaman dalam industri',
        },
        {
            id: 2,
            label: 'Proyek Selesai',
            value: businessUnit.company_stats?.projects_completed || 0,
            suffix: '+',
            icon: '🚀',
            color: 'text-amber-600',
            description: 'Pengiriman proyek berhasil',
        },
        {
            id: 3,
            label: 'Klien Terlayani',
            value: businessUnit.company_stats?.clients_served || 0,
            suffix: '+',
            icon: '👥',
            color: 'text-amber-600',
            description: 'Klien puas di seluruh dunia',
        },
        {
            id: 4,
            label: 'Ukuran Tim',
            value: businessUnit.company_stats?.team_size || 0,
            suffix: '+',
            icon: '👨‍💼',
            color: 'text-amber-600',
            description: 'Profesional ahli',
        },
    ];

    // Contact information
    const contactInfo = {
        address: businessUnit.address,
        phone: businessUnit.contact_phone,
        email: businessUnit.contact_email,
        hours: businessUnit.operating_hours,
    };

    return (
        <PublicLayout
            title={businessUnit.name}
            description={businessUnit.description || `Informasi lengkap tentang ${businessUnit.name} - Unit Bisnis CIGI Global`}
        >
            <Head title={businessUnit.name} />

            {/* Enhanced Hero Section */}
            <HeroSection
                title={businessUnit.name}
                subtitle="Solusi Bisnis Profesional"
                description={
                    businessUnit.description ||
                    `Kami menyediakan layanan dan solusi bisnis unggulan yang disesuaikan dengan kebutuhan Anda. Keahlian dan komitmen kami menjamin keberhasilan proyek Anda.`
                }
                backgroundImage={businessUnit.image}
                ctaText="Get Started"
                ctaLink="#about"
                secondaryCtaText={businessUnit.hero_cta_text || 'Pelajari Lebih Lanjut'}
                contactSectionId="contact"
                className="min-h-screen"
            />

            {/* Back Button - Floating */}
            <div className="fixed top-23 left-4 z-50">
                <Link
                    href={route('business-units.index')}
                    className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Unit Bisnis
                </Link>
            </div>

            {/* About Section */}
            <section id="about" className="section-dark py-16">
                <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="section-heading">Tentang Unit Bisnis Kami</h2>

                    <p className="section-subheading">
                        {businessUnit.description ||
                            'Unit bisnis kami berdedikasi untuk memberikan nilai luar biasa melalui solusi inovatif, konsultasi ahli, dan layanan yang dapat diandalkan. Kami bekerja sama dengan klien untuk mencapai pertumbuhan dan keberlanjutan.'}
                    </p>

                    {businessUnit.more_about?.length && (
                        <MoreAboutCards cards={businessUnit.more_about} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" />
                    )}
                </div>
            </section>

            {/* Services Section */}
            {services?.length > 0 && (
                <section className="bg-zinc-900 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <header className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="section-heading">Layanan Kami</h2>
                            <p className="section-subheading">
                                Temukan rangkaian layanan bisnis kami yang dirancang untuk memenuhi kebutuhan khusus Anda.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, idx) => (
                                <article
                                    key={service.id || idx}
                                    className="section-card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Service Image */}
                                    {service.image && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={typeof service.image === 'string' ? service.image : `/storage/${service.image}`}
                                                alt={service.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {service.featured && (
                                                <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-black">
                                                    ⭐ Featured
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Service Header */}
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                                <CheckCircle className="h-6 w-6 text-amber-400" />
                                            </div>
                                            {service.featured && !service.image && (
                                                <div className="rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-black">⭐ Featured</div>
                                            )}
                                        </div>

                                        {/* Service Title & Description */}
                                        <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                                            {service.title}
                                        </h3>
                                        <p className="mb-4 line-clamp-3 text-sm text-zinc-300">
                                            {service.description || 'Layanan profesional dengan metodologi terbukti dan praktik terbaik industri.'}
                                        </p>

                                        {/* Service Details */}
                                        <div className="space-y-3">
                                            {/* Price Range */}
                                            {service.price_range && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-amber-400">💰</span>
                                                    <span className="text-zinc-300">{service.price_range}</span>
                                                </div>
                                            )}

                                            {/* Duration */}
                                            {service.duration && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-amber-400">⏱️</span>
                                                    <span className="text-zinc-300">{service.duration}</span>
                                                </div>
                                            )}

                                            {/* Features Count */}
                                            {service.features && service.features.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-amber-400">✨</span>
                                                    <span className="text-zinc-300">{service.features.length} fitur utama</span>
                                                </div>
                                            )}

                                            {/* Technologies Count */}
                                            {service.technologies && service.technologies.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-amber-400">🔧</span>
                                                    <span className="text-zinc-300">{service.technologies.length} teknologi</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Process Steps Preview */}
                                        {service.process_steps && service.process_steps.length > 0 && (
                                            <div className="mt-4 border-t border-zinc-700 pt-4">
                                                <div className="mb-2 flex items-center gap-2 text-sm text-amber-400">
                                                    <span>📋</span>
                                                    <span>Proses Kerja</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {service.process_steps
                                                        .slice(0, 3)
                                                        .map((step: { order?: number; step?: string }, stepIdx: number) => (
                                                            <div key={stepIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">
                                                                    {step.order || stepIdx + 1}
                                                                </span>
                                                                <span className="line-clamp-1">{step.step || `Langkah ${stepIdx + 1}`}</span>
                                                            </div>
                                                        ))}
                                                    {service.process_steps.length > 3 && (
                                                        <div className="text-xs text-zinc-500">
                                                            +{service.process_steps.length - 3} langkah lainnya
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Call to Action */}
                                        <div className="mt-6">
                                            <Button
                                                className="w-full bg-amber-500 text-black transition-colors hover:bg-amber-600"
                                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                Konsultasi Sekarang
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {galleryImages.length > 0 ? (
                <GallerySection
                    images={galleryImages}
                    title="Galeri Pekerjaan Kami"
                    subtitle="Lihat Proyek Kami"
                    layout="grid"
                    showLightbox={true}
                    autoPlay={false}
                    showDownload={false}
                    showShare={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Galeri Pekerjaan Kami</h2>
                            <p className="section-subheading">
                                Kami sedang menyiapkan portofolio proyek. Kunjungi kembali untuk melihat contoh pekerjaan dan implementasi sukses
                                kami.
                            </p>
                            <div className="flex h-64 items-center justify-center rounded-xl bg-zinc-800">
                                <div className="text-center text-zinc-400">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                        <span className="text-2xl">🖼️</span>
                                    </div>
                                    <p className="text-sm">Portfolio coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Team Section */}
            {teamMembers.length > 0 ? (
                <TeamSection
                    members={teamMembers}
                    title="Team Kami"
                    subtitle="Profesional dan Berpengalaman"
                    layout="grid"
                    showSocialLinks={true}
                    showContactInfo={false}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Kenali Tim Kami</h2>
                            <p className="section-subheading">
                                Tim ahli kami siap melayani Anda. Kenali para profesional yang mendukung kesuksesan kami.
                            </p>
                            <div className="rounded-xl bg-zinc-800 p-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <p className="text-zinc-300">
                                    Our team profiles are being prepared. Contact us to learn more about our expertise and experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 ? (
                <TestimonialsSection
                    testimonials={testimonials}
                    title="Testimoni"
                    subtitle="kepuasan klien"
                    autoRotate={true}
                    rotationInterval={6000}
                    showNavigation={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Testimoni Klien</h2>
                            <p className="section-subheading">Klien kami berbagi kisah sukses mereka. Jadilah kisah sukses berikutnya!</p>
                            <div className="rounded-xl bg-zinc-800 p-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-zinc-300">
                                    Share your experience working with us and help others discover the value of our services.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 ? (
                <AchievementsSection
                    achievements={achievements}
                    statistics={statistics}
                    title="Pencapaian Kami"
                    subtitle="Penghargaan & Tonggak"
                    showStatistics={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Pencapaian Kami</h2>
                            <p className="section-subheading">
                                Kami sedang membangun jejak kesuksesan. Bergabunglah merayakan tonggak dan pencapaian kami.
                            </p>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {statistics.map((stat) => (
                                    <div key={stat.id} className="rounded-xl bg-zinc-800 p-6 text-center">
                                        <div className="mb-2 text-3xl">{stat.icon}</div>
                                        <div className="mb-1 text-2xl font-bold text-white">
                                            {stat.value}
                                            {stat.suffix}
                                        </div>
                                        <div className="text-sm text-zinc-300">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio Section */}
            {portfolioItems.length > 0 ? (
                <EventsPortfolioSection
                    events={[]}
                    portfolioItems={portfolioItems}
                    title="Portofolio Kami"
                    subtitle="Proyek Berhasil & Studi Kasus"
                    showTabs={false}
                    showEvents={false}
                    showPortfolio={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Portofolio Kami</h2>
                            <p className="section-subheading">
                                Kami sedang menyiapkan showcase proyek. Kunjungi kembali untuk melihat contoh implementasi sukses kami.
                            </p>
                            <div className="rounded-xl bg-zinc-800 p-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-2xl">💼</span>
                                </div>
                                <p className="mb-4 text-zinc-300">Portofolio sedang disiapkan lengkap dengan studi kasus dan contoh proyek.</p>
                                <Button className="cta-button">Minta Studi Kasus</Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Information & Form */}
            <section id="contact" className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Information */}
                        <div>
                            <div className="mb-8">
                                <h2 className="mb-4 text-3xl font-bold text-white">Informasi Kontak - {businessUnit.name}</h2>
                                <p className="text-lg text-zinc-300">Berikut adalah berbagai cara untuk menghubungi tim {businessUnit.name}</p>
                            </div>

                            <div className="space-y-6">
                                {/* Phone */}
                                {contactInfo.phone && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Phone className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Telepon</h3>
                                            <p className="text-zinc-400">Hubungi kami langsung</p>
                                            <a href={`tel:${contactInfo.phone}`} className="text-amber-400 transition-colors hover:text-amber-300">
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                {contactInfo.email && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Mail className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Email</h3>
                                            <p className="text-zinc-400">Kirim email untuk pertanyaan detail</p>
                                            <a href={`mailto:${contactInfo.email}`} className="text-amber-400 transition-colors hover:text-amber-300">
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                {contactInfo.address && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <MapPin className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Alamat</h3>
                                            <p className="text-zinc-400">Kunjungi kantor kami</p>
                                            <p className="text-zinc-300">{contactInfo.address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Office Hours */}
                                {contactInfo.hours && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Clock className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Jam Operasional</h3>
                                            <p className="text-zinc-400">Waktu terbaik untuk menghubungi kami</p>
                                            <p className="text-zinc-300">{contactInfo.hours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Social Media */}
                            <div className="mt-8">
                                <h3 className="mb-4 text-xl font-semibold text-white">Ikuti Kami</h3>
                                <div className="flex gap-4">
                                    {globalVariables.social_facebook && (
                                        <a
                                            href={globalVariables.social_facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVariables.social_instagram && (
                                        <a
                                            href={globalVariables.social_instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 hover:text-white"
                                        >
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVariables.social_twitter && (
                                        <a
                                            href={globalVariables.social_twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                                        >
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVariables.social_linkedin && (
                                        <a
                                            href={globalVariables.social_linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-700 hover:text-white"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-8">
                                <div className="mb-6">
                                    <h2 className="mb-2 text-2xl font-bold text-white">Kirim Pesan</h2>
                                    <p className="text-zinc-400">Isi formulir di bawah dan kami akan segera menghubungi Anda</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name" className="text-white">
                                                Nama Lengkap *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-white">
                                                Nomor Telepon
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Contoh: +62 812-3456-7890"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-white">
                                            Email *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="nama@email.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subject" className="text-white">
                                            Subjek *
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="Topik pesan Anda"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message" className="text-white">
                                            Pesan *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="mt-1 resize-none border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="Jelaskan kebutuhan atau pertanyaan Anda secara detail..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                                Mengirim...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Send className="h-5 w-5" />
                                                Kirim Pesan
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Business Units */}
            {relatedUnits.length > 0 && (
                <section className="section-dark py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="section-heading">Jelajahi Unit Bisnis Lainnya</h2>
                            <p className="section-subheading">Temukan unit bisnis spesialis lain dalam ekosistem CIGI Global.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {relatedUnits.slice(0, 3).map((unit) => (
                                <Link key={unit.id} href={route('business-units.show', unit.slug)} className="group">
                                    <div className="section-card group overflow-hidden transition-all duration-300 hover:-translate-y-1">
                                        {unit.image && (
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={`${unit.image}`}
                                                    alt={unit.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                                                {unit.name}
                                            </h3>
                                            {unit.description && <p className="mb-4 line-clamp-3 text-zinc-300">{unit.description}</p>}
                                            <div className="flex items-center text-sm text-zinc-400">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Layanan Bisnis
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
