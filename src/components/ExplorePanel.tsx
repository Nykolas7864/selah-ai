import { useState } from 'react';
import type { GeneratedPrompt } from '@/types';
import type { StudyTopic } from '@/data/books';
import { findBook } from '@/data/books';
import BookSelector from './BookSelector';
import TopicSelector from './TopicSelector';
import PromptCard from './PromptCard';
import ShareButtons from './ShareButtons';
import { generateExplorePrompts } from '@/lib/api';

/**
 * User-curated prompt generation panel.
 * Allows selecting a Book, Topic, and optional custom query
 * to generate tailored Bible study prompts.
 */
export default function ExplorePanel() {
  const [selectedBook, setSelectedBook] = useState<string>('Any');
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic | 'Any'>('Any');
  const [customQuery, setCustomQuery] = useState('');
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a specific book is selected, narrow the topic list
  const bookData = selectedBook !== 'Any' ? findBook(selectedBook) : undefined;
  const availableTopics = bookData?.topics;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateExplorePrompts({
        book: selectedBook === 'Any' ? undefined : selectedBook,
        topic: selectedTopic === 'Any' ? undefined : selectedTopic,
        customQuery: customQuery.trim() || undefined,
      });
      setPrompts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prompts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selection controls */}
      <div className="bg-white rounded-2xl border border-parchment-200 shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-xl text-olive-800">
          Curate Your Study
        </h2>
        <p className="font-sans text-sm text-olive-500 leading-relaxed">
          Choose a book, a topic, or describe what you want to explore.
          The more specific you are, the deeper the prompts will go.
        </p>

        <BookSelector value={selectedBook} onChange={setSelectedBook} />
        <TopicSelector
          value={selectedTopic}
          onChange={setSelectedTopic}
          availableTopics={availableTopics}
        />

        {/* Custom query */}
        <div className="space-y-1">
          <label
            htmlFor="custom-query"
            className="block text-sm font-sans font-medium text-olive-700"
          >
            Custom Focus <span className="text-olive-400">(optional)</span>
          </label>
          <textarea
            id="custom-query"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g., 'The role of oil as a symbol in wisdom literature' or 'Romans 8:28 and suffering'"
            rows={3}
            className="
              w-full px-4 py-3 rounded-xl border border-parchment-300
              bg-parchment-50 text-olive-800 font-sans text-sm
              placeholder:text-olive-300
              focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400
              transition-colors resize-none
            "
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="
            w-full py-3 rounded-xl bg-olive-700 text-white font-sans font-semibold
            hover:bg-olive-800 active:bg-olive-900
            disabled:bg-olive-300 disabled:cursor-not-allowed
            transition-colors
          "
        >
          {loading ? 'Generating...' : 'Generate Prompts'}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-wine-50 border border-wine-200 rounded-xl p-4 text-wine-700 font-sans text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {prompts.length > 0 && (
        <div className="space-y-4">
          {prompts.map((prompt, i) => (
            <PromptCard key={i} prompt={prompt} compact={false} />
          ))}
          <ShareButtons prompts={prompts} />
        </div>
      )}
    </div>
  );
}
