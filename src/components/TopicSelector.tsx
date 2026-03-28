import { ALL_TOPICS, type StudyTopic } from '@/data/books';

interface TopicSelectorProps {
  value: StudyTopic | 'Any';
  onChange: (value: StudyTopic | 'Any') => void;
  /** Optionally restrict to only topics relevant to a specific book */
  availableTopics?: StudyTopic[];
}

/**
 * Visual topic selector using clickable chips/pills.
 * More visually scannable than a dropdown for this use case.
 */
export default function TopicSelector({
  value,
  onChange,
  availableTopics,
}: TopicSelectorProps) {
  const topics = availableTopics ?? ALL_TOPICS;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-sans font-medium text-olive-700">
        Topic
      </label>
      <div className="flex flex-wrap gap-2">
        {/* "Any" chip */}
        <button
          onClick={() => onChange('Any')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-all
            ${
              value === 'Any'
                ? 'bg-olive-600 text-white shadow-sm'
                : 'bg-parchment-100 text-olive-600 hover:bg-parchment-200 border border-parchment-300'
            }
          `}
        >
          Any Topic
        </button>

        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onChange(topic)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-all
              ${
                value === topic
                  ? 'bg-olive-600 text-white shadow-sm'
                  : 'bg-parchment-100 text-olive-600 hover:bg-parchment-200 border border-parchment-300'
              }
            `}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
