import {
    AchievementsSection,
    ContactCTASection,
    EventsPortfolioSection,
    GallerySection,
    HeroSection,
    TeamSection,
    TestimonialsSection,
} from '@/components/landing';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type BusinessUnit } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react';

interface BusinessUnitShowProps {
    businessUnit: BusinessUnit;
    relatedUnits?: BusinessUnit[];
}

export default function BusinessUnitShow({ businessUnit, relatedUnits = [] }: BusinessUnitShowProps) {
    const services = businessUnit.services ? businessUnit.services.split(',').map((s) => s.trim()) : [];

    // Transform gallery images for the GallerySection component
    const galleryImages =
        businessUnit.gallery_images?.map((image, index) => ({
            id: index + 1,
            url: image,
            alt: `${businessUnit.name} - Image ${index + 1}`,
            caption: `${businessUnit.name} business operations and projects`,
            thumbnail: { url: image },
        })) || [];

    // Transform client testimonials for the TestimonialsSection component
    const testimonials =
        businessUnit.client_testimonials?.map((testimonial, index) => ({
            id: index + 1,
            name: testimonial.name,
            role: 'Client',
            company: testimonial.company,
            content: testimonial.content,
            rating: testimonial.rating || 5,
            image: testimonial.image,
            date: new Date().toISOString().split('T')[0], // Use current date as fallback
            verified: true,
        })) || [];

    // Transform team members for the TeamSection component
    const teamMembers =
        businessUnit.team_members?.map((member, index) => ({
            id: index + 1,
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image,
            email: '',
            phone: '',
            location: '',
            joinDate: '',
            expertise: [],
            achievements: [],
            education: [],
            experience: [],
            socialLinks: member.social_links
                ? [
                      ...(member.social_links.linkedin ? [{ platform: 'linkedin' as const, url: member.social_links.linkedin }] : []),
                      ...(member.social_links.twitter ? [{ platform: 'twitter' as const, url: member.social_links.twitter }] : []),
                      ...(member.social_links.github ? [{ platform: 'website' as const, url: member.social_links.github }] : []),
                  ]
                : [],
            isActive: true,
            isFeatured: index === 0,
        })) || [];

    // Transform portfolio items for the EventsPortfolioSection component
    const portfolioItems =
        businessUnit.portfolio_items?.map((item, index) => ({
            id: index + 1,
            title: item.title,
            description: item.description,
            image: item.image,
            client: item.client,
            technologies: item.technologies,
            category: 'Business Services',
            completionDate: new Date().toISOString().split('T')[0], // Use current date as fallback
            projectUrl: '#',
            caseStudyUrl: '#',
            results: ['Successful project delivery', 'Client satisfaction achieved', 'Business objectives met'],
            challenges: ['Complex requirements', 'Tight timeline', 'Technical constraints'],
            solutions: ['Agile methodology', 'Expert team deployment', 'Innovative solutions'],
            isFeatured: index === 0,
            isHighlighted: index === 0,
        })) || [];

    // Transform achievements for the AchievementsSection component
    const achievements =
        businessUnit.achievements?.map((achievement, index) => ({
            id: index + 1,
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            category: 'achievement' as const,
            icon: '🏆',
            image: achievement.image,
            location: '',
            issuer: 'Industry Recognition',
            level: 'gold' as const,
            isHighlighted: index === 0,
        })) || [];

    // Create statistics for the AchievementsSection
    const statistics = [
        {
            id: 1,
            label: 'Years in Business',
            value: businessUnit.company_stats?.years_in_business || 0,
            suffix: '+',
            icon: '⏰',
            color: 'text-blue-600',
            description: 'Years of industry experience',
        },
        {
            id: 2,
            label: 'Projects Completed',
            value: businessUnit.company_stats?.projects_completed || 0,
            suffix: '+',
            icon: '🚀',
            color: 'text-green-600',
            description: 'Successful project deliveries',
        },
        {
            id: 3,
            label: 'Clients Served',
            value: businessUnit.company_stats?.clients_served || 0,
            suffix: '+',
            icon: '👥',
            color: 'text-purple-600',
            description: 'Satisfied clients worldwide',
        },
        {
            id: 4,
            label: 'Team Size',
            value: businessUnit.company_stats?.team_size || 0,
            suffix: '+',
            icon: '👨‍💼',
            color: 'text-orange-600',
            description: 'Expert professionals',
        },
    ];

    // Contact information for ContactCTASection
    const contactInfo = {
        address: businessUnit.address,
        phone: businessUnit.contact_phone,
        email: businessUnit.contact_email,
        hours: businessUnit.operating_hours,
    };

    // CTA buttons for ContactCTASection
    const ctaButtons = [
        {
            text: 'Get a Quote',
            link: `mailto:${businessUnit.contact_email || 'info@cigi-global.com'}?subject=Quote Request for ${businessUnit.name}`,
            variant: 'primary' as const,
            icon: '💰',
        },
        {
            text: 'Schedule Consultation',
            link: businessUnit.contact_phone ? `tel:${businessUnit.contact_phone}` : `mailto:${businessUnit.contact_email || 'info@cigi-global.com'}`,
            variant: 'secondary' as const,
            icon: '📅',
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
            title={businessUnit.name}
            description={businessUnit.description || `Informasi lengkap tentang ${businessUnit.name} - Unit Bisnis CIGI Global`}
        >
            <Head title={businessUnit.name} />

            {/* Enhanced Hero Section */}
            <HeroSection
                title={businessUnit.name}
                subtitle="Professional Business Solutions"
                description={
                    businessUnit.description ||
                    `We deliver exceptional business services and solutions tailored to meet your specific needs. Our expertise and commitment to excellence ensure your success.`
                }
                backgroundImage={businessUnit.image}
                ctaText="Get Started"
                ctaLink="#contact"
                secondaryCtaText="Learn More"
                secondaryCtaLink="#about"
                showRating={true}
                rating={4.9}
                ratingCount={businessUnit.company_stats?.clients_served || 100}
                features={[
                    'Professional Services',
                    `${services.length}+ Solutions`,
                    `${businessUnit.company_stats?.years_in_business || 5}+ Years Experience`,
                    `${businessUnit.company_stats?.team_size || 10}+ Expert Team`,
                ]}
                className="min-h-screen"
            />

            {/* Back Button - Floating */}
            <div className="fixed top-23 left-4 z-50">
                <Link
                    href={route('business-units.index')}
                    className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Business Units
                </Link>
            </div>

            {/* About Section */}
            <section id="about" className="bg-white py-16 dark:bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">About Our Business Unit</h2>
                        <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            {businessUnit.description ||
                                'Our business unit is dedicated to delivering exceptional value through innovative solutions, expert consultation, and reliable service delivery. We partner with clients to achieve sustainable growth and success.'}
                        </p>

                        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800">
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Our Mission</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    To provide innovative business solutions that drive growth, efficiency, and success for our clients.
                                </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800">
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Our Approach</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    We combine industry expertise with cutting-edge technology to deliver tailored solutions that meet your unique
                                    business challenges.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            {services.length > 0 && (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Services</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Discover our comprehensive range of business services designed to meet your specific needs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => (
                                <div key={index} className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-700">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{service}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Professional service delivery with proven methodologies and industry best practices.
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
                    title="Our Work Gallery"
                    subtitle="See Our Projects in Action"
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
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Work Gallery</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're building our project portfolio! Check back soon to see examples of our work and successful implementations.
                            </p>
                            <div className="flex h-64 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700">
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600">
                                        <span className="text-2xl">🖼️</span>
                                    </div>
                                    <p className="text-sm">Portfolio coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Team Section */}
            {teamMembers.length > 0 ? (
                <TeamSection
                    members={teamMembers}
                    title="Meet Our Team"
                    subtitle="Expert Professionals"
                    layout="grid"
                    showSocialLinks={true}
                    showContactInfo={false}
                />
            ) : (
                <section className="bg-white py-16 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Meet Our Team</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                Our expert team is ready to serve you. Get to know the professionals behind our success.
                            </p>
                            <div className="rounded-xl bg-slate-50 p-8 dark:bg-slate-800">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Our team profiles are being prepared. Contact us to learn more about our expertise and experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 ? (
                <TestimonialsSection
                    testimonials={testimonials}
                    title="What Our Clients Say"
                    subtitle="Client Success Stories"
                    autoRotate={true}
                    rotationInterval={6000}
                    showNavigation={true}
                />
            ) : (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Client Testimonials</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                Our clients are sharing their success stories. Be the next success story!
                            </p>
                            <div className="rounded-xl bg-white p-8 dark:bg-slate-700">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Share your experience working with us and help others discover the value of our services.
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
                    title="Our Achievements"
                    subtitle="Recognition & Milestones"
                    showTimeline={true}
                    showStatistics={true}
                />
            ) : (
                <section className="bg-white py-16 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Achievements</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're building our legacy of success. Join us in celebrating our milestones and achievements.
                            </p>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {statistics.map((stat) => (
                                    <div key={stat.id} className="rounded-xl bg-slate-50 p-6 text-center dark:bg-slate-800">
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

            {/* Portfolio Section */}
            {portfolioItems.length > 0 ? (
                <EventsPortfolioSection
                    events={[]}
                    portfolioItems={portfolioItems}
                    title="Our Portfolio"
                    subtitle="Successful Projects & Case Studies"
                    showTabs={false}
                    showEvents={false}
                    showPortfolio={true}
                />
            ) : (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Portfolio</h2>
                            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                We're building our project showcase! Check back soon to see examples of our successful implementations.
                            </p>
                            <div className="rounded-xl bg-white p-8 dark:bg-slate-700">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <span className="text-2xl">💼</span>
                                </div>
                                <p className="mb-4 text-slate-600 dark:text-slate-300">
                                    Our portfolio is being prepared with detailed case studies and project examples.
                                </p>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">Request Case Study</Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact & CTA Section */}
            <ContactCTASection
                title="Ready to Work Together?"
                subtitle="Let's Discuss Your Project"
                description="Whether you need consultation, project implementation, or ongoing support, we're here to help you achieve your business goals."
                contactInfo={contactInfo}
                ctaButtons={ctaButtons}
                showMap={false}
            />

            {/* Related Business Units */}
            {relatedUnits.length > 0 && (
                <section className="bg-slate-50 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 max-w-4xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Explore Other Business Units</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Discover other specialized business units within the CIGI Global ecosystem.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {relatedUnits.slice(0, 3).map((unit) => (
                                <Link key={unit.id} href={route('business-units.show', unit.slug)} className="group">
                                    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-700">
                                        {unit.image && (
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={`${unit.image}`}
                                                    alt={unit.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                                                {unit.name}
                                            </h3>
                                            {unit.description && (
                                                <p className="mb-4 line-clamp-3 text-slate-600 dark:text-slate-300">{unit.description}</p>
                                            )}
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Business Services
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
