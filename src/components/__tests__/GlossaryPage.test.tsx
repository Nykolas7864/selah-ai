import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GlossaryPage from '@/components/GlossaryPage';

describe('GlossaryPage', () => {
  it('renders the Biblical Figures heading', () => {
    render(<GlossaryPage />);
    expect(screen.getByText('Biblical Figures')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<GlossaryPage />);
    expect(screen.getByPlaceholderText('Search by name or keyword...')).toBeInTheDocument();
  });

  it('renders A-Z letter buttons', () => {
    render(<GlossaryPage />);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Z' })).toBeInTheDocument();
  });

  it('filters entries by name when searching', async () => {
    render(<GlossaryPage />);
    const input = screen.getByPlaceholderText('Search by name or keyword...');
    fireEvent.change(input, { target: { value: 'Moses' } });

    await waitFor(() => {
      expect(screen.getByText('Moses')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('shows empty state when search has no results', async () => {
    render(<GlossaryPage />);
    const input = screen.getByPlaceholderText('Search by name or keyword...');
    fireEvent.change(input, { target: { value: 'xyzunknownfigure999' } });

    await waitFor(() => {
      expect(screen.getByText(/No figures found/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('filters by letter when A-Z button is clicked', async () => {
    render(<GlossaryPage />);
    const aButton = screen.getByRole('button', { name: 'A' });
    fireEvent.click(aButton);

    await waitFor(() => {
      // Abraham starts with A
      expect(screen.getByText('Abraham')).toBeInTheDocument();
    });
  });

  it('clears letter filter when clicking active letter again', async () => {
    render(<GlossaryPage />);
    const aButton = screen.getByRole('button', { name: 'A' });
    fireEvent.click(aButton);
    fireEvent.click(aButton);
    // After clearing, more entries should be visible
    await waitFor(() => {
      expect(screen.getByText('Moses')).toBeInTheDocument();
    });
  });
});
