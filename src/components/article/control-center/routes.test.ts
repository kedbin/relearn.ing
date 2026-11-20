import { describe, expect, it } from 'vitest';
import { LOCAL_STEPS, MODES, TARGETS, finalFrame, frameAt, outcome, phases, targetById } from './routes';

const modes = ['agent', 'ssh'] as const;

describe('entry 069 control center', () => {
  it('verifies only the Windows laptop; the Linux VPS stays proposed', () => {
    expect(TARGETS.filter((t) => t.status === 'verified').map((t) => t.id)).toEqual(['laptop']);
    expect(TARGETS.filter((t) => t.kind === 'vps').every((t) => t.status === 'proposed')).toBe(true);
  });

  it('leads with the agent task; one-shot SSH is the secondary diagnostic', () => {
    expect(MODES[0].id).toBe('agent');
    expect(MODES.map((m) => m.id)).toEqual(['agent', 'ssh']);
  });

  it('assigns out, works on the target, and reports back on the same route', () => {
    for (const m of modes) expect(phases(m).map((p) => p.kind)).toEqual(['out', 'local', 'back']);
    const [out, , back] = phases('agent');
    expect(out.payload).toMatch(/reply route/);
    expect(back.payload).toMatch(/verdict/);
    expect(back.payload).toMatch(/report path/);
    expect(back.via).toMatch(/hc send/);
  });

  it('never presents a playback as evidence, and never claims a VPS result', () => {
    for (const m of modes) {
      expect(outcome(targetById('vps'), m).result).toMatch(/^Proposed\. Nothing has run/);
      expect(outcome(targetById('laptop'), m).result).toMatch(/^Playback only\./);
    }
    expect(targetById('vps').evidence).toMatch(/not run yet/);
  });

  it('keeps host details out of every visible string', () => {
    const text = [
      ...TARGETS.flatMap((t) => [t.name, t.role, t.evidence]),
      ...modes.flatMap((m) => [...phases(m).flatMap((p) => [p.title, p.payload, p.via]), ...LOCAL_STEPS[m]]),
      ...TARGETS.flatMap((t) => modes.flatMap((m) => Object.values(outcome(t, m)))),
    ];
    for (const s of text) expect(s).not.toMatch(/@|\d+\.\d+\.\d+|[A-Z]:\\|\/home\/|\bt\d+[a-z]?\b|localhost/);
  });

  it('moves the packet out, holds it on the target while working, then brings it back', () => {
    expect(frameAt(0, 'agent')).toMatchObject({ kind: 'out', u: 0, step: -1, packet: true });
    const mid = frameAt(.5, 'agent')!;
    expect(mid).toMatchObject({ kind: 'local', u: 1, packet: false });
    expect(mid.step).toBeGreaterThanOrEqual(0);
    expect(frameAt(.97, 'agent')).toMatchObject({ kind: 'back', local: 1, step: LOCAL_STEPS.agent.length });
    expect(frameAt(1, 'agent')!.u).toBe(0);
    expect(frameAt(-1, 'agent')).toBeNull();
    expect(frameAt(1.2, 'agent')).toBeNull();
  });

  it('walks every local step in order', () => {
    const seen = new Set<number>();
    for (let t = 0; t <= 1; t += .005) { const f = frameAt(t, 'agent')!; if (f.kind === 'local') seen.add(f.step); }
    expect([...seen]).toEqual(LOCAL_STEPS.agent.map((_, i) => i));
  });

  it('rests with the work done and nothing in flight', () => {
    expect(finalFrame('agent')).toMatchObject({ local: 1, packet: false, step: LOCAL_STEPS.agent.length });
  });
});
