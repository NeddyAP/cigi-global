import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    type?: string;
    description?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    contactSectionId?: string;
    showPlayButton?: boolean;
    showRating?: boolean;
    rating?: number;
    ratingCount?: number;
    features?: string[];
    className?: string;
}

export default function HeroSection({
    title,
    type,
    description,
    backgroundImage,
    ctaText = 'Mulai',
    ctaLink = '#',
    secondaryCtaText,
    secondaryCtaLink,
    contactSectionId,
    showPlayButton = false,
    className = '',
}: HeroSectionProps) {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={`relative flex min-h-screen items-center justify-center overflow-hidden ${className}`}>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img src={`${backgroundImage}`} alt="Latar belakang hero" className="h-full w-full object-cover" />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Subtitle */}
                    {type && (
                        <div className="mb-6">
                            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
                                {type}
                            </span>
                        </div>
                    )}

                    {/* Main Title */}
                    <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl">{title}</h1>

                    {/* Description */}
                    {description && <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/90 sm:text-2xl">{description}</p>}

                    {/* Call to Action Buttons */}
                    <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {ctaText && ctaLink && (
                            <Button
                                size="lg"
                                onClick={() => scrollToSection(ctaLink.replace('#', ''))}
                                className="transform rounded-full bg-white px-8 py-4 text-lg font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-xl"
                            >
                                {ctaText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}

                        {secondaryCtaText && secondaryCtaLink && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection(secondaryCtaLink.replace('#', ''))}
                                className="rounded-full border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                {secondaryCtaText}
                            </Button>
                        )}

                        {contactSectionId && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection(contactSectionId)}
                                className="rounded-full border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                Hubungi Kami
                            </Button>
                        )}

                        {showPlayButton && (
                            <Button
                                variant="ghost"
                                size="lg"
                                className="rounded-full p-4 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                <Play className="h-8 w-8 fill-current" />
                            </Button>
                        )}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute left-1/2 -translate-x-1/2 transform animate-bounce">
                        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
                            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/60" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
            <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl" />
        </section>
    );
}
