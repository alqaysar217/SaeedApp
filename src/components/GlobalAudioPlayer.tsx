"use client";

import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Play, Pause } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const {
    currentSurah,
    isPlaying,
    handlePlayPause,
    isPlayerVisible,
    audioRef
  } = useAudioPlayer();
  const pathname = usePathname();
  const router = useRouter();

  if (!currentSurah || pathname === '/quran') {
    return (
        <>
            <audio ref={audioRef} />
        </>
    );
  }

  return (
    <>
        <audio ref={audioRef} />
        <div 
            className={cn(
                "fixed bottom-24 left-4 z-10 transition-transform duration-300",
                isPlayerVisible ? "translate-y-0" : "translate-y-[200%]"
            )}
            style={{ visibility: isPlayerVisible ? 'visible' : 'hidden' }}
        >
        <div 
            className="relative"
            onClick={e => e.stopPropagation()}
        >
            <Button 
                size="icon" 
                onClick={() => router.push('/quran')} 
                className="w-14 h-14 bg-primary/90 hover:bg-primary/100 backdrop-blur-xl text-primary-foreground rounded-full shadow-lg border-2 border-background"
                aria-label="Open full player"
            >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
        </div>
      </div>
    </>
  );
}
