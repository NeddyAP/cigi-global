import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { type News } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Eye, Share2, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface NewsShowProps {
    news: News;
    relatedNews: News[];
}

export default function NewsShow({ news, relatedNews }: NewsShowProps) {
    const [isSharing, setIsSharing] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryLabel = (category: string) => {
        const categoryMap: Record<string, string> = {
            umum: 'Umum',
            bisnis: 'Bisnis',
            teknologi: 'Teknologi',
            komunitas: 'Komunitas',
        };
        return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: news.title,
                    text: news.excerpt || '',
                    url: window.location.href,
                });
            } else {
                // Fallback to copying URL to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert('Link artikel berhasil disalin ke clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        } finally {
            setIsSharing(false);
        }
    };

    const estimateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    return (
        <PublicLayout title={news.title} description={news.excerpt}>
            <Head title={news.title}>
                <meta property="og:title" content={news.title} />
                <meta property="og:description" content={news.excerpt} />
                {news.featured_image && <meta property="og:image" content={news.featured_image} />}
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={news.published_at} />
                {news.author && <meta property="article:author" content={news.author.name} />}
                <meta property="article:section" content={getCategoryLabel(news.category)} />
            </Head>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 md:py-20">
                <div className="glass-hero-overlay absolute inset-0"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href={route('news.index')}
                            className="inline-flex items-center glass-button rounded-lg px-4 py-2 text-white transition-all duration-200 hover:scale-105"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Berita
                        </Link>
                    </div>

                    {/* Article Header */}
                    <div className="mx-auto max-w-4xl">
                        {/* Category and Featured Badge */}
                        <div className="mb-4 flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full bg-amber-500/90 px-4 py-2 text-sm font-medium text-black">
                                <Tag className="mr-2 h-4 w-4" />
                                {getCategoryLabel(news.category)}
                            </span>
                            {news.is_featured && (
                                <span className="inline-flex items-center rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white">
                                    ⭐ Artikel Unggulan
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="mb-6 text-3xl leading-tight font-bold text-white text-shadow-lg md:text-5xl">{news.title}</h1>

                        {/* Excerpt */}
                        {news.excerpt && <p className="text-shadow mb-6 text-xl leading-relaxed text-white/90">{news.excerpt}</p>}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>
                                    {formatDate(news.published_at)} - {formatTime(news.published_at)}
                                </span>
                            </div>
                            {news.author && (
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{news.author.name}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>{news.views_count.toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{estimateReadingTime(news.content)} menit baca</span>
                            </div>
                        </div>

                        {/* Share Button */}
                        <div className="mt-6">
                            <Button onClick={handleShare} disabled={isSharing} className="inline-flex items-center glass-button">
                                <Share2 className="mr-2 h-4 w-4" />
                                {isSharing ? 'Membagikan...' : 'Bagikan Artikel'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Featured Image */}
                        {news.featured_image && (
                            <div className="mb-12">
                                <div className="overflow-hidden glass-card rounded-xl">
                                    <img src={news.featured_image} alt={news.title} className="h-auto w-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="glass-card rounded-xl p-8 md:p-12">
                            <div className="prose prose-lg prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
                        </div>

                        {/* Tags */}
                        {news.tags && news.tags.length > 0 && (
                            <div className="mt-8">
                                <h3 className="mb-4 text-lg font-semibold text-white">Tags:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {news.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/20"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Info */}
                        {news.author && (
                            <div className="mt-12">
                                <div className="glass-card rounded-xl p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-white">Tentang Penulis</h3>
                                    <div className="flex items-center space-x-4">
                                        {news.author.avatar ? (
                                            <img src={news.author.avatar} alt={news.author.name} className="h-12 w-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                                <User className="h-6 w-6 text-amber-400" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-white">{news.author.name}</h4>
                                            <p className="text-sm text-white/70">{news.author.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Social Share */}
                        <div className="mt-8 text-center">
                            <p className="mb-4 text-white/70">Bagikan artikel ini:</p>
                            <div className="flex justify-center space-x-4">
                                <Button onClick={handleShare} disabled={isSharing} className="inline-flex items-center glass-button">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Bagikan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedNews.length > 0 && (
                <section className="border-t border-white/10 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="mb-8 text-center text-3xl font-bold text-white">Artikel Terkait</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {relatedNews.map((article) => (
                                    <article key={article.id} className="group glass-card-hover">
                                        {/* Featured Image */}
                                        {article.featured_image && (
                                            <div className="relative h-32 overflow-hidden rounded-t-xl">
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-amber-400">
                                                <Link href={route('news.show', article.slug)}>{article.title}</Link>
                                            </h3>

                                            {article.excerpt && <p className="mb-3 line-clamp-2 text-xs text-white/80">{article.excerpt}</p>}

                                            {/* Meta */}
                                            <div className="flex items-center text-xs text-white/60">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                <span>{new Date(article.published_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('news.index')}
                                    className="inline-flex items-center glass-button rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105"
                                >
                                    Lihat Semua Berita
                                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
