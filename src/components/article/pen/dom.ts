export function textNodes(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest('script, style, template, [hidden]')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  let offset = 0;
  const nodes: { node: Text; start: number; end: number }[] = [];
  for (let next = walker.nextNode(); next; next = walker.nextNode()) {
    const node = next as Text;
    nodes.push({ node, start: offset, end: offset + node.length });
    offset += node.length;
  }
  return nodes;
}

export function stream(root: HTMLElement) {
  return textNodes(root).map(({ node }) => node.data).join('');
}

export function selectionOffsets(root: HTMLElement, range: Range) {
  const nodes = textNodes(root);
  function offset(container: Node, position: number) {
    const point = document.createRange();
    point.setStart(container, position);
    point.collapse(true);
    let last = 0;
    for (const { node, start, end } of nodes) {
      if (node === container) return start + position;
      if (point.comparePoint(node, node.length) > 0) break;
      last = end;
    }
    return last;
  }
  return {
    start: offset(range.startContainer, range.startOffset),
    end: offset(range.endContainer, range.endOffset),
  };
}

/** Split text nodes, never clone or reparent author markup (including links and TOC headings). */
export function inkRange(root: HTMLElement, start: number, end: number, id: number) {
  const marks: HTMLElement[] = [];
  for (const entry of textNodes(root)) {
    if (entry.end <= start || entry.start >= end) continue;
    const from = Math.max(0, start - entry.start);
    const to = Math.min(entry.node.length, end - entry.start);
    if (!entry.node.data.slice(from, to).trim()) continue;
    const part = from ? entry.node.splitText(from) : entry.node;
    if (to - from < part.length) part.splitText(to - from);
    const mark = document.createElement('mark');
    mark.className = 'ink';
    mark.dataset.ink = String(id);
    part.replaceWith(mark);
    mark.append(part);
    marks.push(mark);
  }
  const control = marks.find((mark) => !mark.parentElement?.closest('a, button, [role="button"]'));
  if (control) {
    control.tabIndex = 0;
    control.setAttribute('role', 'button');
    control.setAttribute('aria-label', `Manage highlighted passage: ${control.textContent?.trim().slice(0, 80)}`);
  }
  return marks;
}

export function place(el: HTMLElement, rect: DOMRect, above: boolean) {
  const view = window.visualViewport;
  const left = view?.offsetLeft ?? 0;
  const viewportTop = view?.offsetTop ?? 0;
  const top = Math.max(viewportTop, document.getElementById('site-header')?.getBoundingClientRect().bottom ?? 0);
  const width = Math.min(view?.width ?? Infinity, document.documentElement.getBoundingClientRect().width);
  const bottom = viewportTop + (view?.height ?? window.innerHeight);
  if (rect.bottom < top || rect.top > bottom) return false;
  el.style.setProperty('--pen-width', `${width - 16}px`);
  const gap = 10;
  const over = above ? rect.top - el.offsetHeight - gap >= top + 8
    : rect.bottom + gap + el.offsetHeight > bottom - 8;
  const x = Math.min(Math.max(rect.left + rect.width / 2 - el.offsetWidth / 2, left + 8),
    left + width - el.offsetWidth - 8);
  const y = over ? rect.top - el.offsetHeight - gap : rect.bottom + gap;
  el.style.left = `${x}px`;
  el.style.top = `${Math.max(top + 8, Math.min(y, bottom - el.offsetHeight - 8))}px`;
  el.style.setProperty('--pen-arrow', `${Math.min(el.offsetWidth - 14, Math.max(14, rect.left + rect.width / 2 - x))}px`);
  el.dataset.side = over ? 'above' : 'below';
  return true;
}
