import { describe, expect, it } from 'vitest';
import { LANES } from './routes';

describe('the route board', () => {
  it('compares two tasks against their July source, not a later baseline', () => {
    expect(LANES.map(l => l.site)).toEqual(['binasoy.kim', 'relearn.ing']);
    expect(LANES[0].july.source.href).toContain('/b0eabb3/src/index.html');
    expect(LANES[1].july.source.href).toContain('/a750196/src/components/JournalList.tsx');
  });
  it('distinguishes the two card choices from bypassing the card', () => {
    const modes = LANES[0].now.fork!;
    expect(modes.filter(w => w.tag.startsWith('Card')).length).toBe(2);
    expect(modes.filter(w => w.tag.startsWith('Bypass')).map(w => w.name)).toEqual(['Plain reader']);
  });
  it('offers both the number and the subject from the home page', () => {
    expect(LANES[1].now.stops[0].title).toContain('home page');
    expect(LANES[1].now.fork!.map(w => w.name)).toEqual(['By number', 'By subject']);
  });
});
