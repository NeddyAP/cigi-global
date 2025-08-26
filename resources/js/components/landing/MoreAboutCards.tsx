interface MoreAboutCard {
    title: string;
    description: string;
}

interface MoreAboutCardsProps {
    cards: MoreAboutCard[];
    className?: string;
}

export default function MoreAboutCards({ cards, className = '' }: MoreAboutCardsProps) {
    if (!cards || cards.length === 0) {
        return null;
    }

    return (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">{card.description}</p>
                </div>
            ))}
        </div>
    );
}
