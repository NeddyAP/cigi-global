import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Settings, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface ProcessStep {
    step: string;
    description: string;
    order: number;
}

interface BusinessUnitService {
    id: string;
    title: string;
    description: string;
    image?: string | number;
    price_range?: string;
    duration?: string;
    features?: string[];
    technologies?: string[];
    process_steps?: ProcessStep[];
    featured?: boolean;
    active?: boolean;
}

interface ServiceManagerProps {
    label?: string;
    name: string;
    value?: BusinessUnitService[];
    onChange: (services: BusinessUnitService[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    maxServices?: number;
}

export default function ServiceManager({
    label,
    name,
    value = [],
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    maxServices = 15,
}: ServiceManagerProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxServices;

    const addService = useCallback(() => {
        const newService: BusinessUnitService = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            description: '',
            image: '',
            price_range: '',
            duration: '',
            features: [],
            technologies: [],
            process_steps: [],
            featured: false,
            active: true,
        };

        onChange([...value, newService]);
        setExpandedIndex(value.length); // Expand the new service
    }, [value, onChange]);

    const removeService = useCallback(
        (index: number) => {
            const updatedServices = value.filter((_, i) => i !== index);
            onChange(updatedServices);
            if (expandedIndex === index) {
                setExpandedIndex(null);
            } else if (expandedIndex !== null && expandedIndex > index) {
                setExpandedIndex(expandedIndex - 1);
            }
        },
        [value, onChange, expandedIndex],
    );

    const updateService = useCallback(
        (index: number, field: keyof BusinessUnitService, newValue: string | string[] | ProcessStep[] | number | boolean | undefined | null) => {
            const updatedServices = value.map((service, i) => (i === index ? { ...service, [field]: newValue } : service));
            onChange(updatedServices);
        },
        [value, onChange],
    );

    const updateFeature = useCallback(
        (serviceIndex: number, featureIndex: number, newValue: string) => {
            const service = value[serviceIndex];
            const features = [...(service.features || [])];
            features[featureIndex] = newValue;
            updateService(serviceIndex, 'features', features);
        },
        [value, updateService],
    );

    const addFeature = useCallback(
        (serviceIndex: number) => {
            const service = value[serviceIndex];
            const features = [...(service.features || []), ''];
            updateService(serviceIndex, 'features', features);
        },
        [value, updateService],
    );

    const removeFeature = useCallback(
        (serviceIndex: number, featureIndex: number) => {
            const service = value[serviceIndex];
            const features = (service.features || []).filter((_, i) => i !== featureIndex);
            updateService(serviceIndex, 'features', features);
        },
        [value, updateService],
    );

    const updateTechnology = useCallback(
        (serviceIndex: number, techIndex: number, newValue: string) => {
            const service = value[serviceIndex];
            const technologies = [...(service.technologies || [])];
            technologies[techIndex] = newValue;
            updateService(serviceIndex, 'technologies', technologies);
        },
        [value, updateService],
    );

    const addTechnology = useCallback(
        (serviceIndex: number) => {
            const service = value[serviceIndex];
            const technologies = [...(service.technologies || []), ''];
            updateService(serviceIndex, 'technologies', technologies);
        },
        [value, updateService],
    );

    const removeTechnology = useCallback(
        (serviceIndex: number, techIndex: number) => {
            const service = value[serviceIndex];
            const technologies = (service.technologies || []).filter((_, i) => i !== techIndex);
            updateService(serviceIndex, 'technologies', technologies);
        },
        [value, updateService],
    );

    const updateProcessStep = useCallback(
        (serviceIndex: number, stepIndex: number, field: keyof ProcessStep, newValue: string | number) => {
            const service = value[serviceIndex];
            const processSteps = [...(service.process_steps || [])];
            processSteps[stepIndex] = { ...processSteps[stepIndex], [field]: newValue };
            updateService(serviceIndex, 'process_steps', processSteps);
        },
        [value, updateService],
    );

    const addProcessStep = useCallback(
        (serviceIndex: number) => {
            const service = value[serviceIndex];
            const processSteps = [...(service.process_steps || []), { step: '', description: '', order: (service.process_steps?.length || 0) + 1 }];
            updateService(serviceIndex, 'process_steps', processSteps);
        },
        [value, updateService],
    );

    const removeProcessStep = useCallback(
        (serviceIndex: number, stepIndex: number) => {
            const service = value[serviceIndex];
            const processSteps = (service.process_steps || []).filter((_, i) => i !== stepIndex);
            // Reorder remaining steps
            const reorderedSteps = processSteps.map((step, index) => ({ ...step, order: index + 1 }));
            updateService(serviceIndex, 'process_steps', reorderedSteps);
        },
        [value, updateService],
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

        const newServices = [...value];
        const draggedService = newServices[draggedIndex];

        // Remove dragged item
        newServices.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newServices.splice(insertIndex, 0, draggedService);

        onChange(newServices);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className={cn('space-y-4', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                    <span className="ml-2 text-sm text-gray-500">
                        ({value.length}/{maxServices})
                    </span>
                </Label>
            )}

            {/* Add Button */}
            {canAddMore && (
                <Button type="button" variant="outline" size="sm" onClick={addService} disabled={disabled}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            )}

            {/* Services List */}
            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((service, index) => {
                        const isExpanded = expandedIndex === index;
                        const isEmpty = !service.title && !service.description;

                        return (
                            <Card
                                key={service.id}
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
                                                {service.title || `Service ${index + 1}`}
                                                <div className="mt-1 flex space-x-2">
                                                    {service.featured && (
                                                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {service.active === false && (
                                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => toggleExpanded(index)}>
                                                {isExpanded ? 'Collapse' : 'Edit'}
                                            </Button>
                                            {!disabled && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeService(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && service.description && (
                                        <div className="mt-2">
                                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                                            <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                                                {service.price_range && <span>Price: {service.price_range}</span>}
                                                {service.duration && <span>Duration: {service.duration}</span>}
                                                {service.features && service.features.length > 0 && <span>{service.features.length} features</span>}
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                {/* Expanded Form */}
                                {isExpanded && (
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Title */}
                                            <div>
                                                <Label htmlFor={`${name}_title_${index}`}>Service Title *</Label>
                                                <Input
                                                    id={`${name}_title_${index}`}
                                                    type="text"
                                                    value={service.title}
                                                    onChange={(e) => updateService(index, 'title', e.target.value)}
                                                    placeholder="Service name"
                                                    disabled={disabled}
                                                    required
                                                />
                                            </div>

                                            {/* Price Range */}
                                            <div>
                                                <Label htmlFor={`${name}_price_range_${index}`}>Price Range</Label>
                                                <Input
                                                    id={`${name}_price_range_${index}`}
                                                    type="text"
                                                    value={service.price_range || ''}
                                                    onChange={(e) => updateService(index, 'price_range', e.target.value)}
                                                    placeholder="e.g., $500-$2000, Starting at $100"
                                                    disabled={disabled}
                                                />
                                            </div>

                                            {/* Duration */}
                                            <div>
                                                <Label htmlFor={`${name}_duration_${index}`}>Duration</Label>
                                                <Input
                                                    id={`${name}_duration_${index}`}
                                                    type="text"
                                                    value={service.duration || ''}
                                                    onChange={(e) => updateService(index, 'duration', e.target.value)}
                                                    placeholder="e.g., 2-4 weeks, Ongoing"
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor={`${name}_description_${index}`}>Description *</Label>
                                            <Textarea
                                                id={`${name}_description_${index}`}
                                                value={service.description}
                                                onChange={(e) => updateService(index, 'description', e.target.value)}
                                                placeholder="Describe what this service involves"
                                                disabled={disabled}
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <Label>Features</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addFeature(index)}
                                                    disabled={disabled}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Feature
                                                </Button>
                                            </div>

                                            {service.features && service.features.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {service.features.map((feature, featureIndex) => (
                                                        <div key={featureIndex} className="flex space-x-2">
                                                            <Input
                                                                type="text"
                                                                value={feature}
                                                                onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                                                                placeholder="Service feature or benefit"
                                                                disabled={disabled}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFeature(index, featureIndex)}
                                                                disabled={disabled}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Technologies */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <Label>Technologies</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTechnology(index)}
                                                    disabled={disabled}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Technology
                                                </Button>
                                            </div>

                                            {service.technologies && service.technologies.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {service.technologies.map((tech, techIndex) => (
                                                        <div key={techIndex} className="flex space-x-2">
                                                            <Input
                                                                type="text"
                                                                value={tech}
                                                                onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                                                                placeholder="Technology or tool used"
                                                                disabled={disabled}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeTechnology(index, techIndex)}
                                                                disabled={disabled}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Process Steps */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <Label>Process Steps</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addProcessStep(index)}
                                                    disabled={disabled}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Step
                                                </Button>
                                            </div>

                                            {service.process_steps && service.process_steps.length > 0 && (
                                                <div className="mt-2 space-y-3">
                                                    {service.process_steps.map((step, stepIndex) => (
                                                        <div key={stepIndex} className="rounded-lg border p-3">
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    Step {step.order}
                                                                </span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeProcessStep(index, stepIndex)}
                                                                    disabled={disabled}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    type="text"
                                                                    value={step.step}
                                                                    onChange={(e) => updateProcessStep(index, stepIndex, 'step', e.target.value)}
                                                                    placeholder="Step title"
                                                                    disabled={disabled}
                                                                    required
                                                                />
                                                                <Textarea
                                                                    value={step.description || ''}
                                                                    onChange={(e) =>
                                                                        updateProcessStep(index, stepIndex, 'description', e.target.value)
                                                                    }
                                                                    placeholder="Step description (optional)"
                                                                    disabled={disabled}
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <div>
                                            <ImageInput
                                                label="Service Image"
                                                name={`${name}_image_${index}`}
                                                value={service.image}
                                                onChange={(value) => updateService(index, 'image', value)}
                                                disabled={disabled}
                                                showPreview={true}
                                            />
                                        </div>

                                        {/* Status Toggles */}
                                        <div className="flex space-x-6">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_featured_${index}`}
                                                    checked={service.featured || false}
                                                    onChange={(e) => updateService(index, 'featured', e.target.checked)}
                                                    disabled={disabled}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <Label htmlFor={`${name}_featured_${index}`} className="text-sm">
                                                    Featured service
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_active_${index}`}
                                                    checked={service.active !== false}
                                                    onChange={(e) => updateService(index, 'active', e.target.checked)}
                                                    disabled={disabled}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <Label htmlFor={`${name}_active_${index}`} className="text-sm">
                                                    Active (visible to users)
                                                </Label>
                                            </div>
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
                    <Settings className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No services added yet</p>
                    <p className="text-xs text-gray-400">Add services to showcase what your business unit offers</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
