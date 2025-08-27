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
        <div
            className={`overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900 ${className}`}
        >
            <div
                className={`border-b border-zinc-200/60 bg-gradient-to-r from-zinc-50 to-white px-6 py-5 dark:border-zinc-600/60 dark:from-zinc-800/50 dark:to-zinc-700/50 ${
                    collapsible ? 'cursor-pointer hover:from-zinc-100 hover:to-zinc-50 dark:hover:from-zinc-700/70 dark:hover:to-zinc-600/70' : ''
                }`}
                onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h3>
                            {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
                        </div>
                    </div>
                    {collapsible && (
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:border-zinc-500 dark:hover:bg-zinc-600 dark:hover:text-zinc-300"
                        >
                            <svg
                                className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
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
            {!isCollapsed && <div className="space-y-6 px-6 py-6">{children}</div>}
        </div>
    );
}
