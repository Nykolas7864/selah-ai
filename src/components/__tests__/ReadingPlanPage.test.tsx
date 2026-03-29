import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReadingPlanPage from '@/components/ReadingPlanPage';
import type { ReadingPlan, ReadingPlanProgress } from '@/types';

const STORAGE_KEY_PLAN = 'selah-reading-plan';
const STORAGE_KEY_PROGRESS = 'selah-reading-plan-progress';

const mockPlan: ReadingPlan = {
  title: 'Test Reading Plan',
  description: 'A plan for testing.',
  topics: ['Wisdom Literature'],
  timeline: '1 week',
  totalDays: 2,
  entries: [
    { day: 1, book: 'Proverbs', chapters: '1', description: 'Introduction to wisdom.' },
    { day: 2, book: 'Proverbs', chapters: '2', description: 'More wisdom.' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockProgress: ReadingPlanProgress = { completedDays: [] };

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  vi.restoreAllMocks();
});

describe('ReadingPlanPage', () => {
  it('shows the form when no plan is in localStorage', () => {
    render(<ReadingPlanPage />);
    expect(screen.getByText('Create Your Reading Plan')).toBeInTheDocument();
  });

  it('shows the plan display when a plan exists in localStorage', () => {
    localStorageMock.setItem(STORAGE_KEY_PLAN, JSON.stringify(mockPlan));
    localStorageMock.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(mockProgress));
    render(<ReadingPlanPage />);
    expect(screen.getByText('Test Reading Plan')).toBeInTheDocument();
  });

  it('toggling a day updates the progress', async () => {
    localStorageMock.setItem(STORAGE_KEY_PLAN, JSON.stringify(mockPlan));
    localStorageMock.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(mockProgress));
    render(<ReadingPlanPage />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    fireEvent.click(checkboxes[0]!);
    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    });

    const stored = JSON.parse(localStorageMock.getItem(STORAGE_KEY_PROGRESS)!) as ReadingPlanProgress;
    expect(stored.completedDays).toContain(1);
  });

  it('Start Over clears localStorage when confirmed', async () => {
    localStorageMock.setItem(STORAGE_KEY_PLAN, JSON.stringify(mockPlan));
    localStorageMock.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(mockProgress));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ReadingPlanPage />);
    const startOverBtn = screen.getByRole('button', { name: /Start Over/i });
    fireEvent.click(startOverBtn);

    await waitFor(() => {
      expect(screen.getByText('Create Your Reading Plan')).toBeInTheDocument();
    });

    expect(localStorageMock.getItem(STORAGE_KEY_PLAN)).toBeNull();
    expect(localStorageMock.getItem(STORAGE_KEY_PROGRESS)).toBeNull();
  });

  it('Start Over does nothing when cancelled', async () => {
    localStorageMock.setItem(STORAGE_KEY_PLAN, JSON.stringify(mockPlan));
    localStorageMock.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(mockProgress));
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<ReadingPlanPage />);
    const startOverBtn = screen.getByRole('button', { name: /Start Over/i });
    fireEvent.click(startOverBtn);

    await waitFor(() => {
      expect(screen.getByText('Test Reading Plan')).toBeInTheDocument();
    });
  });
});
