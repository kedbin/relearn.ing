/**
 * Entry 069's control-center figure: Pi in Termux keeps the context and approvals, hands a
 * scoped task to a named agent on another machine, that agent works locally, and its report
 * comes back on the reply route it was given. Pure data and timing, shared by the Three scene,
 * the SVG fallback and the tests. Names are roles, not hosts: no addresses, users or paths.
 */
export type TargetId = 'laptop' | 'vps';
export type Status = 'verified' | 'proposed';
export type Mode = 'agent' | 'ssh';
export type PhaseKind = 'out' | 'local' | 'back';

export interface Target {
  id: TargetId;
  name: string;
  kind: 'laptop' | 'vps';
  status: Status;
  role: string;
  /** What the article says happened (verified) or is planned (proposed). */
  evidence: string;
}

export const TARGETS: readonly Target[] = [
  {
    id: 'laptop', name: 'Windows laptop', kind: 'laptop', status: 'verified', role: 'Named Pi agent, own checkout',
    evidence: 'Verified: from Termux, Herdr Core launched a named Pi agent on the laptop over Tailscale SSH, sent it text and read its screen. In a small callback test, a laptop agent sent a token to its parent and the Termux session received it.',
  },
  {
    id: 'vps', name: 'Linux VPS', kind: 'vps', status: 'proposed', role: 'Direct agent, no laptop hop',
    evidence: 'Proposed, not run yet. Same pattern, reached directly from Termux: one named agent, one scoped task, one report back.',
  },
];

export const MODES: readonly { id: Mode; label: string; hint: string }[] = [
  { id: 'agent', label: 'Agent task', hint: 'The main pattern' },
  { id: 'ssh', label: 'One-shot SSH', hint: 'A quick diagnostic' },
];

export interface Phase {
  kind: PhaseKind;
  title: string;
  /** What travels (out/back) or what happens on the target (local). */
  payload: string;
  /** How it travels, or where it runs. */
  via: string;
  ms: number;
}

/** Work the target agent does in its own checkout, in order. */
export const LOCAL_STEPS: Record<Mode, readonly string[]> = {
  agent: ['Read the brief', 'Edit in its checkout', 'Run its checks', 'Write the report file'],
  ssh: ['Run one command'],
};

export function phases(mode: Mode): Phase[] {
  if (mode === 'ssh') {
    return [
      { kind: 'out', title: 'Command', payload: 'one shell command', via: 'one-shot SSH', ms: 1000 },
      { kind: 'local', title: 'Runs', payload: 'no agent, no context', via: 'on the target', ms: 700 },
      { kind: 'back', title: 'Output', payload: 'stdout + exit code', via: 'same SSH call', ms: 1000 },
    ];
  }
  return [
    { kind: 'out', title: 'Assign', payload: 'scoped task + reply route', via: 'Herdr Core over Tailscale SSH', ms: 1300 },
    { kind: 'local', title: 'Work locally', payload: 'own checkout, own tools', via: 'on the target', ms: 2600 },
    { kind: 'back', title: 'Report', payload: 'verdict · checks · blockers · report path', via: 'reads its qualified parent on the target, then hc send over the open connection', ms: 1300 },
  ];
}

/** Playback length for one exchange, in milliseconds. */
export const exchangeMs = (mode: Mode) => phases(mode).reduce((s, p) => s + p.ms, 0);

export interface Frame {
  phase: number;
  kind: PhaseKind;
  /** Packet position along the route: 0 at Pi in Termux, 1 at the target. */
  u: number;
  /** Local work progress, 0 → 1 (1 once the work is done). */
  local: number;
  /** Index of the local step in progress; -1 before work starts, LOCAL_STEPS.length once done. */
  step: number;
  /** Whether a packet is in flight (false while working, and after the run). */
  packet: boolean;
}

const ease = (k: number) => k * k * (3 - 2 * k);

/** The state of one exchange at time t ∈ [0, 1]. */
export function frameAt(t: number, mode: Mode): Frame | null {
  if (!(t >= 0) || t > 1) return null;
  const all = phases(mode);
  const steps = LOCAL_STEPS[mode].length;
  const total = exchangeMs(mode);
  let at = t * total;
  let i = 0;
  while (i < all.length - 1 && at >= all[i].ms) { at -= all[i].ms; i++; }
  const k = Math.min(1, at / all[i].ms);
  const kind = all[i].kind;
  const localIdx = all.findIndex((p) => p.kind === 'local');
  const local = i < localIdx ? 0 : i > localIdx ? 1 : k;
  const step = i < localIdx ? -1 : i > localIdx ? steps : Math.min(steps - 1, Math.floor(k * steps));
  const u = kind === 'out' ? ease(k) : kind === 'back' ? 1 - ease(k) : 1;
  return { phase: i, kind, u, local, step, packet: kind !== 'local' };
}

/** The resting state after a run: work done, report delivered, nothing in flight. */
export const finalFrame = (mode: Mode): Frame => ({ ...frameAt(1, mode)!, packet: false });

export interface Outcome { brief: string; result: string }

/** The text the figure shows. Playback never claims to be evidence; the evidence line does that. */
export function outcome(target: Target, mode: Mode): Outcome {
  const brief = mode === 'agent'
    ? `Task for the ${target.kind === 'laptop' ? 'laptop' : 'VPS'} agent: owned files, checks, report path, reply route`
    : `One command on the ${target.kind === 'laptop' ? 'laptop' : 'VPS'}, for example a Git status`;
  if (target.status === 'proposed') {
    return { brief, result: 'Proposed. Nothing has run on a VPS yet, so this playback is illustration only.' };
  }
  const result = mode === 'agent'
    ? 'Playback only. The real laptop route is verified: launch, send and read from Termux, plus a small callback test that reached the Termux session. VPS targets and crash recovery are untested.'
    : 'Playback only. One-shot SSH to the laptop is verified. It is the quick check, not the way work gets handed off.';
  return { brief, result };
}

export const targetById = (id: string) => TARGETS.find((t) => t.id === id) ?? TARGETS[0];
export const isMode = (m: string): m is Mode => MODES.some((x) => x.id === m);
