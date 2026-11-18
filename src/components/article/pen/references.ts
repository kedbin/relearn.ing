import { place, textNodes } from './dom';

export function referencePreviews(prose: HTMLElement, preview: HTMLElement, signal: AbortSignal) {
  const sources = new Map<string, string>();
  const referenceSections = new Set<Element>();
  for (const head of prose.querySelectorAll('h2, h3, h4')) {
    if (!/^(references|sources)$/i.test(head.textContent?.trim() ?? '')) continue;
    for (let el = head.nextElementSibling; el; el = el.nextElementSibling) {
      if (/^H[1-6]$/.test(el.tagName) && el.tagName <= head.tagName) break;
      referenceSections.add(el);
      if (el.tagName !== 'P') continue;
      const match = el.textContent?.trim().match(/^\[(\d+)\]\s+([\s\S]+)/);
      if (match) sources.set(match[1], match[2].replace(/\s+/g, ' '));
    }
  }

  const markers = new Map<HTMLElement, string>();
  if (sources.size) for (const { node } of textNodes(prose)) {
    const parent = node.parentElement;
    if (!parent || parent.closest('a, button, pre, code, .footnotes, h1, h2, h3, h4')
      || [...referenceSections].some((el) => el.contains(node))) continue;
    for (const match of [...node.data.matchAll(/\[(\d+)\]/g)].reverse()) {
      const text = sources.get(match[1]);
      if (!text) continue;
      const citation = node.splitText(match.index!);
      citation.splitText(match[0].length);
      const marker = document.createElement('span');
      marker.className = 'pen-citation';
      marker.tabIndex = 0;
      marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `Reference ${match[1]}`);
      citation.replaceWith(marker);
      marker.append(citation);
      markers.set(marker, text);
    }
  }

  for (const link of prose.querySelectorAll<HTMLAnchorElement>('sup a[data-footnote-ref]')) {
    const id = link.hash.slice(1);
    let target = document.getElementById(id);
    try { target ??= document.getElementById(decodeURIComponent(id)); } catch { /* malformed hash */ }
    if (!target || !prose.contains(target)) continue;
    const clone = target.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-footnote-backref], .data-footnote-backref').forEach((el) => el.remove());
    const text = clone.textContent?.trim().replace(/\s+/g, ' ');
    if (text) markers.set(link, text);
  }

  let active: HTMLElement | undefined;
  let touch = false;
  let locked = false;
  let hoverTimer = 0;
  const quote = preview.querySelector('p')!;
  const jump = preview.querySelector('a')!;
  function close() {
    window.clearTimeout(hoverTimer);
    active?.removeAttribute('aria-describedby');
    active?.setAttribute('aria-expanded', 'false');
    active = undefined;
    locked = false;
    preview.hidden = true;
  }
  function position() {
    if (active && !place(preview, active.getBoundingClientRect(), false)) close();
  }
  function open(marker: HTMLElement, pinned = false) {
    if (active && active !== marker) close();
    active = marker;
    locked = pinned;
    quote.textContent = markers.get(marker)!;
    jump.hidden = !(touch && marker instanceof HTMLAnchorElement);
    if (marker instanceof HTMLAnchorElement) jump.href = marker.href;
    preview.hidden = false;
    marker.setAttribute('aria-describedby', quote.id);
    marker.setAttribute('aria-expanded', 'true');
    position();
  }

  for (const marker of markers.keys()) {
    marker.classList.add('pen-citation');
    marker.setAttribute('aria-controls', preview.id);
    marker.setAttribute('aria-expanded', 'false');
    marker.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      touch = false;
      window.clearTimeout(hoverTimer);
      if (!locked) open(marker);
    }, { signal });
    marker.addEventListener('pointerleave', () => {
      if (!locked && document.activeElement !== marker) hoverTimer = window.setTimeout(close, 140);
    }, { signal });
    marker.addEventListener('pointerdown', (event) => { touch = event.pointerType === 'touch'; }, { signal });
    marker.addEventListener('focus', () => {
      if (!touch || marker.matches(':focus-visible')) {
        touch = false;
        open(marker);
      }
    }, { signal });
    marker.addEventListener('blur', (event) => {
      if (active === marker && !preview.contains(event.relatedTarget as Node | null)) close();
    }, { signal });
    marker.addEventListener('click', (event) => {
      if (!document.getSelection()?.isCollapsed) return;
      if (marker instanceof HTMLAnchorElement && (!touch || event.detail === 0)) {
        close();
        return; // Mouse and keyboard follow the original footnote link.
      }
      event.preventDefault();
      if (active === marker && locked) close();
      else open(marker, true);
    }, { signal });
    if (!(marker instanceof HTMLAnchorElement)) marker.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (active === marker) close(); else open(marker, true);
    }, { signal });
  }
  // Preserve non-modal hover content long enough to move the pointer into it.
  preview.addEventListener('pointerenter', () => window.clearTimeout(hoverTimer), { signal });
  preview.addEventListener('pointerleave', () => {
    if (!locked && document.activeElement !== active) close();
  }, { signal });
  jump.addEventListener('click', close, { signal });
  document.addEventListener('pointerdown', (event) => {
    const target = event.target as Node;
    if (!preview.contains(target) && !active?.contains(target)) close();
  }, { signal });
  document.addEventListener('keydown', (event) => {
    if (active && event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      close();
    }
  }, { signal });
  return { close, position };
}
