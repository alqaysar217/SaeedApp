"use client";

import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function QuranPlayer() {
  const {
    currentSurah,
    selectedQari,
    isPlaying,
    progress,
    duration,
    handlePlayPause,
    handleNext,
    handlePrev,
    handleSeek,
    formatTime,
    isPlayerVisible,
  } = useAudioPlayer();

  if (!isPlayerVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-20 left-1/2 w-full max-w-lg -translate-x-1/2 p-2 z-10 transition-transform duration-300",
      isPlayerVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="bg-card/80 backdrop-blur-xl border rounded-lg p-4 shadow-lg space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-foreground">{currentSurah?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedQari.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!currentSurah || currentSurah.id === 1}>
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button size="icon" onClick={handlePlayPause} className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-primary-glow transition-all" disabled={!currentSurah}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} disabled={!currentSurah || currentSurah.id === 114}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2" dir="rtl">
          <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
          <Slider
            dir="rtl"
            value={[progress]}
            max={duration || 1}
            onValueChange={handleSeek}
            className="flex-grow"
            disabled={!currentSurah}
          />
          <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
