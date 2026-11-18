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

