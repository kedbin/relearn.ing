export interface QuoteSelector {
  exact: string;
  prefix: string;
  suffix: string;
}

export function serializeQuote(text: string, start: number, end: number): QuoteSelector {
  return {
    exact: text.slice(start, end),
    prefix: text.slice(Math.max(0, start - 48), start),
    suffix: text.slice(end, end + 48),
  };
}

/** Keep the exact quote; rank duplicate occurrences by matching adjacent context.
 * A tie is unresolved rather than silently inking a different passage.
 */
export function resolveQuote(text: string, { exact, prefix, suffix }: QuoteSelector) {
  if (!exact) return null;
  let best = -1;
  let score = -1;
  for (let start = text.indexOf(exact); start !== -1; start = text.indexOf(exact, start + 1)) {
    const end = start + exact.length;
    let before = 0;
    let after = 0;
    while (before < prefix.length && prefix.at(-1 - before) === text[start - 1 - before]) before++;
    while (after < suffix.length && suffix[after] === text[end + after]) after++;
    const match = before + after;
    if (match > score) {
      best = start;
      score = match;
    } else if (match === score) {
      best = -1;
    }
  }
  return best === -1 ? null : { start: best, end: best + exact.length };
}

export function readQuotes(value: string | null): QuoteSelector[] {
  try {
    const quotes: unknown = JSON.parse(value ?? '[]');
    return Array.isArray(quotes) ? quotes.filter((quote): quote is QuoteSelector =>
      !!quote && typeof quote.exact === 'string' && !!quote.exact
      && typeof quote.prefix === 'string' && typeof quote.suffix === 'string') : [];
  } catch {
    return [];
  }
}

export function textFragment(exact: string) {
  const encode = (text: string) => encodeURIComponent(text).replace(/-/g, '%2D');
  const blocks = exact.trim().split(/\n\s*/);
  const words = exact.trim().split(/\s+/);
  if (blocks.length === 1 && words.length <= 12) return encode(words.join(' '));
  const start = blocks[0].split(/\s+/).slice(0, 5).join(' ');
  const end = blocks.at(-1)!.split(/\s+/).slice(-5).join(' ');
  return `${encode(start)},${encode(end)}`;
}
