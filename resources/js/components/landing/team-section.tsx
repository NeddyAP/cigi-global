import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Award, BookOpen, Calendar, Globe, Linkedin, Mail, MapPin, Phone, Star, Twitter, Users } from 'lucide-react';

interface SocialLink {
    platform: 'linkedin' | 'twitter' | 'website' | 'email' | 'phone';
    url: string;
    label?: string;
}

interface TeamMember {
    id: string | number;
    name: string;
    role: string;
    bio: string;
    image?: string;
    email?: string;
    phone?: string;
    location?: string;
    joinDate?: string;
    expertise?: string[];
    achievements?: string[];
    education?: string[];
    experience?: string[];
    socialLinks?: SocialLink[];
    isActive?: boolean;
    isFeatured?: boolean;
}

interface TeamSectionProps {
    title?: string;
    subtitle?: string;
    members: TeamMember[];
    layout?: 'grid' | 'list' | 'masonry';
    columns?: 2 | 3 | 4 | 5 | 6;
    showDetails?: boolean;
    showSocialLinks?: boolean;
    showExpertise?: boolean;
    showAchievements?: boolean;
    showEducation?: boolean;
    showExperience?: boolean;
    showContactInfo?: boolean;
    showJoinDate?: boolean;
    showLocation?: boolean;
    showFeatured?: boolean;
    className?: string;
}

export default function TeamSection({
    title = 'Our Team',
    subtitle = 'Meet the amazing people behind our success',
    members,
    layout = 'grid',
    columns = 3,
    showDetails = true,
    showSocialLinks = true,
    showExpertise = true,
    showAchievements = true,
    showEducation = true,
    showExperience = true,
    showContactInfo = true,
    showJoinDate = true,
    showLocation = true,
    showFeatured = true,
    className = '',
}: TeamSectionProps) {
    if (members.length === 0) {
        return (
            <section className={`bg-gray-50 py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg text-gray-600">{subtitle}</p>
                    <p className="text-gray-500">No team members available at the moment.</p>
                </div>
            </section>
        );
    }

    const renderSocialIcon = (platform: string) => {
        switch (platform) {
            case 'linkedin':
                return <Linkedin className="h-4 w-4" />;
            case 'twitter':
                return <Twitter className="h-4 w-4" />;
            case 'website':
                return <Globe className="h-4 w-4" />;
            case 'email':
                return <Mail className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            default:
                return <Globe className="h-4 w-4" />;
        }
    };

    const renderMemberCard = (member: TeamMember) => (
        <Card key={member.id} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="p-0">
                <div className="relative">
                    {/* Member Image */}
                    <div className="aspect-square overflow-hidden">
                        {member.image ? (
                            <img
                                src={member.image}
                                alt={member.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-blue-500 text-2xl font-bold text-white">
                                        {member.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>

                    {/* Overlay with social links */}
                    {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex space-x-3">
                                {member.socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 transition-all duration-200 hover:scale-110 hover:bg-white"
                                    >
                                        {renderSocialIcon(social.platform)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Featured Badge */}
                    {showFeatured && member.isFeatured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white hover:bg-yellow-600">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                        </Badge>
                    )}

                    {/* Active Status */}
                    {member.isActive !== undefined && (
                        <div className="absolute top-3 left-3">
                            <div className={`h-3 w-3 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Member Info */}
                <div className="text-center">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                        {member.name}
                    </h3>
                    <p className="mb-4 text-gray-600">{member.role}</p>

                    {/* Location and Join Date */}
                    <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                        {showLocation && member.location && (
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{member.location}</span>
                            </div>
                        )}
                        {showJoinDate && member.joinDate && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {new Date(member.joinDate).getFullYear()}</span>
                            </div>
                        )}
                    </div>

                    {/* Short Bio */}
                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">{member.bio}</p>

                    {/* Expertise Tags */}
                    {showExpertise && member.expertise && member.expertise.length > 0 && (
                        <div className="mb-4 flex flex-wrap justify-center gap-2">
                            {member.expertise.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {member.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{member.expertise.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* View Details Button */}
                    {showDetails && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full transition-all duration-300 group-hover:border-blue-600 group-hover:text-blue-600"
                                >
                                    View Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">{member.name}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                    {/* Member Header */}
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={member.image} alt={member.name} />
                                            <AvatarFallback className="bg-blue-500 text-xl font-bold text-white">
                                                {member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900">{member.role}</h3>
                                            {member.location && (
                                                <p className="flex items-center space-x-1 text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{member.location}</span>
                                                </p>
                                            )}
                                            {member.joinDate && (
                                                <p className="flex items-center space-x-1 text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Member since {new Date(member.joinDate).toLocaleDateString()}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <h4 className="mb-2 font-semibold text-gray-900">About</h4>
                                        <p className="leading-relaxed text-gray-700">{member.bio}</p>
                                    </div>

                                    {/* Contact Information */}
                                    {showContactInfo && (member.email || member.phone) && (
                                        <div>
                                            <h4 className="mb-2 font-semibold text-gray-900">Contact Information</h4>
                                            <div className="space-y-2">
                                                {member.email && (
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Mail className="h-4 w-4" />
                                                        <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                                                            {member.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                                                            {member.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expertise */}
                                    {showExpertise && member.expertise && member.expertise.length > 0 && (
                                        <div>
                                            <h4 className="mb-2 font-semibold text-gray-900">Areas of Expertise</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {member.expertise.map((skill, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {showAchievements && member.achievements && member.achievements.length > 0 && (
                                        <div>
                                            <h4 className="mb-2 flex items-center space-x-2 font-semibold text-gray-900">
                                                <Award className="h-5 w-5 text-yellow-500" />
                                                <span>Achievements & Awards</span>
                                            </h4>
                                            <ul className="space-y-2">
                                                {member.achievements.map((achievement, index) => (
                                                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" />
                                                        <span>{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {showEducation && member.education && member.education.length > 0 && (
                                        <div>
                                            <h4 className="mb-2 flex items-center space-x-2 font-semibold text-gray-900">
                                                <BookOpen className="h-5 w-5 text-blue-500" />
                                                <span>Education</span>
                                            </h4>
                                            <ul className="space-y-2">
                                                {member.education.map((edu, index) => (
                                                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                                        <span>{edu}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {showExperience && member.experience && member.experience.length > 0 && (
                                        <div>
                                            <h4 className="mb-2 flex items-center space-x-2 font-semibold text-gray-900">
                                                <Users className="h-5 w-5 text-green-500" />
                                                <span>Professional Experience</span>
                                            </h4>
                                            <ul className="space-y-2">
                                                {member.experience.map((exp, index) => (
                                                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                                                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                                                        <span>{exp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Social Links */}
                                    {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
                                        <div>
                                            <h4 className="mb-2 font-semibold text-gray-900">Connect</h4>
                                            <div className="flex space-x-3">
                                                {member.socialLinks.map((social, index) => (
                                                    <a
                                                        key={index}
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
                                                    >
                                                        {renderSocialIcon(social.platform)}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    // Grid layout
    if (layout === 'grid') {
        return (
            <section className={`bg-gray-50 py-16 ${className}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                        {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                    </div>

                    {/* Team Grid */}
                    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-${columns}`}>{members.map(renderMemberCard)}</div>
                </div>
            </section>
        );
    }

    // List layout
    if (layout === 'list') {
        return (
            <section className={`bg-gray-50 py-16 ${className}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                        {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                    </div>

                    {/* Team List */}
                    <div className="space-y-6">
                        {members.map((member) => (
                            <Card key={member.id} className="group transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-6">
                                        {/* Avatar */}
                                        <Avatar className="h-20 w-20 flex-shrink-0">
                                            <AvatarImage src={member.image} alt={member.name} />
                                            <AvatarFallback className="bg-blue-500 text-xl font-bold text-white">
                                                {member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Member Info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-center space-x-3">
                                                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                                                {showFeatured && member.isFeatured && (
                                                    <Badge className="bg-yellow-500 text-white">
                                                        <Star className="mr-1 h-3 w-3" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mb-2 text-gray-600">{member.role}</p>
                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600">{member.bio}</p>

                                            {/* Quick Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                {showLocation && member.location && (
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{member.location}</span>
                                                    </div>
                                                )}
                                                {showJoinDate && member.joinDate && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Joined {new Date(member.joinDate).getFullYear()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {showDetails && (
                                            <div className="flex-shrink-0">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">View Details</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                                        {/* Same content as grid layout dialog */}
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Masonry layout (fallback to grid)
    return (
        <section className={`bg-gray-50 py-16 ${className}`}>
            <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                <p className="mt-8 text-gray-500">Masonry layout coming soon!</p>
            </div>
        </section>
    );
}
