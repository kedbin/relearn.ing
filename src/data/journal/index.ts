import fm from 'front-matter';

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  status: string;
  category: string;
  filename: string;
  content: string;
}

// Import all markdown files from the current directory
const modules = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true });

export const journalEntries: JournalEntry[] = Object.keys(modules).map((path) => {
  const filename = path.split('/').pop() || '';
  const markdownContent = modules[path] as unknown as string;
  
  // Parse frontmatter
  // fm returns { attributes: T, body: string, ... }
  const parsed = fm<any>(markdownContent);

  return {
    id: filename.replace('.md', ''),
    filename,
    content: parsed.body,
    // Map attributes, ensuring defaults if missing
    title: parsed.attributes.title || 'Untitled',
    date: parsed.attributes.date || new Date().toISOString(),
    summary: parsed.attributes.summary || '',
    highlights: parsed.attributes.highlights || [],
    status: parsed.attributes.status || 'Draft',
    category: parsed.attributes.category || 'General',
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getJournalEntry = (id: string): JournalEntry | undefined => {
  return journalEntries.find(e => e.id === id);
};

export const getAllJournalEntries = (): JournalEntry[] => {
  return journalEntries;
};