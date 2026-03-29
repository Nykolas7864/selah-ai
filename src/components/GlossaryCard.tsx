import type { GlossaryEntry } from '@/types';

interface GlossaryCardProps {
  entry: GlossaryEntry;
  onNameClick?: (name: string) => void;
}

const testamentBadge = {
  OT: 'bg-olive-100 text-olive-700',
  NT: 'bg-wine-100 text-wine-700',
  Both: 'bg-gold-100 text-gold-700',
};

export default function GlossaryCard({ entry, onNameClick }: GlossaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-parchment-200 shadow-sm p-5">
      {/* Name row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-serif text-lg font-semibold text-olive-900">
          {entry.name}
        </h3>
        {entry.nameMeaning && (
          <span className="font-sans text-sm italic text-olive-500">
            ({entry.nameMeaning})
          </span>
        )}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${testamentBadge[entry.testament]}`}
        >
          {entry.testament === 'Both' ? 'OT & NT' : entry.testament}
        </span>
      </div>

      {/* Summary */}
      <p className="font-sans text-sm text-olive-700 leading-relaxed mb-3">
        {entry.summary}
      </p>

      {/* Key Relationships */}
      {entry.keyRelationships.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {entry.keyRelationships.map((rel, i) => (
            <button
              key={i}
              onClick={() => onNameClick?.(rel.name)}
              className="
                bg-parchment-200 text-olive-600 rounded-full px-2 py-0.5
                text-xs cursor-pointer hover:bg-parchment-300 transition-colors
              "
            >
              {rel.relationship}: {rel.name}
            </button>
          ))}
        </div>
      )}

      {/* Key Verses */}
      {entry.keyVerses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.keyVerses.map((verse, i) => (
            <span key={i} className="text-xs text-olive-400 font-sans">
              {verse}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
