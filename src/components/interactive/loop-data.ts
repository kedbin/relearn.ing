/**
 * The relearning loop: four stages, each paired with a real journal entry that
 * shows the stage in practice, plus the notebook rule that governs it
 * (an index into `principles` in src/data/about.ts).
 *
 * Curated by hand from src/content/journal. If an entry is hidden in a build,
 * Loop.astro leaves out its example instead of linking to a missing page.
 */

export interface LoopExample {
  /** Collection id, e.g. "entry-059" */
  id: string;
  /** Fallback title; the live title from the collection wins */
  title: string;
  /** One line on why this entry is an example of the stage */
  note: string;
}

export interface LoopStage {
  key: 'friction' | 'hypothesis' | 'experiment' | 'log';
  name: string;
  definition: string;
  example: LoopExample;
  /** Index into `principles` */
  rule: number;
}

export const loopStages: LoopStage[] = [
  {
    key: 'friction',
    name: 'Friction',
    definition: 'Notice what keeps snagging: a recurring cost, not a one-off annoyance.',
    example: {
      id: 'entry-059',
      title: 'The Merge Conflict Tax: What 4-Day Playwright Reviews Taught Me About CI/CD',
      note: 'Playwright PRs sat open for three to four days. I was resolving more merge conflicts than I was writing tests.',
    },
    rule: 0,
  },
  {
    key: 'hypothesis',
    name: 'Hypothesis',
    definition: 'Write the fix down as a protocol: what changes, what gets measured, when to stop.',
    example: {
      id: 'entry-034',
      title: 'The Bet: An 11-Month Protocol for Becoming AI-Proof',
      note: 'Fifteen three-week sprints at 10–12 hours a week, each one ending in a shipped artifact. Revised once reality pushed back.',
    },
    rule: 1,
  },
  {
    key: 'experiment',
    name: 'Experiment',
    definition: 'Run the smallest version that could prove you wrong, and measure it.',
    example: {
      id: 'entry-027',
      title: 'The Binary Asymptote: Why Your Deploy Pipeline Has a Weight Problem',
      note: 'Moved 135 MB of audio out of the repo and onto Cloudflare R2. Deploys went from 5 minutes to 8 seconds.',
    },
    rule: 2,
  },
  {
    key: 'log',
    name: 'Log',
    definition: 'Write up what actually happened, misses included. That becomes the next friction.',
    example: {
      id: 'entry-063',
      title: 'My LinkedIn Slides Were Trash, So I Asked My AI to Self-Correct',
      note: 'The first carousel generator was naive. Eleven versions later, the pipeline had been rebuilt around HTML and CSS.',
    },
    rule: 3,
  },
];
