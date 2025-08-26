import {
    AchievementsSection,
    ContactCTASection,
    EventsPortfolioSection,
    GallerySection,
    HeroSection,
    TestimonialsSection,
} from '@/components/landing';
import MoreAboutCards from '@/components/landing/MoreAboutCards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type CommunityClub } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, Users } from 'lucide-react';

interface CommunityClubShowProps {
    communityClub: CommunityClub;
    relatedClubs?: CommunityClub[];
}

export default function CommunityClubShow({ communityClub, relatedClubs = [] }: CommunityClubShowProps) {
    const getClubActivities = (): string[] => {
        if (!communityClub.activities) return [];
        try {
            const activities = JSON.parse(communityClub.activities);
            return Array.isArray(activities) ? activities : [];
        } catch {
            return communityClub.activities.split(',').map((a) => a.trim());
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

    // Contact information for ContactCTASection
    const contactInfo = {
        address: communityClub.location,
        phone: communityClub.contact_phone,
        email: communityClub.contact_email,
        hours: communityClub.meeting_schedule,
    };

    // CTA buttons for ContactCTASection
    const ctaButtons = [
        {
            text: 'Bergabung dengan Komunitas Kami',
            link: `mailto:${communityClub.contact_email || 'info@cigi-global.com'}?subject=Bergabung ${communityClub.name}`,
            variant: 'primary' as const,
            icon: '👥',
        },
        {
            text: 'Hubungi Kami',
            link: communityClub.contact_phone
                ? `tel:${communityClub.contact_phone}`
                : `mailto:${communityClub.contact_email || 'info@cigi-global.com'}`,
            variant: 'secondary' as const,
            icon: '📞',
        },
        {
            text: 'Pelajari Lebih Lanjut',
            link: '#about',
            variant: 'outline' as const,
            icon: 'ℹ️',
        },
    ];

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
                ctaText={communityClub.hero_cta_text || 'Bergabung Sekarang'}
                ctaLink={communityClub.hero_cta_link || '#contact'}
                secondaryCtaText="Pelajari Lebih Lanjut"
                secondaryCtaLink="#about"
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
                                <div key={index} className="section-card">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                        <Activity className="h-6 w-6 text-amber-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-white">{activity}</h3>
                                    <p className="text-sm text-zinc-300">
                                        Join our community members in this engaging activity designed to foster connections and learning.
                                    </p>
                                </div>
                            ))}
                        </div>
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

            {/* Contact & CTA Section */}
            <ContactCTASection
                title="Siap Bergabung dengan Komunitas Kami?"
                subtitle="Hubungi Kami Sekarang"
                description="Apakah Anda ingin belajar keterampilan baru, membangun koneksi profesional, atau menjadi bagian dari sesuatu yang bermakna — kami dengan senang hati mengundang Anda bergabung."
                contactInfo={contactInfo}
                ctaButtons={ctaButtons}
                showMap={false}
            />

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
