import React, { useState, useEffect, useRef } from 'react';

/*
  TerminalBoot — an animated typewriter terminal for the hero.

  Replaces the static handwritten "Building a better operating system for me →"
  note, which read as high-contrast noise with a pointless arrow. This conveys
  *what relearning is* through a looping boot sequence, reinforcing the
  "operating system for the self" thesis in the site's own monospace voice.

  Honors prefers-reduced-motion: renders the full sequence instantly.
*/

type Line = { kind: 'cmd' | 'out' | 'ok'; text: string };

const SEQUENCE: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'kim — relearning in public' },
  { kind: 'cmd', text: 'relearn --mission' },
  { kind: 'out', text: 'build a better operating system for the self' },
  { kind: 'cmd', text: 'relearn --focus' },
  { kind: 'out', text: 'sleep · focus · tools · decisions' },
  { kind: 'cmd', text: 'relearn --loop' },
  { kind: 'ok', text: 'learn → ship → measure → repeat' },
];

const TYPE_MS = 34;
const LINE_MS = 420;
const RESTART_MS = 2600;

export const TerminalBoot = () => {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [typed, setTyped] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reduced-motion users get the full sequence instantly (no typewriter loop).
  useEffect(() => {
    if (reduceMotion) {
      setTyped(SEQUENCE.map((l) => l.text));
      setActiveLine(SEQUENCE.length);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    // Finished the whole sequence → pause, then restart.
    if (activeLine >= SEQUENCE.length) {
      timer.current = setTimeout(() => {
        setTyped([]);
        setActiveLine(0);
        setCharIdx(0);
      }, RESTART_MS);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }

    const current = SEQUENCE[activeLine].text;

    // Still typing the current line.
    if (charIdx <= current.length) {
      timer.current = setTimeout(() => {
        setTyped((prev) => {
          const next = [...prev];
          next[activeLine] = current.slice(0, charIdx);
          return next;
        });
        setCharIdx((c) => c + 1);
      }, TYPE_MS);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }

    // Line fully typed → advance after a beat.
    timer.current = setTimeout(() => {
      setActiveLine((l) => l + 1);
      setCharIdx(0);
    }, LINE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [activeLine, charIdx, reduceMotion]);

  const done = activeLine >= SEQUENCE.length;

  return (
    <div className="notebook-card !p-0 overflow-hidden">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-surface-2/50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-redsoft/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green/80" />
        <span className="ml-2 font-mono text-[11px] text-muted">~/relearn — bash</span>
      </div>

      {/* body */}
      <div className="p-5 font-mono text-[13px] leading-relaxed min-h-[210px]">
        {SEQUENCE.map((line, i) => {
          const text = typed[i] ?? '';
          if (text === '' && i >= activeLine) return null;
          const isCmd = line.kind === 'cmd';
          const isOk = line.kind === 'ok';
          const showCursor = !reduceMotion && i === activeLine && !done;
          return (
            <div key={i} className="flex gap-2">
              {isCmd ? (
                <span className="shrink-0 select-none text-green">$</span>
              ) : (
                <span className="shrink-0 select-none text-muted/50">›</span>
              )}
              <span className={isOk ? 'text-green' : isCmd ? 'text-text/90' : 'text-muted'}>
                {text}
                {showCursor && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-green/80 align-middle" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TerminalBoot;
