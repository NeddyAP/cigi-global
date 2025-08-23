import React from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    icon?: React.ReactNode;
}

export function FormSection({ title, description, children, className = '', collapsible = false, defaultCollapsed = false, icon }: FormSectionProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    return (
        <div className={`rounded-lg border border-zinc-200 bg-white shadow dark:border-zinc-700 dark:bg-zinc-800 ${className}`}>
            <div
                className={`border-b border-zinc-200 px-6 py-4 dark:border-zinc-700 ${
                    collapsible ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50' : ''
                }`}
                onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-zinc-400">{icon}</span>}
                        <div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{title}</h3>
                            {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
                        </div>
                    </div>
                    {collapsible && (
                        <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                            <svg
                                className={`h-5 w-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {!isCollapsed && <div className="space-y-4 px-6 py-4">{children}</div>}
        </div>
    );
}
