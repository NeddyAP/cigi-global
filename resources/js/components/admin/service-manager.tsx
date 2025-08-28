import ImagePicker from '@/components/image-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { EyeOff, GripVertical, Plus, Settings, Star, Trash2 } from 'lucide-react';
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
        <div className={cn('space-y-6', className)}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={name} className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                        <Settings className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {value.length}/{maxServices}
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
                    onClick={addService}
                    disabled={disabled}
                    className="group w-full border-2 border-dashed border-zinc-300 bg-white py-6 text-zinc-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all group-hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Tambah Layanan Baru</div>
                            <div className="text-sm text-zinc-500">Klik untuk menambah layanan baru</div>
                        </div>
                    </div>
                </Button>
            )}

            {/* Services List */}
            {value.length > 0 && (
                <div className="space-y-4">
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
                                    'group overflow-hidden transition-all duration-200 hover:shadow-lg',
                                    dragOverIndex === index && 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
                                    !disabled && 'cursor-move',
                                    isEmpty && 'border-2 border-dashed border-zinc-300',
                                    isExpanded && 'ring-2 ring-blue-500/20',
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
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                                                        {service.title || `Layanan ${index + 1}`}
                                                    </CardTitle>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {service.featured && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                                                                <Star className="h-3 w-3" />
                                                                Featured
                                                            </span>
                                                        )}
                                                        {service.active === false && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-200">
                                                                <EyeOff className="h-3 w-3" />
                                                                Inactive
                                                            </span>
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
                                                    onClick={() => removeService(index)}
                                                    className="border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && service.description && (
                                        <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{service.description}</p>
                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                                {service.price_range && (
                                                    <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm dark:bg-zinc-700">
                                                        💰 {service.price_range}
                                                    </span>
                                                )}
                                                {service.duration && (
                                                    <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm dark:bg-zinc-700">
                                                        ⏱️ {service.duration}
                                                    </span>
                                                )}
                                                {service.features && service.features.length > 0 && (
                                                    <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm dark:bg-zinc-700">
                                                        ✨ {service.features.length} features
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                {/* Expanded Form */}
                                {isExpanded && (
                                    <CardContent className="space-y-6 border-t border-zinc-200/60 bg-gradient-to-br from-zinc-50/50 to-white/50 pt-6 dark:border-zinc-600/60 dark:from-zinc-800/30 dark:to-zinc-700/30">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Title */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_title_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Service Title <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id={`${name}_title_${index}`}
                                                    type="text"
                                                    value={service.title}
                                                    onChange={(e) => updateService(index, 'title', e.target.value)}
                                                    placeholder="Service name"
                                                    disabled={disabled}
                                                    required
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Price Range */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_price_range_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Price Range
                                                </Label>
                                                <Input
                                                    id={`${name}_price_range_${index}`}
                                                    type="text"
                                                    value={service.price_range || ''}
                                                    onChange={(e) => updateService(index, 'price_range', e.target.value)}
                                                    placeholder="e.g., $500-$2000, Starting at $100"
                                                    disabled={disabled}
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Duration */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_duration_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Duration
                                                </Label>
                                                <Input
                                                    id={`${name}_duration_${index}`}
                                                    type="text"
                                                    value={service.duration || ''}
                                                    onChange={(e) => updateService(index, 'duration', e.target.value)}
                                                    placeholder="e.g., 2-4 weeks, Ongoing"
                                                    disabled={disabled}
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`${name}_description_${index}`}
                                                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                            >
                                                Description <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id={`${name}_description_${index}`}
                                                value={service.description}
                                                onChange={(e) => updateService(index, 'description', e.target.value)}
                                                placeholder="Describe what this service involves"
                                                disabled={disabled}
                                                rows={4}
                                                required
                                                className="rounded-lg border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                            />
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Features</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addFeature(index)}
                                                    disabled={disabled}
                                                    className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Feature
                                                </Button>
                                            </div>

                                            {service.features && service.features.length > 0 && (
                                                <div className="space-y-2">
                                                    {service.features.map((feature, featureIndex) => (
                                                        <div key={featureIndex} className="flex gap-2">
                                                            <Input
                                                                type="text"
                                                                value={feature}
                                                                onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                                                                placeholder="Service feature or benefit"
                                                                disabled={disabled}
                                                                className="flex-1 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeFeature(index, featureIndex)}
                                                                disabled={disabled}
                                                                className="h-11 w-11 rounded-lg border-red-200 bg-red-50 p-0 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Technologies */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Technologies</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTechnology(index)}
                                                    disabled={disabled}
                                                    className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Technology
                                                </Button>
                                            </div>

                                            {service.technologies && service.technologies.length > 0 && (
                                                <div className="space-y-2">
                                                    {service.technologies.map((tech, techIndex) => (
                                                        <div key={techIndex} className="flex gap-2">
                                                            <Input
                                                                type="text"
                                                                value={tech}
                                                                onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                                                                placeholder="Technology or tool used"
                                                                disabled={disabled}
                                                                className="flex-1 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeTechnology(index, techIndex)}
                                                                disabled={disabled}
                                                                className="h-11 w-11 rounded-lg border-red-200 bg-red-50 p-0 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Process Steps */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Process Steps</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addProcessStep(index)}
                                                    disabled={disabled}
                                                    className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Step
                                                </Button>
                                            </div>

                                            {service.process_steps && service.process_steps.length > 0 && (
                                                <div className="space-y-3">
                                                    {service.process_steps.map((step, stepIndex) => (
                                                        <div
                                                            key={stepIndex}
                                                            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-600 dark:bg-zinc-800"
                                                        >
                                                            <div className="mb-3 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                                        {step.order}
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                                        Step {step.order}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeProcessStep(index, stepIndex)}
                                                                    disabled={disabled}
                                                                    className="h-8 w-8 rounded-lg border-red-200 bg-red-50 p-0 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <Input
                                                                    type="text"
                                                                    value={step.step}
                                                                    onChange={(e) => updateProcessStep(index, stepIndex, 'step', e.target.value)}
                                                                    placeholder="Step title"
                                                                    disabled={disabled}
                                                                    required
                                                                    className="rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                                />
                                                                <Textarea
                                                                    value={step.description || ''}
                                                                    onChange={(e) =>
                                                                        updateProcessStep(index, stepIndex, 'description', e.target.value)
                                                                    }
                                                                    placeholder="Step description (optional)"
                                                                    disabled={disabled}
                                                                    rows={2}
                                                                    className="rounded-lg border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <div>
                                            <ImagePicker
                                                label="Service Image"
                                                name={`${name}_image_${index}`}
                                                value={service.image}
                                                onChange={(value) => updateService(index, 'image', value)}
                                                disabled={disabled}
                                                showPreview={true}
                                            />
                                        </div>

                                        {/* Status Toggles */}
                                        <div className="flex flex-wrap gap-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_featured_${index}`}
                                                    checked={service.featured || false}
                                                    onChange={(e) => updateService(index, 'featured', e.target.checked)}
                                                    disabled={disabled}
                                                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                                                />
                                                <Label
                                                    htmlFor={`${name}_featured_${index}`}
                                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Featured service
                                                </Label>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_active_${index}`}
                                                    checked={service.active !== false}
                                                    onChange={(e) => updateService(index, 'active', e.target.checked)}
                                                    disabled={disabled}
                                                    className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-600"
                                                />
                                                <Label
                                                    htmlFor={`${name}_active_${index}`}
                                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                                >
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
                <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100 p-12 text-center dark:border-zinc-600 dark:from-zinc-800/50 dark:to-zinc-700/50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <Settings className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Belum ada layanan</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Tambahkan layanan untuk menampilkan apa yang ditawarkan unit bisnis Anda
                    </p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
