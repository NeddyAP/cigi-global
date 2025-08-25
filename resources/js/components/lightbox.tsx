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
        // Main container for background and image centering
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
            {/* Image Display */}
            <div className="relative flex h-full w-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <img
                    src={currentImage.url}
                    alt={'original_filename' in currentImage ? currentImage.original_filename : currentImage.alt || `Image ${currentImage.id}`}
                    className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                        isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />
            </div>

            {/* Container for all UI Overlays */}
            <div className="absolute inset-0 z-10" onClick={(e) => e.stopPropagation()}>
                {/* Header (grid: content | thumbnails | actions) */}
                <div className="absolute top-0 right-0 left-0 p-2">
                    <div className="grid h-20 grid-cols-[1fr_auto_auto] items-center gap-4">
                        <div className="overflow-hidden text-white">
                            <h3 className="truncate text-sm font-semibold">
                                {'original_filename' in currentImage
                                    ? currentImage.original_filename
                                    : currentImage.alt || `Image ${currentImage.id}`}
                            </h3>
                            <p className="text-xs text-white/70">
                                {currentIndex + 1} dari {images.length}
                            </p>
                            {currentImage.caption && <p className="mt-1 max-w-full truncate text-xs text-white/80">{currentImage.caption}</p>}
                        </div>

                        {/* Thumbnails column (fixed, no shifting) */}
                        {images.length > 1 && (
                            <div className="glass-nav m-2 rounded-lg p-2">
                                <div className="flex justify-center space-x-2 overflow-x-auto whitespace-nowrap">
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
                                            className={`box-content h-10 w-10 flex-shrink-0 overflow-hidden rounded transition-all ${
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
                        )}

                        {/* Action buttons column */}
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
                            className="absolute top-1/2 left-4 -translate-y-1/2 glass-button text-white hover:bg-white/10"
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onNext}
                            className="absolute top-1/2 right-4 -translate-y-1/2 glass-button text-white hover:bg-white/10"
                            disabled={currentIndex === images.length - 1}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
