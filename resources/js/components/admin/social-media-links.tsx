import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Facebook, Globe, Instagram, Twitter, Youtube } from 'lucide-react';

interface SocialMediaLink {
    platform: string;
    url: string;
}

interface SocialMediaLinksProps {
    value: SocialMediaLink[];
    onChange: (links: SocialMediaLink[]) => void;
    className?: string;
}

const socialPlatforms = [
    {
        key: 'facebook',
        label: 'Facebook',
        icon: Facebook,
        color: 'text-blue-600',
        placeholder: 'https://facebook.com/username',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        icon: Instagram,
        color: 'text-pink-600',
        placeholder: 'https://instagram.com/username',
    },
    {
        key: 'twitter',
        label: 'Twitter',
        icon: Twitter,
        color: 'text-blue-400',
        placeholder: 'https://twitter.com/username',
    },
    {
        key: 'youtube',
        label: 'YouTube',
        icon: Youtube,
        color: 'text-red-600',
        placeholder: 'https://youtube.com/@username',
    },
    {
        key: 'website',
        label: 'Website',
        icon: Globe,
        color: 'text-green-600',
        placeholder: 'https://website.com',
    },
];

export function SocialMediaLinks({ value, onChange, className = '' }: SocialMediaLinksProps) {
    const handleLinkChange = (platform: string, url: string) => {
        const links = [...value];
        const existingIndex = links.findIndex((link) => link.platform === platform);

        if (existingIndex >= 0) {
            if (url) {
                links[existingIndex].url = url;
            } else {
                links.splice(existingIndex, 1);
            }
        } else if (url) {
            links.push({ platform, url });
        }

        onChange(links);
    };

    const getLinkValue = (platform: string) => {
        const link = value.find((link) => link.platform === platform);
        return link?.url || '';
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Link Media Sosial</Label>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tambahkan link media sosial komunitas (opsional)</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    const linkValue = getLinkValue(platform.key);

                    return (
                        <div key={platform.key} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <IconComponent className={`h-5 w-5 ${platform.color}`} />
                                <Label htmlFor={`social_${platform.key}`} className="text-sm font-medium text-zinc-600 capitalize dark:text-zinc-400">
                                    {platform.label}
                                </Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id={`social_${platform.key}`}
                                    type="url"
                                    value={linkValue}
                                    onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                                    placeholder={platform.placeholder}
                                    className="border-zinc-200 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                                />
                                {linkValue && (
                                    <a
                                        href={linkValue}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {value.length > 0 && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <span className="font-medium">{value.length}</span> platform media sosial telah ditambahkan
                    </p>
                </div>
            )}
        </div>
    );
}
