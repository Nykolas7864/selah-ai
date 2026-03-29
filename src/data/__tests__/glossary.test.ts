import { describe, it, expect } from 'vitest';
import { GLOSSARY_ENTRIES, findGlossaryEntry, getAllGlossaryNames } from '@/data/glossary';

describe('GLOSSARY_ENTRIES data integrity', () => {
  it('has at least 100 entries', () => {
    expect(GLOSSARY_ENTRIES.length).toBeGreaterThanOrEqual(100);
  });

  it('every entry has a non-empty name', () => {
    GLOSSARY_ENTRIES.forEach((entry) => {
      expect(entry.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('every entry has a non-empty nameMeaning', () => {
    GLOSSARY_ENTRIES.forEach((entry) => {
      expect(entry.nameMeaning.trim().length).toBeGreaterThan(0);
    });
  });

  it('every entry has a non-empty summary', () => {
    GLOSSARY_ENTRIES.forEach((entry) => {
      expect(entry.summary.trim().length).toBeGreaterThan(0);
    });
  });

  it('every entry has a valid testament', () => {
    GLOSSARY_ENTRIES.forEach((entry) => {
      expect(['OT', 'NT', 'Both']).toContain(entry.testament);
    });
  });

  it('has no duplicate primary names', () => {
    const names = GLOSSARY_ENTRIES.map((e) => e.name.toLowerCase());
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('contains key biblical figures', () => {
    const names = new Set(GLOSSARY_ENTRIES.map((e) => e.name));
    const required = ['Moses', 'Abraham', 'Jesus', 'David', 'Paul'];
    required.forEach((name) => {
      expect(names.has(name)).toBe(true);
    });
  });
});

describe('findGlossaryEntry', () => {
  it('finds entry by primary name (exact)', () => {
    const entry = findGlossaryEntry('Moses');
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('Moses');
  });

  it('finds entry by primary name (case-insensitive)', () => {
    const entry = findGlossaryEntry('moses');
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('Moses');
  });

  it('finds entry by alternate name', () => {
    // Paul has 'Saul of Tarsus' as an alternate name
    const entry = findGlossaryEntry('Saul of Tarsus');
    expect(entry).toBeDefined();
  });

  it('returns undefined for unknown name', () => {
    const entry = findGlossaryEntry('Thingamajig the Unknown');
    expect(entry).toBeUndefined();
  });
});

describe('getAllGlossaryNames', () => {
  it('returns an array with at least as many items as entries', () => {
    const names = getAllGlossaryNames();
    expect(names.length).toBeGreaterThanOrEqual(GLOSSARY_ENTRIES.length);
  });

  it('is sorted longest-first', () => {
    const names = getAllGlossaryNames();
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i]!.length).toBeGreaterThanOrEqual(names[i + 1]!.length);
    }
  });

  it('includes primary names', () => {
    const names = getAllGlossaryNames();
    expect(names).toContain('Moses');
    expect(names).toContain('Abraham');
  });
});
