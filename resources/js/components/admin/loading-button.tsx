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
            return (
                <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-current" />
                </div>
            );
        }

        if (!icon) return null;

        if (React.isValidElement(icon)) {
            return <span className="mr-2 transition-transform duration-200 group-hover:scale-110">{icon}</span>;
        }

        const iconMap = {
            save: <Save className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />,
            view: <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />,
            plus: <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />,
            edit: <Edit2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />,
            delete: <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />,
        };

        return iconMap[icon as keyof typeof iconMap] || null;
    };

    return (
        <Button
            type={type}
            variant={variant}
            size={size}
            className={`group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {renderIcon()}
            <span className="transition-opacity duration-200">{loading && loadingText ? loadingText : children}</span>
        </Button>
    );
}
