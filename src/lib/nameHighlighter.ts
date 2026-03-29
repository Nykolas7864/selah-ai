import { getAllGlossaryNames, findGlossaryEntry } from '@/data/glossary';

export interface TextSegment {
  text: string;
  isName: boolean;
  glossaryName?: string; // canonical glossary name for lookup
}

/**
 * Scans text left-to-right and splits it into segments, marking glossary
 * names with word-boundary checks so partial matches (e.g. "Daniels") are skipped.
 */
export function highlightNames(text: string): TextSegment[] {
  if (!text) return [{ text: '', isName: false }];

  const names = getAllGlossaryNames(); // already sorted longest-first
  const segments: TextSegment[] = [];
  let i = 0;
  let plainAccum = '';

  while (i < text.length) {
    let matched = false;

    for (const name of names) {
      if (i + name.length > text.length) continue;

      // Case-insensitive check
      const slice = text.slice(i, i + name.length);
      if (slice.toLowerCase() !== name.toLowerCase()) continue;

      // Word-boundary check — char before must be non-alphanumeric (or start)
      if (i > 0) {
        const before = text[i - 1]!;
        if (/[a-zA-Z0-9]/.test(before)) continue;
      }

      // Word-boundary check — char after must be non-alphanumeric (or end)
      const afterIdx = i + name.length;
      if (afterIdx < text.length) {
        const after = text[afterIdx]!;
        if (/[a-zA-Z0-9]/.test(after)) continue;
      }

      // We have a match — flush plain accumulator first
      if (plainAccum) {
        segments.push({ text: plainAccum, isName: false });
        plainAccum = '';
      }

      const entry = findGlossaryEntry(name);
      segments.push({
        text: slice,
        isName: true,
        glossaryName: entry?.name ?? name,
      });

      i += name.length;
      matched = true;
      break;
    }

    if (!matched) {
      plainAccum += text[i];
      i++;
    }
  }

  if (plainAccum) {
    segments.push({ text: plainAccum, isName: false });
  }

  return segments.length > 0 ? segments : [{ text: '', isName: false }];
}
