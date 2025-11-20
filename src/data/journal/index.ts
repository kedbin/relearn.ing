export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  status: string;
  category: string;
  filename: string;
  content?: string; // Optional for now, populated by fetch or direct string
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
    filename: "entry-001.md",
    content: `
# The Physics of Productivity

*Note: This is a placeholder for the full markdown content. In the future, this will be loaded dynamically.*

Productivity is often misunderstood as doing more things in less time. But true productivity—leverage—is about the ratio of output to input.

## The Solow-Swan Model

In economics, the Solow-Swan model explains long-run economic growth. It suggests that capital accumulation alone cannot sustain growth indefinitely due to diminishing returns. The only driver of sustained long-term growth is **technological progress**.

Applying this to personal productivity:
*   **Labor (L):** Your time and effort.
*   **Capital (K):** Your skills and knowledge.
*   **Technology (A):** The tools and systems you use.

If you only increase L (work harder), you hit burnout. If you only increase K (learn more), you hit diminishing returns. But if you improve A (better tools/systems), you shift the entire production function upwards.

## The Relearn.ing Protocol

1.  **Friction Log:** Document every moment of resistance.
2.  **Tool Selection:** Pick one tool to solve the highest friction point.
3.  **J-Curve Implementation:** Accept the initial dip in productivity while learning the tool, knowing the long-term gain is exponential.
    `
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
