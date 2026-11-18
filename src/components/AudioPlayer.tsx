import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { formatClock, minutesLabel, nextSpeed, speedLabel } from './article/article-utils';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

/**
 * Slim inline narration player: play/pause, "Listen · N min", a thin scrubbable line,
 * elapsed/total and a speed toggle. Ruled, not boxed. Keyboard accessible
 * (button + native range input: arrows seek 5s, Home/End jump).
 */
export default function AudioPlayer({ src, title = 'Listen' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    // Metadata may already be loaded before hydration.
    if (Number.isFinite(a.duration) && a.duration > 0) setDuration(a.duration);
    return () => a.pause();
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || error) return;
    if (!a.paused) {
      a.pause();
      return;
    }
    setLoading(true);
    try {
      await a.play();
    } catch {
      setLoading(false);
    }
  };

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    const t = parseFloat(e.target.value);
    if (a && Number.isFinite(t)) a.currentTime = t;
    setTime(t);
  };

  const jump = (t: number) => {
    const a = audioRef.current;
    const next = Math.max(0, Math.min(duration || 0, t));
    if (a) a.currentTime = next;
    setTime(next);
  };

  const onSeekKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const map: Record<string, number> = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 };
    if (e.key in map) { e.preventDefault(); jump(time + map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); jump(0); }
    else if (e.key === 'End') { e.preventDefault(); jump(duration); }
  };

  const cycleRate = () => {
    const r = nextSpeed(rate);
    setRate(r);
    if (audioRef.current) audioRef.current.playbackRate = r;
  };

  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  const mins = minutesLabel(duration);
  const label = error ? 'Audio unavailable' : mins ? `${title} · ${mins}` : title;

  return (
    <div className="audio-player flex items-center gap-4 border-y py-4" data-playing={playing || undefined}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlaying={() => { setLoading(false); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => { setPlaying(false); setTime(0); }}
        onError={() => { setError(true); setLoading(false); setPlaying(false); }}
      />

      <button
        type="button"
        onClick={toggle}
        disabled={error}
        aria-label={playing ? 'Pause narration' : 'Play narration'}
        aria-pressed={playing}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-text text-bg transition-colors duration-200 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:bg-faint/40"
      >
        {loading && playing === false ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.6" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : playing ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <rect x="2.5" y="1.5" width="3" height="11" rx="0.5" />
            <rect x="8.5" y="1.5" width="3" height="11" rx="0.5" />
          </svg>
        ) : (
          <svg className="ml-0.5 h-3.5 w-3.5" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.4-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5Z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium text-text">{label}</span>
          <span className="num shrink-0 text-xs text-muted" aria-hidden="true">
            {formatClock(time)}
            <span className="text-faint"> / {formatClock(duration)}</span>
          </span>
        </div>
        <div className="group relative mt-2.5 h-4 rounded-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line/20" />
          <div
            className="pointer-events-none absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent"
            style={{ width: `${pct}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 [[data-playing]_&]:opacity-100"
            style={{ left: `${pct}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="any"
            value={time}
            onChange={seek}
            onKeyDown={onSeekKey}
            disabled={error || !duration}
            aria-label="Seek narration"
            aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 focus:outline-none disabled:cursor-default"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={cycleRate}
        disabled={error}
        aria-label={`Playback speed ${speedLabel(rate)}. Change speed`}
        className="num h-10 min-w-[3.25rem] shrink-0 rounded-full border px-2.5 text-xs text-muted transition-colors duration-200 hover:border-text/30 hover:text-text disabled:opacity-40"
      >
        {speedLabel(rate)}
      </button>
    </div>
  );
}
