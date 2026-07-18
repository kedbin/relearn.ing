import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header — navigation layout', () => {
  it('renders the three primary nav links with correct hrefs', () => {
    render(<Header currentPath="/" />);
    expect(screen.getByRole('link', { name: /journal/i })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
  });

  it('renders the brand mark linking home', () => {
    render(<Header currentPath="/" />);
    const brand = screen.getByText('R/').closest('a');
    expect(brand).toHaveAttribute('href', '/');
  });

  it('marks the active section with the accent underline + surface pill', () => {
    render(<Header currentPath="/journal/entry-001" />);
    const journal = screen.getByRole('link', { name: /journal/i });
    // Active NavLink gets the surface pill background; inactive links don't.
    expect(journal.className).toContain('bg-surface-2/60');
    // The accent underline span (bg-green) is rendered only for the active item.
    expect(journal.querySelector('span.bg-green')).not.toBeNull();
  });

  it('does not mark inactive sections as active', () => {
    render(<Header currentPath="/journal" />);
    const about = screen.getByRole('link', { name: /about/i });
    expect(about.className).not.toContain('bg-surface-2/60');
  });

  it('renders social links with accessible labels', () => {
    render(<Header currentPath="/" />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/kedbin');
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/kedbin/',
    );
  });
});
