import AppLogo from '@/components/app-logo';
import Lightbox from '@/components/lightbox';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit, type CommunityClub, type Media, type News } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    ChevronRight,
    Globe,
    Heart,
    Image as ImageIcon,
    Lightbulb,
    Mail,
    MessageCircle,
    Newspaper,
    Phone,
    Target,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface HomeProps {
    globalVariables: Record<string, string>;
    galleryMedia: Media[];
    businessUnits: BusinessUnit[];
    communityClubs: CommunityClub[];
    featuredNews: News[];
    latestNews: News[];
}

export default function Home({
    globalVariables = {},
    galleryMedia = [],
    businessUnits = [],
    communityClubs = [],
    featuredNews = [],
    latestNews = [],
}: HomeProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter media yang diizinkan di homepage
    const homepageMedia = galleryMedia.filter((media) => media.show_homepage);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev < homepageMedia.length - 1 ? prev + 1 : prev));
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return (
        <PublicLayout
            title="Beranda"
            description={globalVariables.company_description || 'Membangun masa depan bersama melalui inovasi dan kolaborasi'}
        >
            <Head title="Beranda - CIGI Global" />

            {/* 1. Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
                {/* Background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900/50 to-black"></div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
                        {/* Left Side - Text Content */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                                <AppLogo className="h-5 w-5" />
                                <span className="text-sm font-medium text-amber-400">{globalVariables.homepage_tagline}</span>
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-4">
                                <h1 className="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                                    <span className="block text-amber-400">{globalVariables.homepage_title}</span>
                                </h1>
                            </div>

                            {/* Description */}
                            <div className="max-w-xl space-y-4">
                                <p className="text-lg leading-relaxed text-zinc-300">{globalVariables.homepage_description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    asChild
                                    className="transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700"
                                >
                                    <Link href={route('about')}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                                                <div className="h-2 w-2 rounded-full bg-current"></div>
                                            </div>
                                            Tentang Kami
                                        </div>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-lg border-zinc-700 bg-zinc-800/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-700"
                                >
                                    <Link href={route('news.index')}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-600">
                                                <div className="h-2 w-2 bg-current"></div>
                                            </div>
                                            Lihat Berita
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right Side - CIGI Global Logo */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative aspect-square w-full max-w-lg">
                                <div className="absolute -inset-4 animate-pulse rounded-2xl bg-gradient-to-r from-amber-600 to-amber-400 opacity-20 blur-2xl"></div>
                                <img
                                    src="/assets/cigi-global.jpg"
                                    alt="Cigi Global Office"
                                    className="relative mx-auto w-full max-w-md rounded-2xl shadow-2xl md:max-w-lg"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. About CIGI Section */}
            <section className="section-dark py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="section-heading">Tentang CIGI Global</h2>
                        <p className="section-subheading">Mengenal lebih dalam tentang visi, misi, dan nilai-nilai yang mendorong perjalanan kami</p>
                    </div>

                    <div className="mb-16 grid gap-8 md:grid-cols-3">
                        <div className="section-card text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                <Target className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Visi Kami</h3>
                            <p className="text-zinc-300">{globalVariables.visi_description}</p>
                        </div>

                        <div className="section-card text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                <Heart className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Misi Kami</h3>
                            <p className="text-zinc-300">{globalVariables.misi_description}</p>
                        </div>

                        <div className="section-card text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                <Lightbulb className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Nilai Kami</h3>
                            <p className="text-zinc-300">{globalVariables.value_description}</p>
                        </div>
                    </div>

                    <section className="grid items-center gap-8 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-8 md:grid-cols-2 md:p-12">
                        <div>
                            <h3 className="mb-4 text-3xl font-bold text-white">Komitmen Terhadap Keberlanjutan</h3>
                            <p className="mb-6 text-lg leading-relaxed text-zinc-300">{globalVariables.commitment_description}</p>
                            <span className="flex items-center font-semibold text-amber-400">
                                <Globe className="mr-2 h-5 w-5" />
                                {globalVariables.commitment_tagline}
                            </span>
                        </div>

                        <img
                            src={globalVariables.commitment_image}
                            alt="Commitment"
                            className="mx-auto h-96 w-96 rounded-lg object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </section>
                </div>
            </section>

            {/* 3. Unit Usaha Section */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="section-heading">Unit Usaha</h2>
                        <p className="section-subheading">Jelajahi berbagai unit bisnis kami yang menghadirkan solusi inovatif</p>
                    </div>

                    {businessUnits.length > 0 ? (
                        <>
                            <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {businessUnits.slice(0, 6).map((unit) => (
                                    <div key={unit.id} className="section-card group">
                                        <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                                            <img
                                                src={unit.image || '/assets/placeholder.jpg'}
                                                alt={unit.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-white">{unit.name}</h3>
                                        <p className="mb-4 line-clamp-3 text-zinc-300">{unit.description}</p>
                                        <Link
                                            href={route('business-units.show', unit.slug)}
                                            className="inline-flex items-center font-semibold text-amber-400 hover:text-amber-300"
                                        >
                                            Pelajari Lebih Lanjut
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <Button asChild className="cta-button">
                                    <Link href={route('business-units.index')}>
                                        <Building2 className="mr-2 h-5 w-5" />
                                        Lihat Semua Unit Bisnis
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <Building2 className="mx-auto mb-4 h-16 w-16 text-zinc-600" />
                            <p className="text-lg text-zinc-400">Unit bisnis akan segera hadir</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Komunitas Section */}
            <section className="section-dark py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="section-heading">Komunitas</h2>
                        <p className="section-subheading">Bergabunglah dengan komunitas yang penuh semangat dan saling mendukung</p>
                    </div>

                    {communityClubs.length > 0 ? (
                        <>
                            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {communityClubs.slice(0, 8).map((club) => (
                                    <div key={club.id} className="section-card text-center">
                                        <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-amber-500/20">
                                            {club.image ? (
                                                <img src={club.image} alt={club.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Users className="h-8 w-8 text-amber-400" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-white">{club.name}</h3>
                                        <p className="mb-3 text-sm text-zinc-400">{club.type}</p>
                                        <p className="mb-4 line-clamp-2 text-sm text-zinc-300">{club.description}</p>
                                        <Link
                                            href={route('community-clubs.show', club.slug)}
                                            className="inline-flex items-center text-sm font-semibold text-amber-400 hover:text-amber-300"
                                        >
                                            Lihat
                                            <ChevronRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <Button asChild className="cta-button">
                                    <Link href={route('community-clubs.index')}>
                                        <Users className="mr-2 h-5 w-5" />
                                        Jelajahi Semua Komunitas
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <Users className="mx-auto mb-4 h-16 w-16 text-zinc-600" />
                            <p className="text-lg text-zinc-400">Komunitas akan segera hadir</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 5. Berita Section */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="section-heading">Berita Terkini</h2>
                        <p className="section-subheading">Tetap terdepan dengan berita dan update terbaru dari CIGI Global</p>
                    </div>

                    {featuredNews.length > 0 || latestNews.length > 0 ? (
                        <>
                            {/* Featured News */}
                            {featuredNews.length > 0 && (
                                <div className="mb-16">
                                    <h3 className="mb-8 text-2xl font-bold text-white">Berita Utama</h3>
                                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                        {featuredNews.slice(0, 3).map((news) => (
                                            <article key={news.id} className="news-card">
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={news.featured_image || '/assets/placeholder.jpg'}
                                                        alt={news.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <div className="mb-3 flex items-center gap-4 text-sm text-zinc-400">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{new Date(news.published_at).toLocaleDateString('id-ID')}</span>
                                                        </div>
                                                        {news.author && (
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                <span>{news.author.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white">{news.title}</h3>
                                                    <p className="mb-4 line-clamp-3 text-zinc-300">{news.excerpt}</p>
                                                    <Link
                                                        href={route('news.show', news.slug)}
                                                        className="inline-flex items-center font-semibold text-amber-400 hover:text-amber-300"
                                                    >
                                                        Baca Selengkapnya
                                                        <ArrowRight className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <Button asChild className="cta-button">
                                    <Link href={route('news.index')}>
                                        <Newspaper className="mr-2 h-5 w-5" />
                                        Lihat Semua Berita
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <Newspaper className="mx-auto mb-4 h-16 w-16 text-zinc-600" />
                            <p className="text-lg text-zinc-400">Berita akan segera hadir</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Galeri Section */}
            {homepageMedia.length > 0 && (
                <section className="section-dark py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="section-heading">Galeri</h2>
                            <p className="section-subheading">Dokumentasi visual perjalanan dan pencapaian CIGI Global</p>
                        </div>

                        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {homepageMedia.map((media, index) => (
                                <div key={media.id} className="gallery-item group cursor-pointer" onClick={() => openLightbox(index)}>
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={media.url || media.path}
                                            alt={media.alt_text || media.original_filename}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                                        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <div className="rounded-full bg-amber-500/20 p-3 backdrop-blur-sm">
                                                <ImageIcon className="h-6 w-6 text-amber-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {media.caption && (
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                            <p className="line-clamp-2 text-sm text-white">{media.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. Kontak Section */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="section-heading">Hubungi Kami</h2>
                        <p className="section-subheading">Mari berkolaborasi dan membangun masa depan bersama</p>
                    </div>

                    <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {globalVariables.contact_phone && (
                            <div className="contact-card text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <Phone className="h-8 w-8 text-amber-400" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-white">Telepon</h3>
                                <p className="mb-4 text-zinc-300">Hubungi kami langsung untuk informasi lebih lanjut</p>
                                <a
                                    href={`tel:${globalVariables.contact_phone}`}
                                    className="inline-flex items-center font-semibold text-amber-400 hover:text-amber-300"
                                >
                                    {globalVariables.contact_phone}
                                    <Phone className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        )}

                        {globalVariables.contact_email && (
                            <div className="contact-card text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <Mail className="h-8 w-8 text-amber-400" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-white">Email</h3>
                                <p className="mb-4 text-zinc-300">Kirim email untuk pertanyaan bisnis dan kemitraan</p>
                                <a
                                    href={`mailto:${globalVariables.contact_email}`}
                                    className="inline-flex items-center font-semibold text-amber-400 hover:text-amber-300"
                                >
                                    {globalVariables.contact_email}
                                    <Mail className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        )}

                        {globalVariables.contact_whatsapp && (
                            <div className="contact-card text-center md:col-span-2 lg:col-span-1">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                    <MessageCircle className="h-8 w-8 text-amber-400" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-white">WhatsApp</h3>
                                <p className="mb-4 text-zinc-300">Chat langsung untuk respon yang cepat</p>
                                <a
                                    href={`https://wa.me/${globalVariables.contact_whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center font-semibold text-amber-400 hover:text-amber-300"
                                >
                                    {globalVariables.contact_whatsapp}
                                    <MessageCircle className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Call to Action */}
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-8 text-center md:p-12">
                        <h3 className="mb-4 text-3xl font-bold text-white">Siap Berkolaborasi?</h3>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
                            Mari bergabung dengan kami dalam menciptakan solusi inovatif untuk masa depan yang lebih baik. Hubungi tim kami untuk
                            memulai diskusi.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            {globalVariables.contact_email && (
                                <Button asChild className="cta-button">
                                    <a href={`mailto:${globalVariables.contact_email}`}>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Kirim Email
                                    </a>
                                </Button>
                            )}
                            {globalVariables.contact_whatsapp && (
                                <Button asChild className="cta-button-outline">
                                    <a href={`https://wa.me/${globalVariables.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Chat WhatsApp
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <Lightbox
                images={homepageMedia}
                currentIndex={currentImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={nextImage}
                onPrevious={previousImage}
            />
        </PublicLayout>
    );
}
