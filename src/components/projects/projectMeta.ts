/** Pure helpers for project titles/links, shared by the projects pages. */

/** "relearn.ing: The Cognitive Architecture Platform" -> { name: "relearn.ing", subtitle: "The Cognitive Architecture Platform" } */
export function splitTitle(title: string): { name: string; subtitle: string } {
  const i = title.indexOf(':');
  if (i === -1) return { name: title.trim(), subtitle: '' };
  return { name: title.slice(0, i).trim(), subtitle: title.slice(i + 1).trim() };
}

/** Label a demo URL honestly: video links say "Demo video", everything else "Live". */
export function demoLabel(url: string): string {
  return /youtu\.?be|youtube\.com|vimeo\.com/i.test(url) ? 'Demo video' : 'Live';
}
