const between = (position: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (position - from) / (to - from)));

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Chapter positions on the 0–100 sequence: Ready, Draw, Mirror, Mark, Zoom. */
export const CHAPTERS = [0, 25, 50, 75, 100] as const;

/**
 * Editorial scrub mapping for the studio scene, deliberately not a device latency model.
 * Everything the scene shows is a pure function of one position, so playback, scrubbing,
 * chapter jumps and the static frames always agree.
 */
export function strokeProgress(position: number) {
  const value = Number.isFinite(position) ? Math.min(100, Math.max(0, position)) : 0;
  return {
    /** The Wi-Fi thread from the Scribe to the laptop, drawn once. */
    signal: between(value, 24, 31),
    /** Local ink on the Scribe. */
    pen: between(value, 4, 23),
    /** The same stroke arriving in the browser, later than the pen (illustrative offset). */
    mirror: between(value, 30, 48),
    /** A Grimoire Photos background under the ink. */
    paper: between(value, 52, 62),
    /** The ink circle on the Scribe… */
    mark: between(value, 64, 72),
    /** …and in the browser. */
    markMirror: between(value, 67, 75),
    /** Pinch zoom on the page; the mirror shows the same view. */
    zoom: 1 + .45 * smooth(between(value, 78, 96)),
    /** 0 = resting on the desk, 1 = tip on the page. */
    stylus: Math.max(
      between(value, 0, 4) * (1 - between(value, 23, 27)),
      between(value, 58, 64) * (1 - between(value, 72, 76)),
    ),
    /** Which stroke the stylus is following. */
    stylusOn: value >= 40 ? 'mark' as const : 'ink' as const,
    /** Camera attention: −1 Scribe, +1 browser. */
    focus: -.45 * smooth(between(value, 2, 12)) * (1 - smooth(between(value, 26, 34)))
      + .5 * smooth(between(value, 28, 42)) * (1 - smooth(between(value, 50, 62))),
    /** A small push in for the zoom beat. */
    push: smooth(between(value, 76, 96)),
    frame: Math.min(4, Math.floor((value + 12.5) / 25)),
  };
}

export type StrokeState = ReturnType<typeof strokeProgress>;
