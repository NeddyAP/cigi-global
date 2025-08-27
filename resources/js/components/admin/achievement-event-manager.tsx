import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Trophy } from 'lucide-react';
import { EditableCard, InfoCard } from './info-card';

interface AchievementEvent {
    title: string;
    date: string;
    description: string;
    image?: string;
}

interface AchievementEventManagerProps {
    title: string;
    description: string;
    value: AchievementEvent[];
    onChange: (value: AchievementEvent[]) => void;
    maxItems?: number;
    className?: string;
}

export function AchievementEventManager({ title, description, value, onChange, maxItems = 3, className = '' }: AchievementEventManagerProps) {
    const handleAdd = () => {
        if (value.length < maxItems) {
            onChange([...value, { title: '', date: '', description: '' }]);
        }
    };

    const handleRemove = (index: number) => {
        const newItems = [...value];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    const handleChange = (index: number, field: keyof AchievementEvent, newValue: string) => {
        const newItems = [...value];
        if (!newItems[index]) {
            newItems[index] = { title: '', date: '', description: '' };
        }
        newItems[index][field] = newValue;
        onChange(newItems);
    };

    const canAdd = value.length < maxItems;
    const isTrophy = title.toLowerCase().includes('prestasi') || title.toLowerCase().includes('achievement');

    return (
        <InfoCard
            title={title}
            description={description}
            onAdd={canAdd ? handleAdd : undefined}
            addButtonText={`+ Tambah ${isTrophy ? 'Prestasi' : 'Event'} Baru`}
            className={className}
        >
            <div className="space-y-4">
                {value.map((item, index) => (
                    <EditableCard key={index} index={index} title={isTrophy ? 'Prestasi' : 'Event'} onRemove={() => handleRemove(index)}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    {isTrophy ? 'Judul Prestasi' : 'Judul Event'}
                                </Label>
                                <Input
                                    value={item.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    placeholder={isTrophy ? 'Juara 1 Turnamen Regional' : 'Turnamen Bulutangkis'}
                                    className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tanggal</Label>
                                <Input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                                    className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Deskripsi</Label>
                            <Textarea
                                value={item.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                placeholder={`Deskripsi ${isTrophy ? 'prestasi' : 'event'} ini...`}
                                rows={2}
                                className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                            />
                        </div>
                    </EditableCard>
                ))}

                {value.length === 0 && (
                    <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                        <div className="mb-3 flex justify-center">
                            {isTrophy ? (
                                <Trophy className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                            ) : (
                                <Calendar className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                            )}
                        </div>
                        <p className="text-sm">Belum ada {isTrophy ? 'prestasi' : 'event'} yang ditambahkan</p>
                        <p className="mt-1 text-xs">Klik tombol di bawah untuk menambahkan {isTrophy ? 'prestasi' : 'event'} pertama</p>
                    </div>
                )}
            </div>
        </InfoCard>
    );
}
