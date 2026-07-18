/**
 * Shared test fixtures for component tests.
 *
 * These mirror the shapes the Astro content collections hand to the React
 * island components (see JournalPreview / SelectedProjects / JournalCard /
 * ProjectCard prop types) without depending on astro:content at test time.
 */

export interface JournalEntryFixture {
  id: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
  };
  body: string;
}

export interface ProjectFixture {
  id: string;
  data: {
    title: string;
    description: string;
    date: string;
    techStack: string[];
  };
}

export function makeJournalEntry(
  id: string,
  overrides: Partial<JournalEntryFixture['data']> & { body?: string } = {},
): JournalEntryFixture {
  return {
    id,
    data: {
      title: overrides.title ?? `Entry ${id}`,
      date: overrides.date ?? '2026-04-01',
      status: overrides.status ?? 'published',
      summary: overrides.summary ?? `Summary for ${id}.`,
      category: overrides.category ?? 'Relearn Engineering/Builds',
    },
    body: overrides.body ?? 'One two three four five.',
  };
}

export function makeProject(
  id: string,
  overrides: Partial<ProjectFixture['data']> = {},
): ProjectFixture {
  return {
    id,
    data: {
      title: overrides.title ?? `Project ${id}`,
      description: overrides.description ?? `Description for ${id}.`,
      date: overrides.date ?? '2026-04-01',
      techStack: overrides.techStack ?? ['Astro', 'React'],
    },
  };
}
