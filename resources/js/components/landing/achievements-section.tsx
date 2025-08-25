import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Award, Calendar, CheckCircle, MapPin, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Achievement {
    id: string | number;
    title: string;
    description: string;
    date: string;
    category: 'award' | 'milestone' | 'recognition' | 'certification' | 'achievement';
    icon?: string;
    image?: string;
    location?: string;
    issuer?: string;
    level?: 'bronze' | 'silver' | 'gold' | 'platinum';
    isHighlighted?: boolean;
}

interface Statistic {
    id: string | number;
    label: string;
    value: number;
    unit?: string;
    prefix?: string;
    suffix?: string;
    icon?: string;
    color?: string;
    description?: string;
}

interface AchievementsSectionProps {
    title?: string;
    subtitle?: string;
    achievements: Achievement[];
    statistics?: Statistic[];
    showTimeline?: boolean;
    showStatistics?: boolean;
    showCategories?: boolean;
    maxVisible?: number;
    showViewAll?: boolean;
    viewAllLink?: string;
    className?: string;
}

export default function AchievementsSection({
    achievements = [],
    statistics = [],
    title = 'Achievements & Recognition',
    subtitle = 'Celebrating Our Success',
    showTimeline = true,
    showStatistics = true,
    showCategories = true,
    maxVisible = 6,
    showViewAll = true,
    className = '',
}: AchievementsSectionProps) {
    const [visibleAchievements, setVisibleAchievements] = useState(maxVisible);
    const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
    const statsRef = useRef<HTMLDivElement>(null);

    // Animate statistics when they come into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statistics.forEach((stat) => {
                            animateStat(stat.id, stat.value);
                        });
                    }
                });
            },
            { threshold: 0.5 },
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [statistics]);

    const animateStat = (id: string | number, targetValue: number) => {
        const duration = 2000;
        const steps = 60;
        const increment = targetValue / steps;
        let currentValue = 0;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            setAnimatedStats((prev) => ({
                ...prev,
                [id.toString()]: Math.floor(currentValue),
            }));
        }, duration / steps);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'award':
                return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 'milestone':
                return <Target className="h-6 w-6 text-blue-500" />;
            case 'recognition':
                return <Star className="h-6 w-6 text-purple-500" />;
            case 'certification':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'achievement':
                return <Award className="h-6 w-6 text-orange-500" />;
            default:
                return <Trophy className="h-6 w-6 text-gray-500" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'award':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'milestone':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'recognition':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'certification':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'achievement':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'bronze':
                return 'bg-amber-600';
            case 'silver':
                return 'bg-gray-400';
            case 'gold':
                return 'bg-yellow-500';
            case 'platinum':
                return 'bg-slate-500';
            default:
                return 'bg-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const loadMore = () => {
        setVisibleAchievements((prev) => Math.min(prev + maxVisible, achievements.length));
    };

    if (achievements.length === 0 && statistics.length === 0) {
        return (
            <section className={`bg-white py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg text-gray-600">{subtitle}</p>
                    <p className="text-gray-500">No achievements or statistics available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`bg-white py-16 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
                </div>

                {/* Statistics Section */}
                {showStatistics && statistics.length > 0 && (
                    <div ref={statsRef} className="mb-16">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {statistics.map((stat) => (
                                <Card key={stat.id} className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex justify-center">
                                            {stat.icon ? (
                                                <div
                                                    className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.color || 'bg-blue-100'}`}
                                                >
                                                    <span className="text-2xl">{stat.icon}</span>
                                                </div>
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                                    <TrendingUp className="h-8 w-8 text-blue-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-2 text-3xl font-bold text-gray-900">
                                            {stat.prefix}
                                            {animatedStats[stat.id] || 0}
                                            {stat.suffix}
                                        </div>

                                        <p className="mb-2 text-sm font-medium text-gray-600">{stat.label}</p>

                                        {stat.unit && <p className="text-xs text-gray-500">{stat.unit}</p>}

                                        {stat.description && <p className="mt-2 text-xs text-gray-500">{stat.description}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Grid */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {achievements.slice(0, visibleAchievements).map((achievement) => (
                            <Card
                                key={achievement.id}
                                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                    achievement.isHighlighted ? 'ring-2 ring-yellow-400' : ''
                                }`}
                            >
                                <CardHeader className="p-0">
                                    {/* Achievement Image or Icon */}
                                    <div className="relative h-48 overflow-hidden">
                                        {achievement.image ? (
                                            <img
                                                src={achievement.image}
                                                alt={achievement.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                                                {getCategoryIcon(achievement.category)}
                                            </div>
                                        )}

                                        {/* Level Badge */}
                                        {achievement.level && (
                                            <div className={`absolute top-3 right-3 h-6 w-6 rounded-full ${getLevelColor(achievement.level)}`} />
                                        )}

                                        {/* Highlight Badge */}
                                        {achievement.isHighlighted && (
                                            <Badge className="absolute top-3 left-3 bg-yellow-500 text-white hover:bg-yellow-600">
                                                <Star className="mr-1 h-3 w-3" />
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {/* Category Badge */}
                                    {showCategories && (
                                        <div className="mb-3">
                                            <Badge variant="outline" className={`text-xs ${getCategoryColor(achievement.category)}`}>
                                                {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <CardTitle className="mb-3 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                                        {achievement.title}
                                    </CardTitle>

                                    {/* Description */}
                                    <p className="mb-4 leading-relaxed text-gray-600">{achievement.description}</p>

                                    {/* Meta Information */}
                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(achievement.date)}</span>
                                        </div>

                                        {achievement.location && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{achievement.location}</span>
                                            </div>
                                        )}

                                        {achievement.issuer && (
                                            <div className="flex items-center space-x-2">
                                                <Award className="h-4 w-4" />
                                                <span>Issued by {achievement.issuer}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleAchievements < achievements.length && (
                        <div className="mt-8 text-center">
                            <Button
                                variant="outline"
                                onClick={loadMore}
                                className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                Load More Achievements
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Timeline View */}
                {showTimeline && achievements.length > 0 && (
                    <div className="mt-16">
                        <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">Achievement Timeline</h3>
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" />

                            {/* Timeline Items */}
                            <div className="space-y-8">
                                {achievements
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .slice(0, 8)
                                    .map((achievement, index) => (
                                        <div
                                            key={achievement.id}
                                            className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-blue-500 shadow-lg" />

                                            {/* Content Card */}
                                            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                                <Card className="group transition-all duration-300 hover:shadow-lg">
                                                    <CardContent className="p-4">
                                                        <div className="mb-2 flex items-center space-x-2">
                                                            {getCategoryIcon(achievement.category)}
                                                            <Badge variant="outline" className={`text-xs ${getCategoryColor(achievement.category)}`}>
                                                                {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                                                            </Badge>
                                                        </div>

                                                        <h4 className="mb-2 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                                                            {achievement.title}
                                                        </h4>

                                                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">{achievement.description}</p>

                                                        <p className="text-xs text-gray-500">{formatDate(achievement.date)}</p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* View All Button */}
                {showViewAll && achievements.length > 0 && (
                    <div className="mt-12 text-center">
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                            View All Achievements
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
