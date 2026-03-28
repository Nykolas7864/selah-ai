import type {
  GeneratedPrompt,
  GeneratePromptsResponse,
  PromptSeed,
} from '@/types';
import type { StudyTopic } from '@/data/books';

/**
 * Base URL for Netlify Functions.
 * In dev: proxied through netlify dev (port 8888)
 * In prod: /.netlify/functions/ (handled by netlify.toml redirect)
 */
const API_BASE = '/api';

/**
 * Fetch generated prompts from the backend using random seeds.
 * Used by the Home (Daily) view.
 */
export async function generatePromptsFromSeeds(
  seeds: PromptSeed[]
): Promise<GeneratedPrompt[]> {
  const response = await fetch(`${API_BASE}/generate-prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seeds }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(
      (errBody as { error?: string }).error ?? `API error: ${response.status}`
    );
  }

  const data = (await response.json()) as GeneratePromptsResponse;

  if (data.error) {
    throw new Error(data.error);
  }

  return data.prompts;
}

/**
 * Fetch generated prompts from the backend using user-curated selections.
 * Used by the Explore view.
 */
export async function generateExplorePrompts(options: {
  book?: string;
  topic?: StudyTopic;
  customQuery?: string;
}): Promise<GeneratedPrompt[]> {
  const response = await fetch(`${API_BASE}/generate-prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      book: options.book,
      topic: options.topic,
      customQuery: options.customQuery,
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(
      (errBody as { error?: string }).error ?? `API error: ${response.status}`
    );
  }

  const data = (await response.json()) as GeneratePromptsResponse;

  if (data.error) {
    throw new Error(data.error);
  }

  return data.prompts;
}
