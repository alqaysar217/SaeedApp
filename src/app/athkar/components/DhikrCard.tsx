
"use client";

import { useState, useEffect } from 'react';
import type { Dhikr } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type DhikrCardProps = {
  dhikr: Dhikr;
  total: number;
  currentIndex: number;
};

export default function DhikrCard({ dhikr, total, currentIndex }: DhikrCardProps) {
  const [count, setCount] = useState(dhikr.count);
  const [isCompleted, setIsCompleted] = useState(false);

  const progressPercentage = ( (dhikr.count - count) / dhikr.count) * 100;

  const handleTap = () => {
    if (isCompleted) return;

    setCount((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsCompleted(true);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
      return newCount;
    });
  };

  const handleReset = () => {
    setCount(dhikr.count);
    setIsCompleted(false);
  };
  
  useEffect(() => {
    handleReset();
  }, [dhikr]);


  return (
    <Card 
      onClick={handleTap}
      className={cn(
        "text-right shadow-lg transition-all duration-300 overflow-hidden relative select-none cursor-pointer",
        isCompleted ? "bg-primary/10 border-primary/20" : "bg-card"
      )}
    >
      {isCompleted && (
        <div className="absolute top-3 left-3 flex items-center gap-2 text-xs bg-primary/20 text-primary font-semibold px-2 py-1 rounded-full">
          <Check className="w-4 h-4" />
          <span>مُكتمل</span>
        </div>
      )}
      <CardHeader className='pb-4'>
        <div className="flex justify-between items-start">
            <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">{`الذكر ${currentIndex} من ${total}`}</p>
            {dhikr.description && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="w-7 h-7 text-accent hover:bg-accent/10 flex-shrink-0">
                            <Sparkles className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir='rtl'>
                        <AlertDialogHeader>
                        <AlertDialogTitle className='flex items-center gap-2'>
                            <Sparkles className="w-5 h-5 text-accent"/>
                            فضل الذكر
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-lg leading-relaxed text-foreground/90 pt-4'>
                            {dhikr.description}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>إغلاق</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        <CardTitle className="text-xl font-bold text-foreground/90 pt-2 leading-relaxed">{dhikr.text}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-6">
        <div className="flex items-center justify-center gap-4">
            <span className="text-2xl font-bold font-mono text-primary tabular-nums">{count}</span>
            <span className='text-muted-foreground'>/</span>
            <span className="text-base text-muted-foreground font-mono tabular-nums">{dhikr.count}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4 px-0 pb-0">
          <div className='w-full px-6'>
            {isCompleted && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleReset(); }} className="w-full">
                    <RotateCcw className="w-4 h-4 ml-2" />
                    إعادة
                </Button>
            )}
          </div>
          <Progress value={progressPercentage} className={cn(
              "h-2 w-full rounded-none transition-all duration-500",
              isCompleted ? "bg-primary/50" : ""
          )} />
      </CardFooter>
    </Card>
  );
}
