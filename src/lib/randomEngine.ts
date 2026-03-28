import { BIBLE_BOOKS, type BibleBook, type StudyTopic } from '@/data/books';
import type { PromptSeed } from '@/types';

/**
 * localStorage key for tracking recently seen prompt seeds.
 * Stores a JSON array of seed key strings.
 */
const SEEN_SEEDS_KEY = 'selah-seen-seeds';

/** Maximum number of seen seeds to track before oldest are trimmed */
const MAX_SEEN_SEEDS = 100;

/** Maximum re-roll attempts to avoid a recently seen seed */
const MAX_REROLL_ATTEMPTS = 5;

/**
 * Generate a random integer between min (inclusive) and max (exclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Pick a random element from an array.
 */
function randomPick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)]!;
}

/**
 * Build a unique key string from a seed's components.
 * Used for localStorage deduplication.
 *
 * Example: "genesis-3-symbolism-imagery"
 */
function buildSeedKey(book: string, chapter: number, topic: string): string {
  const normalized = `${book}-${chapter}-${topic}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');
  return normalized;
}

/**
 * Get the list of recently seen seed keys from localStorage.
 */
function getSeenSeeds(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_SEEDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

/**
 * Add a seed key to the seen list in localStorage.
 * Trims oldest entries if the list exceeds MAX_SEEN_SEEDS.
 */
function markSeedAsSeen(key: string): void {
  try {
    const seen = getSeenSeeds();
    seen.push(key);

    // Trim oldest if over limit
    while (seen.length > MAX_SEEN_SEEDS) {
      seen.shift();
    }

    localStorage.setItem(SEEN_SEEDS_KEY, JSON.stringify(seen));
  } catch {
    // localStorage might be full or unavailable — degrade gracefully
    console.warn('Could not write to localStorage');
  }
}

/**
 * Generate a single random prompt seed, avoiding recently seen combinations.
 *
 * @param existingKeys - Keys already generated in this batch (to avoid duplicates within the same load)
 * @returns A PromptSeed ready to send to the API
 */
function generateSeed(existingKeys: Set<string>): PromptSeed {
  const seenSeeds = new Set(getSeenSeeds());

  for (let attempt = 0; attempt < MAX_REROLL_ATTEMPTS; attempt++) {
    const book: BibleBook = randomPick(BIBLE_BOOKS);
    const chapter = randomInt(1, book.chapters + 1); // 1-indexed
    const topic: StudyTopic = randomPick(book.topics);
    const key = buildSeedKey(book.name, chapter, topic);

    // Check for collision with recent seeds OR this batch
    if (!seenSeeds.has(key) && !existingKeys.has(key)) {
      return { book: book.name, chapter, topic, key };
    }
  }

  // Fallback: just pick one even if recently seen (better than nothing)
  const book = randomPick(BIBLE_BOOKS);
  const chapter = randomInt(1, book.chapters + 1);
  const topic = randomPick(book.topics);
  const key = buildSeedKey(book.name, chapter, topic);

  return { book: book.name, chapter, topic, key };
}

/**
 * Generate a batch of unique prompt seeds for the home page.
 *
 * @param count - Number of seeds to generate (default: 2)
 * @returns Array of PromptSeeds
 */
export function generateRandomSeeds(count = 2): PromptSeed[] {
  const seeds: PromptSeed[] = [];
  const batchKeys = new Set<string>();

  for (let i = 0; i < count; i++) {
    const seed = generateSeed(batchKeys);
    seeds.push(seed);
    batchKeys.add(seed.key);
  }

  return seeds;
}

/**
 * Mark seeds as seen after they've been displayed to the user.
 * Call this after the prompts are successfully rendered.
 */
export function markSeedsAsDisplayed(seeds: PromptSeed[]): void {
  seeds.forEach((seed) => markSeedAsSeen(seed.key));
}

/**
 * Clear the seen seeds history.
 * Useful for testing or if the user wants a "fresh start".
 */
export function clearSeenSeeds(): void {
  try {
    localStorage.removeItem(SEEN_SEEDS_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Get the count of recently seen seeds (for debug/UI display).
 */
export function getSeenSeedCount(): number {
  return getSeenSeeds().length;
}
