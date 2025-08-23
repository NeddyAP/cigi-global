import { FormSection } from '@/components/admin/form-section';
import { LoadingButton } from '@/components/admin/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, GlobalVariable } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Database, Info, Settings } from 'lucide-react';

interface EditGlobalVariableProps {
    variable: GlobalVariable;
}

const variableTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'json', label: 'JSON' },
    { value: 'boolean', label: 'Boolean' },
];

const variableCategories = [
    { value: 'company', label: 'Company Information' },
    { value: 'contact', label: 'Contact Information' },
    { value: 'social', label: 'Social Media' },
    { value: 'general', label: 'General' },
    { value: 'seo', label: 'SEO' },
    { value: 'config', label: 'Configuration' },
];

export default function EditGlobalVariable({ variable }: EditGlobalVariableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Global Variables', href: '/admin/global-variables' },
        { title: variable.key, href: `/admin/global-variables/${variable.id}` },
        { title: 'Edit', href: `/admin/global-variables/${variable.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        key: variable.key || '',
        value: variable.value || '',
        type: variable.type || 'text',
        category: variable.category || 'general',
        description: variable.description || '',
        is_public: variable.is_public ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.global-variables.update', variable.id));
    };

    const getTypeDescription = (type: string) => {
        const descriptions = {
            text: 'Simple text, maximum 255 characters',
            textarea: 'Long text with line breaks',
            number: 'Number (integer or decimal)',
            email: 'Valid email format',
            url: 'Valid URL (http/https)',
            json: 'Data in JSON format',
            boolean: 'True/False (1/0)',
        };
        return descriptions[type as keyof typeof descriptions] || '';
    };

    const renderValueInput = () => {
        switch (data.type) {
            case 'textarea':
                return (
                    <Textarea
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Enter variable value..."
                        rows={4}
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'number':
                return (
                    <Input
                        id="value"
                        type="number"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="0"
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'email':
                return (
                    <Input
                        id="value"
                        type="email"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="user@example.com"
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'url':
                return (
                    <Input
                        id="value"
                        type="url"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="https://example.com"
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'json':
                return (
                    <Textarea
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder='{"key": "value"}'
                        rows={6}
                        className={`border-zinc-700 bg-zinc-800 font-mono text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center space-x-3">
                        <Toggle
                            pressed={data.value === '1'}
                            onPressedChange={(pressed) => setData('value', pressed ? '1' : '0')}
                            aria-label="Boolean Value"
                        >
                            {data.value === '1' ? 'True' : 'False'}
                        </Toggle>
                        <Label className="text-zinc-300">Boolean Value</Label>
                    </div>
                );
            default:
                return (
                    <Input
                        id="value"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Enter variable value..."
                        className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.value ? 'border-red-500' : ''}`}
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${variable.key}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Edit Global Variable</h1>
                        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Edit variable "{variable.key}"</p>
                    </div>
                    <Button variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                        <a href={route('admin.global-variables.show', variable.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Details
                        </a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection title="Basic Information" description="Variable key and category details" icon={<Database className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="key" className="text-zinc-300">
                                    Variable Key *
                                </Label>
                                <Input
                                    id="key"
                                    value={data.key}
                                    onChange={(e) => setData('key', e.target.value)}
                                    placeholder="company_name"
                                    className={`border-zinc-700 bg-zinc-800 font-mono text-white placeholder:text-zinc-400 ${errors.key ? 'border-red-500' : ''}`}
                                />
                                {errors.key && <p className="mt-1 text-sm text-red-400">{errors.key}</p>}
                                <p className="mt-1 text-sm text-zinc-500">Use snake_case format (lowercase with underscores)</p>
                            </div>

                            <div>
                                <Label htmlFor="category" className="text-zinc-300">
                                    Category *
                                </Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className={`w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${errors.category ? 'border-red-500' : ''}`}
                                >
                                    {variableCategories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-zinc-300">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Description of this variable usage"
                                className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="type" className="text-zinc-300">
                                Data Type *
                            </Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className={`w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none ${errors.type ? 'border-red-500' : ''}`}
                            >
                                {variableTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-400">{errors.type}</p>}
                            <p className="mt-1 text-sm text-zinc-500">{getTypeDescription(data.type)}</p>
                        </div>
                    </FormSection>

                    <FormSection title="Variable Value" description="Set the variable value" icon={<Settings className="h-5 w-5" />}>
                        <div>
                            <Label htmlFor="value" className="text-zinc-300">
                                Value {data.type !== 'boolean' && '*'}
                            </Label>
                            {renderValueInput()}
                            {errors.value && <p className="mt-1 text-sm text-red-400">{errors.value}</p>}
                            {data.type === 'json' && (
                                <p className="mt-1 text-sm text-zinc-500">Ensure valid JSON format. Example: {'{"name": "value", "number": 123}'}</p>
                            )}
                        </div>
                    </FormSection>

                    <FormSection title="Access Settings" description="Control variable visibility" icon={<Settings className="h-5 w-5" />}>
                        <div className="flex items-start space-x-3">
                            <Toggle pressed={data.is_public} onPressedChange={(pressed) => setData('is_public', pressed)} aria-label="Public Access">
                                {data.is_public ? 'Public' : 'Private'}
                            </Toggle>
                            <div>
                                <Label className="text-zinc-300">Public Access</Label>
                                <div className="mt-1 flex items-start">
                                    <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-400" />
                                    <p className="text-sm text-zinc-400">
                                        {data.is_public
                                            ? 'This variable can be accessed from frontend and public API'
                                            : 'This variable can only be accessed from backend/admin'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Current vs New Value Comparison */}
                    {variable.value !== data.value && (
                        <div className="rounded-lg border border-yellow-600/30 bg-yellow-500/10 p-6">
                            <div className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-yellow-400" />
                                <div className="w-full">
                                    <h4 className="text-sm font-medium text-yellow-300">Changes Detected</h4>
                                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-200">Current Value:</p>
                                            <p className="mt-1 rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white">
                                                {variable.type === 'boolean'
                                                    ? variable.value === '1'
                                                        ? 'True'
                                                        : 'False'
                                                    : variable.value || '(empty)'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-200">New Value:</p>
                                            <p className="mt-1 rounded border border-zinc-700 bg-zinc-800 p-2 text-sm text-white">
                                                {data.type === 'boolean' ? (data.value === '1' ? 'True' : 'False') : data.value || '(empty)'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg border border-blue-600/30 bg-blue-500/10 p-6">
                        <div className="flex items-start">
                            <Info className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-400" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-300">Variable Information</h4>
                                <div className="mt-2 text-sm text-blue-200">
                                    <p>
                                        <strong>ID:</strong> {variable.id}
                                    </p>
                                    <p>
                                        <strong>Created:</strong>{' '}
                                        {new Date(variable.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                    {variable.updated_at && (
                                        <p>
                                            <strong>Last Updated:</strong>{' '}
                                            {new Date(variable.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" asChild className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                            <a href={route('admin.global-variables.show', variable.id)}>Cancel</a>
                        </Button>
                        <LoadingButton type="submit" loading={processing} loadingText="Saving..." icon="save" className="cta-button">
                            Save Changes
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
