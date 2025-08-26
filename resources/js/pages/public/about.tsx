import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Award, Building2, Calendar, CheckCircle, Globe, Heart, Lightbulb, Mail, Phone, Shield, Target, Users } from 'lucide-react';

interface AboutProps {
    globalVariables: Record<string, string>;
}

export default function About({ globalVariables }: AboutProps) {
    return (
        <PublicLayout
            title="Tentang Kami"
            description="Mengenal lebih dalam tentang CIGI Global, visi, misi, dan komitmen kami untuk memberikan solusi terbaik"
        >
            <Head title="Tentang Kami - CIGI Global" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black py-20 md:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />

                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                            <Building2 className="h-5 w-5 text-amber-400" />
                            <span className="text-sm font-medium text-amber-400">Tentang CIGI Global</span>
                        </div>

                        <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
                            Membangun <span className="text-amber-400">Masa Depan</span>
                            <br />
                            Bersama Inovasi
                        </h1>

                        <p className="mb-8 text-lg leading-relaxed text-zinc-300 md:text-xl">
                            {globalVariables.company_description ||
                                'PT Cimande Girang Global adalah perusahaan inovatif yang berkomitmen untuk memberikan solusi digital terbaik bagi bisnis Anda dengan pengalaman lebih dari 4 tahun.'}
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button
                                asChild
                                className="transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700"
                            >
                                <Link href={route('contact')}>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Hubungi Kami
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-lg border-zinc-700 bg-zinc-800/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-700"
                            >
                                <Link href={route('business-units.index')}>
                                    <Building2 className="mr-2 h-5 w-5" />
                                    Unit Bisnis
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision, Mission, Values */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Visi, Misi & Nilai</h2>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-300">Fondasi yang menggerakkan setiap langkah perjalanan CIGI Global</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Vision */}
                        <div className="group rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800/50 p-8 transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 transition-all duration-300 group-hover:scale-110">
                                <Target className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Visi Kami</h3>
                            <p className="leading-relaxed text-zinc-300">
                                {globalVariables.company_vision ||
                                    'Menjadi perusahaan global terdepan yang menghadirkan solusi inovatif dan berkelanjutan untuk kemajuan masyarakat.'}
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="group rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800/50 p-8 transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 transition-all duration-300 group-hover:scale-110">
                                <Heart className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Misi Kami</h3>
                            <p className="leading-relaxed text-zinc-300">
                                {globalVariables.company_mission ||
                                    'Memberikan layanan berkualitas tinggi melalui inovasi teknologi dan kemitraan strategis yang menguntungkan semua pihak.'}
                            </p>
                        </div>

                        {/* Values */}
                        <div className="group rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800/50 p-8 transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 transition-all duration-300 group-hover:scale-110">
                                <Lightbulb className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-white">Nilai Kami</h3>
                            <p className="leading-relaxed text-zinc-300">
                                {globalVariables.company_values ||
                                    'Integritas, inovasi, dan kolaborasi adalah fondasi dalam setiap langkah yang kami ambil untuk menciptakan dampak positif.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company History */}
            <section className="bg-black py-20">
                <div className="container mx-auto px-4">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                                <Calendar className="h-5 w-5 text-amber-400" />
                                <span className="text-sm font-medium text-amber-400">Perjalanan Kami</span>
                            </div>

                            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Sejarah Perusahaan</h2>

                            <div className="space-y-4 text-zinc-300">
                                <p className="leading-relaxed">
                                    {globalVariables.company_history ||
                                        'CIGI Global didirikan dengan semangat untuk memberikan solusi digital terbaik bagi UMKM Indonesia. Bermula dari visi sederhana untuk membantu bisnis lokal berkembang di era digital, kami telah berkembang menjadi mitra terpercaya bagi berbagai perusahaan.'}
                                </p>
                                <p className="leading-relaxed">
                                    Dengan pengalaman lebih dari 4 tahun dalam industri teknologi, kami terus berinovasi dan beradaptasi dengan
                                    kebutuhan pasar yang dinamis.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square overflow-hidden rounded-2xl border border-zinc-800">
                                <img
                                    src="/assets/cigi-global.jpg"
                                    alt="Kantor CIGI Global"
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="absolute -inset-4 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-amber-600 to-amber-400 opacity-20 blur-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Mengapa Memilih CIGI Global?</h2>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-300">Keunggulan dan komitmen yang membuat kami berbeda</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="group rounded-xl border border-zinc-800 bg-zinc-800/50 p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-800">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <Award className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">{globalVariables.why_choose_us_title_1}</h3>
                            <p className="text-sm text-zinc-400">{globalVariables.why_choose_us_description_1}</p>
                        </div>

                        <div className="group rounded-xl border border-zinc-800 bg-zinc-800/50 p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-800">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <Shield className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">{globalVariables.why_choose_us_title_2}</h3>
                            <p className="text-sm text-zinc-400">{globalVariables.why_choose_us_description_2}</p>
                        </div>

                        <div className="group rounded-xl border border-zinc-800 bg-zinc-800/50 p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-800">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <Globe className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">{globalVariables.why_choose_us_title_3}</h3>
                            <p className="text-sm text-zinc-400">{globalVariables.why_choose_us_description_3}</p>
                        </div>

                        <div className="group rounded-xl border border-zinc-800 bg-zinc-800/50 p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-800">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                                <Users className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-white">{globalVariables.why_choose_us_title_4}</h3>
                            <p className="text-sm text-zinc-400">{globalVariables.why_choose_us_description_4}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Commitment */}
            <section className="bg-black py-20">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-8 md:p-12">
                        <div className="grid items-center gap-8 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Komitmen Terhadap Keberlanjutan</h2>
                                <p className="mb-6 text-lg leading-relaxed text-zinc-300">{globalVariables.commitment_description}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-amber-400" />
                                        <span className="text-zinc-300">Praktek bisnis yang bertanggung jawab</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-amber-400" />
                                        <span className="text-zinc-300">Inovasi untuk solusi berkelanjutan</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-amber-400" />
                                        <span className="text-zinc-300">Pemberdayaan UMKM lokal</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center text-amber-400">
                                    <Globe className="mr-2 h-5 w-5" />
                                    <span className="font-semibold">
                                        {globalVariables.commitment_tagline || 'Bersama membangun masa depan yang berkelanjutan'}
                                    </span>
                                </div>
                            </div>

                            <img
                                src={globalVariables.commitment_image}
                                alt="Komitmen"
                                className="mx-auto h-96 w-96 rounded-lg object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Siap Berkolaborasi dengan Kami?</h2>
                        <p className="mb-8 text-lg text-zinc-300">
                            Mari diskusikan bagaimana CIGI Global dapat membantu mewujudkan visi bisnis Anda.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button
                                asChild
                                className="transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700"
                            >
                                <Link href={route('contact')}>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Hubungi Kami
                                </Link>
                            </Button>

                            {globalVariables.contact_whatsapp && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-lg border-zinc-700 bg-zinc-800/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-700"
                                >
                                    <a
                                        href={`https://wa.me/${globalVariables.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Phone className="mr-2 h-5 w-5" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}
                        </div>

                        {globalVariables.contact_email && (
                            <p className="mt-6 text-zinc-400">
                                Atau kirim email ke{' '}
                                <a href={`mailto:${globalVariables.contact_email}`} className="text-amber-400 hover:text-amber-300">
                                    {globalVariables.contact_email}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
