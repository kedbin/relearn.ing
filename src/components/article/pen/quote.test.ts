import { describe, expect, it } from 'vitest';
import { serializeQuote, resolveQuote, readQuotes, textFragment } from './quote';

describe('text quote selectors', () => {
  it('serializes exact text and context and resolves its original position', () => {
    const text = 'The notebook holds three small marks in blue.';
    const quote = serializeQuote(text, 19, 36);
    expect(quote).toEqual({ exact: 'three small marks', prefix: 'The notebook holds ', suffix: ' in blue.' });
    expect(resolveQuote(text, quote)).toEqual({ start: 19, end: 36 });
  });

  it('re-anchors a duplicate excerpt after an insertion and a nearby edit', () => {
    const text = 'Then the tool left three small marks on the final sheet. Elsewhere: three small marks on the cover.';
    const quote = serializeQuote(text, 19, 36);
    const changed = 'Yesterday: ' + text.replace('the tool left', 'the nib left');
    const start = changed.indexOf(quote.exact);
    expect(resolveQuote(changed, quote)).toEqual({ start, end: start + quote.exact.length });
  });

  it('leaves absent or genuinely ambiguous quotes unresolved', () => {
    const quote = serializeQuote('three small marks', 0, 17);
    expect(resolveQuote('nothing here', quote)).toBeNull();
    expect(resolveQuote('three small marks; three small marks', quote)).toBeNull();
  });

  it('accepts only valid persisted selectors', () => {
    expect(readQuotes('invalid')).toEqual([]);
    expect(readQuotes('[null,{"exact":"ink"},{"exact":"ink","prefix":"","suffix":""}]'))
      .toEqual([{ exact: 'ink', prefix: '', suffix: '' }]);
  });

  it('encodes text fragment syntax and uses endpoints across paragraphs', () => {
    expect(textFragment('the pen-tip, blue')).toBe('the%20pen%2Dtip%2C%20blue');
    expect(textFragment('a short paragraph\n\n another short paragraph'))
      .toBe('a%20short%20paragraph,another%20short%20paragraph');
  });
});
