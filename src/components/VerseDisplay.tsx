interface VerseDisplayProps {
  reference: string;
  text: string;
  bibleGatewayUrl: string;
  /** Smaller variant for sub-question verse displays */
  small?: boolean;
}

/**
 * Displays a Bible verse with its reference and a link to BibleGateway.
 * Styled as a blockquote with warm accent border.
 */
export default function VerseDisplay({
  reference,
  text,
  bibleGatewayUrl,
  small = false,
}: VerseDisplayProps) {
  return (
    <blockquote
      className={`
        border-l-[3px] border-wine-300 bg-parchment-50 rounded-r-lg
        ${small ? 'pl-3 py-2 pr-3' : 'pl-4 py-3 pr-4'}
      `}
    >
      <p
        className={`
          font-serif italic text-olive-700 leading-relaxed
          ${small ? 'text-sm' : 'text-base'}
        `}
      >
        &ldquo;{text}&rdquo;
      </p>
      <footer className="mt-1 flex items-center justify-between">
        <cite className={`not-italic font-sans text-olive-500 ${small ? 'text-xs' : 'text-sm'}`}>
          &mdash; {reference} (ESV)
        </cite>
        <a
          href={bibleGatewayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            font-sans text-gold-600 hover:text-gold-700 underline underline-offset-2
            ${small ? 'text-xs' : 'text-sm'}
          `}
        >
          Read more
        </a>
      </footer>
    </blockquote>
  );
}
