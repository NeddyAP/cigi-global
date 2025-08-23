import Lightbox from '@/components/lightbox';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit, type CommunityClub, type GlobalVars, type Media } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, ChevronRight, Image as ImageIcon, Users } from 'lucide-react';
import { useState } from 'react';

interface HomeProps {
    globalVars: GlobalVars;
    galleryMedia: Media[];
    navBusinessUnits: BusinessUnit[];
    navCommunityClubs: CommunityClub[];
}

export default function Home({ globalVars, galleryMedia = [], navBusinessUnits = [], navCommunityClubs = [] }: HomeProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev < galleryMedia.length - 1 ? prev + 1 : prev));
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return (
        <PublicLayout
            title="Beranda"
            description={globalVars.company_description || 'Membangun masa depan bersama melalui inovasi dan kolaborasi'}
            businessUnits={navBusinessUnits}
            communityClubs={navCommunityClubs}
        >
            <Head title="Beranda - CIGI Global" />

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img className="h-full w-full object-cover" src="/assets/cigi-global.jpg" alt="CIGI Global" />
                    <div className="glass-hero-overlay absolute inset-0"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-shadow-lg mb-8 text-5xl font-bold text-white md:text-7xl lg:text-8xl">
                        {globalVars.company_name || 'CIGI Global'}
                    </h1>
                    <p className="text-shadow mx-auto mb-6 max-w-4xl text-2xl text-white/90 md:text-3xl">
                        {globalVars.company_tagline || 'Membangun Masa Depan Bersama'}
                    </p>
                    <p className="text-shadow mx-auto mb-12 max-w-3xl text-lg text-white/80 md:text-xl">
                        {globalVars.company_description ||
                            'Melalui inovasi dan kolaborasi, kami menciptakan solusi berkelanjutan untuk masa depan yang lebih baik.'}
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button asChild className="glass-button border border-white/30 px-8 py-3 text-lg text-white hover:bg-white/20">
                            <Link href={route('business-units.index')}>
                                <Building2 className="mr-2 h-5 w-5" />
                                Jelajahi Unit Bisnis
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="glass-button border border-white/30 px-8 py-3 text-lg text-white hover:bg-white/10"
                        >
                            <Link href={route('community-clubs.index')}>
                                <Users className="mr-2 h-5 w-5" />
                                Bergabung Komunitas
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {galleryMedia.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-shadow-lg mb-6 text-4xl font-bold text-white md:text-5xl">Galeri Kami</h2>
                            <p className="text-shadow mx-auto max-w-3xl text-xl text-white/80">
                                Dokumentasi kegiatan dan pencapaian CIGI Global dalam berbagai aktivitas dan program.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {galleryMedia.map((media, index) => (
                                <div key={media.id} className="glass-gallery-item group relative cursor-pointer" onClick={() => openLightbox(index)}>
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={media.url || media.path}
                                            alt={media.alt_text || media.original_filename}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                                        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <div className="glass-button rounded-full p-3">
                                                <ImageIcon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {media.caption && (
                                        <div className="glass-overlay absolute bottom-0 left-0 right-0 p-3">
                                            <p className="line-clamp-2 text-sm text-white">{media.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox */}
            <Lightbox
                images={galleryMedia}
                currentIndex={currentImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={nextImage}
                onPrevious={previousImage}
            />
        </PublicLayout>
    );
}
