import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareButtons from '@/components/ShareButtons';
import type { GeneratedPrompt } from '@/types';

const mockPrompt: GeneratedPrompt = {
  seed: { book: 'Psalms', chapter: 1, topic: 'Faith & Doubt', key: 'psalms-1-faith' },
  mainQuestion: 'Test question?',
  context: 'Test context.',
  primaryReference: 'Psalm 1:1',
  primaryVerseText: 'Blessed is the man...',
  primaryBibleGatewayUrl: 'https://biblegateway.com',
  subQuestions: [],
};

beforeEach(() => {
  // Mock clipboard
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  });
  // Mock URL methods
  globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
  globalThis.URL.revokeObjectURL = vi.fn();
});

describe('ShareButtons', () => {
  it('renders Copy All and Download buttons', () => {
    render(<ShareButtons prompts={[mockPrompt]} />);
    expect(screen.getByText('Copy All')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('calls clipboard API when Copy All is clicked', async () => {
    render(<ShareButtons prompts={[mockPrompt]} />);
    fireEvent.click(screen.getByText('Copy All'));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('shows "Copied!" feedback after successful copy', async () => {
    render(<ShareButtons prompts={[mockPrompt]} />);
    fireEvent.click(screen.getByText('Copy All'));
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('triggers file download when Download is clicked', () => {
    render(<ShareButtons prompts={[mockPrompt]} />);
    fireEvent.click(screen.getByText('Download'));
    // URL.createObjectURL is called to generate the blob URL
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    // URL.revokeObjectURL is called to clean up after download
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
