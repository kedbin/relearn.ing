import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../ui/SectionHeader';

describe('SectionHeader — section label + title layout', () => {
  it('renders the title as a heading', () => {
    render(<SectionHeader title="Latest from the Journal" />);
    expect(
      screen.getByRole('heading', { level: 2, name: /latest from the journal/i }),
    ).toBeInTheDocument();
  });

  it('renders the label as an accent-stamped pill with a dot', () => {
    const { container } = render(<SectionHeader label="Journal" title="Title" />);
    expect(screen.getByText('Journal')).toBeInTheDocument();
    // The label pill carries the accent dot (a span with bg-green).
    const pill = container.querySelector('.bg-surface-2\\/40');
    expect(pill).not.toBeNull();
    expect(pill?.querySelector('span.bg-green')).not.toBeNull();
  });

  it('renders the description when provided', () => {
    render(<SectionHeader title="T" description="A longer lede for the section." />);
    expect(screen.getByText('A longer lede for the section.')).toBeInTheDocument();
  });
});
