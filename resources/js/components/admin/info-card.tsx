import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface InfoCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    onAdd?: () => void;
    addButtonText?: string;
    className?: string;
}

export function InfoCard({ title, description, children, onAdd, addButtonText = 'Tambah Baru', className = '' }: InfoCardProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                {description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
            </div>
            <div className="space-y-4">
                {children}
                {onAdd && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onAdd}
                        className="w-full border-2 border-dashed border-zinc-300 bg-zinc-50 py-6 text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <div className="rounded-full bg-zinc-200 p-2 dark:bg-zinc-700">
                                <Plus className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <span className="font-medium">{addButtonText}</span>
                        </div>
                    </Button>
                )}
            </div>
        </div>
    );
}

interface EditableCardProps {
    index: number;
    title: string;
    onRemove: () => void;
    children: React.ReactNode;
    className?: string;
}

export function EditableCard({ index, title, onRemove, children, className = '' }: EditableCardProps) {
    return (
        <div
            className={`space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 ${className}`}
        >
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {title} {index + 1}
                </h4>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRemove}
                    className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            {children}
        </div>
    );
}

interface CardFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'textarea';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

export function CardField({ label, name, type = 'text', value, onChange, placeholder, rows = 2, className = '' }: CardFieldProps) {
    const fieldId = `card_${name}`;

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={fieldId} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {label}
            </Label>
            {type === 'textarea' ? (
                <Textarea
                    id={fieldId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                />
            ) : (
                <Input
                    id={fieldId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                />
            )}
        </div>
    );
}
