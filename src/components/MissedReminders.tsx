"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { defaultReminders, type Reminder } from '@/app/reminders/lib/reminders';
import { surahs } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { BellRing, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function MissedReminders() {
    const [missedReminder, setMissedReminder] = useState<Reminder | null>(null);
    const { playSurah } = useAudioPlayer();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = dayMap[today.getDay()];
        const lastCheckedDate = localStorage.getItem('lastReminderCheckDate');
        const todayStr = today.toISOString().split('T')[0];

        // Only check for missed reminders once per day
        if (lastCheckedDate === todayStr) {
            const dismissed = localStorage.getItem(`dismissed_surah-kahf`);
            if (dismissed) return;
        } else {
            localStorage.setItem('lastReminderCheckDate', todayStr);
            // Clear dismissal status on a new day
            localStorage.removeItem(`dismissed_surah-kahf`);
        }

        const kahfReminder = defaultReminders.find(r => r.id === 'surah-kahf');

        if (kahfReminder && kahfReminder.days.includes(dayOfWeek)) {
            const isDismissed = localStorage.getItem(`dismissed_${kahfReminder.id}`);
            if (!isDismissed) {
                setMissedReminder(kahfReminder);
            }
        } else {
             setMissedReminder(null);
        }

    }, []);

    const handleReadSurah = () => {
        const surahAlKahf = surahs.find(s => s.id === 18);
        if (surahAlKahf) {
            playSurah(surahAlKahf);
            router.push('/quran');
        } else {
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: 'لم يتم العثور على سورة الكهف.',
            });
        }
        dismissReminder();
    };

    const dismissReminder = () => {
        if (missedReminder) {
            localStorage.setItem(`dismissed_${missedReminder.id}`, 'true');
            setMissedReminder(null);
        }
    };

    if (!missedReminder) {
        return null;
    }

    return (
        <Card className={cn(
            "bg-amber-50 dark:bg-amber-950/40 border-amber-300/50 dark:border-amber-800/60 shadow-md",
            "animate-in fade-in-50 slide-in-from-top-10 duration-500"
        )}>
            <CardHeader className="p-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-full">
                       <BellRing className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-200">
                           {missedReminder.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                           نورٌ ما بين الجمعتين، لا تنسَ قراءتها اليوم.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={dismissReminder} className="text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10">
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف
                </Button>
                <Button 
                    size="sm" 
                    onClick={handleReadSurah}
                    className="bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-amber-950 shadow-sm"
                >
                    <BookOpen className="ml-2 h-4 w-4" />
                    قراءة السورة
                </Button>
            </CardContent>
        </Card>
    );
}
