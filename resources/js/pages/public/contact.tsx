import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { type GlobalVars } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Send, Twitter } from 'lucide-react';
import { useState } from 'react';

interface ContactProps {
    globalVars: GlobalVars;
}

export default function Contact({ globalVars }: ContactProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would typically submit the form to your backend
            // For now, we'll just simulate a successful submission
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });

            // You could show a success message here
            alert('Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.');
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicLayout
            title="Kontak"
            description="Hubungi CIGI Global untuk konsultasi dan kerjasama. Kami siap membantu mewujudkan visi bisnis Anda."
        >
            <Head title="Kontak - CIGI Global" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black py-20 md:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />

                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2">
                            <MessageCircle className="h-5 w-5 text-amber-400" />
                            <span className="text-sm font-medium text-amber-400">Hubungi Kami</span>
                        </div>

                        <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
                            Mari <span className="text-amber-400">Berkolaborasi</span>
                            <br />
                            Bersama Kami
                        </h1>

                        <p className="mb-8 text-lg leading-relaxed text-zinc-300 md:text-xl">
                            Kami siap mendengar ide dan kebutuhan Anda. Hubungi tim CIGI Global untuk konsultasi gratis dan temukan solusi terbaik
                            untuk bisnis Anda.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            {globalVars.contact_whatsapp && (
                                <Button
                                    asChild
                                    className="transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700"
                                >
                                    <a
                                        href={`https://wa.me/${globalVars.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Phone className="mr-2 h-5 w-5" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}

                            {globalVars.contact_email && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-lg border-zinc-700 bg-zinc-800/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-700"
                                >
                                    <a href={`mailto:${globalVars.contact_email}`}>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Email
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information & Form */}
            <section className="bg-zinc-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Information */}
                        <div>
                            <div className="mb-8">
                                <h2 className="mb-4 text-3xl font-bold text-white">Informasi Kontak</h2>
                                <p className="text-lg text-zinc-300">Berikut adalah berbagai cara untuk menghubungi tim CIGI Global</p>
                            </div>

                            <div className="space-y-6">
                                {/* Phone */}
                                {globalVars.contact_phone && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Phone className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Telepon</h3>
                                            <p className="text-zinc-400">Hubungi kami langsung</p>
                                            <a
                                                href={`tel:${globalVars.contact_phone}`}
                                                className="text-amber-400 transition-colors hover:text-amber-300"
                                            >
                                                {globalVars.contact_phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                {globalVars.contact_email && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Mail className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Email</h3>
                                            <p className="text-zinc-400">Kirim email untuk pertanyaan detail</p>
                                            <a
                                                href={`mailto:${globalVars.contact_email}`}
                                                className="text-amber-400 transition-colors hover:text-amber-300"
                                            >
                                                {globalVars.contact_email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                {globalVars.contact_address && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <MapPin className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Alamat</h3>
                                            <p className="text-zinc-400">Kunjungi kantor kami</p>
                                            <p className="text-zinc-300">{globalVars.contact_address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Office Hours */}
                                {globalVars.contact_office_hours && (
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/50 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Clock className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-white">Jam Operasional</h3>
                                            <p className="text-zinc-400">Waktu terbaik untuk menghubungi kami</p>
                                            <p className="text-zinc-300">{globalVars.contact_office_hours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Social Media */}
                            <div className="mt-8">
                                <h3 className="mb-4 text-xl font-semibold text-white">Ikuti Kami</h3>
                                <div className="flex gap-4">
                                    {globalVars.contact_social_facebook && (
                                        <a
                                            href={globalVars.contact_social_facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVars.contact_social_instagram && (
                                        <a
                                            href={globalVars.contact_social_instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 hover:text-white"
                                        >
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVars.contact_social_twitter && (
                                        <a
                                            href={globalVars.contact_social_twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                                        >
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {globalVars.contact_social_linkedin && (
                                        <a
                                            href={globalVars.contact_social_linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-all duration-300 hover:bg-blue-700 hover:text-white"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-8">
                                <div className="mb-6">
                                    <h2 className="mb-2 text-2xl font-bold text-white">Kirim Pesan</h2>
                                    <p className="text-zinc-400">Isi formulir di bawah dan kami akan segera menghubungi Anda</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name" className="text-white">
                                                Nama Lengkap *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-white">
                                                Nomor Telepon
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="Contoh: +62 812-3456-7890"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-white">
                                            Email *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="nama@email.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subject" className="text-white">
                                            Subjek *
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="Topik pesan Anda"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message" className="text-white">
                                            Pesan *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="mt-1 resize-none border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="Jelaskan kebutuhan atau pertanyaan Anda secara detail..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full transform rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                                Mengirim...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Send className="h-5 w-5" />
                                                Kirim Pesan
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact CTA */}
            <section className="bg-black py-20">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-8 md:p-12">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Butuh Respon Cepat?</h2>
                            <p className="mb-8 text-lg text-zinc-300">
                                Untuk pertanyaan mendesak atau konsultasi langsung, hubungi kami melalui WhatsApp
                            </p>

                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                {globalVars.contact_whatsapp && (
                                    <Button
                                        asChild
                                        className="transform rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700"
                                    >
                                        <a
                                            href={`https://wa.me/${globalVars.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            Chat WhatsApp
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-lg border-zinc-700 bg-zinc-800/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-700"
                                >
                                    <Link href={route('about')}>Tentang Kami</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
