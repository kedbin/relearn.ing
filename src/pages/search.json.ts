import type { APIRoute } from 'astro';
import { getEntries, toLite } from '../lib/content';

export const GET: APIRoute = async () => {
  const entries = await getEntries();
  return new Response(JSON.stringify(entries.map(toLite)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
