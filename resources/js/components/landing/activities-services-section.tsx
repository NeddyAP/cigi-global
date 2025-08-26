import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, DollarSign, Users } from 'lucide-react';

interface Activity {
    id: string | number;
    title: string;
    description: string;
    image?: string;
    duration: string;
    maxParticipants?: number;
    requirements?: string;
    benefits?: string[];
    type: 'activity';
}

interface Service {
    id: string | number;
    title: string;
    description: string;
    image?: string;
    priceRange: string;
    duration: string;
    features?: string[];
    technologies?: string[];
    type: 'service';
}

interface ActivitiesServicesSectionProps {
    title?: string;
    subtitle?: string;
    activities?: Activity[];
    services?: Service[];
    showViewAll?: boolean;
    viewAllLink?: string;
    className?: string;
}

export default function ActivitiesServicesSection({
    title = 'Activities & Services',
    subtitle = 'Discover what we offer',
    activities = [],
    services = [],
    showViewAll = true,
    viewAllLink = '#',
    className = '',
}: ActivitiesServicesSectionProps) {
    const allItems = [...activities, ...services];

    if (allItems.length === 0) {
        return (
            <section className={`py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
                    <p className="mb-8 text-lg text-gray-600">{subtitle}</p>
                    <p className="text-gray-500">No activities or services available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                </div>

                {/* Grid Layout */}
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allItems.map((item) => (
                        <Card key={item.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
                            {/* Image */}
                            {item.image && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Type Badge */}
                                    <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90 text-gray-900 hover:bg-white">
                                        {item.type === 'activity' ? 'Activity' : 'Service'}
                                    </Badge>
                                </div>
                            )}

                            {/* Content */}
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3 text-gray-600">{item.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="pb-3">
                                {/* Activity-specific details */}
                                {item.type === 'activity' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{item.duration}</span>
                                        </div>

                                        {item.maxParticipants && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Users className="h-4 w-4" />
                                                <span>Max {item.maxParticipants} participants</span>
                                            </div>
                                        )}

                                        {item.requirements && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Requirements:</span> {item.requirements}
                                            </div>
                                        )}

                                        {item.benefits && item.benefits.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium text-gray-700">Benefits:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.benefits.slice(0, 3).map((benefit, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {benefit}
                                                        </Badge>
                                                    ))}
                                                    {item.benefits.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{item.benefits.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Service-specific details */}
                                {item.type === 'service' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span>{item.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm font-semibold text-green-600">
                                                <DollarSign className="h-4 w-4" />
                                                <span>{item.priceRange}</span>
                                            </div>
                                        </div>

                                        {item.features && item.features.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium text-gray-700">Features:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.features.slice(0, 3).map((feature, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                    {item.features.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{item.features.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {item.technologies && item.technologies.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium text-gray-700">Technologies:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.technologies.slice(0, 3).map((tech, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-blue-100 text-xs text-blue-800">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                    {item.technologies.length > 3 && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-xs text-blue-800">
                                                            +{item.technologies.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            {/* Footer */}
                            <CardFooter className="pt-0">
                                <Button
                                    variant="outline"
                                    className="w-full transition-all duration-300 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                >
                                    Learn More
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                {showViewAll && allItems.length > 0 && (
                    <div className="text-center">
                        <Link href={viewAllLink}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                View All {title}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
