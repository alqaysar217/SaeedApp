import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { athkar } from '@/lib/data';
import Link from 'next/link';
import { Bed, BookOpen, Utensils, CloudDrizzle, Briefcase, HeartPulse, Sunrise, Sunset, Plane, Coffee, ShieldQuestion } from 'lucide-react';
import { ReactElement } from 'react';

const categoryIcons: Record<string, ReactElement> = {
  morning: <Sunrise className="w-8 h-8 text-amber-500" />,
  evening: <Sunset className="w-8 h-8 text-orange-600" />,
  after_prayer: <BookOpen className="w-8 h-8 text-primary" />,
  sleep: <Bed className="w-8 h-8 text-indigo-500" />,
  travel: <Plane className="w-8 h-8 text-blue-500" />,
  sickness: <HeartPulse className="w-8 h-8 text-red-500" />,
  rain: <CloudDrizzle className="w-8 h-8 text-sky-400" />,
  exams: <ShieldQuestion className="w-8 h-8 text-purple-500" />,
  family: <HeartPulse className="w-8 h-8 text-pink-500" />,
}


export default function AthkarPage() {
  const categories = Object.keys(athkar);

  return (
    <div>
      <PageHeader title="الأذكار" description="حصن المسلم اليومي" />
      <div className="grid grid-cols-2 gap-4 p-4">
        {categories.map((key) => (
          <Link href={`/athkar/${key}`} key={key}>
            <Card className="hover:bg-muted/50 transition-all shadow-md hover:shadow-lg h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                 <div className="bg-muted p-4 rounded-full">
                    {categoryIcons[key] || <BookOpen className="w-8 h-8 text-primary" />}
                 </div>
                <span className="font-semibold text-base">{athkar[key].title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
