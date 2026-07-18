import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

/*
  Motif — dense, theme-aware editorial illustrations used as card/hero art.

  Replaces GenerativeThumbnail, whose sparse "stack"/"grid" scenes rendered as
  near-empty dark rectangles that looked like broken skeleton loaders (confirmed
  by whole-page Gemini critiques in light AND dark mode).

  Design rules (the antidote to "empty box"):
  - The container background uses theme tokens (--surface-2 / --bg), so it is a
    soft surface in light mode and a deep surface in dark mode — never a hard
    black void on a light page.
  - The illustration is DENSE and FILLED (not thin wireframe lines): confident
    shapes, layered fills, and a radial accent glow.
  - Strokes/fills use a per-motif accent drawn from the palette (--green / --amber
    / --note / --redsoft) at high opacity, so art reads clearly in both themes.
  - Motif + accent are chosen deterministically from the seed so adjacent cards
    differ (no more repetitive identical skeletons).
*/

type AccentName = 'green' | 'amber' | 'note' | 'redsoft';
const ACCENTS: Record<AccentName, string> = {
  green: 'rgb(var(--green))',
  amber: 'rgb(var(--amber))',
  note: 'rgb(var(--blue-note))',
  redsoft: 'rgb(var(--red-soft))',
};
const ACCENT_LIST: AccentName[] = ['green', 'amber', 'note', 'redsoft'];

const MOTIFS = ['orbit', 'waveform', 'nodes', 'sunburst', 'sprout', 'brain', 'moon', 'mountain'] as const;
type MotifType = (typeof MOTIFS)[number];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** Map a content category to a preferred motif family, falling back to seed. */
function categoryToMotifs(category?: string): readonly MotifType[] {
  if (!category) return MOTIFS;
  const c = category.toLowerCase();
  const pick = (...m: MotifType[]): readonly MotifType[] => m;
  if (c.includes('life')) return pick('sprout', 'sunburst', 'moon');
  if (c.includes('sleep')) return pick('moon', 'orbit');
  if (c.includes('focus')) return pick('mountain', 'orbit');
  if (c.includes('engineer') || c.includes('build') || c.includes('ai') || c.includes('cognit')) return pick('brain', 'nodes', 'waveform');
  if (c.includes('output') || c.includes('voice') || c.includes('audio')) return pick('waveform', 'nodes');
  if (c.includes('decision')) return pick('orbit', 'nodes');
  return MOTIFS;
}

interface MotifProps {
  seed: string;
  category?: string;
  className?: string;
}

export const Motif = ({ seed, category, className = '' }: MotifProps) => {
  const { type, accentName, accent, secondary, glow } = useMemo(() => {
    const pool = categoryToMotifs(category);
    const rand = hashString(seed);
    const type = pool[rand % pool.length];
    const accentName = ACCENT_LIST[(rand >> 3) % ACCENT_LIST.length];
    const accent = ACCENTS[accentName];
    const secondary = ACCENTS[ACCENT_LIST[(rand >> 5) % ACCENT_LIST.length]];
    const glow = accent;
    return { type, accentName, accent, secondary, glow };
  }, [seed, category]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        // Themed surface — adapts to light/dark automatically.
        background:
          `radial-gradient(ellipse at 30% 25%, ${glow}22 0%, transparent 60%),` +
          `linear-gradient(160deg, rgb(var(--surface-2) / 0.9), rgb(var(--surface) / 0.95))`,
      }}
      role="img"
      aria-label={`${type} illustration`}
    >
      <Scene type={type} accent={accent} secondary={secondary} />
      {/* subtle inner border for definition in light mode */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-border/40" />
    </div>
  );
};

const Scene = ({ type, accent, secondary }: { type: MotifType; accent: string; secondary: string }) => {
  switch (type) {
    case 'orbit':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mo-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <g stroke={secondary} fill="none" opacity="0.55">
            <ellipse cx="100" cy="75" rx="80" ry="34" strokeWidth="1.4" />
            <ellipse cx="100" cy="75" rx="62" ry="48" strokeWidth="1.2" transform="rotate(28 100 75)" />
            <ellipse cx="100" cy="75" rx="44" ry="60" strokeWidth="1.1" transform="rotate(-18 100 75)" />
          </g>
          <circle cx="100" cy="75" r="30" fill="url(#mo-sun)" />
          <circle cx="100" cy="75" r="13" fill={accent} opacity="0.92" />
          <circle cx="172" cy="62" r="5" fill={accent} />
          <circle cx="44" cy="104" r="3.5" fill={secondary} />
          <circle cx="150" cy="116" r="3" fill={secondary} />
        </svg>
      );
    case 'waveform':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 26 }).map((_, i) => {
            const h = 14 + Math.abs(Math.sin(i * 0.7) * 60) + (i % 3) * 8;
            return (
              <rect key={i} x={12 + i * 7} y={75 - h / 2} width="4.2" height={h} rx="2"
                fill={i % 4 === 0 ? accent : secondary} opacity={i % 4 === 0 ? 0.95 : 0.6} />
            );
          })}
          <line x1="0" y1="75" x2="200" y2="75" stroke={accent} strokeWidth="1" opacity="0.35" />
        </svg>
      );
    case 'nodes':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <g stroke={secondary} strokeWidth="1.3" opacity="0.5">
            <line x1="40" y1="40" x2="100" y2="75" /><line x1="100" y1="75" x2="160" y2="45" />
            <line x1="100" y1="75" x2="150" y2="120" /><line x1="40" y1="40" x2="60" y2="115" />
            <line x1="60" y1="115" x2="100" y2="75" /><line x1="160" y1="45" x2="150" y2="120" />
          </g>
          {[[40, 40, 7, true], [100, 75, 12, true], [160, 45, 7, false], [150, 120, 8, false], [60, 115, 6, false]].map(
            ([x, y, r, primary], i) => (
              <circle key={i} cx={x as number} cy={y as number} r={r as number}
                fill={primary ? accent : secondary} opacity={primary ? 0.95 : 0.7} />
            ),
          )}
        </svg>
      );
    case 'sunburst':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="150" fill="url(#mo-sky)" />
          <circle cx="100" cy="150" r="62" fill={accent} opacity="0.92" />
          <circle cx="100" cy="150" r="86" fill="none" stroke={accent} strokeWidth="2" opacity="0.4" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI;
            const x2 = 100 + Math.cos(a) * 120;
            const y2 = 150 - Math.sin(a) * 120;
            return <line key={i} x1="100" y1="150" x2={x2} y2={Math.max(20, y2)} stroke={accent} strokeWidth="1.4" opacity="0.35" />;
          })}
          <path d="M0 150 Q 50 120 100 150 T 200 150 Z" fill={secondary} opacity="0.5" />
        </svg>
      );
    case 'sprout':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <path d="M100 130 L100 70" stroke={secondary} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <path d="M100 96 Q 70 86 58 64 Q 86 60 100 86" fill={accent} opacity="0.9" />
          <path d="M100 84 Q 130 74 142 52 Q 114 48 100 74" fill={accent} opacity="0.8" />
          <ellipse cx="100" cy="70" rx="15" ry="13" fill={accent} />
          <path d="M0 130 Q 50 120 100 130 T 200 130 L200 150 L0 150 Z" fill={secondary} opacity="0.3" />
          <circle cx="150" cy="40" r="4" fill={accent} opacity="0.7" />
          <circle cx="48" cy="52" r="3" fill={secondary} opacity="0.6" />
        </svg>
      );
    case 'brain':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <path d="M70 40 Q 44 44 46 74 Q 30 86 48 104 Q 50 122 74 120 Q 100 132 126 120 Q 150 122 152 104 Q 170 86 154 74 Q 156 44 130 40 Q 116 26 100 34 Q 84 26 70 40 Z"
            fill={accent} opacity="0.16" stroke={accent} strokeWidth="2" />
          <g stroke={accent} strokeWidth="1.6" fill="none" opacity="0.85" strokeLinecap="round">
            <path d="M70 60 Q 84 52 96 64" /><path d="M104 64 Q 116 52 130 60" />
            <path d="M64 84 Q 84 78 100 86 Q 116 78 136 84" /><path d="M72 104 Q 86 98 100 106 Q 114 98 128 104" />
          </g>
          <g fill={accent}>
            <circle cx="68" cy="60" r="3.4" /><circle cx="132" cy="60" r="3.4" />
            <circle cx="62" cy="84" r="3" /><circle cx="138" cy="84" r="3" />
            <circle cx="100" cy="86" r="4.2" />
          </g>
          <g stroke={secondary} strokeWidth="1" opacity="0.5">
            <line x1="68" y1="60" x2="62" y2="84" /><line x1="132" y1="60" x2="138" y2="84" />
            <line x1="62" y1="84" x2="100" y2="86" /><line x1="138" y1="84" x2="100" y2="86" />
          </g>
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mo-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="75" r="78" fill="url(#mo-glow)" />
          <path d="M128 41 a 42 42 0 1 0 0 68 a 33 33 0 1 1 0 -68 Z" fill={accent} opacity="0.92" />
          <g fill={secondary}>
            {[[40, 40, 2], [160, 50, 2.4], [50, 110, 1.8], [150, 108, 2], [70, 30, 1.6], [170, 86, 1.8]].map(([x, y, r], i) => (
              <circle key={i} cx={x as number} cy={y as number} r={r as number} opacity="0.8" />
            ))}
          </g>
          <path d="M0 150 Q 50 138 100 150 T 200 150" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.4" />
        </svg>
      );
    case 'mountain':
      return (
        <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="150" cy="46" r="20" fill={accent} opacity="0.85" />
          <path d="M0 150 L52 74 L92 120 L120 84 L168 130 L200 100 L200 150 Z" fill={accent} opacity="0.55" />
          <path d="M0 150 L40 96 L78 132 L108 100 L150 140 L200 116 L200 150 Z" fill={secondary} opacity="0.45" />
          <path d="M52 74 L66 90 L40 96 Z" fill={accent} opacity="0.9" />
          <path d="M120 84 L132 98 L108 100 Z" fill={accent} opacity="0.8" />
          <line x1="0" y1="150" x2="200" y2="150" stroke={accent} strokeWidth="1.4" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
};

export default Motif;
