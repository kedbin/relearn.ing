import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CodeGlyph } from '../ui/CodeGlyph';

describe('CodeGlyph — code-tag iconography', () => {
  it('renders the keyword wrapped in self-closing angle brackets', () => {
    const { container } = render(<CodeGlyph k="journal" />);
    expect(container.textContent).toBe('<journal/>');
  });

  it('renders a non-self-closing variant when requested', () => {
    const { container } = render(<CodeGlyph k="focus" selfClosing={false} />);
    expect(container.textContent).toBe('<focus>');
  });

  it('styles the brackets with the accent color', () => {
    const { container } = render(<CodeGlyph k="projects" />);
    // the opening and closing bracket spans carry the accent class
    expect(container.querySelectorAll('.text-green').length).toBeGreaterThanOrEqual(2);
  });

  it('exposes the bare keyword as an accessible label', () => {
    const { container } = render(<CodeGlyph k="about" />);
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('about');
  });
});
