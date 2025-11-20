export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  status: string;
  category: string;
  filename: string;
}

export const journalEntries: JournalEntry[] = [
  {
    id: "1",
    title: "The Physics of Productivity: Mastering the Input/Output Ratio Through Tool-Driven Growth",
    date: "November 19, 2025",
    summary: "Exploring how tools serve as the fulcrum between input and output, applying economic models like Solow-Swan to personal productivity, and introducing the Relearn.ing Protocol for systematic leverage optimization.",
    highlights: [
      "Solow-Swan model applied to personal growth: technological progress (tools) creates sustainable growth beyond just increasing input",
      "Extended Mind Thesis: tools become part of our cognitive circuit through cognitive offloading",
      "Surgical checklist study: 36% reduction in complications, 47% reduction in deaths through simple process tools",
      "Relearn.ing Protocol: 3-phase framework (Friction Log → Tool Selection → J-Curve Implementation)"
    ],
    status: "Published",
    category: "Systems Thinking / Cognitive Science",
    filename: "entry-001.md"
  }
];

export const getJournalEntry = async (id: string): Promise<string | null> => {
  const entry = journalEntries.find(e => e.id === id);
  if (!entry) return null;
  
  try {
    const response = await fetch(`/journal/${entry.filename}`);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error('Error loading journal entry:', error);
    return null;
  }
};

export const getAllJournalEntries = (): JournalEntry[] => {
  return journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
