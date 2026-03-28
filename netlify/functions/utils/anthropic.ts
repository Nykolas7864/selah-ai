import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** Model to use — Haiku 4.5 for cost efficiency */
const MODEL = 'claude-haiku-4-5-20251001';

/**
 * System prompt that shapes Claude Haiku into a thoughtful biblical scholar.
 * This is the core personality and instruction set for prompt generation.
 */
const SYSTEM_PROMPT = `You are a thoughtful, scholarly Bible study guide with deep expertise in biblical theology, hermeneutics, symbolism, and historical context. You create thought-provoking study prompts for avid adult Christians who already have solid Bible knowledge and want to go deeper.

Your prompts should:
- Go beyond surface-level questions — never ask things like "Who wrote this book?" or "How many chapters are there?"
- Focus on symbolism, typology, theological implications, cultural/historical context, intertextual connections, and practical application for mature faith
- Reference specific verses when possible
- Encourage the reader to research and discover answers, not just recall facts
- Be accessible in language but deep in substance
- Draw connections between Old and New Testament where relevant
- Consider the original Hebrew/Greek meaning when it illuminates the text

You MUST respond in valid JSON matching this exact structure:
{
  "mainQuestion": "The primary thought-provoking question",
  "context": "1-2 sentences providing framing or background that makes the question richer",
  "primaryReference": "Book Chapter:Verse (e.g., Proverbs 21:20)",
  "subQuestions": [
    {
      "question": "A follow-up question that digs deeper",
      "verseReference": "Book Chapter:Verse (optional, include if relevant)"
    }
  ]
}

Generate exactly 2-3 sub-questions per prompt. Each sub-question should approach the topic from a different angle (e.g., one symbolic, one historical, one practical).`;

export interface HaikuPromptResult {
  mainQuestion: string;
  context: string;
  primaryReference: string;
  subQuestions: {
    question: string;
    verseReference?: string;
  }[];
}

/**
 * Generate a Bible study prompt using Claude Haiku.
 *
 * @param book - Bible book name
 * @param chapter - Chapter number within the book
 * @param topic - Study topic to focus on
 * @param customQuery - Optional user-provided focus text
 * @returns Structured prompt data
 */
export async function generateStudyPrompt(
  book: string,
  chapter: number,
  topic: string,
  customQuery?: string
): Promise<HaikuPromptResult> {
  let userMessage = `Generate a deep Bible study prompt about ${topic} in ${book} chapter ${chapter}.`;

  if (customQuery) {
    userMessage += `\n\nThe user has a specific focus: "${customQuery}". Tailor the prompt to address this while staying grounded in ${book} ${chapter}.`;
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userMessage },
    ],
  });

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Haiku response');
  }

  // Parse JSON response
  const parsed = JSON.parse(textBlock.text) as HaikuPromptResult;
  return parsed;
}
