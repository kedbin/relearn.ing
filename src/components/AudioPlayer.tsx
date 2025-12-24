import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title = "Audio Overview" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Lazy initialization - only create audio element on first user interaction
  const initializeAudio = useCallback(() => {
    if (audioRef.current || isInitialized) return audioRef.current;
    
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = src;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('canplay', () => {
      setIsLoading(false);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.addEventListener('error', () => {
      setError(true);
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audio.addEventListener('playing', () => {
      setIsLoading(false);
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audioRef.current = audio;
    setIsInitialized(true);
    return audio;
  }, [src, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = async () => {
    if (error) return;

    const audio = initializeAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audio.play();
      } catch (err) {
        // Silently handle - user may have paused quickly or audio not ready
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-slate-500 font-bold mb-2 font-display">
          <Headphones className="w-4 h-4" />
          <h3>{title}</h3>
        </div>
        <p className="text-xs text-slate-600">Audio unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-brand-300 font-bold mb-4 font-display">
        <Headphones className="w-4 h-4" />
        <h3>{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Play Button and Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-500 disabled:bg-brand-700 disabled:cursor-wait text-white rounded-full transition-colors shadow-lg shadow-brand-900/30"
            aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          <div className="flex-1 space-y-1">
            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-xs text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            disabled={!isInitialized}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-600 transition-colors rounded-lg hover:bg-slate-800/50"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Listen prompt */}
        <p className="text-xs text-slate-500">
          Listen to a quick audio overview of this entry
        </p>
      </div>
    </div>
  );
}
