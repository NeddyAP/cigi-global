import {
    AchievementsSection,
    ContactCTASection,
    EventsPortfolioSection,
    GallerySection,
    HeroSection,
    TestimonialsSection,
} from '@/components/landing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type CommunityClub } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, Users } from 'lucide-react';

interface CommunityClubShowProps {
    communityClub: CommunityClub;
    relatedClubs?: CommunityClub[];
}

export default function CommunityClubShow({ communityClub, relatedClubs = [] }: CommunityClubShowProps) {
    const getClubActivities = (): string[] => {
        if (!communityClub.activities) return [];
        try {
            const activities = JSON.parse(communityClub.activities);
            return Array.isArray(activities) ? activities : [];
        } catch {
            return communityClub.activities.split(',').map((a) => a.trim());
        }
    };

    const activities = getClubActivities();

    // Transform gallery images for the GallerySection component
    const galleryImages =
        communityClub.gallery_images?.map((image: any, index: number) => {
            // gallery_images may be an array of strings (urls) or objects { id, url, alt, caption }
            if (typeof image === 'string') {
                return {
                    id: `img-${index + 1}`,
                    url: image,
                    alt: `${communityClub.name} - Image ${index + 1}`,
                    caption: `${communityClub.name} community activities and events`,
                    thumbnail: { url: image },
                };
            }

            // If image is an object, safely read properties
            const imgUrl = image?.url ?? (typeof image === 'string' ? image : '');
            return {
                id: image?.id ?? `img-${index + 1}`,
                url: imgUrl,
                alt: image?.alt ?? `${communityClub.name} - Image ${index + 1}`,
                caption: image?.caption ?? `${communityClub.name} community activities and events`,
                thumbnail: { url: imgUrl },
            };
        }) || [];

    // Transform testimonials for the TestimonialsSection component
    const testimonials =
        communityClub.testimonials?.map((testimonial, index) => ({
            id: index + 1,
            name: testimonial.name,
            role: testimonial.role,
            company: '',
            content: testimonial.content,
            rating: testimonial.rating || 5,
            image: testimonial.image,
            date: new Date().toISOString().split('T')[0], // Use current date as fallback
            verified: true,
        })) || [];

    // Transform achievements for the AchievementsSection component
    const achievements =
        communityClub.achievements?.map((achievement, index) => ({
            id: index + 1,
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            category: 'achievement' as const,
            icon: '🏆',
            image: achievement.image,
            location: '',
            issuer: communityClub.name,
            level: 'gold' as const,
            isHighlighted: index === 0,
        })) || [];

    // Transform upcoming events for the EventsPortfolioSection component
    const events =
        communityClub.upcoming_events?.map((event, index) => ({
            id: index + 1,
            title: event.title,
            description: event.description,
            date: event.date,
            time: '10:00 AM',
            endDate: event.date,
            endTime: '6:00 PM',
            location: communityClub.location || 'TBD',
            image: event.image,
            maxParticipants: 50,
            currentParticipants: 0,
            price: 'Free',
            category: 'Community',
            tags: ['community', 'networking'],
            organizer: communityClub.name,
            contactEmail: communityClub.contact_email || '',
            contactPhone: communityClub.contact_phone || '',
            registrationUrl: '#',
            isFeatured: index === 0,
            isUpcoming: true,
            isPast: false,
        })) || [];

    // Create statistics for the AchievementsSection
    const statistics = [
        {
            id: 1,
            label: 'Community Members',
            value: communityClub.member_count || 0,
            suffix: '+',
            icon: '👥',
            color: 'text-blue-600',
            description: 'Active community members',
        },
        {
            id: 2,
            label: 'Years Active',
            value: communityClub.founded_year ? new Date().getFullYear() - communityClub.founded_year : 0,
            suffix: '+',
            icon: '⏰',
            color: 'text-green-600',
            description: 'Years of community building',
        },
        {
            id: 3,
            label: 'Activities Available',
            value: activities.length,
            suffix: '',
            icon: '🎯',
            color: 'text-purple-600',
            description: 'Community activities and programs',
        },
        {
            id: 4,
            label: 'Events This Year',
            value: events.length,
            suffix: '',
            icon: '📅',
            color: 'text-orange-600',
            description: 'Upcoming community events',
        },
    ];

    // Contact information for ContactCTASection
    const contactInfo = {
        address: communityClub.location,
        phone: communityClub.contact_phone,
        email: communityClub.contact_email,
        hours: communityClub.meeting_schedule,
    };

    // CTA buttons for ContactCTASection
    const ctaButtons = [
        {
            text: 'Join Our Community',
            link: `mailto:${communityClub.contact_email || 'info@cigi-global.com'}?subject=Joining ${communityClub.name}`,
            variant: 'primary' as const,
            icon: '👥',
        },
        {
            text: 'Contact Us',
            link: communityClub.contact_phone
                ? `tel:${communityClub.contact_phone}`
                : `mailto:${communityClub.contact_email || 'info@cigi-global.com'}`,
            variant: 'secondary' as const,
            icon: '📞',
        },
        {
            text: 'Learn More',
            link: '#about',
            variant: 'outline' as const,
            icon: 'ℹ️',
        },
    ];

    return (
        <PublicLayout
            title={communityClub.name}
            description={communityClub.description || `Informasi lengkap tentang ${communityClub.name} - Komunitas CIGI Global`}
        >
            <Head title={communityClub.name} />

            {/* Enhanced Hero Section */}
            <HeroSection
                title={communityClub.name}
                subtitle={communityClub.hero_subtitle || `Join our vibrant ${communityClub.type} community`}
                description={
                    communityClub.description ||
                    `Be part of our dynamic community where learning, collaboration, and innovation come together. Discover activities, build connections, and grow with like-minded individuals.`
                }
                backgroundImage={communityClub.image}
                ctaText={communityClub.hero_cta_text || 'Join Now'}
                ctaLink={communityClub.hero_cta_link || '#contact'}
                secondaryCtaText="Learn More"
                secondaryCtaLink="#about"
                showRating={true}
                rating={4.8}
                ratingCount={communityClub.member_count || 100}
                features={[
                    `${communityClub.type} Community`,
                    `${activities.length}+ Activities`,
                    `${communityClub.member_count || 100}+ Members`,
                    communityClub.founded_year ? `${new Date().getFullYear() - communityClub.founded_year}+ Years` : 'Established Community',
                ]}
                className="min-h-screen"
            />

            {/* Back Button - Floating */}
            <div className="fixed top-23 left-4 z-50">
                <Link
                    href={route('community-clubs.index')}
                    className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Communities
                </Link>
            </div>

            {/* About Section */}
            <section id="about" className="bg-white py-16 dark:bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">About Our Community</h2>
                        <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            {communityClub.description ||
                                'Our community is dedicated to fostering meaningful connections, promoting continuous learning, and creating opportunities for personal and professional growth. We believe in the power of collaboration and shared knowledge.'}
                        </p>

                        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800">
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Community Mission</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    To create an inclusive environment where members can learn, grow, and contribute to the collective success of our
                                    community.
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800">
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">What We Offer</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Regular activities, networking opportunities, skill development workshops, and a supportive environment for
                                    personal growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            {activities.length > 0 && (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Community Activities</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Discover the diverse range of activities and programs we offer to our community members.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activities.map((activity, index) => (
                                <div key={index} className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-700">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{activity}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Join our community members in this engaging activity designed to foster connections and learning.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {galleryImages.length > 0 ? (
                <GallerySection
                    images={galleryImages}
                    title="Community Gallery"
                    subtitle="Capturing Our Moments Together"
                    layout="grid"
                    showLightbox={true}
                    autoPlay={false}
                    showDownload={false}
                    showShare={true}
                />
            ) : (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Community Gallery</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're building our photo collection! Check back soon to see images from our community activities and events.
                            </p>
                            <div className="flex h-64 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700">
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600">
                                        <span className="text-2xl">📸</span>
                                    </div>
                                    <p className="text-sm">Gallery coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 ? (
                <TestimonialsSection
                    testimonials={testimonials}
                    title="What Our Members Say"
                    subtitle="Community Voices"
                    autoRotate={true}
                    rotationInterval={6000}
                    showNavigation={true}
                />
            ) : (
                <section className="bg-white py-16 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Member Testimonials</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                Our community members are sharing their experiences. Be the first to add your story!
                            </p>
                            <div className="rounded-xl bg-slate-50 p-8 dark:bg-slate-800">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Share your experience with our community and help others discover the value of joining us.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 ? (
                <AchievementsSection
                    achievements={achievements}
                    statistics={statistics}
                    title="Community Achievements"
                    subtitle="Celebrating Our Success"
                    showTimeline={true}
                    showStatistics={true}
                />
            ) : (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Community Achievements</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're building our legacy of success. Join us in creating meaningful achievements together.
                            </p>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {statistics.map((stat) => (
                                    <div key={stat.id} className="rounded-xl bg-white p-6 text-center dark:bg-slate-700">
                                        <div className="mb-2 text-3xl">{stat.icon}</div>
                                        <div className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                            {stat.suffix}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Events Section */}
            {events.length > 0 ? (
                <EventsPortfolioSection
                    events={events}
                    portfolioItems={[]}
                    title="Upcoming Events"
                    subtitle="Join Our Community Activities"
                    showTabs={false}
                    showEvents={true}
                    showPortfolio={false}
                />
            ) : (
                <section className="bg-white py-16 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Community Events</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're planning exciting events and activities. Stay tuned for updates!
                            </p>
                            <div className="rounded-xl bg-slate-50 p-8 dark:bg-slate-800">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <p className="mb-4 text-slate-600 dark:text-slate-300">
                                    Our event calendar is being prepared with exciting activities and networking opportunities.
                                </p>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">Get Notified</Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact & CTA Section */}
            <ContactCTASection
                title="Ready to Join Our Community?"
                subtitle="Connect With Us Today"
                description="Whether you're looking to learn new skills, build professional connections, or simply be part of something meaningful, we'd love to have you join our community."
                contactInfo={contactInfo}
                ctaButtons={ctaButtons}
                showMap={false}
            />

            {/* Related Clubs */}
            {relatedClubs.length > 0 && (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Explore Other Communities</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Discover other vibrant communities within the CIGI Global ecosystem.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {relatedClubs.slice(0, 3).map((club) => (
                                <Link key={club.id} href={route('community-clubs.show', club.slug)} className="group">
                                    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-700">
                                        {club.image && (
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={`${club.image}`}
                                                    alt={club.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-green-500 text-white">{club.type}</Badge>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                                                {club.name}
                                            </h3>
                                            {club.description && (
                                                <p className="mb-4 line-clamp-3 text-slate-600 dark:text-slate-300">{club.description}</p>
                                            )}
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Users className="mr-2 h-4 w-4" />
                                                {club.member_count || 'New'} members
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
