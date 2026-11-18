type JournalDomain = 'all' | 'engineering' | 'life' | 'work';

export interface JournalFilters {
  domain: JournalDomain;
  query: string;
  audio: boolean;
  video: boolean;
  sort: 'newest' | 'oldest';
  /** Inclusive ISO date window (YYYY-MM-DD), e.g. from the homepage record brush. */
  from: string;
  to: string;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isoOrEmpty = (v: string | null) => (v && ISO.test(v) ? v : '');

export function readJournalFilters(params: URLSearchParams): JournalFilters {
  const domain = params.get('d');
  return {
    domain: domain === 'engineering' || domain === 'life' || domain === 'work' ? domain : 'all',
    query: params.get('q') ?? '',
    audio: params.get('a') === '1',
    video: params.get('v') === '1',
    sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
    from: isoOrEmpty(params.get('from')),
    to: isoOrEmpty(params.get('to')),
  };
}

export function writeJournalFilters(params: URLSearchParams, filters: JournalFilters) {
  const values = {
    d: filters.domain === 'all' ? '' : filters.domain,
    q: filters.query.trim(),
    a: filters.audio ? '1' : '',
    v: filters.video ? '1' : '',
    sort: filters.sort === 'oldest' ? 'oldest' : '',
    from: filters.from,
    to: filters.to,
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
    && (!needle || row.search?.includes(needle) === true)
    && (!filters.from || (row.date ?? '') >= filters.from)
    && (!filters.to || (row.date ?? '') <= filters.to);
}
