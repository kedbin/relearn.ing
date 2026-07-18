import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroPanel } from '../home/HeroPanel';

describe('HeroPanel — hero CTA hierarchy', () => {
  it('renders the primary CTA linking to the journal', () => {
    render(<HeroPanel />);
    expect(screen.getByRole('link', { name: /read the journal/i })).toHaveAttribute('href', '/journal');
  });

  it('renders the secondary CTA linking to about', () => {
    render(<HeroPanel />);
    expect(screen.getByRole('link', { name: /about the experiment/i })).toHaveAttribute('href', '/about');
  });

  it('renders the hero headline', () => {
    const { container } = render(<HeroPanel />);
    expect(container.textContent).toContain('Relearning');
    expect(container.textContent).toContain('how to work');
  });
});
