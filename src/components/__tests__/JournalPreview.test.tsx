import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JournalPreview } from '../home/JournalPreview';
import type { JournalEntryFixture } from '../../test/fixtures';

/**
 * Regression tests for the homepage "Latest from the Journal" section.
 *
 * Bug being locked out: the cards were rendered as plain <section>/<div>
 * containers with no link (stacked entries) or only a tiny "Read more →"
 * link (featured entry). Clicking the title, summary, or thumbnail did
 * nothing. Every card must be a full-card link to /journal/<id>.
 */
function makeEntry(id: string, title: string): JournalEntryFixture {
  return {
    id,
    data: {
      title,
      date: '2026-04-01',
      status: 'published',
      summary: `Summary for ${title}.`,
      category: 'Relearn Engineering/Builds',
    },
    body: 'One two three four five.',
  };
}

describe('JournalPreview — engagement layout (thumbnails, read-time, CTA)', () => {
  it('badges the featured card as the latest essay and shows a reading time', () => {
    const entries = [makeEntry('e1', 'Featured'), makeEntry('e2', 'B'), makeEntry('e3', 'C')];
    render(<JournalPreview entries={entries} />);
    expect(screen.getByText(/latest essay/i)).toBeInTheDocument();
    // readingTime fixture body is 5 words -> 1 min read
    expect(screen.getByText(/1 min read/i)).toBeInTheDocument();
  });

  it('renders a full-card "View all entries" CTA to the journal index', () => {
    render(<JournalPreview entries={[makeEntry('a', 'A'), makeEntry('b', 'B'), makeEntry('c', 'C')]} />);
    expect(screen.getByRole('link', { name: /view all entries/i })).toHaveAttribute('href', '/journal');
  });

  it('renders a generative thumbnail inside the featured card', () => {
    const { container } = render(
      <JournalPreview entries={[makeEntry('e1', 'Featured'), makeEntry('e2', 'B'), makeEntry('e3', 'C')]} />,
    );
    // GenerativeThumbnail paints a radial-gradient background on a styled div.
    const thumbs = container.querySelectorAll('[style*="radial-gradient"]');
    expect(thumbs.length).toBeGreaterThan(0);
  });
});

describe('JournalPreview — card clickability (homepage)', () => {
  it('renders the featured entry as a full-card link to its page', () => {
    const entries = [makeEntry('entry-featured', 'Featured Title'), makeEntry('a', 'A'), makeEntry('b', 'B')];
    render(<JournalPreview entries={entries} />);

    // The title must be inside the link → the link's accessible name includes
    // the title. Before the fix the title sat in an <h3> with no surrounding
    // link, so this lookup threw.
    const featuredLink = screen.getByRole('link', { name: /Featured Title/i });
    expect(featuredLink).toHaveAttribute('href', '/journal/entry-featured');
  });

  it('renders every stacked entry as a full-card link', () => {
    const entries = [
      makeEntry('entry-featured', 'Featured Title'),
      makeEntry('entry-stacked-1', 'Stacked Title One'),
      makeEntry('entry-stacked-2', 'Stacked Title Two'),
    ];
    render(<JournalPreview entries={entries} />);

    const link1 = screen.getByRole('link', { name: /Stacked Title One/i });
    const link2 = screen.getByRole('link', { name: /Stacked Title Two/i });
    expect(link1).toHaveAttribute('href', '/journal/entry-stacked-1');
    expect(link2).toHaveAttribute('href', '/journal/entry-stacked-2');
  });

  it('links to the journal index from the footer', () => {
    render(<JournalPreview entries={[makeEntry('a', 'A'), makeEntry('b', 'B'), makeEntry('c', 'C')]} />);
    expect(screen.getByRole('link', { name: /view all entries/i })).toHaveAttribute('href', '/journal');
  });
});
