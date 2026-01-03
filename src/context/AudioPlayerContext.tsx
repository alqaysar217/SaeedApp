
"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { qaris, surahs } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type Qari = typeof qaris[0];
type Surah = typeof surahs[0];

interface AudioPlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  selectedQari: Qari;
  setSelectedQari: (qari: Qari) => void;
  currentSurah: Surah | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isPlayerVisible: boolean;
  playSurah: (surah: Surah) => void;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSeek: (value: number[]) => void;
  formatTime: (seconds: number) => string;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQari, setSelectedQariState] = useState<Qari>(qaris[0]);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  
  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement>(null);
  const seekTimeRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playSurah = useCallback((surah: Surah) => {
    if (currentSurah?.id !== surah.id) {
        seekTimeRef.current = 0;
    }
    setCurrentSurah(surah);
    setIsPlayerVisible(true);
    if (audioRef.current) {
      const surahId = String(surah.id).padStart(3, '0');
      const audioSrc = `${selectedQari.server}/${surahId}.mp3`;
      if (audioRef.current.src !== audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
            setIsPlaying(false);
            toast({
              variant: "destructive",
              title: "خطأ في التشغيل",
              description: "عذراً، هذه السورة غير متوفرة حالياً بصوت هذا القارئ.",
            });
        });
    }
  }, [selectedQari, toast, currentSurah]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentSurah) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleNext = () => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex(s => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex(s => s.id === currentSurah.id);
    if (currentIndex > 0) {
      playSurah(surahs[currentIndex - 1]);
    }
  };
  
  const handleSeek = (value: number[]) => {
      if (audioRef.current) {
        audioRef.current.currentTime = value[0];
        setProgress(value[0]);
    }
  };

  const setSelectedQari = (qari: Qari) => {
    if (currentSurah && audioRef.current && !audioRef.current.paused) {
        seekTimeRef.current = audioRef.current.currentTime;
    }
    setSelectedQariState(qari);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setAudioData = () => {
        setDuration(audio.duration);
        if (seekTimeRef.current > 0 && seekTimeRef.current < audio.duration) {
            audio.currentTime = seekTimeRef.current;
            seekTimeRef.current = 0;
        }
    }
    const onEnded = () => {
        handleNext();
    };

    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    const onError = (e: Event) => {
      if (currentSurah) {
        setIsPlaying(false);
        toast({
          variant: "destructive",
          title: "خطأ في التشغيل",
          description: `تعذر تحميل تلاوة سورة ${currentSurah.name}. قد تكون غير متوفرة لهذا القارئ.`,
        });
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('error', onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);
  
  useEffect(() => {
    if (currentSurah) {
      playSurah(currentSurah);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQari]);


  return (
    <AudioPlayerContext.Provider value={{ 
        audioRef,
        selectedQari, 
        setSelectedQari, 
        currentSurah, 
        isPlaying, 
        progress, 
        duration, 
        isPlayerVisible,
        playSurah, 
        handlePlayPause, 
        handleNext, 
        handlePrev, 
        handleSeek, 
        formatTime 
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};
