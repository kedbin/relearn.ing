import { getCollection, type CollectionEntry } from 'astro:content';
import { isJournalVisible } from './journal-visibility';

export type Entry = CollectionEntry<'journal'>;
export type Project = CollectionEntry<'projects'>;
export type Domain = 'Engineering' | 'Life' | 'Work';

const includeDrafts = () => process.env.JOURNAL_INCLUDE_DRAFTS === 'true';

/** Visible journal entries, newest first (ties broken by entry number desc). */
export async function getEntries(): Promise<Entry[]> {
  const entries = await getCollection('journal', (e) => isJournalVisible(e, includeDrafts()));
  return entries.sort((a, b) => {
    const d = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    return d !== 0 ? d : entryNumber(b.id) - entryNumber(a.id);
  });
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

/** "entry-068" -> 68 */
export function entryNumber(id: string): number {
  const m = id.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/** "entry-068" -> "068" */
export function entryNo(id: string): string {
  return String(entryNumber(id)).padStart(3, '0');
}

/**
 * Collapse the many free-form categories into three domains.
 * "Relearn Life / X" -> Life, "Relearn Work / X" -> Work, everything else -> Engineering.
 */
export function domainOf(category: string): Domain {
  const head = category.split('/')[0].trim().toLowerCase();
  if (head.includes('life') || head.includes('learning')) return 'Life';
  if (head.includes('work')) return 'Work';
  return 'Engineering';
}

/** "Relearn Engineering / AI Engineering" -> "AI Engineering" */
export function topicOf(category: string): string {
  return category.split('/').pop()?.trim() || category;
}

export function domainDotClass(d: Domain): string {
  return d === 'Life' ? 'dot-life' : d === 'Work' ? 'dot-work' : 'dot-eng';
}

export function wordCount(body?: string): number {
  if (!body) return 0;
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(body?: string): number {
  return Math.max(1, Math.round(wordCount(body) / 230));
}

/** "2026-11-04" -> "Nov 4, 2026" (UTC-safe) */
export function formatDate(date: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  const d = new Date(date + (date.length === 10 ? 'T12:00:00Z' : ''));
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });
}

/** Entries sharing domain/topic, excluding self; topic matches first. */
export function relatedEntries(entry: Entry, all: Entry[], n = 3): Entry[] {
  const topic = topicOf(entry.data.category);
  const domain = domainOf(entry.data.category);
  const scored = all
    .filter((e) => e.id !== entry.id)
    .map((e) => {
      let s = 0;
      if (topicOf(e.data.category) === topic) s += 3;
      if (domainOf(e.data.category) === domain) s += 1;
      s -= Math.abs(entryNumber(e.id) - entryNumber(entry.id)) / 1000; // proximity tiebreak
      return { e, s };
    })
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, n).map((x) => x.e);
}

/** Older / newer neighbours in chronological order. */
export function neighbours(entry: Entry, all: Entry[]): { prev?: Entry; next?: Entry } {
  const i = all.findIndex((e) => e.id === entry.id);
  return { next: i > 0 ? all[i - 1] : undefined, prev: i >= 0 ? all[i + 1] : undefined };
}

export interface SiteStats {
  entries: number;
  words: number;
  narrated: number;
  videos: number;
  firstDate: string;
  latestDate: string;
  days: number;
  projects: number;
}

export function siteStats(entries: Entry[], projects: Project[] = []): SiteStats {
  const dates = entries.map((e) => e.data.date).sort();
  const first = dates[0] ?? '';
  const latest = dates[dates.length - 1] ?? '';
  const days = first ? Math.round((Date.now() - new Date(first).getTime()) / 86_400_000) : 0;
  return {
    entries: entries.length,
    words: entries.reduce((s, e) => s + wordCount(e.body), 0),
    narrated: entries.filter((e) => !!e.data.audioUrl).length,
    videos: entries.filter((e) => !!e.data.youtube_video_id).length,
    firstDate: first,
    latestDate: latest,
    days,
    projects: projects.length,
  };
}

/** Lightweight, serialisable record for client islands (search palette, filters). */
export interface EntryLite {
  id: string;
  no: string;
  title: string;
  summary: string;
  date: string;
  domain: Domain;
  topic: string;
  minutes: number;
  audio: boolean;
  video: boolean;
}

export function toLite(e: Entry): EntryLite {
  return {
    id: e.id,
    no: entryNo(e.id),
    title: e.data.title,
    summary: e.data.summary,
    date: e.data.date,
    domain: domainOf(e.data.category),
    topic: topicOf(e.data.category),
    minutes: readingTime(e.body),
    audio: !!e.data.audioUrl,
    video: !!e.data.youtube_video_id,
  };
}
