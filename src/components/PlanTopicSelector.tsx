import { PLAN_TOPICS } from '@/types';

interface PlanTopicSelectorProps {
  selected: string[];
  onChange: (topics: string[]) => void;
}

export default function PlanTopicSelector({ selected, onChange }: PlanTopicSelectorProps) {
  const toggle = (topic: string) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((t) => t !== topic));
    } else {
      onChange([...selected, topic]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PLAN_TOPICS.map((topic) => {
        const active = selected.includes(topic);
        return (
          <button
            key={topic}
            type="button"
            onClick={() => toggle(topic)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-colors
              ${active
                ? 'bg-olive-600 text-white shadow-sm'
                : 'bg-parchment-100 text-olive-600 hover:bg-parchment-200 border border-parchment-300'
              }
            `}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
