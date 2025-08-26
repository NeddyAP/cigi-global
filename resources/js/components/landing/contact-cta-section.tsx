'use client';

import { router } from '@inertiajs/react';
import { useState } from 'react';

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    preferredContact: 'email' | 'phone' | 'both';
    urgency: 'low' | 'medium' | 'high';
    interests: string[];
}

interface ContactCTASectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    contactInfo?: {
        address?: string;
        phone?: string;
        email?: string;
        hours?: string;
    };
    ctaButtons?: Array<{
        text: string;
        link: string;
        variant?: 'primary' | 'secondary' | 'outline';
        icon?: string;
    }>;
    showMap?: boolean;
    mapLocation?: string;
    className?: string;
}

export default function ContactCTASection({
    title = 'Get In Touch',
    subtitle = 'Ready to get started?',
    description = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    contactInfo = {},
    ctaButtons = [],
    showMap = false,
    mapLocation,
    className = '',
}: ContactCTASectionProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        preferredContact: 'email',
        urgency: 'medium',
        interests: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState<Partial<ContactFormData>>({});

    const interestOptions = [
        'Business Services',
        'Community Activities',
        'Partnership Opportunities',
        'General Inquiry',
        'Support Request',
        'Feedback',
    ];

    const urgencyOptions = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-red-600' },
    ];

    const handleInputChange = (field: keyof ContactFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleInterestToggle = (interest: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactFormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate form submission - replace with actual endpoint
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: '',
                preferredContact: 'email',
                urgency: 'medium',
                interests: [],
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCTAClick = (link: string) => {
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else {
            router.visit(link);
        }
    };

    return (
        <section className={`bg-gradient-to-br from-slate-50 to-slate-100 py-16 dark:from-slate-900 dark:to-slate-800 ${className}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    {subtitle && <p className="mb-4 text-xl text-slate-600 dark:text-slate-300">{subtitle}</p>}
                    {description && <p className="mx-auto max-w-3xl text-lg text-slate-500 dark:text-slate-400">{description}</p>}
                </div>

                <div className="grid items-start gap-12 lg:grid-cols-2">
                    {/* Contact Form */}
                    <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
                        {submitSuccess ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
                                <p className="text-slate-600 dark:text-slate-300">We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                                                errors.name
                                                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                                    : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                                            }`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                                                errors.email
                                                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                                    : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                                            }`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Phone and Company */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                                            placeholder="Enter your company name"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange('subject', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                                            errors.subject
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                                : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                                        }`}
                                        placeholder="What is this about?"
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        className={`w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                                            errors.message
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                                : 'border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                                        }`}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
                                </div>

                                {/* Preferences */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Preferred Contact Method
                                        </label>
                                        <div className="space-y-2">
                                            {(['email', 'phone', 'both'] as const).map((method) => (
                                                <label key={method} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="preferredContact"
                                                        value={method}
                                                        checked={formData.preferredContact === method}
                                                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                                                        className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-slate-700 capitalize dark:text-slate-300">{method}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">Areas of Interest</label>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {interestOptions.map((interest) => (
                                            <label key={interest} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interests.includes(interest)}
                                                    onChange={() => handleInterestToggle(interest)}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{interest}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending Message...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info & CTA */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        {Object.keys(contactInfo).length > 0 && (
                            <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
                                <h3 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Contact Information</h3>
                                <div className="space-y-4">
                                    {contactInfo.address && (
                                        <div className="flex items-start">
                                            <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <svg
                                                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Address</p>
                                                <p className="text-slate-600 dark:text-slate-300">{contactInfo.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {contactInfo.phone && (
                                        <div className="flex items-start">
                                            <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                <svg
                                                    className="h-5 w-5 text-green-600 dark:text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                                                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                    {contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {contactInfo.email && (
                                        <div className="flex items-start">
                                            <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                <svg
                                                    className="h-5 w-5 text-purple-600 dark:text-purple-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Email</p>
                                                <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                    {contactInfo.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {contactInfo.hours && (
                                        <div className="flex items-start">
                                            <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                <svg
                                                    className="h-5 w-5 text-orange-600 dark:text-orange-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Business Hours</p>
                                                <p className="text-slate-600 dark:text-slate-300">{contactInfo.hours}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        {ctaButtons.length > 0 && (
                            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white shadow-xl">
                                <h3 className="mb-4 text-2xl font-semibold">Ready to Get Started?</h3>
                                <p className="mb-6 text-blue-100">Take the next step towards achieving your goals with our expert team.</p>
                                <div className="space-y-3">
                                    {ctaButtons.map((button, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleCTAClick(button.link)}
                                            className={`flex w-full items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
                                                button.variant === 'secondary'
                                                    ? 'border border-white/30 bg-white/20 text-white hover:bg-white/30'
                                                    : button.variant === 'outline'
                                                      ? 'border border-white/50 bg-transparent text-white hover:bg-white/20'
                                                      : 'bg-white text-blue-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {button.icon && <span className="mr-2">{button.icon}</span>}
                                            {button.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Map Placeholder */}
                        {showMap && mapLocation && (
                            <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
                                <h3 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Find Us</h3>
                                <div className="flex h-48 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
                                    <div className="text-center text-slate-500 dark:text-slate-400">
                                        <svg className="mx-auto mb-2 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm">Map integration for: {mapLocation}</p>
                                        <p className="text-xs">Replace with actual map component</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
