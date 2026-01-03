
"use client";

import React, { useState, useEffect } from 'react';
import { qaris, surahs } from '@/lib/data';
import { User, Search, Volume2, Play, Pause, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import QuranPlayer from '@/components/QuranPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { quranText, type QuranSurahText } from '@/lib/quran-text';
import { Button } from '@/components/ui/button';

type Qari = typeof qaris[0];
type Surah = typeof surahs[0];

function ListenerTab() {
  const { 
    currentSurah, 
    selectedQari, 
    isPlaying, 
    playSurah, 
    setSelectedQari, 
    isPlayerVisible 
  } = useAudioPlayer();
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleQariChange = (qariId: string) => {
    const qari = qaris.find(q => q.id === qariId);
    if (qari) {
        setSelectedQari(qari);
    }
  }

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSurahClick = (surah: Surah) => {
    playSurah(surah);
  }

  return (
    <div className='flex flex-col h-full'>
       <div className="space-y-4 px-4 pt-4">
        <Select value={selectedQari.id} onValueChange={handleQariChange} dir="rtl">
          <SelectTrigger className="w-full shadow-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="اختر القارئ" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {qaris.map(qari => (
              <SelectItem key={qari.id} value={qari.id}>{qari.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground"/>
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن سورة..." 
            className="w-full h-10 rounded-md border bg-transparent px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea dir="rtl" className="flex-grow my-4" style={{ height: `calc(100vh - ${isPlayerVisible ? '400px' : '284px'})`}}>
        <div className="px-4 space-y-2">
          {filteredSurahs.map(surah => (
            <Card 
              key={surah.id} 
              onClick={() => handleSurahClick(surah)}
              className={cn(
                "cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50",
                currentSurah?.id === surah.id ? 'bg-primary/10 border-primary/40' : 'bg-card'
              )}
            >
              <CardContent className="p-3 flex items-center gap-4">
                <span className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full text-sm font-mono transition-colors",
                    currentSurah?.id === surah.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>{surah.id}</span>
                
                <div className="flex-grow">
                  <p className={cn("font-semibold", currentSurah?.id === surah.id ? 'text-primary' : 'text-foreground')}>{surah.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {`${surah.type} - ${surah.verses} آيات`}
                  </p>
                </div>

                {currentSurah?.id === surah.id ? (
                  isPlaying ? (
                    <Volume2 className="w-5 h-5 text-primary animate-pulse mr-auto" />
                  ) : (
                    <Play className="w-5 h-5 text-primary/70 mr-auto" />
                  )
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <QuranPlayer />
    </div>
  )
}

function ReaderTab() {
  const { isPlayerVisible } = useAudioPlayer();
  const [selectedSurah, setSelectedSurah] = useState<QuranSurahText | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = React.useRef<HTMLDivElement>(null);

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSurahSelection = (surahId: number) => {
    const surahContent = quranText.find(s => s.id === surahId);
    if (surahContent) {
      setSelectedSurah(surahContent);
    }
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (!selectedSurah) return;
    const currentIndex = surahs.findIndex(s => s.id === selectedSurah.id);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < surahs.length) {
      const nextSurahInfo = surahs[nextIndex];
      const nextSurahContent = quranText.find(s => s.id === nextSurahInfo.id);
      if (nextSurahContent) {
        setSelectedSurah(nextSurahContent);
        contentRef.current?.scrollTo(0,0);
      }
    }
  }
  
  const containerHeight = isPlayerVisible ? 'calc(100vh - 210px)' : 'calc(100vh - 90px)';

  if (selectedSurah) {
    const currentSurahInfo = surahs.find(s => s.id === selectedSurah.id);
    const currentIndex = surahs.findIndex(s => s.id === selectedSurah.id);

    return (
      <div className="flex flex-col h-full" style={{ height: containerHeight }}>
        <header className="sticky top-0 z-10 flex items-center justify-between gap-1 bg-background/80 p-2 backdrop-blur-sm shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => handleNavigation('prev')} disabled={currentIndex === 0}>
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button variant="link" onClick={() => setSelectedSurah(null)} className="text-xl font-bold font-headline text-foreground h-auto p-0">{selectedSurah.name}</Button>
          
          <Button variant="ghost" size="icon" onClick={() => handleNavigation('next')} disabled={currentIndex === surahs.length - 1}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </header>

        <ScrollArea dir="rtl" className="h-full" ref={contentRef}>
            <Card className='m-4 shadow-lg'>
                <CardContent className='p-6'>
                    <div className='space-y-6'>
                    {selectedSurah.id !== 1 && selectedSurah.id !== 9 && (
                        <p className="text-center text-lg font-medium font-headline">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    )}
                    <div className='space-y-5 text-xl leading-loose text-justify font-serif'>
                        {selectedSurah.verses.map(verse => (
                        <span key={verse.id}>
                            {verse.text}
                            <span className='font-mono text-base text-primary/80 mx-1'> ({verse.id}) </span>
                        </span>
                        ))}
                    </div>
                    </div>
                </CardContent>
            </Card>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
       <div className="space-y-4 px-4 pt-4">
        <div className="relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground"/>
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن سورة..." 
            className="w-full h-10 rounded-md border bg-transparent px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea dir="rtl" className="flex-grow my-4" style={{ height: `calc(100vh - ${isPlayerVisible ? '330px' : '210px'})`}}>
        <div className="px-4 space-y-2">
          {filteredSurahs.map(surah => (
            <Card 
              key={surah.id} 
              onClick={() => handleSurahSelection(surah.id)}
              className="cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 bg-card"
            >
              <CardContent className="p-3 flex items-center gap-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-mono transition-colors bg-muted text-muted-foreground">
                  {surah.id}
                </span>
                
                <div className="flex-grow">
                  <p className="font-semibold text-foreground">{surah.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {`${surah.type} - ${surah.verses} آيات`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}


export default function QuranPage() {
  const { isPlaying } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState('listener');
  
  useEffect(() => {
    // If audio starts playing anywhere, switch to the listener tab
    if (isPlaying) {
      setActiveTab('listener');
    }
  }, [isPlaying]);


  return (
    <div className="flex flex-col h-full" dir="rtl">
      <PageHeader title="القرآن الكريم" description="استمع واقرأ كلام الله" />
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="listener" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-auto max-w-[90%] mt-4">
          <TabsTrigger value="listener" className='gap-2'>
            <Volume2 className='w-5 h-5'/>
            استماع
          </TabsTrigger>
          <TabsTrigger value="reader" className='gap-2'>
            <BookOpen className='w-5 h-5'/>
            قراءة
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listener" className='flex-grow'>
          <ListenerTab />
        </TabsContent>
        <TabsContent value="reader" className='flex-grow'>
          <ReaderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
