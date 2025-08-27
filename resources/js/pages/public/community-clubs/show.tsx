import { AchievementsSection, EventsPortfolioSection, GallerySection, HeroSection, TestimonialsSection } from '@/components/landing';
import MoreAboutCards from '@/components/landing/MoreAboutCards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { type CommunityClub } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, ArrowLeft, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter, Users } from 'lucide-react';
import { useState } from 'react';

interface CommunityClubShowProps {
    communityClub: CommunityClub;
    relatedClubs?: CommunityClub[];
    globalVariables?: Record<string, string>;
}

export default function CommunityClubShow({ communityClub, relatedClubs = [], globalVariables = {} }: CommunityClubShowProps) {
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

    const getClubActivities = (): Array<{
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
    }> => {
        if (!communityClub.activities) return [];
        try {
            const activities = JSON.parse(communityClub.activities);
            if (Array.isArray(activities)) {
                // Filter hanya aktivitas yang aktif
                return activities.filter((activity) => activity.active !== false);
            }
            return [];
        } catch {
            // Fallback untuk format lama (string dengan line breaks)
            if (typeof communityClub.activities === 'string' && communityClub.activities.trim()) {
                return communityClub.activities
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
            return [];
        }
    };

    const activities = getClubActivities();

    // Transform gallery images for the GallerySection component
    const galleryImages =
        communityClub.gallery_images?.map((image: unknown, index: number) => {
            // gallery_images may be an array of strings (urls) or objects { id, url, alt, caption }
            if (typeof image === 'string') {
                return {
                    id: `img-${index + 1}`,
                    url: image,
                    alt: `${communityClub.name} - Image ${index + 1}`,
                    caption: `${communityClub.name} community activities and events`,
                    thumbnail: { url: image },
                };
            }

            // If image is an object, safely read properties
            const imageObj = image as { url?: string; id?: string | number; alt?: string; caption?: string };
            const imgUrl = imageObj?.url ?? (typeof image === 'string' ? image : '');
            return {
                id: imageObj?.id ?? `img-${index + 1}`,
                url: imgUrl,
                alt: imageObj?.alt ?? `${communityClub.name} - Image ${index + 1}`,
                caption: imageObj?.caption ?? `${communityClub.name} community activities and events`,
                thumbnail: { url: imgUrl },
            };
        }) || [];

    // Transform testimonials for the TestimonialsSection component
    const testimonials =
        communityClub.testimonials?.map((testimonial, index) => ({
            id: index + 1,
            name: testimonial.name,
            role: testimonial.role,
            company: '',
            content: testimonial.content,
            image: testimonial.image,
            date: new Date().toISOString().split('T')[0], // Use current date as fallback
            verified: true,
        })) || [];

    // Transform achievements for the AchievementsSection component
    const achievements =
        communityClub.achievements?.map((achievement, index) => ({
            id: index + 1,
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            category: 'achievement' as const,
            icon: '🏆',
            image: achievement.image,
            location: '',
            issuer: communityClub.name,
            level: 'gold' as const,
            isHighlighted: index === 0,
        })) || [];

    // Transform upcoming events for the EventsPortfolioSection component
    const events =
        communityClub.upcoming_events?.map((event, index) => ({
            id: index + 1,
            title: event.title,
            description: event.description,
            date: event.date,
            time: '10:00 AM',
            endDate: event.date,
            endTime: '6:00 PM',
            location: communityClub.location || 'TBD',
            image: event.image,
            maxParticipants: 50,
            currentParticipants: 0,
            price: 'Free',
            category: 'Community',
            tags: ['community', 'networking'],
            organizer: communityClub.name,
            contactEmail: communityClub.contact_email || '',
            contactPhone: communityClub.contact_phone || '',
            registrationUrl: '#',
            isFeatured: index === 0,
            isUpcoming: true,
            isPast: false,
        })) || [];

    // Create statistics for the AchievementsSection
    const statistics = [
        {
            id: 1,
            label: 'Community Members',
            value: communityClub.member_count || 0,
            suffix: '+',
            icon: '👥',
            color: 'text-blue-600',
            description: 'Active community members',
        },
        {
            id: 2,
            label: 'Years Active',
            value: communityClub.founded_year ? new Date().getFullYear() - communityClub.founded_year : 0,
            suffix: '+',
            icon: '⏰',
            color: 'text-green-600',
            description: 'Years of community building',
        },
        {
            id: 3,
            label: 'Activities Available',
            value: activities.length,
            suffix: '',
            icon: '🎯',
            color: 'text-purple-600',
            description: 'Community activities and programs',
        },
        {
            id: 4,
            label: 'Events This Year',
            value: events.length,
            suffix: '',
            icon: '📅',
            color: 'text-orange-600',
            description: 'Upcoming community events',
        },
    ];

    // Contact information
    const contactInfo = {
        address: communityClub.location,
        phone: communityClub.contact_phone,
        email: communityClub.contact_email,
        hours: communityClub.meeting_schedule,
    };

    return (
        <PublicLayout
            title={communityClub.name}
            description={communityClub.description || `Informasi lengkap tentang ${communityClub.name} - Komunitas CIGI Global`}
        >
            <Head title={communityClub.name} />

            {/* Enhanced Hero Section */}
            <HeroSection
                title={communityClub.name}
                subtitle={communityClub.hero_subtitle || `Bergabung dengan komunitas ${communityClub.type} yang dinamis`}
                description={
                    communityClub.description ||
                    `Jadilah bagian dari komunitas kami yang dinamis — tempat belajar, kolaborasi, dan inovasi bertemu. Temukan aktivitas, bangun koneksi, dan berkembang bersama individu yang sejalan.`
                }
                type={communityClub.type}
                backgroundImage={communityClub.image}
                ctaText="Get Started"
                ctaLink="#about"
                secondaryCtaLink="#about"
                contactSectionId="contact"
                className="min-h-screen"
            />

            {/* Back Button - Floating */}
            <div className="fixed top-23 left-4 z-50">
                <Link
                    href={route('community-clubs.index')}
                    className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Komunitas
                </Link>
            </div>

            {/* About Section */}
            <section id="about" className="section-dark py-16">
                <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="section-heading">Tentang Komunitas Kami</h2>

                    <p className="section-subheading">
                        {communityClub.description ||
                            'Kampung Ramah Lingkungan Cigi adalah program komunitas untuk menciptakan lingkungan yang bersih, hijau, dan berkelanjutan.'}
                    </p>

                    {communityClub.more_about?.length && (
                        <MoreAboutCards cards={communityClub.more_about} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" />
                    )}
                </div>
            </section>

            {/* Activities Section */}
            {activities.length > 0 && (
                <section className="bg-zinc-900 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="section-heading">Aktivitas Komunitas</h2>
                            <p className="section-subheading">Temukan berbagai aktivitas dan program yang kami sediakan untuk anggota komunitas.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activities.map((activity, index) => (
                                <div
                                    key={activity.id || index}
                                    className="section-card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Activity Image */}
                                    {activity.image && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={typeof activity.image === 'string' ? activity.image : `/storage/${activity.image}`}
                                                alt={activity.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {activity.featured && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-amber-500 text-black">Unggulan</Badge>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {/* Activity Header */}
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                            <Activity className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                                            {activity.title}
                                        </h3>

                                        {/* Activity Description */}
                                        {activity.description && <p className="mb-4 line-clamp-3 text-sm text-zinc-300">{activity.description}</p>}

                                        {/* Activity Details */}
                                        <div className="space-y-2 text-xs text-zinc-400">
                                            {activity.duration && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{activity.duration}</span>
                                                </div>
                                            )}
                                            {activity.max_participants && (
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-3 w-3" />
                                                    <span>Maksimal {activity.max_participants} peserta</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Activity Benefits */}
                                        {activity.benefits && activity.benefits.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="mb-2 text-sm font-semibold text-amber-400">Manfaat:</h4>
                                                <ul className="space-y-1">
                                                    {activity.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                                                        <li key={benefitIndex} className="flex items-start gap-2 text-xs text-zinc-300">
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                    {activity.benefits.length > 3 && (
                                                        <li className="text-xs text-zinc-500">+{activity.benefits.length - 3} manfaat lainnya</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Activity Requirements */}
                                        {activity.requirements && (
                                            <div className="mt-4">
                                                <h4 className="mb-2 text-sm font-semibold text-zinc-400">Persyaratan:</h4>
                                                <p className="line-clamp-2 text-xs text-zinc-300">{activity.requirements}</p>
                                            </div>
                                        )}

                                        {/* Call to Action */}
                                        <div className="mt-6">
                                            <Button
                                                className="w-full transform bg-gradient-to-r from-amber-500 to-amber-600 text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700"
                                                onClick={() => {
                                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Bergabung Sekarang
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Show More Activities Button */}
                        {activities.length > 6 && (
                            <div className="mt-8 text-center">
                                <Button variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black">
                                    Lihat Semua Aktivitas ({activities.length})
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {galleryImages.length > 0 ? (
                <GallerySection
                    images={galleryImages}
                    title="Galeri Komunitas"
                    subtitle="Mengabadikan Momen Kita"
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
                            <h2 className="section-heading">Galeri Komunitas</h2>
                            <p className="section-subheading">
                                Kami sedang menyusun koleksi foto kami. Kunjungi kembali untuk melihat gambar dari aktivitas dan acara komunitas.
                            </p>
                            <div className="flex h-64 items-center justify-center rounded-xl bg-zinc-800">
                                <div className="text-center text-zinc-400">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                        <span className="text-2xl">📸</span>
                                    </div>
                                    <p className="text-sm">Galeri segera hadir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 ? (
                <TestimonialsSection
                    testimonials={testimonials}
                    title="Pendapat Anggota Kami"
                    subtitle="Suara Komunitas"
                    autoRotate={true}
                    rotationInterval={6000}
                    showNavigation={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Testimoni Anggota</h2>
                            <p className="section-subheading">
                                Anggota komunitas kami berbagi pengalaman mereka. Jadilah yang pertama menambahkan cerita Anda!
                            </p>
                            <div className="rounded-xl bg-zinc-800 p-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-zinc-300">
                                    Share your experience with our community and help others discover the value of joining us.
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
                    title="Pencapaian Komunitas"
                    subtitle="Merayakan Keberhasilan Kami"
                    showStatistics={true}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Pencapaian Komunitas</h2>
                            <p className="section-subheading">
                                Kami sedang membangun jejak kesuksesan kami. Bergabunglah untuk menciptakan pencapaian bermakna bersama.
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

            {/* Events Section */}
            {events.length > 0 ? (
                <EventsPortfolioSection
                    events={events}
                    portfolioItems={[]}
                    title="Acara Mendatang"
                    subtitle="Ikuti Aktivitas Komunitas Kami"
                    showTabs={false}
                    showEvents={true}
                    showPortfolio={false}
                />
            ) : (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="section-heading">Acara Komunitas</h2>
                            <p className="section-subheading">Kami sedang merencanakan acara dan aktivitas menarik. Nantikan pembaruan!</p>
                            <div className="rounded-xl bg-zinc-800 p-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <p className="mb-4 text-zinc-300">
                                    Kalender acara kami sedang disiapkan dengan aktivitas menarik dan peluang jaringan.
                                </p>
                                <Button className="cta-button">Dapatkan Pemberitahuan</Button>
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
                                <h2 className="mb-4 text-3xl font-bold text-white">Informasi Kontak - {communityClub.name}</h2>
                                <p className="text-lg text-zinc-300">Berikut adalah berbagai cara untuk menghubungi tim {communityClub.name}</p>
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

            {/* Related Clubs */}
            {relatedClubs.length > 0 && (
                <section className="section-dark py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="section-heading">Jelajahi Komunitas Lainnya</h2>
                            <p className="section-subheading">Temukan komunitas dinamis lain dalam ekosistem CIGI Global.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {relatedClubs.slice(0, 3).map((club) => (
                                <Link key={club.id} href={route('community-clubs.show', club.slug)} className="group">
                                    <div className="section-card group overflow-hidden transition-all duration-300 hover:-translate-y-1">
                                        {club.image && (
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={`${club.image}`}
                                                    alt={club.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-amber-500 text-black">{club.type}</Badge>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                                                {club.name}
                                            </h3>
                                            {club.description && <p className="mb-4 line-clamp-3 text-zinc-300">{club.description}</p>}
                                            <div className="flex items-center text-sm text-zinc-400">
                                                <Users className="mr-2 h-4 w-4" />
                                                {club.member_count || 'Baru'} anggota
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
