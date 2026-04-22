import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    status: z.string(),
    category: z.string(),
    audioUrl: z.string().optional(),
    linkedin_video_urn: z.string().optional(),
    youtube_url: z.string().optional(),
    youtube_video_id: z.string().optional(),
    publish_social: z.boolean().optional(),
    linkedin: z.string().optional(),
    threads: z.string().optional(),
    youtube_title: z.string().optional(),
    youtube_description: z.string().optional(),
    youtube_tags: z.array(z.string()).optional(),
    youtube_privacy_status: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    techStack: z.array(z.string()),
    audioUrl: z.string().optional(),
  }),
});

export const collections = { journal, projects };
