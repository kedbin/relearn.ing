import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalList, topDomain } from '../JournalList';
import { makeJournalEntry } from '../../test/fixtures';

const sample = [
  makeJournalEntry('eng-1', { title: 'Eng Post One', category: 'Relearn Engineering / AI Engineering' }),
  makeJournalEntry('eng-2', { title: 'Eng Post Two', category: 'Relearn Engineering / Systems' }),
  makeJournalEntry('life-1', { title: 'Life Post One', category: 'Relearn Life / Behavioral Economics' }),
  makeJournalEntry('life-2', { title: 'Life Systems Note', category: 'Relearn Life / Systems Thinking' }),
  makeJournalEntry('work-1', { title: 'Work Post', category: 'Relearn Work / Career Engineering' }),
  makeJournalEntry('odd-1', { title: 'Odd AI Post', category: 'AI Engineering / Cognitive Systems' }),
];

describe('topDomain — baseline taxonomy parser', () => {
  it('strips the Relearn prefix and takes the segment before the slash', () => {
    expect(topDomain('Relearn Engineering / AI Engineering')).toBe('Engineering');
    expect(topDomain('Relearn Life / Behavioral Economics')).toBe('Life');
    expect(topDomain('Relearn Work / Career Engineering')).toBe('Work');
    expect(topDomain('Relearn Learning / Cognitive Engineering')).toBe('Learning');
  });

  it('normalises the oddball "AI Engineering" entry into Engineering', () => {
    expect(topDomain('AI Engineering / Cognitive Systems')).toBe('Engineering');
  });
});

describe('JournalList — filters derived from content (no dead pills)', () => {
  it('shows All + only the top-level domains that have entries', () => {
    render(<JournalList entries={sample} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Life' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument();
  });

  it('never renders a filter with zero entries (no Productivity) and merges Systems', () => {
    render(<JournalList entries={sample} />);
    // Productivity has no matching category -> no pill.
    expect(screen.queryByRole('button', { name: 'Productivity' })).toBeNull();
    // "Systems" is always a sub-category, never its own filter.
    expect(screen.queryByRole('button', { name: 'Systems' })).toBeNull();
  });

  it('narrows the list when a domain filter is selected', () => {
    render(<JournalList entries={sample} />);
    fireEvent.click(screen.getByRole('button', { name: 'Life' }));
    expect(screen.getByText('Life Post One')).toBeInTheDocument();
    expect(screen.getByText('Life Systems Note')).toBeInTheDocument();
    expect(screen.queryByText('Eng Post One')).toBeNull();
    expect(screen.queryByText('Work Post')).toBeNull();
  });

  it('Engineering filter includes the normalised "AI Engineering" oddball', () => {
    render(<JournalList entries={sample} />);
    fireEvent.click(screen.getByRole('button', { name: 'Engineering' }));
    expect(screen.getByText('Odd AI Post')).toBeInTheDocument();
    expect(screen.getByText('Eng Post One')).toBeInTheDocument();
    expect(screen.queryByText('Life Post One')).toBeNull();
  });
});
