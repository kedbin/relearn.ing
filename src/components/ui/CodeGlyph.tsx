import React from 'react';
import { cn } from '../../lib/utils';

/*
  CodeGlyph — on-brand "code tag" iconography. Renders a keyword as a monospace
  tag with accent angle brackets, e.g.  <journal/>   <focus/>   <sleep/>

  This replaces bare/generic icon-only spots (nav items, category labels) with a
  distinctive, instantly-recognisable motif that fits the "engineering field
  notes / operating system for the self" identity. Pure text/CSS — infinitely
  scalable, zero image assets, and theme-aware via tokens.
*/
interface CodeGlyphProps {
  /** The keyword shown inside the brackets, e.g. "journal". */
  k: string;
  className?: string;
  /** Hide the closing slash for short inline use; default keeps `<k/>`. */
  selfClosing?: boolean;
}

export const CodeGlyph = ({ k, className = '', selfClosing = true }: CodeGlyphProps) => {
  return (
    <span className={cn('font-mono leading-none tracking-tight', className)} aria-label={k}>
      <span className="text-green">&lt;</span>
      <span className="text-text/90">{k}</span>
      {selfClosing ? <span className="text-green">/&gt;</span> : <span className="text-green">&gt;</span>}
    </span>
  );
};

export default CodeGlyph;
