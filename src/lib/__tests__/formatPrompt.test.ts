import { describe, it, expect, vi } from 'vitest';
import {
  formatPromptAsText,
  formatPromptsAsText,
  formatPlanAsText,
  copyToClipboard,
  downloadAsTextFile,
} from '@/lib/formatPrompt';
import type { GeneratedPrompt, ReadingPlan, ReadingPlanProgress } from '@/types';

const mockPrompt: GeneratedPrompt = {
  seed: { book: 'Psalms', chapter: 23, topic: 'Faith & Doubt', key: 'psalms-23-faith' },
  mainQuestion: 'What does the imagery of the shepherd reveal about God?',
  context: 'Psalm 23 uses pastoral metaphors to describe divine care.',
  primaryReference: 'Psalm 23:1',
  primaryVerseText: 'The LORD is my shepherd; I shall not want.',
  primaryBibleGatewayUrl: 'https://www.biblegateway.com/passage/?search=Psalm+23:1&version=ESV',
  subQuestions: [
    {
      question: 'How does this image connect to Jesus as the Good Shepherd?',
      verseReference: 'John 10:11',
      verseText: 'I am the good shepherd.',
    },
  ],
};

const mockPlan: ReadingPlan = {
  title: 'Test Plan',
  description: 'A simple test plan.',
  topics: ['Wisdom Literature'],
  timeline: '1 week',
  totalDays: 7,
  entries: [
    { day: 1, book: 'Proverbs', chapters: '1-3', description: 'Introduction to wisdom.' },
    { day: 2, book: 'Proverbs', chapters: '4-6', description: 'Warnings against folly.' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockProgress: ReadingPlanProgress = { completedDays: [1] };

describe('formatPromptAsText', () => {
  it('includes the book and topic', () => {
    const text = formatPromptAsText(mockPrompt);
    expect(text).toContain('Psalms');
    expect(text).toContain('Faith & Doubt');
  });

  it('includes the main question', () => {
    const text = formatPromptAsText(mockPrompt);
    expect(text).toContain('What does the imagery of the shepherd reveal about God?');
  });

  it('includes QUESTION: and CONTEXT: labels', () => {
    const text = formatPromptAsText(mockPrompt);
    expect(text).toContain('QUESTION:');
    expect(text).toContain('CONTEXT:');
  });

  it('includes the primary verse reference', () => {
    const text = formatPromptAsText(mockPrompt);
    expect(text).toContain('Psalm 23:1');
  });

  it('includes GO DEEPER section with sub-questions', () => {
    const text = formatPromptAsText(mockPrompt);
    expect(text).toContain('GO DEEPER:');
    expect(text).toContain('Good Shepherd');
  });
});

describe('formatPromptsAsText', () => {
  it('includes Selah-AI header', () => {
    const text = formatPromptsAsText([mockPrompt]);
    expect(text).toContain('Selah-AI Study Prompts');
  });

  it('includes ESV attribution at the bottom', () => {
    const text = formatPromptsAsText([mockPrompt]);
    expect(text).toContain('ESV');
  });

  it('uses custom title when provided', () => {
    const text = formatPromptsAsText([mockPrompt], 'My Custom Header');
    expect(text).toContain('My Custom Header');
  });

  it('includes separator between multiple prompts', () => {
    const text = formatPromptsAsText([mockPrompt, mockPrompt]);
    // The separator is repeated dashes
    expect((text.match(/─{10,}/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

describe('formatPlanAsText', () => {
  it('includes plan title', () => {
    const text = formatPlanAsText(mockPlan, mockProgress);
    expect(text).toContain('Test Plan');
  });

  it('shows progress summary', () => {
    const text = formatPlanAsText(mockPlan, mockProgress);
    expect(text).toContain('1/7');
  });

  it('marks completed days', () => {
    const text = formatPlanAsText(mockPlan, mockProgress);
    expect(text).toContain('[x] Completed');
  });

  it('marks incomplete days', () => {
    const text = formatPlanAsText(mockPlan, mockProgress);
    expect(text).toContain('[ ] Not started');
  });
});

describe('copyToClipboard', () => {
  it('calls navigator.clipboard.writeText and returns true on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard('hello');
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(result).toBe(true);
  });

  it('returns false when clipboard write fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard('hello');
    expect(result).toBe(false);
  });
});

describe('downloadAsTextFile', () => {
  it('creates a temporary anchor element and triggers click', () => {
    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tag);
    });

    // Mock URL.createObjectURL
    const createURL = vi.fn().mockReturnValue('blob:test');
    const revokeURL = vi.fn();
    globalThis.URL.createObjectURL = createURL;
    globalThis.URL.revokeObjectURL = revokeURL;

    downloadAsTextFile('content', 'test.txt');

    expect(clickSpy).toHaveBeenCalled();
    expect(revokeURL).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});
