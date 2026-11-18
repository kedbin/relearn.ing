const RECORD_PAD = 7 * 86_400_000;

// Input arrives in chronological order. Keep equal dates visibly distinct
// without spreading the gaps between different dates.
export function journalRecordPoints<T extends { date: number; words: number }>(entries: readonly T[]) {
  if (!entries.length) return [];
  const start = entries[0].date - RECORD_PAD;
  const span = entries[entries.length - 1].date + RECORD_PAD - start;
  const maxWords = Math.max(1, ...entries.map((entry) => entry.words));
  const days = new Map<number, number>();
  return entries.map((entry) => {
    const sameDay = days.get(entry.date) ?? 0;
    days.set(entry.date, sameDay + 1);
    return {
      ...entry,
      position: Number((((entry.date - start) / span) * 100).toFixed(4)),
      offset: sameDay * 3,
      height: Math.max(3, Math.sqrt(entry.words / maxWords) * 100),
    };
  });
}

type JournalDomain = 'all' | 'engineering' | 'life' | 'work';

export interface JournalFilters {
  domain: JournalDomain;
  query: string;
  audio: boolean;
  video: boolean;
  sort: 'newest' | 'oldest';
}

export function readJournalFilters(params: URLSearchParams): JournalFilters {
  const domain = params.get('d');
  return {
    domain: domain === 'engineering' || domain === 'life' || domain === 'work' ? domain : 'all',
    query: params.get('q') ?? '',
    audio: params.get('a') === '1',
    video: params.get('v') === '1',
    sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
  };
}

export function writeJournalFilters(params: URLSearchParams, filters: JournalFilters) {
  const values = {
    d: filters.domain === 'all' ? '' : filters.domain,
    q: filters.query.trim(),
    a: filters.audio ? '1' : '',
    v: filters.video ? '1' : '',
    sort: filters.sort === 'oldest' ? 'oldest' : '',
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
}

export function matchesJournalFilters(
  row: { [key: string]: string | undefined },
  filters: JournalFilters,
  needle: string,
): boolean {
  return (filters.domain === 'all' || row.domain === filters.domain)
    && (!filters.audio || row.audio === '1')
    && (!filters.video || row.video === '1')
    && (!needle || row.search?.includes(needle) === true);
}
