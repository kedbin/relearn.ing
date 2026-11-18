/**
 * About-page content, curated from binasoy.kim/src/content/content.json.
 * Edit here; the page in src/pages/about.astro renders whatever is in this file.
 */

export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ExperienceItem {
  start: string; // "Mar 2026"
  end: string; // "Present" | "Apr 2026"
  role: string;
  company: string;
  note?: string; // employment type / location line
  aside?: string; // tiny faint mono aside after the note
  bullets: string[];
}

export interface Cert {
  issuer: string;
  name: string;
  issued: string; // "Feb 2026"
  expires?: string;
  url: string;
  featured: boolean;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface NowItem {
  label: string;
  text: string;
  href?: string;
}

export const profile = {
  name: 'Kim Edrian Binasoy',
  shortName: 'Kim',
  location: 'Toronto, Canada',
  role: 'AI Automation Engineer at Accenture',
  photo: { src: '/about/kim.webp', alt: 'Portrait of Kim Edrian Binasoy in a grey suit and round glasses', caption: 'Toronto · 2026' },
  email: 'hello@binasoy.kim',
  links: {
    portfolio: { label: 'binasoy.kim', href: 'https://binasoy.kim' },
    github: { label: 'GitHub', href: 'https://github.com/kedbin' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/' },
    threads: { label: 'Threads', href: 'https://www.threads.com/@relearn.ing' },
    resume: { label: 'Résumé (PDF)', href: 'https://binasoy.kim/Kim_Binasoy_Resume.pdf' },
  } satisfies Record<string, Link>,
};

/** Short field-notes list shown under the portrait. */
export const facts: { k: string; v: string }[] = [
  { k: 'Based in', v: 'Toronto, Canada' },
  { k: 'Day job', v: 'AI Automation Engineer, Accenture' },
  { k: 'Before that', v: 'Clinical lab, BS Medical Technology' },
  { k: 'Weekends', v: 'The camper van, with Wingwing' },
];

export const nowUpdated = 'Nov 2026';

export const now: NowItem[] = [
  { label: 'Day job', text: 'Building AI-assisted Playwright pipelines and review agents at Accenture.' },
  { label: 'Training', text: 'Fresh out of the Gemini Enterprise Forward Deployed Engineer bootcamp, and writing up the field notes.' },
  { label: 'Studying', text: 'Georgia Tech’s analytics coursework on edX, one notebook at a time.' },
  { label: 'This site', text: 'Logging every experiment here, and rebuilding the notebook itself in public.' },
];

export const stats: Stat[] = [
  { value: '5×', label: 'faster test authoring via AI agents' },
  { value: '90%', label: 'of content distribution automated through relearn.ing' },
  { value: '70%', label: 'less time spent on test documentation' },
];

export const experience: ExperienceItem[] = [
  {
    start: 'Mar 2026',
    end: 'Present',
    role: 'AI Automation Engineer',
    company: 'Accenture',
    note: 'Toronto · Full-time',
    bullets: [
      'Architecting an AI-assisted Playwright pipeline for an enterprise logistics web app.',
      'Built an agent skill that turns Azure DevOps user stories into Playwright scripts, cutting authoring from 15–30 min to 5 min.',
      'Wired CI runs and review agents into PR gates to catch flaky tests and steps that drift from acceptance criteria.',
    ],
  },
  {
    start: 'Dec 2025',
    end: 'Present',
    role: 'Founder',
    company: 'Relearning AI Labs',
    note: 'Self-employed · the lab behind this site',
    bullets: [
      'Built relearn.ing end to end: a static Astro site deployed by GitHub Actions on every commit.',
      'Added a build step that narrates journal entries with a cloned voice, plus a serverless fan-out to LinkedIn and Threads.',
      'Experimenting with local, hybrid inference for agentic workflows at zero infrastructure cost.',
    ],
  },
  {
    start: 'Jun 2023',
    end: 'Apr 2026',
    role: 'Cloud Operations & Quality Automation Engineer',
    company: 'Accenture',
    note: 'Toronto · Hybrid',
    bullets: [
      'Ran three Azure environments for a transportation platform and mapped 800+ test cases across the release pipeline.',
      'Led incident triage and DR exercises against RTO/RPO targets; kept 10+ runbooks current.',
      'Built a tool that cut test documentation time by 70%, and an MVP Gen-AI bot for onboarding new joiners.',
    ],
  },
  {
    start: 'Jun 2022',
    end: 'Jun 2023',
    role: 'Program Management & App Dev',
    company: 'Accenture',
    note: 'Banking engagement',
    bullets: [
      'Owned onboarding and offboarding for a 200+ person engagement at peak.',
      'Built Power Automate and Power Apps tooling that made PMO workflows 50–75% faster.',
    ],
  },
  {
    start: '2014',
    end: '2017',
    role: 'BS Medical Technology',
    company: 'Far Eastern University',
    note: 'Where it started',
    aside: 'pipettes → pipelines',
    bullets: [
      'Trained as a clinical lab scientist: specimens, protocols, quality control. I swapped the pipettes for pipelines, but kept the habit of writing everything down.',
    ],
  },
];

export const certs: Cert[] = [
  { issuer: 'Google', name: 'Gemini Enterprise Forward Deployed Engineer Bootcamp', issued: 'Oct 2026', featured: true, url: 'https://www.credly.com/badges/782af94c-39ec-41ca-bcac-c4a379d8a9ad/linked_in_profile' },
  { issuer: 'Google Cloud', name: 'Professional Cloud DevOps Engineer', issued: 'Feb 2026', expires: 'Feb 2028', featured: true, url: 'https://www.credly.com/badges/22eafd76-a507-400d-867d-cc62fbf40986/linked_in_profile' },
  { issuer: 'Google Cloud', name: 'Professional Security Operations Engineer', issued: 'Jan 2026', expires: 'Jan 2028', featured: true, url: 'https://www.credly.com/badges/88c46e17-22f6-44ab-a6cd-bfe4570889ba/linked_in_profile' },
  { issuer: 'Google Cloud', name: 'Professional Cloud Architect', issued: 'Jan 2026', expires: 'Jan 2028', featured: true, url: 'https://www.credly.com/badges/b588458a-fda4-48a0-bed9-5eae89063272/linked_in_profile' },
  { issuer: 'Google', name: 'Generative AI Leader', issued: 'Dec 2025', expires: 'Dec 2028', featured: true, url: 'https://www.credly.com/badges/3343c287-cdf3-4fe7-9a95-ff72840ef117/linked_in_profile' },
  { issuer: 'Microsoft', name: 'Azure Developer Associate (AZ-204)', issued: 'Dec 2024', expires: 'Dec 2026', featured: true, url: 'https://learn.microsoft.com/api/credentials/share/en-ca/BinasoyKimEdrian-5255/4105622AA6791074?sharingId=EC9611BB547AD22B' },
  { issuer: 'Amazon Web Services', name: 'AWS Cloud Practitioner', issued: 'Dec 2023', expires: 'Dec 2026', featured: true, url: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/L54219BD5E1QQGWP' },
  { issuer: 'Google', name: 'Partner Specialist · Gemini Enterprise Agent Development', issued: 'Sep 2026', expires: 'Mar 2027', featured: false, url: 'https://www.credly.com/badges/a2f0efa8-0fe8-4227-a6d2-052fb336e4c9/linked_in_profile' },
  { issuer: 'Google', name: 'Partner Specialist · Gemini Enterprise Deployment', issued: 'Sep 2026', expires: 'Mar 2027', featured: false, url: 'https://www.credly.com/badges/f4f01cc5-a7e4-43a9-ad89-5b04d5423400/linked_in_profile' },
  { issuer: 'Georgia Tech', name: 'Data Analytics for Business (edX Verified)', issued: 'May 2026', featured: false, url: 'https://courses.edx.org/certificates/4c0db0275a464f528f4ecbc6f2a4598d' },
  { issuer: 'Accenture', name: 'Reinvention with Agentic AI', issued: 'Feb 2026', featured: false, url: 'https://www.credly.com/badges/ece9a89e-03fc-4612-8221-c1df3ca37aaf/linked_in_profile' },
  { issuer: 'Kaggle × Google', name: '5-Day AI Agents Intensive', issued: 'Dec 2025', featured: false, url: 'https://www.kaggle.com/certification/badges/k3dbin/105' },
  { issuer: 'Microsoft', name: 'Azure AI Fundamentals (AI-900)', issued: 'Jun 2022', featured: false, url: 'https://www.credly.com/badges/884a0e87-74d7-478d-ad3d-c8414bb3e123?source=linked_in_profile' },
  { issuer: 'Microsoft', name: 'Azure Fundamentals (AZ-900)', issued: 'Apr 2021', featured: false, url: 'https://www.credly.com/badges/ad2ed2d6-4792-4a47-8bdb-a9225eebe712?source=linked_in_profile' },
];

export const skills: SkillGroup[] = [
  { title: 'Cloud', items: ['Google Cloud', 'Microsoft Azure', 'AWS'] },
  { title: 'AI & agents', items: ['Agentic workflows', 'LLM orchestration', 'LLMOps', 'Gemini Enterprise', 'GitHub Copilot'] },
  { title: 'Automation & QA', items: ['Playwright', 'E2E & regression testing', 'Power Automate', 'Power Apps'] },
  { title: 'DevOps & IaC', items: ['GitHub Actions', 'Azure DevOps', 'Terraform', 'Docker', 'Git'] },
  { title: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'Bash'] },
  { title: 'Reliability', items: ['Incident response', 'Disaster recovery', 'Runbooks', 'Monitoring'] },
];

export const principles: { title: string; body: string }[] = [
  { title: 'Build in public', body: 'Accountability is a feature. The repo is open, and every entry is a commit anyone can read, fork or critique.' },
  { title: 'Honest metrics', body: 'No hype. Numbers come from the content itself, and if a habit didn’t stick, the chart says so.' },
  { title: 'Ship v0.1 habits', body: 'Commit, test, deploy, monitor, repeat. A small habit that ships beats a perfect system that never leaves draft.' },
  { title: 'Failures get logged', body: 'If a prompt failed or an agent hallucinated, it goes in the notebook. The misses teach more than the wins.' },
];

export const vanPhoto = {
  src: '/about/van-lake.webp',
  alt: 'Kim and Wingwing inflating a raft on a lake beach at sunset, autumn hills behind',
  caption: 'Off the clock: Wingwing and I built a camper out of our minivan. Here we are inflating the raft at Arrowhead Lake.',
};

/* ───────────── helpers ───────────── */

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "Feb 2026" -> sortable number (2026*12+1). "2017" -> 2017*12. Unparseable -> 0. */
export function monthKey(s: string): number {
  const m = s.trim().match(/^(?:([A-Za-z]{3})[a-z]*\s+)?(\d{4})$/);
  if (!m) return 0;
  const mi = m[1] ? MONTHS.indexOf(m[1].toLowerCase()) : 0;
  return parseInt(m[2], 10) * 12 + Math.max(0, mi);
}

/** Split certs into featured and the rest, each newest first. */
export function partitionCerts(list: Cert[]): { featured: Cert[]; rest: Cert[] } {
  const byDate = [...list].sort((a, b) => monthKey(b.issued) - monthKey(a.issued));
  return { featured: byDate.filter((c) => c.featured), rest: byDate.filter((c) => !c.featured) };
}
