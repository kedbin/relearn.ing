import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectedProjects } from '../home/SelectedProjects';
import { makeProject } from '../../test/fixtures';

/**
 * The homepage "Selected Projects" cards must each be full-card links to
 * /projects/<id>. (This section was already correct; the tests lock it in so
 * regressions are caught.)
 */
describe('SelectedProjects — card clickability (homepage)', () => {
  it('renders each project as a full-card link to its page', () => {
    const projects = [
      makeProject('alpha', { title: 'Alpha Project' }),
      makeProject('beta', { title: 'Beta Project' }),
      makeProject('gamma', { title: 'Gamma Project' }),
    ];
    render(<SelectedProjects projects={projects} />);

    // slice(0, 2) are rendered as cards on the homepage.
    expect(screen.getByRole('link', { name: /Alpha Project/i })).toHaveAttribute('href', '/projects/alpha');
    expect(screen.getByRole('link', { name: /Beta Project/i })).toHaveAttribute('href', '/projects/beta');
    // Third project is not shown as a card.
    expect(screen.queryByRole('link', { name: /Gamma Project/i })).toBeNull();
  });

  it('links to the projects index from the footer', () => {
    render(<SelectedProjects projects={[makeProject('a'), makeProject('b')]} />);
    expect(screen.getByRole('link', { name: /view all projects/i })).toHaveAttribute('href', '/projects');
  });
});
