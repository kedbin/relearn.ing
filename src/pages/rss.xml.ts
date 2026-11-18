import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntries, entryNo } from '../lib/content';

export async function GET(context: APIContext) {
  const entries = await getEntries();
  return rss({
    title: 'relearn.ing',
    description: 'A public lab notebook on relearning how to work and live in the AI era.',
    site: context.site!,
    items: entries.map((e) => ({
      title: `№ ${entryNo(e.id)} — ${e.data.title}`,
      pubDate: new Date(e.data.date + 'T12:00:00Z'),
      description: e.data.summary,
      link: `/journal/${e.id}/`,
      categories: [e.data.category],
    })),
  });
}
