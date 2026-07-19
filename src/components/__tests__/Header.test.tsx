import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header — simple, plain navigation', () => {
  it('renders the three primary nav links as plain text with correct hrefs', () => {
    render(<Header currentPath="/" />);
    expect(screen.getByRole('link', { name: 'Journal' })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('does NOT render code-bracket labels (plain text only)', () => {
    const { container } = render(<Header currentPath="/" />);
    expect(container.textContent).not.toContain('<journal/>');
    expect(container.textContent).not.toContain('<');
  });

  it('renders the brand mark linking home', () => {
    render(<Header currentPath="/" />);
    const brand = screen.getByText('R/').closest('a');
    expect(brand).toHaveAttribute('href', '/');
  });

  it('marks the active section with the accent underline (w-5)', () => {
    render(<Header currentPath="/journal/entry-001" />);
    const journal = screen.getByRole('link', { name: 'Journal' });
    const underline = journal.querySelector('span.bg-green');
    expect(underline).not.toBeNull();
    expect(underline?.className).toContain('w-5');
    expect(underline?.className).toContain('opacity-100');
  });

  it('keeps the inactive underline hidden (w-0)', () => {
    render(<Header currentPath="/journal" />);
    const about = screen.getByRole('link', { name: 'About' });
    const underline = about.querySelector('span.bg-green');
    expect(underline?.className).toContain('w-0');
  });

  it('keeps social links out of the header (they live in the footer)', () => {
    render(<Header currentPath="/" />);
    expect(screen.queryByRole('link', { name: /github/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /linkedin/i })).toBeNull();
  });
});
