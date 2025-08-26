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
    showStatistics?: boolean;
    showCategories?: boolean;
    maxVisible?: number;
    viewAllLink?: string;
    className?: string;
}

export default function AchievementsSection({
    achievements = [],
    statistics = [],
    title = 'Achievements & Recognition',
    subtitle = 'Celebrating Our Success',
    showStatistics = true,
    showCategories = true,
    maxVisible = 6,
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
                return <Trophy className="h-6 w-6 text-amber-500" />;
            case 'milestone':
                return <Target className="h-6 w-6 text-amber-400" />;
            case 'recognition':
                return <Star className="h-6 w-6 text-amber-600" />;
            case 'certification':
                return <CheckCircle className="h-6 w-6 text-amber-300" />;
            case 'achievement':
                return <Award className="h-6 w-6 text-amber-500" />;
            default:
                return <Trophy className="h-6 w-6 text-zinc-400" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'award':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'milestone':
                return 'bg-amber-400/20 text-amber-300 border-amber-400/30';
            case 'recognition':
                return 'bg-amber-600/20 text-amber-500 border-amber-600/30';
            case 'certification':
                return 'bg-amber-300/20 text-amber-200 border-amber-300/30';
            case 'achievement':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default:
                return 'bg-zinc-700 text-zinc-300 border-zinc-600';
        }
    };

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'bronze':
                return 'bg-amber-600';
            case 'silver':
                return 'bg-zinc-400';
            case 'gold':
                return 'bg-amber-500';
            case 'platinum':
                return 'bg-zinc-300';
            default:
                return 'bg-zinc-400';
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
            <section className={`section-dark py-16 ${className}`}>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="section-heading">{title}</h2>
                    <p className="section-subheading">{subtitle}</p>
                    <p className="text-zinc-400">No achievements or statistics available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`section-dark py-16 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="section-heading">{title}</h2>
                    {subtitle && <p className="section-subheading">{subtitle}</p>}
                </div>

                {/* Statistics Section */}
                {showStatistics && statistics.length > 0 && (
                    <div ref={statsRef} className="mb-16">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {statistics.map((stat) => (
                                <Card key={stat.id} className="section-card text-center">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex justify-center">
                                            {stat.icon ? (
                                                <div
                                                    className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.color || 'bg-amber-500/20'}`}
                                                >
                                                    <span className="text-2xl">{stat.icon}</span>
                                                </div>
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                                                    <TrendingUp className="h-8 w-8 text-amber-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-2 text-3xl font-bold text-white">
                                            {stat.prefix}
                                            {animatedStats[stat.id] || 0}
                                            {stat.suffix}
                                        </div>

                                        <p className="mb-2 text-sm font-medium text-zinc-300">{stat.label}</p>

                                        {stat.unit && <p className="text-xs text-zinc-400">{stat.unit}</p>}

                                        {stat.description && <p className="mt-2 text-xs text-zinc-400">{stat.description}</p>}
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
                                className={`section-card group relative overflow-hidden ${achievement.isHighlighted ? 'ring-2 ring-amber-500' : ''}`}
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
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                                                {getCategoryIcon(achievement.category)}
                                            </div>
                                        )}

                                        {/* Level Badge */}
                                        {achievement.level && (
                                            <div className={`absolute top-3 right-3 h-6 w-6 rounded-full ${getLevelColor(achievement.level)}`} />
                                        )}

                                        {/* Highlight Badge */}
                                        {achievement.isHighlighted && (
                                            <Badge className="absolute top-3 left-3 bg-amber-500 text-black hover:bg-amber-600">
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
                                    <CardTitle className="mb-3 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-400">
                                        {achievement.title}
                                    </CardTitle>

                                    {/* Description */}
                                    <p className="mb-4 leading-relaxed text-zinc-300">{achievement.description}</p>

                                    {/* Meta Information */}
                                    <div className="space-y-2 text-sm text-zinc-400">
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
                            <Button variant="outline" onClick={loadMore} className="cta-button-outline px-8 py-3 text-lg font-semibold">
                                Load More Achievements
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
