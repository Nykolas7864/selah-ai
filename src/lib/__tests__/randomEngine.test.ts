import { describe, it, expect, beforeEach } from 'vitest';
import { generateRandomSeeds, markSeedsAsDisplayed, clearSeenSeeds } from '@/lib/randomEngine';
import { BIBLE_BOOKS } from '@/data/books';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
});

describe('generateRandomSeeds', () => {
  it('returns the requested number of seeds', () => {
    const seeds = generateRandomSeeds(2);
    expect(seeds).toHaveLength(2);
  });

  it('returns seeds with unique keys within the batch', () => {
    const seeds = generateRandomSeeds(2);
    const keys = seeds.map((s) => s.key);
    expect(new Set(keys).size).toBe(2);
  });

  it('returns seeds with valid book names', () => {
    const validBooks = new Set(BIBLE_BOOKS.map((b) => b.name));
    const seeds = generateRandomSeeds(3);
    seeds.forEach((seed) => {
      expect(validBooks.has(seed.book)).toBe(true);
    });
  });

  it('returns seeds with valid chapter numbers', () => {
    const bookMap = new Map(BIBLE_BOOKS.map((b) => [b.name, b]));
    const seeds = generateRandomSeeds(3);
    seeds.forEach((seed) => {
      const book = bookMap.get(seed.book)!;
      expect(seed.chapter).toBeGreaterThanOrEqual(1);
      expect(seed.chapter).toBeLessThanOrEqual(book.chapters);
    });
  });

  it('returns seeds with valid topics from the book', () => {
    const bookMap = new Map(BIBLE_BOOKS.map((b) => [b.name, b]));
    const seeds = generateRandomSeeds(3);
    seeds.forEach((seed) => {
      const book = bookMap.get(seed.book)!;
      expect(book.topics).toContain(seed.topic);
    });
  });
});

describe('markSeedsAsDisplayed', () => {
  it('writes seed keys to localStorage', () => {
    const seeds = generateRandomSeeds(2);
    markSeedsAsDisplayed(seeds);
    const raw = localStorageMock.getItem('selah-seen-seeds');
    expect(raw).not.toBeNull();
    const stored = JSON.parse(raw!) as string[];
    seeds.forEach((seed) => {
      expect(stored).toContain(seed.key);
    });
  });
});

describe('clearSeenSeeds', () => {
  it('removes the seen seeds from localStorage', () => {
    const seeds = generateRandomSeeds(1);
    markSeedsAsDisplayed(seeds);
    expect(localStorageMock.getItem('selah-seen-seeds')).not.toBeNull();
    clearSeenSeeds();
    expect(localStorageMock.getItem('selah-seen-seeds')).toBeNull();
  });
});
