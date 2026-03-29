import type { Context } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-haiku-4-5-20251001';

const TIMELINE_DAYS: Record<string, number> = {
  '1 week': 7,
  '2 weeks': 14,
  '1 month': 30,
  '3 months': 90,
  '6 months': 180,
  '1 year': 365,
};

interface ReadingPlanEntry {
  day: number;
  book: string;
  chapters: string;
  description: string;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as {
      topics: string[];
      customDescription?: string;
      timeline: string;
    };

    const totalDays = TIMELINE_DAYS[body.timeline] ?? 14;
    const topicsText = body.topics.length > 0 ? body.topics.join(', ') : 'General Bible study';
    const customText = body.customDescription ? `\nUser's focus: "${body.customDescription}"` : '';

    // For very long plans, instruct Haiku to keep descriptions concise
    const descriptionGuidance = totalDays >= 90
      ? 'Keep each day\'s description to 1 short sentence (under 15 words).'
      : 'Keep each day\'s description to 1-2 sentences.';

    const systemPrompt = `You are a biblical reading plan designer. Create a structured daily Bible reading plan based on the user's interests and timeline.

Sequence readings logically — chronological where appropriate, thematic grouping for topical studies. Space readings proportionally across the timeline. Each day should be a manageable amount (1-3 chapters typically, occasionally more for shorter books). ${descriptionGuidance}

You MUST respond in valid JSON matching this structure:
{
  "title": "A descriptive title for the plan",
  "description": "1-2 sentences describing what this plan covers",
  "entries": [
    { "day": 1, "book": "Book Name", "chapters": "1-3", "description": "Why this reading matters" },
    ...
  ]
}

Generate entries for EVERY day of the plan (all ${totalDays} days). Do not skip days. Do not include any text outside the JSON.`;

    const userMessage = `Topics: ${topicsText}${customText}\nTimeline: ${body.timeline} (${totalDays} days total)\n\nGenerate a complete ${totalDays}-day reading plan.`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text content in AI response');
    }

    let jsonText = textBlock.text.trim();
    jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');

    let parsed: { title: string; description: string; entries: ReadingPlanEntry[] };
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error('AI response was not valid JSON. Please try again.');
    }

    return new Response(
      JSON.stringify({
        plan: {
          title: parsed.title,
          description: parsed.description,
          topics: body.topics,
          customDescription: body.customDescription,
          timeline: body.timeline,
          totalDays,
          entries: parsed.entries,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('generate-reading-plan error:', err);
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
