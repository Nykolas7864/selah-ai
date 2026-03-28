import { useState, useEffect, useCallback } from 'react';
import type { AppView } from '@/types';
import type { GeneratedPrompt } from '@/types';
import Header from '@/components/Header';
import PromptCard from '@/components/PromptCard';
import ExplorePanel from '@/components/ExplorePanel';
import LoadingState from '@/components/LoadingState';
import { generateRandomSeeds, markSeedsAsDisplayed } from '@/lib/randomEngine';
import { generatePromptsFromSeeds } from '@/lib/api';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [dailyPrompts, setDailyPrompts] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load daily prompts on mount.
   * Generates 2 random seeds, sends them to the API, and marks them as seen.
   */
  const loadDailyPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const seeds = generateRandomSeeds(2);
      const prompts = await generatePromptsFromSeeds(seeds);
      setDailyPrompts(prompts);
      markSeedsAsDisplayed(seeds);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load prompts'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDailyPrompts();
  }, [loadDailyPrompts]);

  return (
    <div className="min-h-screen bg-parchment-50">
      <Header currentView={view} onNavigate={setView} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {view === 'home' && (
          <div className="space-y-6">
            {/* Welcome message */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-serif text-2xl text-olive-800">
                Pause. Reflect. Go Deeper.
              </h2>
              <p className="font-sans text-sm text-olive-500 max-w-md mx-auto">
                Two fresh study prompts, drawn from across Scripture.
                Tap one to begin your study.
              </p>
            </div>

            {/* Loading / Error / Prompts */}
            {loading && <LoadingState />}

            {error && (
              <div className="bg-wine-50 border border-wine-200 rounded-xl p-4 text-center space-y-3">
                <p className="text-wine-700 font-sans text-sm">{error}</p>
                <button
                  onClick={loadDailyPrompts}
                  className="text-sm font-sans text-gold-600 hover:text-gold-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && dailyPrompts.map((prompt, i) => (
              <PromptCard key={i} prompt={prompt} compact />
            ))}

            {/* Refresh button */}
            {!loading && !error && (
              <div className="text-center pt-4">
                <button
                  onClick={loadDailyPrompts}
                  className="
                    font-sans text-sm text-olive-400 hover:text-olive-600
                    underline underline-offset-4 transition-colors
                  "
                >
                  Generate new prompts
                </button>
              </div>
            )}

            {/* ESV attribution */}
            <footer className="text-center pt-8">
              <p className="font-sans text-xs text-olive-300 max-w-sm mx-auto">
                Scripture quotations are from the ESV&reg; Bible (The Holy Bible,
                English Standard Version&reg;), copyright &copy; 2001 by Crossway,
                a publishing ministry of Good News Publishers.
              </p>
            </footer>
          </div>
        )}

        {view === 'explore' && <ExplorePanel />}
      </main>
    </div>
  );
}
