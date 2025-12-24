import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title = "Audio Overview" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-brand-300 font-bold mb-4 font-display">
        <Headphones className="w-4 h-4" />
        <h3>{title}</h3>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="space-y-4">
        {/* Play Button and Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-full transition-colors shadow-lg shadow-brand-900/30"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
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
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
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
