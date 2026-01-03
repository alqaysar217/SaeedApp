import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, BookOpen, HeartHandshake, ShieldCheck } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { cn } from "@/lib/utils";
import MissedReminders from "@/components/MissedReminders";

export default function Home() {
  return (
    <div className="flex flex-col">
       <header 
        className={cn(
          "sticky top-0 z-10 flex items-center justify-between gap-4 bg-background/80 p-4 backdrop-blur-sm shadow-md dark:shadow-primary-glow",
        )}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">سَعيد</h1>
          <p className="text-xs text-muted-foreground mt-1">صدقة جارية</p>
        </div>
        <ThemeToggleButton />
      </header>

      <div className="space-y-6 p-4">
        <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 text-center shadow-lg">
            <CardContent className="p-4">
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    بسم الله الرحمن الرحيم
                    <br />
                    اللهم اجعل هذا العمل في ميزان حسنات
                    <br />
                    <strong className="font-semibold text-foreground/90">محمد سعيد عبدالله الاشولي</strong>
                    <br />
                    رحمه الله وأسكنه فسيح جناته
                </p>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-4">
           <Link href="/quran">
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary/10 border-primary/20">
              <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">استمع للقرآن الكريم</h3>
                    <p className="text-sm text-muted-foreground">أكثر من 20 قارئ</p>
                  </div>
                  <Button asChild variant="ghost" size="icon">
                    <div>
                      <ArrowLeft className="h-5 w-5" />
                    </div>
                  </Button>
                </CardContent>
            </Card>
           </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Link href="/athkar">
                <Card className="shadow-md hover:shadow-lg transition-shadow h-full bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="bg-accent/20 p-4 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-accent" />
                    </div>
                    <span className="font-semibold mt-2">الأذكار</span>
                </CardContent>
                </Card>
            </Link>
            <Link href="/dua">
                <Card className="shadow-md hover:shadow-lg transition-shadow h-full bg-destructive/10 border-destructive/20">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="bg-destructive/20 p-4 rounded-full">
                        <HeartHandshake className="w-8 h-8 text-destructive" />
                    </div>
                    <span className="font-semibold mt-2">الدعاء</span>
                </CardContent>
                </Card>
            </Link>
        </div>

        <MissedReminders />

      </div>
    </div>
  );
}
