import { describe, it, expect } from 'vitest';
import { highlightNames } from '@/lib/nameHighlighter';

describe('highlightNames', () => {
  it('returns a single plain segment for text with no names', () => {
    const result = highlightNames('The sky is blue.');
    expect(result).toHaveLength(1);
    expect(result[0]!.isName).toBe(false);
    expect(result[0]!.text).toBe('The sky is blue.');
  });

  it('returns empty segment for empty string', () => {
    const result = highlightNames('');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('');
  });

  it('detects a biblical name in context', () => {
    const result = highlightNames('God told Moses to lead the people.');
    const nameSegment = result.find((s) => s.isName);
    expect(nameSegment).toBeDefined();
    expect(nameSegment!.text.toLowerCase()).toBe('moses');
  });

  it('does NOT match partial word — "Daniels" should not match Daniel', () => {
    const result = highlightNames('Read the Daniels account.');
    const nameSegment = result.find((s) => s.isName);
    expect(nameSegment).toBeUndefined();
  });

  it('is case-insensitive', () => {
    const result = highlightNames('The story of MOSES continues.');
    const nameSegment = result.find((s) => s.isName);
    expect(nameSegment).toBeDefined();
    expect(nameSegment!.isName).toBe(true);
  });

  it('detects multiple names in one string', () => {
    const result = highlightNames('Abraham and Sarah left Ur.');
    const nameSegments = result.filter((s) => s.isName);
    expect(nameSegments.length).toBeGreaterThanOrEqual(2);
    const names = nameSegments.map((s) => s.text.toLowerCase());
    expect(names).toContain('abraham');
    expect(names).toContain('sarah');
  });

  it('sets glossaryName to canonical entry name', () => {
    const result = highlightNames('Moses spoke to Pharaoh.');
    const mosesSegment = result.find((s) => s.isName && s.text.toLowerCase() === 'moses');
    expect(mosesSegment).toBeDefined();
    expect(mosesSegment!.glossaryName).toBe('Moses');
  });

  it('handles text that is entirely a name', () => {
    const result = highlightNames('Moses');
    expect(result.some((s) => s.isName)).toBe(true);
  });
});
