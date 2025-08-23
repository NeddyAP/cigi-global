export interface StatusBadgeProps {
    status: 'active' | 'inactive' | 'published' | 'draft' | 'featured' | 'normal' | string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline';
    customColors?: Record<string, string>;
}

export function StatusBadge({ status, size = 'md', variant = 'solid', customColors }: StatusBadgeProps) {
    const defaultColors = {
        active: 'bg-green-500/20 text-green-400 border-green-500/30',
        inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
        published: 'bg-green-500/20 text-green-400 border-green-500/30',
        draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        featured: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        normal: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        // Community club types
        olahraga: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        keagamaan: 'bg-green-500/20 text-green-400 border-green-500/30',
        lingkungan: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        sosial: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        budaya: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        pendidikan: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        kesehatan: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        // News categories
        bisnis: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        komunitas: 'bg-green-500/20 text-green-400 border-green-500/30',
        umum: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        pengumuman: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        acara: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        prestasi: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };

    const colors = { ...defaultColors, ...customColors };
    const statusKey = status.toLowerCase() as keyof typeof colors;
    const colorClass = colors[statusKey] || colors.normal;

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base',
    };

    const baseClasses = `inline-flex items-center rounded-full font-medium border ${
        variant === 'outline' ? 'bg-transparent border-current' : colorClass
    } ${sizeClasses[size]}`;

    // Capitalize first letter for display
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);

    return <span className={baseClasses}>{displayText}</span>;
}
