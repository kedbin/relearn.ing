import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';

const baseProps = {
  title: 'Test Project',
  description: 'A description of the project.',
  date: '2026-04-01',
  techStack: ['Astro', 'React', 'Tailwind'],
  id: 'test-id',
};

describe('ProjectCard', () => {
  describe('featured', () => {
    it('wraps the whole card in a link to the project page', () => {
      render(<ProjectCard {...baseProps} featured />);
      const link = screen.getByRole('link', { name: /Test Project/i });
      expect(link).toHaveAttribute('href', '/projects/test-id');
    });
  });

  describe('non-featured', () => {
    /**
     * Regression: the non-featured card was a plain <div>; only the title
         * text and a small "Read case study" link were clickable. The whole card
         * must now link to the project page via a stretched-link overlay.
         */
    it('renders a full-card link to the project page', () => {
      render(<ProjectCard {...baseProps} />);
      // The overlay link exposes the project title in its accessible name.
      const cardLink = screen.getByRole('link', { name: /Test Project/i });
      expect(cardLink).toHaveAttribute('href', '/projects/test-id');
    });

    it('still surfaces the external repo link when provided', () => {
      render(<ProjectCard {...baseProps} repoUrl="https://github.com/foo/bar" />);
      expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute(
        'href',
        'https://github.com/foo/bar',
      );
    });

    it('still surfaces the external demo link when provided', () => {
      render(<ProjectCard {...baseProps} demoUrl="https://example.com" />);
      expect(screen.getByRole('link', { name: /live/i })).toHaveAttribute('href', 'https://example.com');
    });

    it('uses the unified card-title system', () => {
      const { container } = render(<ProjectCard {...baseProps} />);
      expect(container.querySelector('.card-title')).not.toBeNull();
    });
  });
});
