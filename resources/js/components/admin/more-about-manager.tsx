import { Label } from '@/components/ui/label';
import { Award, BookOpen, Heart, Lightbulb, Target, Users } from 'lucide-react';
import { EditableCard, InfoCard } from './info-card';

interface MoreAboutItem {
    title: string;
    description: string;
}

interface MoreAboutManagerProps {
    value: MoreAboutItem[];
    onChange: (value: MoreAboutItem[]) => void;
    maxItems?: number;
    className?: string;
}

const defaultItems = [
    { title: 'Misi', description: 'Misi dan tujuan utama komunitas' },
    { title: 'Visi', description: 'Visi dan cita-cita komunitas' },
    { title: 'Nilai-Nilai', description: 'Nilai-nilai yang dianut komunitas' },
    { title: 'Sejarah', description: 'Sejarah berdirinya komunitas' },
    { title: 'Program Unggulan', description: 'Program-program unggulan komunitas' },
    { title: 'Target', description: 'Target dan sasaran komunitas' },
];

export function MoreAboutManager({ value, onChange, maxItems = 6, className = '' }: MoreAboutManagerProps) {
    const handleAdd = () => {
        if (value.length < maxItems) {
            onChange([...value, { title: '', description: '' }]);
        }
    };

    const handleRemove = (index: number) => {
        const newItems = [...value];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    const handleChange = (index: number, field: keyof MoreAboutItem, newValue: string) => {
        const newItems = [...value];
        if (!newItems[index]) {
            newItems[index] = { title: '', description: '' };
        }
        newItems[index][field] = newValue;
        onChange(newItems);
    };

    const handleAddDefault = (defaultItem: MoreAboutItem) => {
        if (value.length < maxItems && !value.find((item) => item.title.toLowerCase() === defaultItem.title.toLowerCase())) {
            onChange([...value, defaultItem]);
        }
    };

    const canAdd = value.length < maxItems;
    const availableDefaults = defaultItems.filter(
        (defaultItem) => !value.find((item) => item.title.toLowerCase() === defaultItem.title.toLowerCase()),
    );

    const getIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('misi')) return Target;
        if (lowerTitle.includes('visi')) return Lightbulb;
        if (lowerTitle.includes('nilai')) return Heart;
        if (lowerTitle.includes('sejarah')) return BookOpen;
        if (lowerTitle.includes('program')) return Award;
        if (lowerTitle.includes('target')) return Target;
        return Users;
    };

    return (
        <InfoCard
            title="Informasi Tambahan"
            description="Tambahkan informasi tambahan seperti misi, visi, nilai-nilai, dll. dalam bentuk card"
            onAdd={canAdd ? handleAdd : undefined}
            addButtonText="+ Tambah Card Baru"
            className={className}
        >
            <div className="space-y-4">
                {value.map((item, index) => {
                    const IconComponent = getIcon(item.title);

                    return (
                        <EditableCard key={index} index={index} title="Card" onRemove={() => handleRemove(index)}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <IconComponent className="h-4 w-4 text-zinc-500" />
                                        <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Judul</Label>
                                    </div>
                                    <input
                                        value={item.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="Contoh: Misi Komunitas"
                                        className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Deskripsi</Label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        placeholder="Deskripsi singkat..."
                                        rows={2}
                                        className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </EditableCard>
                    );
                })}

                {value.length === 0 && (
                    <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                        <div className="mb-3 flex justify-center">
                            <Users className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-sm">Belum ada informasi tambahan yang ditambahkan</p>
                        <p className="mt-1 text-xs">Pilih template di bawah atau buat custom</p>
                    </div>
                )}

                {availableDefaults.length > 0 && (
                    <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                        <h4 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Template Siap Pakai</h4>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {availableDefaults.map((defaultItem, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleAddDefault(defaultItem)}
                                    className="rounded-lg border border-zinc-200 bg-white p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                                >
                                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{defaultItem.title}</div>
                                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{defaultItem.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </InfoCard>
    );
}
