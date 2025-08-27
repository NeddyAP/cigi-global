import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Building2, GripVertical, Plus, Quote, Star, Trash2, User } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    image?: string | number;
    rating?: number;
    featured?: boolean;
}

interface TestimonialManagerProps {
    label?: string;
    name: string;
    value?: Testimonial[];
    onChange: (testimonials: Testimonial[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    maxTestimonials?: number;
    showRatings?: boolean;
    showImages?: boolean;
    showCompany?: boolean;
}

export default function TestimonialManager({
    label,
    name,
    value = [],
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    maxTestimonials = 10,
    showRatings = true,
    showImages = true,
    showCompany = true,
}: TestimonialManagerProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxTestimonials;

    const addTestimonial = useCallback(() => {
        const newTestimonial: Testimonial = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            role: '',
            company: '',
            content: '',
            image: '',
            rating: 5,
            featured: false,
        };

        onChange([...value, newTestimonial]);
        setExpandedIndex(value.length); // Expand the new testimonial
    }, [value, onChange]);

    const removeTestimonial = useCallback(
        (index: number) => {
            const updatedTestimonials = value.filter((_, i) => i !== index);
            onChange(updatedTestimonials);
            if (expandedIndex === index) {
                setExpandedIndex(null);
            } else if (expandedIndex !== null && expandedIndex > index) {
                setExpandedIndex(expandedIndex - 1);
            }
        },
        [value, onChange, expandedIndex],
    );

    const updateTestimonial = useCallback(
        (index: number, field: keyof Testimonial, newValue: string | number | boolean | undefined | null) => {
            const updatedTestimonials = value.map((testimonial, i) => (i === index ? { ...testimonial, [field]: newValue } : testimonial));
            onChange(updatedTestimonials);
        },
        [value, onChange],
    );

    const toggleExpanded = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Drag and drop reordering
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newTestimonials = [...value];
        const draggedTestimonial = newTestimonials[draggedIndex];

        // Remove dragged item
        newTestimonials.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newTestimonials.splice(insertIndex, 0, draggedTestimonial);

        onChange(newTestimonials);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange?.(star)}
                        disabled={disabled || !onRatingChange}
                        className={cn(
                            'h-5 w-5 transition-all duration-200 hover:scale-110',
                            star <= rating ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-600',
                            onRatingChange && !disabled && 'cursor-pointer hover:text-yellow-300',
                        )}
                    >
                        <Star className="h-5 w-5 fill-current" />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={cn('space-y-6', className)}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={name} className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                        <Quote className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {value.length}/{maxTestimonials}
                        </span>
                    </div>
                </div>
            )}

            {/* Add Button */}
            {canAddMore && (
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={addTestimonial}
                    disabled={disabled}
                    className="group w-full border-2 border-dashed border-zinc-300 bg-white py-6 text-zinc-600 transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-orange-500 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-all group-hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Tambah Testimoni</div>
                            <div className="text-sm text-zinc-500">Klik untuk menambah testimoni baru</div>
                        </div>
                    </div>
                </Button>
            )}

            {/* Testimonials List */}
            {value.length > 0 && (
                <div className="space-y-4">
                    {value.map((testimonial, index) => {
                        const isExpanded = expandedIndex === index;
                        const isEmpty = !testimonial.name && !testimonial.content;

                        return (
                            <Card
                                key={testimonial.id}
                                draggable={!disabled}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                className={cn(
                                    'group overflow-hidden transition-all duration-200 hover:shadow-lg',
                                    dragOverIndex === index && 'border-2 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20',
                                    !disabled && 'cursor-move',
                                    isEmpty && 'border-2 border-dashed border-zinc-300',
                                    isExpanded && 'ring-2 ring-orange-500/20',
                                )}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {!disabled && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 transition-all group-hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-500 dark:group-hover:bg-zinc-600">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-lg">
                                                    {testimonial.image ? (
                                                        <img
                                                            src={typeof testimonial.image === 'string' ? testimonial.image : ''}
                                                            alt={testimonial.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : testimonial.name ? (
                                                        testimonial.name.charAt(0).toUpperCase()
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                                                        {testimonial.name || `Testimoni ${index + 1}`}
                                                    </CardTitle>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {testimonial.featured && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                                                                <Star className="h-3 w-3" />
                                                                Featured
                                                            </span>
                                                        )}
                                                        {testimonial.rating && showRatings && (
                                                            <div className="flex items-center gap-1">
                                                                {renderStars(testimonial.rating)}
                                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                                    {testimonial.rating}/5
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleExpanded(index)}
                                                className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                            >
                                                {isExpanded ? 'Collapse' : 'Edit'}
                                            </Button>
                                            {!disabled && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeTestimonial(index)}
                                                    className="border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && testimonial.content && (
                                        <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                            <div className="flex items-start gap-2">
                                                <Quote className="mt-1 h-4 w-4 flex-shrink-0 text-orange-500" />
                                                <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">"{testimonial.content}"</p>
                                            </div>
                                            {(testimonial.role || testimonial.company) && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                    <span className="font-medium">— {testimonial.name}</span>
                                                    {testimonial.role && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{testimonial.role}</span>
                                                        </>
                                                    )}
                                                    {testimonial.company && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Building2 className="h-3 w-3" />
                                                                {testimonial.company}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardHeader>

                                {/* Expanded Form */}
                                {isExpanded && (
                                    <CardContent className="space-y-6 border-t border-zinc-200/60 bg-gradient-to-br from-zinc-50/50 to-white/50 pt-6 dark:border-zinc-600/60 dark:from-zinc-800/30 dark:to-zinc-700/30">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Name */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_name_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id={`${name}_name_${index}`}
                                                    type="text"
                                                    value={testimonial.name}
                                                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                                    placeholder="Customer name"
                                                    disabled={disabled}
                                                    required
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:ring-orange-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Role */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_role_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Role
                                                </Label>
                                                <Input
                                                    id={`${name}_role_${index}`}
                                                    type="text"
                                                    value={testimonial.role || ''}
                                                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                                    placeholder="Job title or role"
                                                    disabled={disabled}
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:ring-orange-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Company */}
                                            {showCompany && (
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`${name}_company_${index}`}
                                                        className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                    >
                                                        Company
                                                    </Label>
                                                    <Input
                                                        id={`${name}_company_${index}`}
                                                        type="text"
                                                        value={testimonial.company || ''}
                                                        onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                                                        placeholder="Company name"
                                                        disabled={disabled}
                                                        className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:ring-orange-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                    />
                                                </div>
                                            )}

                                            {/* Rating */}
                                            {showRatings && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Rating</Label>
                                                    <div className="mt-1">
                                                        {renderStars(testimonial.rating || 5, (rating) => updateTestimonial(index, 'rating', rating))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`${name}_content_${index}`}
                                                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                            >
                                                Testimonial Content <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id={`${name}_content_${index}`}
                                                value={testimonial.content}
                                                onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                                                placeholder="What did they say about your service?"
                                                disabled={disabled}
                                                rows={4}
                                                required
                                                className="rounded-lg border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:ring-orange-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                            />
                                        </div>

                                        {/* Image */}
                                        {showImages && (
                                            <div>
                                                <ImageInput
                                                    label="Photo"
                                                    name={`${name}_image_${index}`}
                                                    value={testimonial.image}
                                                    onChange={(value) => updateTestimonial(index, 'image', value)}
                                                    disabled={disabled}
                                                    showPreview={true}
                                                />
                                            </div>
                                        )}

                                        {/* Featured Toggle */}
                                        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-800">
                                            <input
                                                type="checkbox"
                                                id={`${name}_featured_${index}`}
                                                checked={testimonial.featured || false}
                                                onChange={(e) => updateTestimonial(index, 'featured', e.target.checked)}
                                                disabled={disabled}
                                                className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500 dark:border-zinc-600"
                                            />
                                            <Label
                                                htmlFor={`${name}_featured_${index}`}
                                                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                            >
                                                Featured testimonial
                                            </Label>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {value.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100 p-12 text-center dark:border-zinc-600 dark:from-zinc-800/50 dark:to-zinc-700/50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <User className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Belum ada testimoni</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Tambahkan testimoni untuk menampilkan feedback pelanggan</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
