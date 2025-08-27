import {
    AchievementsSection,
    ContactCTASection,
    EventsPortfolioSection,
    GallerySection,
    HeroSection,
    TeamSection,
    TestimonialsSection,
} from '@/components/landing';
import MoreAboutCards from '@/components/landing/MoreAboutCards';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react';

interface BusinessUnitShowProps {
    businessUnit: BusinessUnit;
    relatedUnits?: BusinessUnit[];
}

export default function BusinessUnitShow({ businessUnit, relatedUnits = [] }: BusinessUnitShowProps) {
    const services = businessUnit.services ? businessUnit.services.split(',').map((s) => s.trim()) : [];

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

    // Contact information for ContactCTASection
    const contactInfo = {
        address: businessUnit.address,
        phone: businessUnit.contact_phone,
        email: businessUnit.contact_email,
        hours: businessUnit.operating_hours,
    };

    // CTA buttons for ContactCTASection
    const ctaButtons = [
        {
            text: 'Minta Penawaran',
            link: `mailto:${businessUnit.contact_email || 'info@cigi-global.com'}?subject=Permintaan Penawaran untuk ${businessUnit.name}`,
            variant: 'primary' as const,
            icon: '💰',
        },
        {
            text: 'Jadwalkan Konsultasi',
            link: businessUnit.contact_phone ? `tel:${businessUnit.contact_phone}` : `mailto:${businessUnit.contact_email || 'info@cigi-global.com'}`,
            variant: 'secondary' as const,
            icon: '📅',
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
                ctaText={businessUnit.hero_cta_text || 'Mulai Sekarang'}
                ctaLink={businessUnit.hero_cta_link || '#contact'}
                secondaryCtaText={businessUnit.hero_cta_text || 'Pelajari Lebih Lanjut'}
                secondaryCtaLink={businessUnit.hero_cta_link || '#about'}
                className="min-h-screen"
            />
            {/* Back Button - Floating */}
            <div className="fixed top-23 left-4 z-50">
                <Link
                    href={route('business-units.index')}
                    className="20 hover:30 inline-flex items-center rounded-lg px-4 py-2 text-white backdrop-blur-sm transition-colors"
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
            {services?.length && (
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
                                <article key={idx} className="section-card flex flex-col">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                        <CheckCircle className="h-6 w-6 text-amber-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-white">{service}</h3>
                                    <p className="text-sm text-zinc-300">
                                        Penyampaian layanan profesional dengan metodologi terbukti dan praktik terbaik industri.
                                    </p>
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
            {/* Contact & CTA Section */}
            <ContactCTASection
                title="Siap Bekerja Bersama?"
                subtitle="Mari Diskusikan Proyek Anda"
                description="Apakah Anda membutuhkan konsultasi, pelaksanaan proyek, atau dukungan berkelanjutan — kami siap membantu mencapai tujuan bisnis Anda."
                contactInfo={contactInfo}
                ctaButtons={ctaButtons}
                showMap={false}
            />
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
