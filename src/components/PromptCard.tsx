import { useState } from 'react';
import type { GeneratedPrompt } from '@/types';
import VerseDisplay from './VerseDisplay';

interface PromptCardProps {
  prompt: GeneratedPrompt;
  /** If true, card starts in compact mode (only main question visible) */
  compact?: boolean;
}

/**
 * Expandable card displaying a generated Bible study prompt.
 *
 * Compact state: Shows main question + book/topic tag + "Explore deeper" CTA.
 * Expanded state: Reveals context, primary verse, sub-questions with verse references.
 *
 * Design direction: warm parchment card, serif headings, subtle shadow,
 * olive/gold accent for topic tags.
 */
export default function PromptCard({ prompt, compact = true }: PromptCardProps) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <article
      className={`
        bg-white rounded-2xl border border-parchment-200 shadow-sm
        transition-all duration-300 overflow-hidden
        ${!expanded ? 'hover:shadow-md hover:border-parchment-300 cursor-pointer' : 'shadow-md'}
      `}
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className="p-6">
        {/* Topic + Book tag */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-3 py-1 bg-olive-100 text-olive-700 rounded-full text-xs font-sans font-medium">
            {prompt.seed.book}
          </span>
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-xs font-sans font-medium">
            {prompt.seed.topic}
          </span>
        </div>

        {/* Main question */}
        <h2 className="font-serif text-lg leading-relaxed text-olive-900 mb-2">
          {prompt.mainQuestion}
        </h2>

        {/* Primary reference (always visible) */}
        <p className="text-sm text-olive-500 font-sans">
          {prompt.primaryReference}
        </p>

        {!expanded && (
          <p className="mt-4 text-sm text-gold-600 font-sans font-medium">
            Tap to explore deeper &rarr;
          </p>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Context paragraph */}
            <p className="text-olive-700 font-sans leading-relaxed">
              {prompt.context}
            </p>

            {/* Primary verse display */}
            {prompt.primaryVerseText && (
              <VerseDisplay
                reference={prompt.primaryReference}
                text={prompt.primaryVerseText}
                bibleGatewayUrl={prompt.primaryBibleGatewayUrl}
              />
            )}

            {/* Sub-questions */}
            {prompt.subQuestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-base font-semibold text-olive-800">
                  Go Deeper
                </h3>
                {prompt.subQuestions.map((sq, i) => (
                  <div
                    key={i}
                    className="pl-4 border-l-2 border-gold-300 space-y-1"
                  >
                    <p className="font-sans text-olive-800 leading-relaxed">
                      {sq.question}
                    </p>
                    {sq.verseReference && (
                      <p className="text-xs text-olive-500 font-sans">
                        {sq.verseReference}
                      </p>
                    )}
                    {sq.verseText && sq.bibleGatewayUrl && (
                      <VerseDisplay
                        reference={sq.verseReference ?? ''}
                        text={sq.verseText}
                        bibleGatewayUrl={sq.bibleGatewayUrl}
                        small
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Collapse button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              className="text-sm text-olive-400 hover:text-olive-600 font-sans transition-colors"
            >
              &larr; Collapse
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
