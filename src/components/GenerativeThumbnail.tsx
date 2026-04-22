import React, { useMemo } from 'react';

/*
  Deterministic generative thumbnails for journal entries and projects.
  Each ID produces a unique, consistent abstract composition using CSS/SVG.
  Scene types: arch, orb, grid, wave, constellation, crystal, stack, portal
*/

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const PALETTES = [
  { name: 'moss', bg: '#0f1410', accent: '#7aa876', secondary: '#4a6b47', glow: 'rgba(122,168,118,0.25)' },
  { name: 'amber', bg: '#14110f', accent: '#c9a96e', secondary: '#8a7348', glow: 'rgba(201,169,110,0.25)' },
  { name: 'slate', bg: '#0f1114', accent: '#8a9bb0', secondary: '#55667a', glow: 'rgba(138,155,176,0.25)' },
  { name: 'rose', bg: '#140f10', accent: '#b07a7a', secondary: '#7a4e4e', glow: 'rgba(176,122,122,0.2)' },
  { name: 'teal', bg: '#0f1414', accent: '#6ea8a0', secondary: '#4a7a72', glow: 'rgba(110,168,160,0.25)' },
  { name: 'gold', bg: '#14120f', accent: '#d4b896', secondary: '#967d5c', glow: 'rgba(212,184,150,0.25)' },
];

const SCENE_TYPES = ['arch', 'orb', 'grid', 'wave', 'constellation', 'crystal', 'stack', 'portal'] as const;

interface GenerativeThumbnailProps {
  seed: string;
  className?: string;
}

export const GenerativeThumbnail = ({ seed, className = '' }: GenerativeThumbnailProps) => {
  const rand = useMemo(() => seededRandom(hashString(seed)), [seed]);
  
  const palette = useMemo(() => PALETTES[Math.floor(rand() * PALETTES.length)], [rand]);
  const sceneType = useMemo(() => SCENE_TYPES[Math.floor(rand() * SCENE_TYPES.length)], [rand]);
  
  const baseStyle: React.CSSProperties = {
    background: `radial-gradient(ellipse at ${30 + rand() * 40}% ${20 + rand() * 30}%, ${palette.glow} 0%, transparent 70%), ${palette.bg}`,
  };

  const renderScene = () => {
    switch (sceneType) {
      case 'arch':
        return <ArchScene rand={rand} palette={palette} />;
      case 'orb':
        return <OrbScene rand={rand} palette={palette} />;
      case 'grid':
        return <GridScene rand={rand} palette={palette} />;
      case 'wave':
        return <WaveScene rand={rand} palette={palette} />;
      case 'constellation':
        return <ConstellationScene rand={rand} palette={palette} />;
      case 'crystal':
        return <CrystalScene rand={rand} palette={palette} />;
      case 'stack':
        return <StackScene rand={rand} palette={palette} />;
      case 'portal':
        return <PortalScene rand={rand} palette={palette} />;
      default:
        return <OrbScene rand={rand} palette={palette} />;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={baseStyle}
    >
      {renderScene()}
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }}
      />
    </div>
  );
};

/* --- Scene Components --- */

function ArchScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const archCount = 2 + Math.floor(rand() * 3);
  const arches = Array.from({ length: archCount }, (_, i) => ({
    width: 20 + rand() * 30,
    height: 40 + rand() * 40,
    left: 10 + rand() * 60,
    bottom: -10,
    opacity: 0.3 + rand() * 0.4,
    borderWidth: 1 + rand() * 2,
    delay: i * 0.1,
  }));

  return (
    <div className="absolute inset-0">
      {/* Moon */}
      <div 
        className="absolute rounded-full"
        style={{
          width: 20 + rand() * 20,
          height: 20 + rand() * 20,
          top: 15 + rand() * 20,
          right: 20 + rand() * 30,
          background: palette.accent,
          opacity: 0.6,
          filter: `blur(${2 + rand() * 2}px)`,
          boxShadow: `0 0 ${20 + rand() * 20}px ${palette.glow}`,
        }}
      />
      {/* Arches */}
      {arches.map((arch, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: arch.width,
            height: arch.height,
            left: `${arch.left}%`,
            bottom: arch.bottom,
            borderTop: `${arch.borderWidth}px solid ${palette.accent}`,
            borderLeft: `${arch.borderWidth}px solid ${palette.accent}`,
            borderRight: `${arch.borderWidth}px solid ${palette.accent}`,
            borderRadius: `${arch.width / 2}px ${arch.width / 2}px 0 0`,
            opacity: arch.opacity,
          }}
        />
      ))}
      {/* Steps */}
      {Array.from({ length: 3 + Math.floor(rand() * 3) }, (_, i) => (
        <div
          key={`step-${i}`}
          className="absolute"
          style={{
            width: 40 + rand() * 60,
            height: 2,
            bottom: 20 + i * 15,
            left: 10 + rand() * 40,
            background: `linear-gradient(90deg, transparent, ${palette.secondary}, transparent)`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

function OrbScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const orbs = Array.from({ length: 3 + Math.floor(rand() * 4) }, (_, i) => ({
    size: 15 + rand() * 50,
    x: 10 + rand() * 80,
    y: 10 + rand() * 80,
    opacity: 0.15 + rand() * 0.35,
    blur: 2 + rand() * 8,
  }));

  return (
    <div className="absolute inset-0">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: i === 0 ? palette.accent : palette.secondary,
            opacity: orb.opacity,
            filter: `blur(${orb.blur}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {/* Center glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 60 + rand() * 40,
          height: 60 + rand() * 40,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${palette.accent}30 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

function GridScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const rows = 4 + Math.floor(rand() * 4);
  const cols = 4 + Math.floor(rand() * 4);
  const nodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() > 0.4) {
        nodes.push({ r, c, active: rand() > 0.6 });
      }
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-60">
        {/* Grid lines */}
        {Array.from({ length: rows }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="10" y1={10 + (i * 80) / (rows - 1)}
            x2="90" y2={10 + (i * 80) / (rows - 1)}
            stroke={palette.secondary}
            strokeWidth="0.3"
            opacity="0.5"
          />
        ))}
        {Array.from({ length: cols }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={10 + (i * 80) / (cols - 1)} y1="10"
            x2={10 + (i * 80) / (cols - 1)} y2="90"
            stroke={palette.secondary}
            strokeWidth="0.3"
            opacity="0.5"
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={10 + (node.c * 80) / (cols - 1)}
            cy={10 + (node.r * 80) / (rows - 1)}
            r={node.active ? 2 : 1}
            fill={node.active ? palette.accent : palette.secondary}
            opacity={node.active ? 0.8 : 0.4}
          />
        ))}
      </svg>
    </div>
  );
}

function WaveScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const waves = 3 + Math.floor(rand() * 3);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: waves }, (_, i) => (
          <path
            key={i}
            d={`M0,${60 + i * 15} Q50,${30 + i * 15} 100,${60 + i * 15} T200,${60 + i * 15}`}
            fill="none"
            stroke={i === 0 ? palette.accent : palette.secondary}
            strokeWidth={1 + (waves - i) * 0.5}
            opacity={0.3 + (waves - i) * 0.15}
          />
        ))}
        {/* Vertical bars */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={`bar-${i}`}
            x={20 + i * 22}
            y={40 + rand() * 30}
            width={3 + rand() * 4}
            height={20 + rand() * 40}
            rx={2}
            fill={palette.secondary}
            opacity={0.2 + rand() * 0.3}
          />
        ))}
      </svg>
    </div>
  );
}

function ConstellationScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const stars = Array.from({ length: 8 + Math.floor(rand() * 8) }, () => ({
    x: 15 + rand() * 70,
    y: 15 + rand() * 70,
    size: 1 + rand() * 3,
    opacity: 0.4 + rand() * 0.6,
  }));

  const connections = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 35 && rand() > 0.5) {
        connections.push({ i, j });
      }
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        {/* Connections */}
        {connections.map((conn, idx) => (
          <line
            key={idx}
            x1={stars[conn.i].x}
            y1={stars[conn.i].y}
            x2={stars[conn.j].x}
            y2={stars[conn.j].y}
            stroke={palette.secondary}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {/* Stars */}
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={i === 0 ? palette.accent : palette.secondary}
            opacity={star.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

function CrystalScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const crystals = Array.from({ length: 3 + Math.floor(rand() * 3) }, (_, i) => ({
    x: 20 + rand() * 60,
    y: 30 + rand() * 40,
    width: 15 + rand() * 20,
    height: 25 + rand() * 35,
    rotation: -15 + rand() * 30,
    opacity: 0.2 + rand() * 0.3,
  }));

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-4">
      {crystals.map((crystal, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${crystal.x}%`,
            bottom: '15%',
            transform: `rotate(${crystal.rotation}deg) translateX(-50%)`,
            opacity: crystal.opacity,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${crystal.width / 2}px solid transparent`,
              borderRight: `${crystal.width / 2}px solid transparent`,
              borderBottom: `${crystal.height}px solid ${i === 0 ? palette.accent : palette.secondary}`,
            }}
          />
          <div
            style={{
              width: crystal.width,
              height: crystal.height * 0.6,
              background: `linear-gradient(180deg, ${palette.secondary}40, ${palette.bg})`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>
      ))}
      {/* Base glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '80%',
          height: '30%',
          background: `radial-gradient(ellipse at center, ${palette.glow} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

function StackScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const layers = 4 + Math.floor(rand() * 4);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ perspective: '400px' }}>
        {Array.from({ length: layers }, (_, i) => {
          const width = 60 + (layers - i) * 15;
          const opacity = 0.15 + (layers - i) * 0.08;
          return (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 rounded-lg border"
              style={{
                width,
                height: 8,
                bottom: i * 12,
                background: i === layers - 1 ? `${palette.accent}30` : `${palette.secondary}20`,
                borderColor: `${palette.secondary}40`,
                opacity,
                transform: `rotateX(60deg) translateZ(${i * 5}px)`,
                boxShadow: i === layers - 1 ? `0 0 15px ${palette.glow}` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PortalScene({ rand, palette }: { rand: () => number; palette: typeof PALETTES[0] }) {
  const rings = 4 + Math.floor(rand() * 3);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: rings }, (_, i) => {
        const size = 20 + i * 18;
        const opacity = 0.5 - i * 0.08;
        return (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: i === 0 ? `${palette.accent}60` : `${palette.secondary}40`,
              borderWidth: i === 0 ? 2 : 1,
              opacity: Math.max(0.1, opacity),
              boxShadow: i === 0 ? `0 0 20px ${palette.glow}` : 'none',
            }}
          />
        );
      })}
      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          background: palette.accent,
          boxShadow: `0 0 10px ${palette.accent}`,
        }}
      />
    </div>
  );
}
