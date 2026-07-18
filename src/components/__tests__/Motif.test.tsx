import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Motif } from '../ui/Motif';

describe('Motif — theme-aware editorial illustration', () => {
  it('renders an svg illustration (never an empty box)', () => {
    const { container } = render(<Motif seed="entry-1" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('uses a themed surface background (adapts to light/dark), not a hardcoded dark void', () => {
    const { container } = render(<Motif seed="entry-1" />);
    const box = container.firstElementChild as HTMLElement;
    expect(box.getAttribute('style') || '').toContain('radial-gradient');
    expect(box.getAttribute('style') || '').toContain('var(--surface');
  });

  it('exposes an accessible label describing the motif', () => {
    const { container } = render(<Motif seed="entry-1" />);
    const box = container.firstElementChild as HTMLElement;
    expect(box.getAttribute('aria-label')).toMatch(/illustration$/);
  });

  it('is deterministic: the same seed always yields the same motif', () => {
    const a = render(<Motif seed="deterministic-seed" />);
    const b = render(<Motif seed="deterministic-seed" />);
    expect(a.container.firstElementChild?.getAttribute('aria-label'))
      .toBe(b.container.firstElementChild?.getAttribute('aria-label'));
  });

  it('honours category hints (life -> plant-like motifs)', () => {
    // life categories map into {sprout, sunburst, moon}
    const { container } = render(<Motif seed="zzz" category="Relearn Life/Mind" />);
    const label = container.firstElementChild?.getAttribute('aria-label');
    expect(['sprout', 'sunburst', 'moon']).toContain(label?.replace(' illustration', ''));
  });
});
