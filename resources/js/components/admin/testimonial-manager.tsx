import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Star, Trash2, User } from 'lucide-react';
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
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange?.(star)}
                        disabled={disabled || !onRatingChange}
                        className={cn(
                            'h-4 w-4 transition-colors',
                            star <= rating ? 'text-yellow-400' : 'text-gray-300',
                            onRatingChange && !disabled && 'hover:text-yellow-300',
                        )}
                    >
                        <Star className="h-4 w-4 fill-current" />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                    <span className="ml-2 text-sm text-gray-500">
                        ({value.length}/{maxTestimonials})
                    </span>
                </Label>
            )}

            {/* Add Button */}
            {canAddMore && (
                <Button type="button" variant="outline" size="sm" onClick={addTestimonial} disabled={disabled}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                </Button>
            )}

            {/* Testimonials List */}
            {value.length > 0 && (
                <div className="space-y-3">
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
                                    'transition-all',
                                    dragOverIndex === index && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                                    !disabled && 'cursor-move',
                                    isEmpty && 'border-dashed',
                                )}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {!disabled && <GripVertical className="h-4 w-4 text-gray-400" />}
                                            <CardTitle className="text-sm">
                                                {testimonial.name || `Testimonial ${index + 1}`}
                                                {testimonial.featured && (
                                                    <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        Featured
                                                    </span>
                                                )}
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {showRatings && testimonial.rating && (
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(testimonial.rating)}
                                                    <span className="text-xs text-gray-500">{testimonial.rating}/5</span>
                                                </div>
                                            )}
                                            <Button type="button" variant="ghost" size="sm" onClick={() => toggleExpanded(index)}>
                                                {isExpanded ? 'Collapse' : 'Edit'}
                                            </Button>
                                            {!disabled && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeTestimonial(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && testimonial.content && (
                                        <div className="mt-2">
                                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">"{testimonial.content}"</p>
                                            {(testimonial.role || testimonial.company) && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    — {testimonial.role}
                                                    {testimonial.role && testimonial.company && ', '}
                                                    {testimonial.company}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardHeader>

                                {/* Expanded Form */}
                                {isExpanded && (
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Name */}
                                            <div>
                                                <Label htmlFor={`${name}_name_${index}`}>Name *</Label>
                                                <Input
                                                    id={`${name}_name_${index}`}
                                                    type="text"
                                                    value={testimonial.name}
                                                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                                    placeholder="Customer name"
                                                    disabled={disabled}
                                                    required
                                                />
                                            </div>

                                            {/* Role */}
                                            <div>
                                                <Label htmlFor={`${name}_role_${index}`}>Role</Label>
                                                <Input
                                                    id={`${name}_role_${index}`}
                                                    type="text"
                                                    value={testimonial.role || ''}
                                                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                                    placeholder="Job title or role"
                                                    disabled={disabled}
                                                />
                                            </div>

                                            {/* Company */}
                                            {showCompany && (
                                                <div>
                                                    <Label htmlFor={`${name}_company_${index}`}>Company</Label>
                                                    <Input
                                                        id={`${name}_company_${index}`}
                                                        type="text"
                                                        value={testimonial.company || ''}
                                                        onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                                                        placeholder="Company name"
                                                        disabled={disabled}
                                                    />
                                                </div>
                                            )}

                                            {/* Rating */}
                                            {showRatings && (
                                                <div>
                                                    <Label>Rating</Label>
                                                    <div className="mt-1">
                                                        {renderStars(testimonial.rating || 5, (rating) => updateTestimonial(index, 'rating', rating))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <Label htmlFor={`${name}_content_${index}`}>Testimonial Content *</Label>
                                            <Textarea
                                                id={`${name}_content_${index}`}
                                                value={testimonial.content}
                                                onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                                                placeholder="What did they say about your service?"
                                                disabled={disabled}
                                                rows={4}
                                                required
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
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`${name}_featured_${index}`}
                                                checked={testimonial.featured || false}
                                                onChange={(e) => updateTestimonial(index, 'featured', e.target.checked)}
                                                disabled={disabled}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <Label htmlFor={`${name}_featured_${index}`} className="text-sm">
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
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No testimonials added yet</p>
                    <p className="text-xs text-gray-400">Add testimonials to showcase customer feedback</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
