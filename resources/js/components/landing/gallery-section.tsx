import Lightbox from '@/components/lightbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Download, Maximize2, Share2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { showToastNotification } from '../ui/toast-notification';

interface GalleryImage {
    id: string | number;
    url: string;
    alt?: string;
    caption?: string;
    thumbnail?: { url: string | null };
}

interface GallerySectionProps {
    title?: string;
    subtitle?: string;
    images: GalleryImage[];
    layout?: 'grid' | 'carousel' | 'masonry';
    columns?: 2 | 3 | 4 | 5 | 6;
    showLightbox?: boolean;
    showDownload?: boolean;
    showShare?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    className?: string;
}

export default function GallerySection({
    title = 'Galeri Foto',
    subtitle = 'Jelajahi perjalanan visual kami',
    images,
    layout = 'grid',
    columns = 3,
    showLightbox = true,
    showDownload = true,
    showShare = true,
    autoPlay = false,
    autoPlayInterval = 5000,
    className = '',
}: GallerySectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const [loadedImages, setLoadedImages] = useState<Set<string | number>>(new Set());
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-play functionality for carousel
    useEffect(() => {
        if (autoPlay && isAutoPlaying && images.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, autoPlayInterval);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [autoPlay, isAutoPlaying, images.length, autoPlayInterval]);

    // Pause auto-play on hover
    const handleMouseEnter = useCallback(() => {
        if (autoPlay && isAutoPlaying) {
            setIsAutoPlaying(false);
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        }
    }, [autoPlay, isAutoPlaying]);

    const handleMouseLeave = useCallback(() => {
        if (autoPlay) {
            setIsAutoPlaying(true);
        }
    }, [autoPlay]);

    // Navigation functions
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Lightbox functions
    const openLightbox = useCallback(
        (index: number) => {
            if (showLightbox) {
                setCurrentIndex(index);
                setIsLightboxOpen(true);
            }
        },
        [showLightbox],
    );

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    // Image loading
    const handleImageLoad = useCallback((imageId: string | number) => {
        setLoadedImages((prev) => new Set(prev).add(imageId));
    }, []);

    // Share functionality
    const handleShare = useCallback(async (image: GalleryImage) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: image.caption || 'Lihat gambar ini',
                    text: image.caption || 'Foto menakjubkan dari galeri kami',
                    url: image.url,
                });
            } catch (error) {
                showToastNotification({
                    type: 'error',
                    title: 'Gagal',
                    message: 'Gagal membagikan gambar' + error,
                });
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(image.url);
                showToastNotification({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'URL berhasil disalin ke clipboard',
                });
            } catch (error) {
                showToastNotification({
                    type: 'error',
                    title: 'Gagal',
                    message: 'Gagal menyalin URL ke clipboard' + error,
                });
            }
        }
    }, []);

    // Download functionality
    const handleDownload = useCallback((image: GalleryImage) => {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = image.alt || `gallery-image-${image.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    if (images.length === 0) {
        return (
            <section className={`section-dark py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="section-heading">{title}</h2>
                    <p className="section-subheading">{subtitle}</p>
                    <p className="text-zinc-400">Tidak ada gambar di galeri.</p>
                </div>
            </section>
        );
    }

    // Grid layout
    if (layout === 'grid') {
        return (
            <section className={`section-dark py-16 ${className}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="section-heading">{title}</h2>
                        {subtitle && <p className="section-subheading">{subtitle}</p>}
                    </div>

                    {/* Grid */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 md:gap-6`}>
                        {images.map((image, index) => (
                            <Card
                                key={image.id}
                                className="section-card group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                onClick={() => openLightbox(index)}
                            >
                                <CardContent className="p-0">
                                    <div className="relative aspect-square overflow-hidden">
                                        {/* Lazy loading placeholder */}
                                        {!loadedImages.has(image.id) && <div className="absolute inset-0 animate-pulse bg-zinc-700" />}

                                        <img
                                            src={image.thumbnail?.url || image.url}
                                            alt={image.alt || ''}
                                            className={`h-full w-full object-cover transition-opacity duration-300 ${
                                                loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            loading="lazy"
                                            onLoad={() => handleImageLoad(image.id)}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                                            <div className="flex space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                {showLightbox && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="bg-amber-500/90 text-black hover:bg-amber-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openLightbox(index);
                                                        }}
                                                    >
                                                        <Maximize2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {showDownload && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="bg-zinc-800/90 text-white hover:bg-zinc-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(image);
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {showShare && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="bg-zinc-800/90 text-white hover:bg-zinc-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShare(image);
                                                        }}
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Caption */}
                                    {image.caption && (
                                        <div className="p-4">
                                            <p className="text-center text-sm text-zinc-300">{image.caption}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Lightbox */}
                {showLightbox && (
                    <Lightbox
                        images={images.map((img) => ({ ...img, original_filename: img.alt || `Image ${img.id}` }))}
                        currentIndex={currentIndex}
                        isOpen={isLightboxOpen}
                        onClose={closeLightbox}
                        onNext={goToNext}
                        onPrevious={goToPrevious}
                    />
                )}
            </section>
        );
    }

    // Carousel layout
    if (layout === 'carousel') {
        return (
            <section className={`section-dark py-16 ${className}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="section-heading">{title}</h2>
                        {subtitle && <p className="section-subheading">{subtitle}</p>}
                    </div>

                    {/* Carousel */}
                    <div className="relative mx-auto max-w-4xl">
                        <div
                            ref={carouselRef}
                            className="relative overflow-hidden rounded-lg"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Images */}
                            <div className="flex transition-transform duration-500 ease-in-out">
                                {images.map((image) => (
                                    <div key={image.id} className="w-full flex-shrink-0" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                        <div className="relative aspect-video">
                                            <img
                                                src={image.thumbnail?.url || image.url}
                                                alt={image.alt || ''}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                            {/* Caption */}
                                            {image.caption && (
                                                <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                                                    <h3 className="mb-2 text-xl font-semibold">{image.caption}</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={goToPrevious}
                                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-amber-500/90 text-black shadow-lg hover:bg-amber-500"
                                        disabled={currentIndex === 0}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={goToNext}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-amber-500/90 text-black shadow-lg hover:bg-amber-500"
                                        disabled={currentIndex === images.length - 1}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </>
                            )}

                            {/* Dots Indicator */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                                index === currentIndex ? 'scale-125 bg-amber-400' : 'bg-zinc-600 hover:bg-zinc-500'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {images.length > 1 && (
                            <div className="mt-6 flex justify-center space-x-2">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => goToSlide(index)}
                                        className={`h-16 w-16 overflow-hidden rounded-lg transition-all duration-300 ${
                                            index === currentIndex ? 'scale-110 ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={image.thumbnail?.url || image.url} alt={image.alt || ''} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lightbox */}
                {showLightbox && (
                    <Lightbox
                        images={images.map((img) => ({ ...img, original_filename: img.alt || `Image ${img.id}` }))}
                        currentIndex={currentIndex}
                        isOpen={isLightboxOpen}
                        onClose={closeLightbox}
                        onNext={goToNext}
                        onPrevious={goToPrevious}
                    />
                )}
            </section>
        );
    }

    // Masonry layout (fallback to grid for now)
    return (
        <section className={`section-dark py-16 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="section-heading">{title}</h2>
                    {subtitle && <p className="section-subheading">{subtitle}</p>}
                </div>
                <p className="text-center text-zinc-400">Tata letak masonry segera hadir!</p>
            </div>
        </section>
    );
}
