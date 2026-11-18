/**
 * About-page data. Deliberately small: the page states what relearn.ing is and
 * points to binasoy.kim for everything about the person (work, résumé).
 */

export interface Link {
  label: string;
  href: string;
}

export const profile = {
  name: 'Kim Binasoy',
  location: 'Toronto',
  photo: {
    // Optimised crop of /profile.jpg (white matte removed).
    src: '/about/kim-binasoy.webp',
    width: 640,
    height: 798,
    alt: 'Kim Binasoy in a brown blazer, black turtleneck and round glasses, looking to the side',
  },
  portfolio: { label: 'binasoy.kim', href: 'https://binasoy.kim' } satisfies Link,
  social: [
    { label: 'GitHub', href: 'https://github.com/kedbin' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/' },
    { label: 'Threads', href: 'https://www.threads.com/@relearn.ing' },
  ] satisfies Link[],
  source: { label: 'kedbin/relearn.ing', href: 'https://github.com/kedbin/relearn.ing' } satisfies Link,
};

/**
 * The notebook's four rules. No longer rendered on /about, but still read by
 * src/components/interactive/Loop.astro (via loop-data's `rule` index).
 */
export const principles: { title: string; body: string }[] = [
  { title: 'Build in public', body: 'Accountability is a feature. The repo is open, and every entry is a commit anyone can read, fork or critique.' },
  { title: 'Honest metrics', body: 'No hype. Numbers come from the content itself, and if a habit didn’t stick, the chart says so.' },
  { title: 'Ship v0.1 habits', body: 'Commit, test, deploy, monitor, repeat. A small habit that ships beats a perfect system that never leaves draft.' },
  { title: 'Failures get logged', body: 'If a prompt failed or an agent hallucinated, it goes in the notebook. The misses teach more than the wins.' },
];
