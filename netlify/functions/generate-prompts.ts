import type { Context } from '@netlify/functions';
import { generateStudyPrompt } from './utils/anthropic';
import { fetchVerseText } from './utils/esv';

/**
 * Netlify Function: generate-prompts
 *
 * Accepts POST with either:
 * 1. { seeds: [{ book, chapter, topic }] } — for home page random prompts
 * 2. { book?, topic?, customQuery? } — for Explore curated prompts
 *
 * Returns: { prompts: GeneratedPrompt[] }
 */

interface PromptSeed {
  book: string;
  chapter: number;
  topic: string;
  key: string;
}

interface ExploreRequest {
  book?: string;
  topic?: string;
  customQuery?: string;
}

type RequestBody =
  | { seeds: PromptSeed[] }
  | ExploreRequest;

function isSeedRequest(body: RequestBody): body is { seeds: PromptSeed[] } {
  return 'seeds' in body && Array.isArray(body.seeds);
}

/**
 * Build a BibleGateway URL from a reference string.
 */
function buildBibleGatewayUrl(reference: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=ESV`;
}

export default async (req: Request, _context: Context) => {
  // Only POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as RequestBody;

    let prompts;

    if (isSeedRequest(body)) {
      // Home page: generate from seeds
      prompts = await Promise.all(
        body.seeds.map(async (seed) => {
          const result = await generateStudyPrompt(
            seed.book,
            seed.chapter,
            seed.topic
          );

          // Fetch verse text for primary reference + sub-question references
          const primaryVerseText = await fetchVerseText(result.primaryReference);

          const subQuestions = await Promise.all(
            result.subQuestions.map(async (sq) => ({
              question: sq.question,
              verseReference: sq.verseReference,
              verseText: sq.verseReference
                ? await fetchVerseText(sq.verseReference)
                : undefined,
              bibleGatewayUrl: sq.verseReference
                ? buildBibleGatewayUrl(sq.verseReference)
                : undefined,
            }))
          );

          return {
            seed,
            mainQuestion: result.mainQuestion,
            context: result.context,
            primaryReference: result.primaryReference,
            primaryVerseText: primaryVerseText ?? undefined,
            primaryBibleGatewayUrl: buildBibleGatewayUrl(result.primaryReference),
            subQuestions,
          };
        })
      );
    } else {
      // Explore: generate from user selections
      const book = body.book ?? 'Psalms';
      const topic = body.topic ?? 'Theology & Doctrine';

      // Randomize chapter based on the book's actual chapter count
      const chapterCounts: Record<string, number> = {
        'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
        'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
        '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
        'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
        'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
        'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
        'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
        'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
        'Zechariah': 14, 'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24,
        'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16,
        '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6, 'Philippians': 4,
        'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
        '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1,
        'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3,
        '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22,
      };
      const maxChapter = chapterCounts[book] ?? 10;
      const chapter = Math.floor(Math.random() * maxChapter) + 1;

      const result = await generateStudyPrompt(
        book,
        chapter,
        topic,
        body.customQuery
      );

      const primaryVerseText = await fetchVerseText(result.primaryReference);

      const subQuestions = await Promise.all(
        result.subQuestions.map(async (sq) => ({
          question: sq.question,
          verseReference: sq.verseReference,
          verseText: sq.verseReference
            ? await fetchVerseText(sq.verseReference)
            : undefined,
          bibleGatewayUrl: sq.verseReference
            ? buildBibleGatewayUrl(sq.verseReference)
            : undefined,
        }))
      );

      prompts = [
        {
          seed: { book, chapter, topic, key: `${book}-${chapter}-${topic}` },
          mainQuestion: result.mainQuestion,
          context: result.context,
          primaryReference: result.primaryReference,
          primaryVerseText: primaryVerseText ?? undefined,
          primaryBibleGatewayUrl: buildBibleGatewayUrl(result.primaryReference),
          subQuestions,
        },
      ];
    }

    return new Response(JSON.stringify({ prompts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('generate-prompts error:', err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
