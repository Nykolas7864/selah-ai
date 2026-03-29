import type { GeneratedPrompt } from '@/types';

// These types will be added in Feature 4; defined inline here for now
interface ReadingPlanEntry {
  day: number;
  book: string;
  chapters: string;
  description: string;
}

interface ReadingPlan {
  title: string;
  description: string;
  timeline: string;
  totalDays: number;
  entries: ReadingPlanEntry[];
}

interface ReadingPlanProgress {
  completedDays: number[];
}

/**
 * Format a single prompt as readable plain text.
 */
export function formatPromptAsText(prompt: GeneratedPrompt): string {
  const lines: string[] = [];

  lines.push(`${prompt.seed.book} — ${prompt.seed.topic}`);
  lines.push('');
  lines.push(`QUESTION: ${prompt.mainQuestion}`);
  lines.push('');
  lines.push(`CONTEXT: ${prompt.context}`);
  lines.push('');
  lines.push(`PRIMARY VERSE (${prompt.primaryReference}):`);
  if (prompt.primaryVerseText) {
    lines.push(`"${prompt.primaryVerseText}"`);
  }
  lines.push('');
  lines.push('GO DEEPER:');
  prompt.subQuestions.forEach((sq, i) => {
    lines.push(`${i + 1}. ${sq.question}`);
    if (sq.verseReference) {
      lines.push(`   Verse: ${sq.verseReference}${sq.verseText ? ` — "${sq.verseText}"` : ''}`);
    }
  });

  return lines.join('\n');
}

/**
 * Wrap multiple prompts with a header and separators.
 * Includes ESV attribution at the bottom.
 */
export function formatPromptsAsText(prompts: GeneratedPrompt[], title?: string): string {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const header = title ?? `Selah-AI Study Prompts — ${date}`;
  const separator = '─'.repeat(50);

  const parts = [header, separator];

  prompts.forEach((prompt, i) => {
    if (i > 0) parts.push('', separator, '');
    parts.push(formatPromptAsText(prompt));
  });

  parts.push('');
  parts.push(separator);
  parts.push('Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®),');
  parts.push('copyright © 2001 by Crossway, a publishing ministry of Good News Publishers.');

  return parts.join('\n');
}

/**
 * Format a reading plan + progress as plain text.
 */
export function formatPlanAsText(plan: ReadingPlan, progress: ReadingPlanProgress): string {
  const lines: string[] = [];

  lines.push(`READING PLAN: ${plan.title}`);
  lines.push(plan.description);
  lines.push(`Timeline: ${plan.timeline} | Progress: ${progress.completedDays.length}/${plan.totalDays} days complete`);
  lines.push('');
  lines.push('─'.repeat(50));
  lines.push('');

  plan.entries.forEach((entry) => {
    const done = progress.completedDays.includes(entry.day);
    lines.push(`Day ${entry.day}: ${entry.book} ${entry.chapters}`);
    lines.push(entry.description);
    lines.push(done ? '[x] Completed' : '[ ] Not started');
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Copy text to clipboard. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Trigger a browser download of the given text as a .txt file.
 */
export function downloadAsTextFile(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
