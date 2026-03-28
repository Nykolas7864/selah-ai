/**
 * ESV Bible API client.
 * Docs: https://api.esv.org/docs/
 *
 * Free tier: 5,000 queries/day, 1,000/hour, 60/min.
 * Attribution required: "Scripture quotations are from the ESV® Bible..."
 */

const ESV_API_BASE = 'https://api.esv.org/v3/passage/text/';

interface ESVPassageResponse {
  query: string;
  canonical: string;
  passages: string[];
}

/**
 * Fetch verse text from the ESV API.
 *
 * @param reference - e.g., "Proverbs 21:20" or "John 3:16-18"
 * @returns The passage text, or null if not found
 */
export async function fetchVerseText(reference: string): Promise<string | null> {
  const apiKey = process.env.ESV_API_KEY;
  if (!apiKey) {
    console.warn('ESV_API_KEY not set — skipping verse fetch');
    return null;
  }

  const params = new URLSearchParams({
    q: reference,
    'include-headings': 'false',
    'include-footnotes': 'false',
    'include-verse-numbers': 'false',
    'include-short-copyright': 'false',
    'include-passage-references': 'false',
    indent: '0',
  });

  try {
    const response = await fetch(`${ESV_API_BASE}?${params.toString()}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`ESV API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as ESVPassageResponse;

    if (data.passages && data.passages.length > 0 && data.passages[0]) {
      return data.passages[0].trim();
    }

    return null;
  } catch (err) {
    console.error('ESV API fetch failed:', err);
    return null;
  }
}
