import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JournalCard } from '../JournalCard';
import { makeJournalEntry } from '../../test/fixtures';

describe('JournalCard', () => {
  it('wraps the non-featured card in a link to the entry page', () => {
    const entry = makeJournalEntry('entry-42', { title: 'My Journal Entry' });
    render(<JournalCard entry={entry} />);

    const link = screen.getByRole('link', { name: /My Journal Entry/i });
    expect(link).toHaveAttribute('href', '/journal/entry-42');
  });

  it('wraps the featured card in a link to the entry page', () => {
    const entry = makeJournalEntry('entry-99', { title: 'Featured Essay' });
    render(<JournalCard entry={entry} featured />);

    const link = screen.getByRole('link', { name: /Featured Essay/i });
    expect(link).toHaveAttribute('href', '/journal/entry-99');
  });

  it('derives the sub-category from the category path', () => {
    const entry = makeJournalEntry('e1', { category: 'Relearn Life/Mind' });
    const { container } = render(<JournalCard entry={entry} />);
    // Sub-category is the segment after the slash.
    expect(container.textContent).toContain('Mind');
  });

  it('uses the unified card-title system and has no preview picture', () => {
    const entry = makeJournalEntry('e1', { title: 'Unified Title' });
    const { container } = render(<JournalCard entry={entry} />);
    expect(container.querySelector('.card-title')).not.toBeNull();
    expect(container.querySelectorAll('[style*="radial-gradient"]').length).toBe(0);
  });
});
