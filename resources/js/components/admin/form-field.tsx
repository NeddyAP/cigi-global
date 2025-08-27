import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'number' | 'url' | 'date' | 'textarea';
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    rows?: number;
    min?: number;
    max?: number;
    className?: string;
}

export function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    rows = 3,
    min,
    max,
    className = '',
}: FormFieldProps) {
    const inputId = `form_${name}`;
    const hasError = !!error;

    const inputClasses = `transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-600'
    } ${className}`;

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <Textarea
                    id={inputId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={inputClasses}
                />
            );
        }

        return (
            <Input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? (e.target.value ? parseInt(e.target.value) : '') : e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className={inputClasses}
            />
        );
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {renderInput()}
            {hasError && (
                <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

interface FormSelectProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    error?: string;
    required?: boolean;
    className?: string;
}

export function FormSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = 'Pilih opsi',
    error,
    required = false,
    className = '',
}: FormSelectProps) {
    const selectId = `form_${name}`;
    const hasError = !!error;

    const selectClasses = `w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
    } ${className}`;

    return (
        <div className="space-y-2">
            <Label htmlFor={selectId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <select id={selectId} value={value} onChange={(e) => onChange(e.target.value)} className={selectClasses}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hasError && (
                <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}
