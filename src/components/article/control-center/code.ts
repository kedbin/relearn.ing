/**
 * The code panel for entry 069's figure. Illustrative only: the browser never runs any of it.
 * Each line says which part of the hand-off it belongs to, so playback can highlight it:
 * out = dispatch, local = local work (worker) or the event wait (Pi), back = the callback.
 * `step` ties a worker line to LOCAL_STEPS.agent[step]. `build-vps`, `phone/t1` and `build-vps/t4` are
 * fictional addresses: the phone's Pi is t1 on its own core, the worker is t4 on build-vps.
 */
import type { PhaseKind } from './routes';

export interface CodeLine { text: string; at?: PhaseKind; step?: number }
export interface CodePanel { id: 'pi' | 'worker' | 'ssh'; label: string; where: string; lines: CodeLine[] }

export const CODE: readonly CodePanel[] = [
  {
    id: 'pi', label: 'Pi · Termux', where: 'Pi codemode on the phone',
    lines: [
      { text: '// One brief: scope, checks, report file, how to reply.' },
      { text: 'const task = "Fix the flaky date test in /srv/app. Own src/date.ts" +', at: 'out' },
      { text: '  " and its test only. Run npm test, write reports/date-fix.md," +', at: 'out' },
      { text: '  " then hc send your parent one line tagged [date-fix].";', at: 'out' },
      { text: 'await tools.bash({ command:', at: 'out' },
      { text: '  `hc run --bg --on build-vps --name date-fix --cwd /srv/app pi \'${task}\'` });', at: 'out' },
      { text: '// → build-vps/t4. Pi ends its turn: no loop, no sleep, no wait needed.', at: 'local' },
      { text: '// The report is typed into this session over the same connection:', at: 'back' },
      { text: '//   <hc from="build-vps/t4">[date-fix] pass · npm test · none · reports/…</hc>', at: 'back' },
      { text: '// Follow-up? Same worker, same checkout, no new spawn:' },
      { text: 'await tools.bash({ command: \'hc send build-vps/t4 "Also cover leap years"\' });' },
    ],
  },
  {
    id: 'worker', label: 'Worker · build-vps', where: 'what the named agent runs, in its own checkout',
    lines: [
      { text: '# date-fix starts with the task as its first message', at: 'out' },
      { text: '# reads the brief: owned files, checks, report path', at: 'local', step: 0 },
      { text: '$EDITOR src/date.ts src/date.test.ts', at: 'local', step: 1 },
      { text: 'npm test', at: 'local', step: 2 },
      { text: '$EDITOR reports/date-fix.md   # written before replying', at: 'local', step: 3 },
      { text: '# Not "hc send t1": on this core, bare t1 is build-vps\'s own t1.', at: 'back' },
      { text: 'parent=$(hc get "$HC_TERMINAL_ID" --json | jq -r .parent)  # phone/t1', at: 'back' },
      { text: 'hc send "$parent" "[date-fix] <verdict> · <checks> · <blockers> · reports/date-fix.md"', at: 'back' },
    ],
  },
  {
    id: 'ssh', label: 'One-shot SSH', where: 'the quick diagnostic, no agent',
    lines: [
      { text: '// A status check, not a hand-off.' },
      { text: 'await tools.bash({ command:', at: 'out' },
      { text: '  "ssh build-vps git -C /srv/app status --short" });', at: 'out' },
      { text: '# runs once on the target, no context kept', at: 'local', step: 0 },
      { text: '// stdout + exit code come back on the same SSH call', at: 'back' },
    ],
  },
];

export const codeById = (id: CodePanel['id']) => CODE.find((c) => c.id === id)!;
