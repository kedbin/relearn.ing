import { describe, expect, it } from 'vitest';
import { CODE, codeById } from './code';
import { LOCAL_STEPS } from './routes';

const all = CODE.flatMap((c) => c.lines.map((l) => l.text)).join('\n');
/** Lines that would run, without comments. */
const runnable = CODE.flatMap((c) => c.lines.map((l) => l.text.replace(/(^|\s)(#|\/\/).*$/, '')).filter((t) => t.trim())).join('\n');

describe('entry 069 code panel', () => {
  it('dispatches a named interactive worker on the placeholder VPS from Pi codemode', () => {
    const pi = codeById('pi').lines.map((l) => l.text).join('\n');
    expect(pi).toMatch(/tools\.bash/);
    expect(pi).toMatch(/hc run --bg --on build-vps --name date-fix/);
    expect(pi).not.toMatch(/hc wait/); // optional, not required: the report is typed into Pi
  });

  it('reuses the one interactive worker for follow-ups instead of spawning per reply', () => {
    const pi = codeById('pi').lines.map((l) => l.text).join('\n');
    expect(pi.match(/hc run/g)).toHaveLength(1);
    expect(pi).toMatch(/hc send build-vps\/t4/);
  });

  it('has the worker find its own parent and reply to exactly that address', () => {
    const w = codeById('worker').lines.map((l) => l.text).join('\n');
    expect(w).toMatch(/hc get "\$HC_TERMINAL_ID" --json/);
    expect(w).toMatch(/hc send "\$parent"/);
    expect(w).toMatch(/\[date-fix\]/);
    expect(w).toMatch(/bare t1 is build-vps's own t1/);
    expect(w).toMatch(/# phone\/t1/);
    expect(runnable).not.toMatch(/hc send "?t1\b/);
  });

  it('never polls and never claims a different transport', () => {
    expect(runnable).not.toMatch(/\bsleep\b|setInterval|setTimeout|while\s*\(|for\s*\(|websocket|webhook/i);
  });

  it('uses placeholders only: no real hosts, users or addresses', () => {
    expect(all).not.toMatch(/@|\d+\.\d+\.\d+|[A-Z]:\\|\/home\/|localhost|tailnet|\.ts\.net/);
    const addrs = all.match(/\b[\w-]*\/?t\d+\b/g) ?? [];
    expect(new Set(addrs)).toEqual(new Set(['t1', 'phone/t1', 'build-vps/t4']));
  });

  it('gives every phase a highlighted line, and the worker one line per local step', () => {
    for (const c of CODE) {
      const kinds = new Set(c.lines.map((l) => l.at).filter(Boolean));
      expect([...kinds].sort()).toEqual(['back', 'local', 'out']);
    }
    const steps = codeById('worker').lines.filter((l) => l.at === 'local').map((l) => l.step);
    expect(steps).toEqual(LOCAL_STEPS.agent.map((_, i) => i));
    expect(codeById('ssh').lines.filter((l) => l.at === 'local').map((l) => l.step)).toEqual(LOCAL_STEPS.ssh.map((_, i) => i));
  });
});
