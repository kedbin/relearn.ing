/**
 * Hand-curated reading paths. Chronology is the archive's job; these are for a
 * first-time reader. Every "why" is a plain description of what the entry
 * actually contains: no invented claims.
 */

export interface StartPick {
  id: string;
  topic: string;
  heading: string;
  why: string;
}

export const START_HERE: StartPick[] = [
  {
    id: 'entry-027',
    topic: 'Deployment',
    heading: 'The eight-second deploy',
    why: 'How moving audio to R2 cut deploys from five minutes to eight seconds.',
  },
  {
    id: 'entry-055',
    topic: 'Automation',
    heading: 'The Excel script that beat the agent',
    why: 'Why an HR team needed a formatting script instead of a new workflow.',
  },
  {
    id: 'entry-035',
    topic: 'Decisions',
    heading: 'Deciding when to stop',
    why: 'Setting a stopping rule before a study session or a workout.',
  },
];

export interface Trail {
  name: string;
  note: string;
  ids: string[];
}

/** A few doors into the archive, instead of 27 overlapping topic tags. */
export const TRAILS: Trail[] = [
  {
    name: 'FDE Workshop',
    note: 'Four days of Google’s Forward Deployed Engineer workshop, one entry per day.',
    ids: ['entry-065', 'entry-066', 'entry-067', 'entry-068'],
  },
  {
    name: 'Running coding agents in parallel',
    note: 'Orchestration, worktrees, tmux, then a swarm.',
    ids: ['entry-048', 'entry-049', 'entry-050', 'entry-058'],
  },
  {
    name: 'Agent memory',
    note: 'How agents keep and consolidate what they learn.',
    ids: ['entry-051', 'entry-053', 'entry-054'],
  },
  {
    name: 'The publishing pipeline',
    note: 'The tooling behind this site: storage, voice, slides.',
    ids: ['entry-027', 'entry-045', 'entry-060', 'entry-063'],
  },
  {
    name: 'Work and career',
    note: 'What a job does to your time, and how the market changed.',
    ids: ['entry-021', 'entry-039', 'entry-040', 'entry-056'],
  },
];
