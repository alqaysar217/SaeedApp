import type { ReactNode } from 'react';
import BottomNav from '@/components/BottomNav';

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black">
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col border-x border-border/20 bg-background text-foreground shadow-2xl">
        <div className="flex-1 pb-24">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
