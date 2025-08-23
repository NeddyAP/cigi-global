import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import React from 'react';

interface InfoItemProps {
    label: string;
    value?: string | number | React.ReactNode;
    type?: 'text' | 'email' | 'phone' | 'url' | 'date' | 'datetime' | 'multiline';
    icon?: React.ReactNode;
    copyable?: boolean;
    className?: string;
    emptyState?: string;
}

export function InfoItem({ label, value, type = 'text', icon, copyable = false, className = '', emptyState = '-' }: InfoItemProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        if (typeof value === 'string' || typeof value === 'number') {
            await navigator.clipboard.writeText(String(value));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatValue = () => {
        if (!value && value !== 0) {
            return <span className="text-zinc-400 italic">{emptyState}</span>;
        }

        switch (type) {
            case 'email':
                return (
                    <a href={`mailto:${value}`} className="text-amber-400 transition-colors hover:text-amber-300">
                        {value}
                    </a>
                );
            case 'phone':
                return (
                    <a href={`tel:${value}`} className="text-amber-400 transition-colors hover:text-amber-300">
                        {value}
                    </a>
                );
            case 'url':
                return (
                    <a
                        href={String(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-amber-400 transition-colors hover:text-amber-300"
                    >
                        {value}
                        <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                );
            case 'date':
                return new Date(String(value)).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            case 'datetime':
                return new Date(String(value)).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            case 'multiline':
                return <span className="break-words whitespace-pre-wrap">{value}</span>;
            default:
                return value;
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-zinc-400">
                    {icon && <span className="mr-2">{icon}</span>}
                    {label}
                </label>
                {copyable && value && (
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-300">
                        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                )}
            </div>
            <div className="text-sm text-zinc-300">{formatValue()}</div>
        </div>
    );
}

interface InfoGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3;
    className?: string;
}

export function InfoGrid({ children, cols = 2, className = '' }: InfoGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    };

    return <div className={`grid gap-4 ${gridCols[cols]} ${className}`}>{children}</div>;
}
