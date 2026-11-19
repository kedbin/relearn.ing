// Runtime bridge for Canvas/Three; see docs/COLOR.md. Read once per theme, never per frame.
import colors from '../../../styles/colors.json';
export type ScenePalette = Record<keyof typeof colors, string>;
export function readPalette(host: HTMLElement): ScenePalette {
  const style = getComputedStyle(host);
  return Object.fromEntries(Object.keys(colors).map(role => {
    const channels = style.getPropertyValue('--' + role).trim().split(/\s+/);
    // Three's CSS parser accepts the legacy comma-separated sRGB spelling.
    return [role, 'rgb(' + channels.join(',') + ')'];
  })) as ScenePalette;
}
