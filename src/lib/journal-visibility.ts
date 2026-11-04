/** Explicit opt-in drafts; historical status labels are display text, not gates. */
export function isJournalVisible(
  entry: { data: { draft?: boolean } },
  includeDrafts = false,
): boolean {
  return includeDrafts || entry.data.draft !== true;
}

export const FDE_WORKSHOP_SERIES = [
  { id: 'entry-065', day: 1, title: 'Prompts, policies, and agent foundations' },
  { id: 'entry-066', day: 2, title: 'Your prompt is not a security boundary' },
  { id: 'entry-067', day: 3, title: 'Measure before you optimize' },
  { id: 'entry-068', day: 4, title: 'Guard the real data path' },
] as const;

/** Never advertise a draft route that the current build did not generate. */
export function visibleFdeSeries(visibleIds: readonly string[]) {
  const ids = new Set(visibleIds);
  return FDE_WORKSHOP_SERIES.filter((entry) => ids.has(entry.id));
}
