import { highlightNames } from '@/lib/nameHighlighter';

interface HighlightedTextProps {
  text: string;
  onNameClick: (name: string) => void;
  className?: string;
}

export default function HighlightedText({ text, onNameClick, className }: HighlightedTextProps) {
  const segments = highlightNames(text);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.isName ? (
          <span
            key={i}
            className="font-semibold text-gold-700 underline decoration-dotted decoration-gold-400/60 cursor-pointer hover:text-gold-800 hover:decoration-gold-500 transition-colors"
            onClick={() => onNameClick(seg.glossaryName!)}
          >
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
