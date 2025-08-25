import { Button } from '@/components/ui/button';
import { type Media } from '@/types';
import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LightboxProps {
    images: Array<Media | { id: string | number; url: string; alt?: string; caption?: string; original_filename?: string }>;
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export default function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrevious }: LightboxProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrevious();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onNext, onPrevious]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !images[currentIndex]) return null;

    const currentImage = images[currentIndex];

    const handleDownload = () => {
        if (currentImage.url) {
            const link = document.createElement('a');
            link.href = currentImage.url;
            const filename = 'original_filename' in currentImage ? currentImage.original_filename : currentImage.alt || `image-${currentImage.id}`;
            link.download = filename || `image-${currentImage.id}`;
            link.click();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Header */}
            <div className="glass-nav absolute top-0 right-0 left-0 z-10 p-4">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <h3 className="font-semibold">
                            {'original_filename' in currentImage ? currentImage.original_filename : currentImage.alt || `Image ${currentImage.id}`}
                        </h3>
                        <p className="text-sm text-white/70">
                            {currentIndex + 1} dari {images.length}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsZoomed(!isZoomed)} className="text-white hover:bg-white/10">
                            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-white/10">
                            <Download className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPrevious}
                        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 glass-button text-white hover:bg-white/10"
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNext}
                        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 glass-button text-white hover:bg-white/10"
                        disabled={currentIndex === images.length - 1}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Image */}
            <div className="relative mx-4 max-h-[90vh] max-w-7xl">
                <img
                    src={currentImage.url}
                    alt={'original_filename' in currentImage ? currentImage.original_filename : currentImage.alt || `Image ${currentImage.id}`}
                    className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                        isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {currentImage.caption && (
                    <div className="absolute right-4 bottom-4 left-4 glass-card rounded-lg p-3">
                        <p className="text-sm text-white">{currentImage.caption}</p>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
                    <div className="glass-card rounded-lg p-2">
                        <div className="flex max-w-xs space-x-2 overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => {
                                        const diff = index - currentIndex;
                                        if (diff > 0) {
                                            for (let i = 0; i < diff; i++) onNext();
                                        } else if (diff < 0) {
                                            for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                                        }
                                    }}
                                    className={`h-12 w-12 overflow-hidden rounded transition-all ${
                                        index === currentIndex ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={'original_filename' in image ? image.original_filename : image.alt || `Image ${image.id}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
