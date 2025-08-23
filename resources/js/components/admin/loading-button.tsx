import { Button } from '@/components/ui/button';
import { Edit2, Eye, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import React from 'react';

interface LoadingButtonProps {
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    icon?: 'save' | 'view' | 'plus' | 'edit' | 'delete' | React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function LoadingButton({
    loading = false,
    loadingText,
    children,
    type = 'button',
    variant = 'default',
    size = 'default',
    icon,
    className = '',
    disabled = false,
    onClick,
    ...props
}: LoadingButtonProps) {
    const renderIcon = () => {
        if (loading) {
            return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
        }

        if (!icon) return null;

        if (React.isValidElement(icon)) {
            return <span className="mr-2">{icon}</span>;
        }

        const iconMap = {
            save: <Save className="mr-2 h-4 w-4" />,
            view: <Eye className="mr-2 h-4 w-4" />,
            plus: <Plus className="mr-2 h-4 w-4" />,
            edit: <Edit2 className="mr-2 h-4 w-4" />,
            delete: <Trash2 className="mr-2 h-4 w-4" />,
        };

        return iconMap[icon as keyof typeof iconMap] || null;
    };

    return (
        <Button type={type} variant={variant} size={size} className={className} disabled={disabled || loading} onClick={onClick} {...props}>
            {renderIcon()}
            {loading && loadingText ? loadingText : children}
        </Button>
    );
}
