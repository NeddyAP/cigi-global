import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Building, Calendar, Clock, ExternalLink, MapPin, Star, Tag, TrendingUp, User, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

interface Event {
    id: string | number;
    title: string;
    description: string;
    date: string;
    time?: string;
    endDate?: string;
    endTime?: string;
    location?: string;
    image?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    price?: string;
    category?: string;
    tags?: string[];
    organizer?: string;
    contactEmail?: string;
    contactPhone?: string;
    registrationUrl?: string;
    isFeatured?: boolean;
    isUpcoming?: boolean;
    isPast?: boolean;
}

interface PortfolioItem {
    id: string | number;
    title: string;
    description: string;
    image?: string;
    client?: string;
    technologies?: string[];
    category?: string;
    completionDate?: string;
    projectUrl?: string;
    caseStudyUrl?: string;
    results?: string[];
    challenges?: string[];
    solutions?: string[];
    isFeatured?: boolean;
    isHighlighted?: boolean;
}

interface EventsPortfolioSectionProps {
    title?: string;
    subtitle?: string;
    events?: Event[];
    portfolioItems?: PortfolioItem[];
    showEvents?: boolean;
    showPortfolio?: boolean;
    showTabs?: boolean;
    maxVisible?: number;
    showViewAll?: boolean;
    viewAllEventsLink?: string;
    viewAllPortfolioLink?: string;
    className?: string;
}

export default function EventsPortfolioSection({
    title = 'Events & Portfolio',
    subtitle = 'Discover our upcoming events and successful projects',
    events = [],
    portfolioItems = [],
    showEvents = true,
    showPortfolio = true,
    showTabs = true,
    maxVisible = 6,
    showViewAll = true,
    viewAllEventsLink = '#',
    viewAllPortfolioLink = '#',
    className = '',
}: EventsPortfolioSectionProps) {
    const [activeTab, setActiveTab] = useState('events');
    const [visibleEvents, setVisibleEvents] = useState(maxVisible);
    const [visiblePortfolio, setVisiblePortfolio] = useState(maxVisible);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    const formatTime = useCallback((timeString?: string) => {
        if (!timeString) return '';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }, []);

    const isEventUpcoming = useCallback((event: Event) => {
        const eventDate = new Date(event.date);
        const now = new Date();
        return eventDate >= now;
    }, []);

    const getEventStatus = useCallback(
        (event: Event) => {
            if (event.isFeatured) return 'featured';
            if (isEventUpcoming(event)) return 'upcoming';
            return 'ongoing';
        },
        [isEventUpcoming],
    );

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'featured':
                return 'bg-yellow-500 text-white';
            case 'upcoming':
                return 'bg-green-500 text-white';
            case 'past':
                return 'bg-gray-500 text-white';
            case 'ongoing':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    }, []);

    const getStatusText = useCallback((status: string) => {
        switch (status) {
            case 'featured':
                return 'Featured';
            case 'upcoming':
                return 'Upcoming';
            case 'past':
                return 'Past';
            case 'ongoing':
                return 'Ongoing';
            default:
                return 'Unknown';
        }
    }, []);

    const loadMoreEvents = () => {
        setVisibleEvents((prev) => Math.min(prev + maxVisible, events.length));
    };

    const loadMorePortfolio = () => {
        setVisiblePortfolio((prev) => Math.min(prev + maxVisible, portfolioItems.length));
    };

    const renderEventCard = (event: Event) => {
        const status = getEventStatus(event);
        const isUpcoming = isEventUpcoming(event);

        return (
            <Card
                key={event.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    event.isFeatured ? 'ring-2 ring-yellow-400' : ''
                }`}
            >
                <CardHeader className="p-0">
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                                <Calendar className="h-16 w-16 text-blue-400" />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                            <Badge className={getStatusColor(status)}>{getStatusText(status)}</Badge>
                        </div>

                        {/* Featured Badge */}
                        {event.isFeatured && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-yellow-500 text-white">
                                    <Star className="mr-1 h-3 w-3" />
                                    Featured
                                </Badge>
                            </div>
                        )}

                        {/* Registration Status */}
                        {isUpcoming && event.maxParticipants && event.currentParticipants && (
                            <div className="absolute right-3 bottom-3">
                                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                    {event.currentParticipants}/{event.maxParticipants} spots
                                </Badge>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Event Meta */}
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        {event.price && (
                            <Badge variant="outline" className="border-green-200 text-green-600">
                                {event.price}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <CardTitle className="mb-3 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                        {event.title}
                    </CardTitle>

                    {/* Description */}
                    <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{event.description}</p>

                    {/* Event Details */}
                    <div className="mb-4 space-y-2 text-sm text-gray-500">
                        {event.time && (
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {formatTime(event.time)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                </span>
                            </div>
                        )}

                        {event.location && (
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                        )}

                        {event.maxParticipants && (
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Max {event.maxParticipants} participants</span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {event.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {event.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{event.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        {isUpcoming && event.registrationUrl && (
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                                    Register Now
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}

                        {!isUpcoming && (
                            <Button variant="outline" size="sm" className="flex-1">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderPortfolioCard = (item: PortfolioItem) => (
        <Card
            key={item.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                item.isHighlighted ? 'ring-2 ring-blue-400' : ''
            }`}
        >
            <CardHeader className="p-0">
                {/* Portfolio Image */}
                <div className="relative h-48 overflow-hidden">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                            <Building className="h-16 w-16 text-green-400" />
                        </div>
                    )}

                    {/* Featured Badge */}
                    {item.isFeatured && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500 text-white">
                                <Star className="mr-1 h-3 w-3" />
                                Featured
                            </Badge>
                        </div>
                    )}

                    {/* Category Badge */}
                    {item.category && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                {item.category}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Client */}
                {item.client && (
                    <div className="mb-3 flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>Client: {item.client}</span>
                    </div>
                )}

                {/* Title */}
                <CardTitle className="mb-3 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                    {item.title}
                </CardTitle>

                {/* Description */}
                <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{item.description}</p>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                    <div className="mb-4">
                        <div className="mb-2 flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Tag className="h-4 w-4" />
                            <span>Technologies</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {item.technologies.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                </Badge>
                            ))}
                            {item.technologies.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                    +{item.technologies.length - 4} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Results */}
                {item.results && item.results.length > 0 && (
                    <div className="mb-4">
                        <div className="mb-2 flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <TrendingUp className="h-4 w-4" />
                            <span>Key Results</span>
                        </div>
                        <ul className="space-y-1">
                            {item.results.slice(0, 2).map((result, index) => (
                                <li key={index} className="flex items-start space-x-2 text-xs text-gray-600">
                                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                    <span>{result}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {item.caseStudyUrl && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={item.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                                Case Study
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}

                    {item.projectUrl && (
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                            <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                                View Project
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}

                    {!item.caseStudyUrl && !item.projectUrl && (
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    if (!showEvents && !showPortfolio) {
        return (
            <section className={`bg-gray-50 py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg text-gray-600">{subtitle}</p>
                    <p className="text-gray-500">No content available at the moment.</p>
                </div>
            </section>
        );
    }

    // If only one type is shown, don't use tabs
    if (!showTabs || (showEvents && !showPortfolio) || (!showEvents && showPortfolio)) {
        const content = showEvents ? (
            <div>
                <div className="mb-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">Upcoming Events</h3>
                    <p className="text-gray-600">Join us for these exciting community events</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{events.slice(0, visibleEvents).map(renderEventCard)}</div>

                {visibleEvents < events.length && (
                    <div className="mt-8 text-center">
                        <Button variant="outline" onClick={loadMoreEvents}>
                            Load More Events
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <div className="mb-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">Our Portfolio</h3>
                    <p className="text-gray-600">Explore our successful projects and case studies</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {portfolioItems.slice(0, visiblePortfolio).map(renderPortfolioCard)}
                </div>

                {visiblePortfolio < portfolioItems.length && (
                    <div className="mt-8 text-center">
                        <Button variant="outline" onClick={loadMorePortfolio}>
                            Load More Projects
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        );

        return (
            <section className={`bg-gray-50 py-16 ${className}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                        {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                    </div>

                    {content}
                </div>
            </section>
        );
    }

    // Use tabs when both types are shown
    return (
        <section className={`bg-gray-50 py-16 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-8 grid w-full grid-cols-2">
                        <TabsTrigger value="events" className="text-lg">
                            <Calendar className="mr-2 h-5 w-5" />
                            Events ({events.length})
                        </TabsTrigger>
                        <TabsTrigger value="portfolio" className="text-lg">
                            <Building className="mr-2 h-5 w-5" />
                            Portfolio ({portfolioItems.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.slice(0, visibleEvents).map(renderEventCard)}
                        </div>

                        {visibleEvents < events.length && (
                            <div className="mt-8 text-center">
                                <Button variant="outline" onClick={loadMoreEvents}>
                                    Load More Events
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {showViewAll && events.length > 0 && (
                            <div className="mt-8 text-center">
                                <Button
                                    variant="outline"
                                    className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                                    asChild
                                >
                                    <a href={viewAllEventsLink}>
                                        View All Events
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="portfolio" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {portfolioItems.slice(0, visiblePortfolio).map(renderPortfolioCard)}
                        </div>

                        {visiblePortfolio < portfolioItems.length && (
                            <div className="mt-8 text-center">
                                <Button variant="outline" onClick={loadMorePortfolio}>
                                    Load More Projects
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {showViewAll && portfolioItems.length > 0 && (
                            <div className="mt-8 text-center">
                                <Button
                                    variant="outline"
                                    className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                                    asChild
                                >
                                    <a href={viewAllPortfolioLink}>
                                        View All Projects
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}
