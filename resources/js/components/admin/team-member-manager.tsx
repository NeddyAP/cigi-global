import ImageInput from '@/components/image-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Trash2, Users } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface SocialLink {
    platform: string;
    url: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio?: string;
    image?: string | number;
    email?: string;
    phone?: string;
    social_links?: SocialLink[];
    featured?: boolean;
    order?: number;
}

interface TeamMemberManagerProps {
    label?: string;
    name: string;
    value?: TeamMember[];
    onChange: (members: TeamMember[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    maxMembers?: number;
    showSocialLinks?: boolean;
    showContactInfo?: boolean;
}

export default function TeamMemberManager({
    label,
    name,
    value = [],
    onChange,
    error,
    required = false,
    disabled = false,
    className,
    maxMembers = 20,
    showSocialLinks = true,
    showContactInfo = false,
}: TeamMemberManagerProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const canAddMore = value.length < maxMembers;

    const addTeamMember = useCallback(() => {
        const newMember: TeamMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            role: '',
            bio: '',
            image: '',
            email: '',
            phone: '',
            social_links: [],
            featured: false,
            order: value.length,
        };

        onChange([...value, newMember]);
        setExpandedIndex(value.length); // Expand the new member
    }, [value, onChange]);

    const removeMember = useCallback(
        (index: number) => {
            const updatedMembers = value.filter((_, i) => i !== index);
            onChange(updatedMembers);
            if (expandedIndex === index) {
                setExpandedIndex(null);
            } else if (expandedIndex !== null && expandedIndex > index) {
                setExpandedIndex(expandedIndex - 1);
            }
        },
        [value, onChange, expandedIndex],
    );

    const updateMember = useCallback(
        (index: number, field: keyof TeamMember, newValue: string | string[] | SocialLink[] | number | boolean | undefined | null) => {
            const updatedMembers = value.map((member, i) => (i === index ? { ...member, [field]: newValue } : member));
            onChange(updatedMembers);
        },
        [value, onChange],
    );

    const updateSocialLink = useCallback(
        (memberIndex: number, linkIndex: number, field: keyof SocialLink, newValue: string) => {
            const member = value[memberIndex];
            const socialLinks = [...(member.social_links || [])];
            socialLinks[linkIndex] = { ...socialLinks[linkIndex], [field]: newValue };
            updateMember(memberIndex, 'social_links', socialLinks);
        },
        [value, updateMember],
    );

    const addSocialLink = useCallback(
        (memberIndex: number) => {
            const member = value[memberIndex];
            const socialLinks = [...(member.social_links || []), { platform: '', url: '' }];
            updateMember(memberIndex, 'social_links', socialLinks);
        },
        [value, updateMember],
    );

    const removeSocialLink = useCallback(
        (memberIndex: number, linkIndex: number) => {
            const member = value[memberIndex];
            const socialLinks = (member.social_links || []).filter((_, i) => i !== linkIndex);
            updateMember(memberIndex, 'social_links', socialLinks);
        },
        [value, updateMember],
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

        const newMembers = [...value];
        const draggedMember = newMembers[draggedIndex];

        // Remove dragged item
        newMembers.splice(draggedIndex, 1);

        // Insert at new position
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
        newMembers.splice(insertIndex, 0, draggedMember);

        // Update order values
        const updatedMembers = newMembers.map((member, index) => ({ ...member, order: index }));

        onChange(updatedMembers);
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
                        ({value.length}/{maxMembers})
                    </span>
                </Label>
            )}

            {/* Add Button */}
            {canAddMore && (
                <Button type="button" variant="outline" size="sm" onClick={addTeamMember} disabled={disabled}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                </Button>
            )}

            {/* Team Members List */}
            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((member, index) => {
                        const isExpanded = expandedIndex === index;
                        const isEmpty = !member.name && !member.role;

                        return (
                            <Card
                                key={member.id}
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
                                                {member.name || `Team Member ${index + 1}`}
                                                {member.featured && (
                                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        Featured
                                                    </span>
                                                )}
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
                                                    onClick={() => removeMember(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && (member.role || member.bio) && (
                                        <div className="mt-2">
                                            {member.role && <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{member.role}</p>}
                                            {member.bio && <p className="line-clamp-2 text-sm text-gray-500">{member.bio}</p>}
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
                                                    value={member.name}
                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                    placeholder="Full name"
                                                    disabled={disabled}
                                                    required
                                                />
                                            </div>

                                            {/* Role */}
                                            <div>
                                                <Label htmlFor={`${name}_role_${index}`}>Role *</Label>
                                                <Input
                                                    id={`${name}_role_${index}`}
                                                    type="text"
                                                    value={member.role}
                                                    onChange={(e) => updateMember(index, 'role', e.target.value)}
                                                    placeholder="Job title or position"
                                                    disabled={disabled}
                                                    required
                                                />
                                            </div>

                                            {/* Contact Info */}
                                            {showContactInfo && (
                                                <>
                                                    <div>
                                                        <Label htmlFor={`${name}_email_${index}`}>Email</Label>
                                                        <Input
                                                            id={`${name}_email_${index}`}
                                                            type="email"
                                                            value={member.email || ''}
                                                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                            placeholder="email@example.com"
                                                            disabled={disabled}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor={`${name}_phone_${index}`}>Phone</Label>
                                                        <Input
                                                            id={`${name}_phone_${index}`}
                                                            type="tel"
                                                            value={member.phone || ''}
                                                            onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                            placeholder="+1 (555) 123-4567"
                                                            disabled={disabled}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Bio */}
                                        <div>
                                            <Label htmlFor={`${name}_bio_${index}`}>Bio</Label>
                                            <Textarea
                                                id={`${name}_bio_${index}`}
                                                value={member.bio || ''}
                                                onChange={(e) => updateMember(index, 'bio', e.target.value)}
                                                placeholder="Brief description about this team member"
                                                disabled={disabled}
                                                rows={3}
                                            />
                                        </div>

                                        {/* Photo */}
                                        <div>
                                            <ImageInput
                                                label="Photo"
                                                name={`${name}_image_${index}`}
                                                value={member.image}
                                                onChange={(value) => updateMember(index, 'image', value)}
                                                disabled={disabled}
                                                showPreview={true}
                                            />
                                        </div>

                                        {/* Social Links */}
                                        {showSocialLinks && (
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Label>Social Links</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addSocialLink(index)}
                                                        disabled={disabled}
                                                    >
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Add Link
                                                    </Button>
                                                </div>

                                                {member.social_links && member.social_links.length > 0 && (
                                                    <div className="mt-2 space-y-2">
                                                        {member.social_links.map((link, linkIndex) => (
                                                            <div key={linkIndex} className="flex space-x-2">
                                                                <Input
                                                                    type="text"
                                                                    value={link.platform}
                                                                    onChange={(e) => updateSocialLink(index, linkIndex, 'platform', e.target.value)}
                                                                    placeholder="Platform (e.g., LinkedIn)"
                                                                    disabled={disabled}
                                                                    className="flex-1"
                                                                />
                                                                <Input
                                                                    type="url"
                                                                    value={link.url}
                                                                    onChange={(e) => updateSocialLink(index, linkIndex, 'url', e.target.value)}
                                                                    placeholder="https://..."
                                                                    disabled={disabled}
                                                                    className="flex-2"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeSocialLink(index, linkIndex)}
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
                                        )}

                                        {/* Featured Toggle */}
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`${name}_featured_${index}`}
                                                checked={member.featured || false}
                                                onChange={(e) => updateMember(index, 'featured', e.target.checked)}
                                                disabled={disabled}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <Label htmlFor={`${name}_featured_${index}`} className="text-sm">
                                                Featured team member
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
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No team members added yet</p>
                    <p className="text-xs text-gray-400">Add team members to showcase your team</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
