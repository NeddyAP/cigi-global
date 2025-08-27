import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Activity, GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface CommunityActivity {
    id: string;
    title: string;
    description: string;
    image?: string | number;
    duration?: string;
    max_participants?: number;
    requirements?: string;
    benefits?: string[];
    featured?: boolean;
    active?: boolean;
}

interface ActivityManagerProps {
    label?: string;
    name: string;
    value?: CommunityActivity[];
    onChange: (activities: CommunityActivity[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    maxActivities?: number;
}

export default function ActivityManager({
    label,
    name,
    value = [],
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    maxActivities = 15,
}: ActivityManagerProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxActivities;

    const addActivity = useCallback(() => {
        const newActivity: CommunityActivity = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            description: '',
            image: '',
            duration: '',
            max_participants: undefined,
            requirements: '',
            benefits: [],
            featured: false,
            active: true,
        };

        onChange([...value, newActivity]);
        setExpandedIndex(value.length); // Expand the new activity
    }, [value, onChange]);

    const removeActivity = useCallback(
        (index: number) => {
            const updatedActivities = value.filter((_, i) => i !== index);
            onChange(updatedActivities);
            if (expandedIndex === index) {
                setExpandedIndex(null);
            } else if (expandedIndex !== null && expandedIndex > index) {
                setExpandedIndex(expandedIndex - 1);
            }
        },
        [value, onChange, expandedIndex],
    );

    const updateActivity = useCallback(
        (index: number, field: keyof CommunityActivity, newValue: string | string[] | number | boolean | undefined | null) => {
            const updatedActivities = value.map((activity, i) => (i === index ? { ...activity, [field]: newValue } : activity));
            onChange(updatedActivities);
        },
        [value, onChange],
    );

    const updateBenefit = useCallback(
        (activityIndex: number, benefitIndex: number, newValue: string) => {
            const activity = value[activityIndex];
            const benefits = [...(activity.benefits || [])];
            benefits[benefitIndex] = newValue;
            updateActivity(activityIndex, 'benefits', benefits);
        },
        [value, updateActivity],
    );

    const addBenefit = useCallback(
        (activityIndex: number) => {
            const activity = value[activityIndex];
            const benefits = [...(activity.benefits || []), ''];
            updateActivity(activityIndex, 'benefits', benefits);
        },
        [value, updateActivity],
    );

    const removeBenefit = useCallback(
        (activityIndex: number, benefitIndex: number) => {
            const activity = value[activityIndex];
            const benefits = (activity.benefits || []).filter((_, i) => i !== benefitIndex);
            updateActivity(activityIndex, 'benefits', benefits);
        },
        [value, updateActivity],
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

        const newActivities = [...value];
        const draggedActivity = newActivities[draggedIndex];

        // Remove dragged item
        newActivities.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newActivities.splice(insertIndex, 0, draggedActivity);

        onChange(newActivities);
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
                        ({value.length}/{maxActivities})
                    </span>
                </Label>
            )}

            {/* Add Button */}
            {canAddMore && (
                <Button type="button" variant="outline" size="sm" onClick={addActivity} disabled={disabled}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Aktivitas
                </Button>
            )}

            {/* Activities List */}
            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((activity, index) => {
                        const isExpanded = expandedIndex === index;
                        const isEmpty = !activity.title && !activity.description;

                        return (
                            <Card
                                key={activity.id}
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
                                                {activity.title || `Aktivitas ${index + 1}`}
                                                <div className="mt-1 flex space-x-2">
                                                    {activity.featured && (
                                                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            Unggulan
                                                        </span>
                                                    )}
                                                    {activity.active === false && (
                                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                                            Tidak Aktif
                                                        </span>
                                                    )}
                                                </div>
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => toggleExpanded(index)}>
                                                {isExpanded ? 'Sembunyikan' : 'Edit'}
                                            </Button>
                                            {!disabled && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeActivity(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && activity.description && (
                                        <div className="mt-2">
                                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                                            <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                                                {activity.duration && <span>Durasi: {activity.duration}</span>}
                                                {activity.max_participants && <span>Maks: {activity.max_participants} peserta</span>}
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
                                                <Label htmlFor={`${name}_title_${index}`}>Judul Aktivitas *</Label>
                                                <Input
                                                    id={`${name}_title_${index}`}
                                                    type="text"
                                                    value={activity.title}
                                                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                                                    placeholder="Nama aktivitas"
                                                    disabled={disabled}
                                                    required
                                                />
                                            </div>

                                            {/* Duration */}
                                            <div>
                                                <Label htmlFor={`${name}_duration_${index}`}>Durasi</Label>
                                                <Input
                                                    id={`${name}_duration_${index}`}
                                                    type="text"
                                                    value={activity.duration || ''}
                                                    onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                                                    placeholder="contoh: 2 jam, Mingguan, Bulanan"
                                                    disabled={disabled}
                                                />
                                            </div>

                                            {/* Max Participants */}
                                            <div>
                                                <Label htmlFor={`${name}_max_participants_${index}`}>Jumlah Peserta Maksimal</Label>
                                                <Input
                                                    id={`${name}_max_participants_${index}`}
                                                    type="number"
                                                    value={activity.max_participants || ''}
                                                    onChange={(e) =>
                                                        updateActivity(
                                                            index,
                                                            'max_participants',
                                                            e.target.value ? parseInt(e.target.value) : undefined,
                                                        )
                                                    }
                                                    placeholder="Kosongkan untuk tidak terbatas"
                                                    disabled={disabled}
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor={`${name}_description_${index}`}>Deskripsi *</Label>
                                            <Textarea
                                                id={`${name}_description_${index}`}
                                                value={activity.description}
                                                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                                placeholder="Jelaskan apa yang melibatkan aktivitas ini"
                                                disabled={disabled}
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <Label htmlFor={`${name}_requirements_${index}`}>Persyaratan</Label>
                                            <Textarea
                                                id={`${name}_requirements_${index}`}
                                                value={activity.requirements || ''}
                                                onChange={(e) => updateActivity(index, 'requirements', e.target.value)}
                                                placeholder="Persyaratan atau prasyarat untuk berpartisipasi"
                                                disabled={disabled}
                                                rows={2}
                                            />
                                        </div>

                                        {/* Benefits */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <Label>Manfaat</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addBenefit(index)}
                                                    disabled={disabled}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Tambah Manfaat
                                                </Button>
                                            </div>

                                            {activity.benefits && activity.benefits.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {activity.benefits.map((benefit, benefitIndex) => (
                                                        <div key={benefitIndex} className="flex space-x-2">
                                                            <Input
                                                                type="text"
                                                                value={benefit}
                                                                onChange={(e) => updateBenefit(index, benefitIndex, e.target.value)}
                                                                placeholder="Manfaat atau hasil yang didapat"
                                                                disabled={disabled}
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeBenefit(index, benefitIndex)}
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

                                        {/* Image */}
                                        <div>
                                            <ImageInput
                                                label="Gambar Aktivitas"
                                                name={`${name}_image_${index}`}
                                                value={activity.image}
                                                onChange={(value) => updateActivity(index, 'image', value)}
                                                error={undefined}
                                                showPreview={true}
                                                multiple={false}
                                                disabled={disabled}
                                            />
                                        </div>

                                        {/* Status Toggles */}
                                        <div className="flex space-x-6">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_featured_${index}`}
                                                    checked={activity.featured || false}
                                                    onChange={(e) => updateActivity(index, 'featured', e.target.checked)}
                                                    disabled={disabled}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <Label htmlFor={`${name}_featured_${index}`} className="text-sm">
                                                    Aktivitas unggulan
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${name}_active_${index}`}
                                                    checked={activity.active !== false}
                                                    onChange={(e) => updateActivity(index, 'active', e.target.checked)}
                                                    disabled={disabled}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <Label htmlFor={`${name}_active_${index}`} className="text-sm">
                                                    Aktif (terlihat oleh pengguna)
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
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Belum ada aktivitas yang ditambahkan</p>
                    <p className="text-xs text-gray-400">Tambahkan aktivitas untuk menampilkan apa yang ditawarkan komunitas Anda</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
