import { inkRange, place, selectionOffsets, stream, textNodes } from './dom';
import { readQuotes, resolveQuote, serializeQuote, textFragment, type QuoteSelector } from './quote';
import { referencePreviews } from './references';

type Anchor = { start: number; end: number };
type Ink = { quote: QuoteSelector; anchor: Anchor | null; marks: HTMLElement[]; id: number };
const overlaps = (a: Anchor, b: Anchor) => a.start < b.end && b.start < a.end;

export function bindPen(ui: HTMLElement, prose: HTMLElement, signal: AbortSignal) {
  const get = <T extends HTMLElement = HTMLElement>(name: string) => ui.querySelector<T>(`[data-pen="${name}"]`)!;
  const bar = get('bar');
  const copy = get('copy');
  const highlight = get<HTMLButtonElement>('highlight');
  const share = get('share');
  const remove = get('remove');
  const launcher = get('launcher');
  const dialog = get<HTMLDialogElement>('drawer');
  const list = get('list');
  const confirmation = get('confirm');
  const clear = get('clear');
  const notice = get('notice');
  const drawerNotice = get('drawer-notice');
  const title = ui.dataset.title!;
  const url = new URL(`/journal/${ui.dataset.entry}/`, 'https://relearn.ing');
  const storageKey = `relearn:pen:${ui.dataset.entry}`;
  prose.tabIndex = 0;
  prose.setAttribute('aria-label', 'Article text. Use Shift and arrow keys to select text.');
  const refs = referencePreviews(prose, get('reference'), signal);
  const text = stream(prose);
  const inks: Ink[] = [];
  let nextId = 0;
  let current: { anchor: Anchor; quote: QuoteSelector; range: Range } | undefined;
  let editing: Ink | undefined;
  let editTarget: HTMLElement | undefined;
  let dismissed: string | undefined;
  let pressing = false;
  let selecting = false;
  let toolbarPointer = false;
  let frame = 0;
  let copyTimer = 0;
  let caret: { node: Node; offset: number } | undefined;

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(inks.map(({ quote }) => quote))); }
    catch { notice.textContent = 'Storage unavailable. Marks will last only for this visit.'; }
  }

  function add(quote: QuoteSelector, anchor: Anchor | null) {
    const id = nextId++;
    if (anchor && inks.some((ink) => ink.anchor && overlaps(ink.anchor, anchor!))) anchor = null;
    const marks = anchor ? inkRange(prose, anchor.start, anchor.end, id) : [];
    const ink = { quote, anchor, marks, id };
    inks.push(ink);
    return ink;
  }

  try {
    for (const quote of readQuotes(localStorage.getItem(storageKey))) add(quote, resolveQuote(text, quote));
  } catch { /* Storage can be blocked by browser settings. */ }
  updateLauncher();

  function updateLauncher() {
    launcher.hidden = !inks.length;
    launcher.lastElementChild!.textContent = `${inks.length} ${inks.length === 1 ? 'mark' : 'marks'}`;
  }

  function drop(ink: Ink) {
    for (const mark of ink.marks) {
      const parent = mark.parentNode;
      mark.replaceWith(...mark.childNodes);
      parent?.normalize();
    }
    inks.splice(inks.indexOf(ink), 1);
  }

  function position() {
    if (bar.hidden) return;
    const rect = editTarget?.getBoundingClientRect() ??
      (current && Array.from(current.range.getClientRects()).find((r) => r.width > 0
        && r.bottom > (document.getElementById('site-header')?.getBoundingClientRect().bottom ?? 0)));
    bar.style.visibility = rect && place(bar, rect, true) ? '' : 'hidden';
  }

  function closeBar() {
    current = editing = editTarget = undefined;
    bar.hidden = true;
  }

  function showBar() {
    refs.close();
    const isEditing = !!editing;
    remove.hidden = !isEditing;
    highlight.hidden = copy.hidden = isEditing;
    highlight.disabled = !!current && inks.some((ink) => ink.anchor && overlaps(ink.anchor, current!.anchor));
    share.hidden = isEditing || typeof navigator.share !== 'function';
    bar.hidden = false;
    position();
  }

  function updateSelection() {
    if (pressing || toolbarPointer || dialog.open || bar.contains(document.activeElement)) return;
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      if (!editing) closeBar();
      dismissed = undefined;
      return;
    }
    const range = sel.getRangeAt(0);
    if (!prose.contains(range.startContainer) || !prose.contains(range.endContainer)) {
      closeBar();
      return;
    }
    const anchor = selectionOffsets(prose, range);
    while (anchor.start < anchor.end && /\s/.test(text[anchor.start])) anchor.start++;
    while (anchor.end > anchor.start && /\s/.test(text[anchor.end - 1])) anchor.end--;
    const quote = serializeQuote(text, anchor.start, anchor.end);
    if ((quote.exact.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0) < 3
      || dismissed === `${anchor.start}:${anchor.end}`) {
      closeBar();
      return;
    }
    editing = editTarget = undefined;
    current = { anchor, quote, range: range.cloneRange() };
    showBar();
  }

  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updateSelection();
    });
  }

  function paint(marks: HTMLElement[], flash = false) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const mark of marks) {
      for (const rect of mark.getClientRects()) {
        if (rect.bottom < 0 || rect.top > innerHeight || !rect.width) continue;
        const stroke = document.createElement('span');
        stroke.className = 'pen-stroke';
        stroke.setAttribute('aria-hidden', 'true');
        const css = stroke.style;
        css.left = `${rect.left}px`;
        css.top = `${rect.top}px`;
        css.width = `${rect.width}px`;
        css.height = `${rect.height}px`;
        ui.append(stroke);
        stroke.animate(flash ? [{ opacity: 1 }, { opacity: 0 }]
          : [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 0 }],
        { duration: flash ? 550 : 250, easing: 'ease-out' }).finished.then(() => stroke.remove(), () => stroke.remove());
      }
    }
  }

  function makeMark(keyboard: boolean) {
    if (!current || highlight.disabled) return;
    const { quote, anchor } = current;
    document.getSelection()?.removeAllRanges();
    closeBar();
    const ink = add(quote, anchor);
    paint(ink.marks);
    updateLauncher();
    save();
    if (keyboard) (ink.marks.find((mark) => mark.tabIndex === 0) ?? launcher).focus({ preventScroll: true });
  }

  function editMark(mark: HTMLElement, keyboard: boolean) {
    const ink = inks.find((item) => item.id === Number(mark.dataset.ink));
    if (!ink) return;
    if (editing === ink && editTarget === mark && !keyboard) { closeBar(); return; }
    current = undefined;
    editing = ink;
    editTarget = mark;
    showBar();
    if (keyboard) remove.focus({ preventScroll: true });
  }

  function quoteUrl(quote: QuoteSelector) {
    return `${url.href}#:~:text=${textFragment(quote.exact)}`;
  }

  async function copyText(text: string, status: HTMLElement, button?: HTMLElement) {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copied';
      if (!button) return;
      button.textContent = 'Copied';
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => { button.textContent = 'Copy quote'; position(); }, 1600);
    } catch {
      status.textContent = 'Could not copy to clipboard.';
      if (!button) return;
      button.textContent = 'Not copied';
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => { button.textContent = 'Copy quote'; position(); }, 1600);
    }
    position();
  }

  function drawList() {
    list.replaceChildren();
    for (const ink of inks) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = ink.quote.exact.trim().replace(/\s+/g, ' ');
      if (!ink.marks.length) {
        button.disabled = true;
        const label = document.createElement('small');
        label.textContent = 'Passage no longer found';
        label.className = 'label';
        item.append(label);
      }
      button.addEventListener('click', () => {
        const mark = ink.marks.find((piece) => piece.tabIndex === 0) ?? ink.marks[0];
        dialog.close('jump');
        mark.scrollIntoView({ block: 'center' });
        mark.focus({ preventScroll: true });
        if (document.activeElement !== mark) editMark(mark, true);
        paint(ink.marks, true);
      });
      item.append(button);
      list.append(item);
    }
  }

  const on = <K extends keyof HTMLElementEventMap>(
    node: HTMLElement, type: K, fn: (event: HTMLElementEventMap[K]) => void,
  ) => node.addEventListener(type, fn, { signal });

  on(launcher, 'click', () => {
    closeBar();
    refs.close();
    document.getSelection()?.removeAllRanges();
    dialog.returnValue = '';
    confirmation.hidden = true;
    clear.hidden = false;
    drawerNotice.textContent = '';
    drawList();
    dialog.showModal();
  });
  on(get('close'), 'click', () => dialog.close());
  on(dialog, 'click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'jump') (launcher.hidden ? prose : launcher).focus({ preventScroll: true });
  }, { signal });
  on(clear, 'click', () => {
    confirmation.hidden = false;
    clear.hidden = true;
    get('cancel').focus();
  });
  on(get('cancel'), 'click', () => {
    confirmation.hidden = true;
    clear.hidden = false;
    clear.focus();
  });
  on(get('clear-now'), 'click', () => {
    for (const ink of [...inks]) drop(ink);
    updateLauncher();
    save();
    dialog.close();
  });
  on(dialog, 'keydown', (event) => {
    if (event.key !== 'Tab') return;
    const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')).filter((btn) => btn.offsetWidth);
    const edge = event.shiftKey ? buttons.at(0) : buttons.at(-1);
    if (document.activeElement !== edge) return;
    event.preventDefault();
    (event.shiftKey ? buttons.at(-1) : buttons.at(0))?.focus();
  });
  on(get('export'), 'click', () => {
    const heading = `# ${title.replace(/\s+/g, ' ')}\n\n<${url.href}>`;
    const quotes = inks.map((ink) => `> ${ink.quote.exact.trim().replace(/\n/g, '\n> ')}`);
    void copyText([heading, ...quotes].join('\n\n'), drawerNotice);
  });

  on(bar, 'pointerdown', (event) => {
    toolbarPointer = true;
    if (event.pointerType !== 'touch' && event.button === 0) event.preventDefault(); // Retain the selection.
  });
  on(highlight, 'click', (event) => makeMark(event.detail === 0));
  on(copy, 'click', () => {
    if (!current) return;
    const quote = current.quote;
    notice.textContent = '';
    void copyText(`"${quote.exact.replace(/\s+/g, ' ')}" — ${title}, ${quoteUrl(quote)}`, notice, copy);
  });
  on(share, 'click', () => {
    if (current) void navigator.share({ title, text: current.quote.exact, url: quoteUrl(current.quote) })
      .catch((error) => { if (error.name !== 'AbortError') notice.textContent = 'Could not share this quote.'; });
  });
  on(remove, 'click', (event) => {
    if (!editing) return;
    drop(editing);
    closeBar();
    updateLauncher();
    save();
    if (event.detail === 0) prose.focus({ preventScroll: true });
  });

  function markFrom(target: EventTarget | null) {
    if (!(target instanceof Element) || target.closest('a, button, .pen-citation')) return null;
    return target.closest<HTMLElement>('mark[data-ink]');
  }

  on(prose, 'focusout', (event) => {
    if (event.target === prose && !bar.contains(event.relatedTarget as Node | null)) caret = undefined;
  });
  on(prose, 'click', (event) => {
    if (event.button !== 0 || !document.getSelection()?.isCollapsed) return;
    const mark = markFrom(event.target);
    if (mark) editMark(mark, false);
    else if (event.target instanceof Element && !event.target.closest('a, button, .pen-citation, video, iframe')) {
      // Browsers without caret browsing don't expose a collapsed caret in ordinary article text.
      const range = document.caretRangeFromPoint?.(event.clientX, event.clientY);
      const point = document.caretPositionFromPoint?.(event.clientX, event.clientY);
      if (point && prose.contains(point.offsetNode)) caret = { node: point.offsetNode, offset: point.offset };
      else if (range && prose.contains(range.startContainer)) caret = { node: range.startContainer, offset: range.startOffset };
    }
  });

  document.addEventListener('keydown', (event) => {
    if (dialog.open || event.defaultPrevented || event.isComposing) return;
    const { key } = event;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable]')) return;
    if (target === prose && /^Arrow/.test(key) && !event.altKey && !event.metaKey) {
      const sel = document.getSelection();
      if (sel?.modify) {
        if (!prose.contains(sel.focusNode)) {
          const first = textNodes(prose).find(({ node }) => node.data.trim());
          if (caret?.node.isConnected) sel.collapse(caret.node, caret.offset);
          else if (first) sel.collapse(first.node, 0);
        }
        const granularity = key === 'ArrowUp' || key === 'ArrowDown' ? 'line' : event.ctrlKey ? 'word' : 'character';
        sel.modify(event.shiftKey ? 'extend' : 'move',
          key === 'ArrowLeft' || key === 'ArrowUp' ? 'backward' : 'forward', granularity);
        if (event.shiftKey && sel.rangeCount) {
          const rect = sel.getRangeAt(0).getClientRects()[0];
          const header = document.getElementById('site-header')?.getBoundingClientRect().bottom ?? 0;
          if (rect && rect.top < header + 54 && rect.bottom >= 0) scrollBy(0, rect.top - header - 68);
        }
        event.preventDefault();
        schedule();
      }
    }
    const mark = markFrom(target);
    if (mark && (key === 'Enter' || key === ' ')) {
      event.preventDefault();
      editMark(mark, true);
    }
    if (bar.hidden || bar.style.visibility === 'hidden') return;
    if (key === 'Escape') {
      if (current) dismissed = `${current.anchor.start}:${current.anchor.end}`;
      if (bar.contains(target)) (editTarget?.tabIndex === 0 ? editTarget : prose).focus({ preventScroll: true });
      closeBar();
      event.preventDefault();
    } else if (key === 'Tab' && !event.shiftKey && !bar.contains(target)) {
      event.preventDefault();
      (editing ? remove : highlight.disabled ? copy : highlight).focus({ preventScroll: true });
    } else if (key.toLowerCase() === 'h' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.repeat && current) {
      event.preventDefault();
      makeMark(true);
    }
  }, { signal });

  document.addEventListener('selectionchange', schedule, { signal });
  document.addEventListener('pointerdown', (event) => {
    if (ui.contains(event.target as Node)) return;
    closeBar();
    pressing = event.pointerType !== 'touch' && prose.contains(event.target as Node);
    selecting = pressing;
  }, { signal });
  document.addEventListener('pointerup', () => {
    toolbarPointer = false;
    pressing = false;
    if (selecting) schedule();
    selecting = false;
  }, { signal });
  document.addEventListener('pointercancel', () => { toolbarPointer = pressing = selecting = false; }, { signal });
  const layout = () => { position(); refs.position(); };
  window.addEventListener('scroll', layout, { passive: true, signal });
  window.addEventListener('resize', layout, { passive: true, signal });
  window.visualViewport?.addEventListener('resize', layout, { signal });
  window.visualViewport?.addEventListener('scroll', layout, { signal });
  signal.addEventListener('abort', () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(copyTimer);
    refs.close();
  }, { once: true });
}
