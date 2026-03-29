import { useEffect } from 'react';
import type { GlossaryEntry } from '@/types';

interface FigurePanelProps {
  entry: GlossaryEntry | null;
  onClose: () => void;
}

const testamentBadge = {
  OT: 'bg-olive-100 text-olive-700',
  NT: 'bg-wine-100 text-wine-700',
  Both: 'bg-gold-100 text-gold-700',
};

function PanelContent({ entry, onClose }: { entry: GlossaryEntry; onClose: () => void }) {
  return (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close figure panel"
        className="absolute top-3 right-3 text-olive-400 hover:text-olive-600 transition-colors text-xl leading-none"
      >
        ×
      </button>

      {/* Name */}
      <h2 className="font-serif text-xl font-bold text-olive-900 pr-6">{entry.name}</h2>

      {/* Name meaning */}
      {entry.nameMeaning && (
        <p className="font-sans text-sm italic text-olive-500 mt-1">{entry.nameMeaning}</p>
      )}

      {/* Testament badge */}
      <span
        className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${testamentBadge[entry.testament]}`}
      >
        {entry.testament === 'Both' ? 'OT & NT' : entry.testament}
      </span>

      {/* Summary */}
      <p className="font-sans text-sm text-olive-700 leading-relaxed mt-3">{entry.summary}</p>

      {/* Key Relationships */}
      {entry.keyRelationships.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.keyRelationships.map((rel, i) => (
            <span
              key={i}
              className="bg-parchment-200 text-olive-600 rounded-full px-2 py-0.5 text-xs font-sans"
            >
              {rel.relationship}: {rel.name}
            </span>
          ))}
        </div>
      )}

      {/* Key Verses */}
      {entry.keyVerses.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entry.keyVerses.map((verse, i) => (
            <span key={i} className="text-xs text-olive-400 font-sans">
              {verse}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default function FigurePanel({ entry, onClose }: FigurePanelProps) {
  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (!entry) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [entry]);

  // Close on Escape key
  useEffect(() => {
    if (!entry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <>
      {/* Desktop panel */}
      <div className="hidden md:block fixed right-0 top-20 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white shadow-xl rounded-l-2xl p-6 border-l border-parchment-200 z-20 animate-slideInRight relative">
        <PanelContent entry={entry} onClose={onClose} />
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={onClose}
        />
        {/* Sheet */}
        <div className="fixed inset-x-0 bottom-0 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-t-2xl p-6 z-30 animate-slideUpFromBottom relative">
          <PanelContent entry={entry} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
