import { z, defineCollection } from 'astro:content';

const journalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // Or z.date() if you convert it
    summary: z.string(),
    highlights: z.array(z.string()),
    status: z.string(),
    category: z.string(),
  }),
});

export const collections = {
  'journal': journalCollection,
};
