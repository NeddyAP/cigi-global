import ImagePicker from '@/components/image-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Github, GripVertical, Linkedin, Mail, Phone, Plus, Star, Trash2, Twitter, Users } from 'lucide-react';
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

    const getSocialIcon = (platform: string) => {
        const lowerPlatform = platform.toLowerCase();
        if (lowerPlatform.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
        if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x')) return <Twitter className="h-4 w-4" />;
        if (lowerPlatform.includes('github')) return <Github className="h-4 w-4" />;
        if (lowerPlatform.includes('email') || lowerPlatform.includes('mail')) return <Mail className="h-4 w-4" />;
        if (lowerPlatform.includes('phone')) return <Phone className="h-4 w-4" />;
        return <span className="text-xs">🔗</span>;
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
                        <Users className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {value.length}/{maxMembers}
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
                    onClick={addTeamMember}
                    disabled={disabled}
                    className="group w-full border-2 border-dashed border-zinc-300 bg-white py-6 text-zinc-600 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-purple-500 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-all group-hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Tambah Anggota Tim</div>
                            <div className="text-sm text-zinc-500">Klik untuk menambah anggota tim baru</div>
                        </div>
                    </div>
                </Button>
            )}

            {/* Team Members List */}
            {value.length > 0 && (
                <div className="space-y-4">
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
                                    'group overflow-hidden transition-all duration-200 hover:shadow-lg',
                                    dragOverIndex === index && 'border-2 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
                                    !disabled && 'cursor-move',
                                    isEmpty && 'border-2 border-dashed border-zinc-300',
                                    isExpanded && 'ring-2 ring-purple-500/20',
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
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold text-white shadow-lg">
                                                    {member.image ? (
                                                        <img
                                                            src={typeof member.image === 'string' ? member.image : ''}
                                                            alt={member.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : member.name ? (
                                                        member.name.charAt(0).toUpperCase()
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                                                        {member.name || `Anggota Tim ${index + 1}`}
                                                    </CardTitle>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {member.featured && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                                                                <Star className="h-3 w-3" />
                                                                Featured
                                                            </span>
                                                        )}
                                                        {member.role && (
                                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{member.role}</span>
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
                                                    onClick={() => removeMember(index)}
                                                    className="border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview when collapsed */}
                                    {!isExpanded && (member.role || member.bio) && (
                                        <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                            {member.bio && <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{member.bio}</p>}
                                            {member.social_links && member.social_links.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {member.social_links.map((link, linkIndex) => (
                                                        <span
                                                            key={linkIndex}
                                                            className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-zinc-600 shadow-sm dark:bg-zinc-700 dark:text-zinc-400"
                                                        >
                                                            {getSocialIcon(link.platform)}
                                                            {link.platform}
                                                        </span>
                                                    ))}
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
                                                    value={member.name}
                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                    placeholder="Full name"
                                                    disabled={disabled}
                                                    required
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Role */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${name}_role_${index}`}
                                                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Role <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id={`${name}_role_${index}`}
                                                    type="text"
                                                    value={member.role}
                                                    onChange={(e) => updateMember(index, 'role', e.target.value)}
                                                    placeholder="Job title or position"
                                                    disabled={disabled}
                                                    required
                                                    className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                />
                                            </div>

                                            {/* Contact Info */}
                                            {showContactInfo && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`${name}_email_${index}`}
                                                            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                        >
                                                            Email
                                                        </Label>
                                                        <Input
                                                            id={`${name}_email_${index}`}
                                                            type="email"
                                                            value={member.email || ''}
                                                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                            placeholder="email@example.com"
                                                            disabled={disabled}
                                                            className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`${name}_phone_${index}`}
                                                            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                                        >
                                                            Phone
                                                        </Label>
                                                        <Input
                                                            id={`${name}_phone_${index}`}
                                                            type="tel"
                                                            value={member.phone || ''}
                                                            onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                            placeholder="+1 (555) 123-4567"
                                                            disabled={disabled}
                                                            className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Bio */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`${name}_bio_${index}`}
                                                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                                            >
                                                Bio
                                            </Label>
                                            <Textarea
                                                id={`${name}_bio_${index}`}
                                                value={member.bio || ''}
                                                onChange={(e) => updateMember(index, 'bio', e.target.value)}
                                                placeholder="Brief description about this team member"
                                                disabled={disabled}
                                                rows={3}
                                                className="rounded-lg border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                            />
                                        </div>

                                        {/* Photo */}
                                        <div>
                                            <ImagePicker
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
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Social Links</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addSocialLink(index)}
                                                        disabled={disabled}
                                                        className="border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                                    >
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Add Link
                                                    </Button>
                                                </div>

                                                {member.social_links && member.social_links.length > 0 && (
                                                    <div className="space-y-3">
                                                        {member.social_links.map((link, linkIndex) => (
                                                            <div key={linkIndex} className="flex gap-2">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        type="text"
                                                                        value={link.platform}
                                                                        onChange={(e) =>
                                                                            updateSocialLink(index, linkIndex, 'platform', e.target.value)
                                                                        }
                                                                        placeholder="Platform (e.g., LinkedIn)"
                                                                        disabled={disabled}
                                                                        className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                                    />
                                                                </div>
                                                                <div className="flex-2">
                                                                    <Input
                                                                        type="url"
                                                                        value={link.url}
                                                                        onChange={(e) => updateSocialLink(index, linkIndex, 'url', e.target.value)}
                                                                        placeholder="https://..."
                                                                        disabled={disabled}
                                                                        className="h-11 rounded-lg border-zinc-300 bg-white px-4 text-zinc-900 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                                                                    />
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeSocialLink(index, linkIndex)}
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
                                        )}

                                        {/* Featured Toggle */}
                                        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-800">
                                            <input
                                                type="checkbox"
                                                id={`${name}_featured_${index}`}
                                                checked={member.featured || false}
                                                onChange={(e) => updateMember(index, 'featured', e.target.checked)}
                                                disabled={disabled}
                                                className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-600"
                                            />
                                            <Label
                                                htmlFor={`${name}_featured_${index}`}
                                                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                            >
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
                <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100 p-12 text-center dark:border-zinc-600 dark:from-zinc-800/50 dark:to-zinc-700/50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <Users className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Belum ada anggota tim</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Tambahkan anggota tim untuk menampilkan tim Anda</p>
                </div>
            )}

            {/* Hidden Input for Form Submission */}
            <Input type="hidden" name={name} value={JSON.stringify(value)} />

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
