import React from 'react';
import { cn } from '../../lib/utils';

interface HandwrittenNoteProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
}

export const HandwrittenNote = ({ children, className, rotation = -2 }: HandwrittenNoteProps) => {
  return (
    <div 
      className={cn(
        "text-note font-medium italic opacity-90",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)`, fontFamily: "'Caveat', cursive" }}
    >
      {children}
    </div>
  );
};
