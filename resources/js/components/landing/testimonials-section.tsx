import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Testimonial {
    id: string | number;
    name: string;
    role?: string;
    company?: string;
    content: string;
    rating?: number;
    image?: string;
    date?: string;
    verified?: boolean;
}

interface TestimonialsSectionProps {
    title?: string;
    subtitle?: string;
    testimonials: Testimonial[];
    autoRotate?: boolean;
    rotationInterval?: number;
    showNavigation?: boolean;
    showRating?: boolean;
    showCompany?: boolean;
    showDate?: boolean;
    showVerified?: boolean;
    maxVisible?: number;
    className?: string;
}

export default function TestimonialsSection({
    title = 'What People Say',
    subtitle = 'Testimonials from our community',
    testimonials,
    autoRotate = true,
    rotationInterval = 5000,
    showNavigation = true,
    showRating = true,
    showCompany = true,
    showDate = true,
    showVerified = true,
    maxVisible = 3,
    className = '',
}: TestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);

    // Auto-rotation functionality
    useEffect(() => {
        if (autoRotate && isAutoRotating && testimonials.length > maxVisible) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % (testimonials.length - maxVisible + 1));
            }, rotationInterval);

            return () => clearInterval(interval);
        }
    }, [autoRotate, isAutoRotating, testimonials.length, maxVisible, rotationInterval]);

    // Pause auto-rotation on hover
    const handleMouseEnter = useCallback(() => {
        if (autoRotate) {
            setIsAutoRotating(false);
        }
    }, [autoRotate]);

    const handleMouseLeave = useCallback(() => {
        if (autoRotate) {
            setIsAutoRotating(true);
        }
    }, [autoRotate]);

    // Navigation functions
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - maxVisible : prev - 1));
    }, [testimonials.length, maxVisible]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev >= testimonials.length - maxVisible ? 0 : prev + 1));
    }, [testimonials.length, maxVisible]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    if (testimonials.length === 0) {
        return (
            <section className={`bg-white py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg text-gray-600">{subtitle}</p>
                    <p className="text-gray-500">No testimonials available at the moment.</p>
                </div>
            </section>
        );
    }

    const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + maxVisible);

    return (
        <section className={`bg-white py-16 ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                </div>

                {/* Testimonials Grid */}
                <div className="relative">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {visibleTestimonials.map((testimonial, index) => (
                            <Card
                                key={testimonial.id}
                                className="group relative overflow-hidden transition-all duration-500 hover:shadow-xl"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <CardContent className="p-6">
                                    {/* Quote Icon */}
                                    <div className="mb-4 text-4xl text-blue-100 transition-colors duration-300 group-hover:text-blue-200">
                                        <Quote className="h-8 w-8" />
                                    </div>

                                    {/* Rating */}
                                    {showRating && testimonial.rating && (
                                        <div className="mb-4 flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < testimonial.rating! ? 'fill-current text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-500">{testimonial.rating}/5</span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <blockquote className="mb-6 leading-relaxed text-gray-700">"{testimonial.content}"</blockquote>

                                    {/* Author Information */}
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback className="bg-blue-100 font-semibold text-blue-600">
                                                {testimonial.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="truncate font-semibold text-gray-900">{testimonial.name}</h4>
                                                {showVerified && testimonial.verified && (
                                                    <Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
                                                        ✓ Verified
                                                    </Badge>
                                                )}
                                            </div>

                                            {showCompany && testimonial.company && (
                                                <p className="truncate text-sm text-gray-600">
                                                    {testimonial.role && `${testimonial.role} at `}
                                                    {testimonial.company}
                                                </p>
                                            )}

                                            {!showCompany && testimonial.role && <p className="truncate text-sm text-gray-600">{testimonial.role}</p>}

                                            {showDate && testimonial.date && (
                                                <p className="mt-1 text-xs text-gray-500">{new Date(testimonial.date).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {showNavigation && testimonials.length > maxVisible && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={goToPrevious}
                                className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2 border border-gray-200 bg-white shadow-lg hover:bg-gray-50"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={goToNext}
                                className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 border border-gray-200 bg-white shadow-lg hover:bg-gray-50"
                                disabled={currentIndex >= testimonials.length - maxVisible}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {testimonials.length > maxVisible && (
                    <div className="mt-8 flex justify-center space-x-2">
                        {Array.from({ length: testimonials.length - maxVisible + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'scale-125 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                {autoRotate && testimonials.length > maxVisible && (
                    <div className="mx-auto mt-6 max-w-md">
                        <div className="h-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-linear"
                                style={{
                                    width: `${((currentIndex + 1) / (testimonials.length - maxVisible + 1)) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
