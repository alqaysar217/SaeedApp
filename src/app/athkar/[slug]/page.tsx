import { athkar } from '@/lib/data';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DhikrCard from '../components/DhikrCard';
import { ScrollArea } from '@/components/ui/scroll-area';

type AthkarCategoryPageProps = {
  params: {
    slug: string;
  };
};

export default function AthkarCategoryPage({ params }: AthkarCategoryPageProps) {
  const { slug } = params;
  const category = athkar[slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={category.title} />
      <ScrollArea className="flex-grow" dir="rtl">
        <div className="px-4 space-y-4 pb-4 pt-4">
          {category.data.map((dhikr, index) => (
            <DhikrCard key={dhikr.id} dhikr={dhikr} total={category.data.length} currentIndex={index + 1} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(athkar).map((slug) => ({
    slug,
  }));
}
