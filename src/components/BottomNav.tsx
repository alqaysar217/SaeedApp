"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ShieldCheck, HeartHandshake, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/quran', label: 'القرآن', icon: BookOpen },
  { href: '/athkar', label: 'الأذكار', icon: ShieldCheck },
  { href: '/dua', label: 'الدعاء', icon: HeartHandshake },
  { href: '/reminders', label: 'التذكير', icon: Bell },
];

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 p-2 rounded-lg" prefetch>
      <div className={cn(
        "p-2 rounded-full transition-all duration-300 transform-gpu",
        isMounted && isActive ? 'bg-primary text-primary-foreground scale-110 shadow-primary-glow' : 'bg-muted text-muted-foreground'
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors",
        isMounted && isActive ? 'text-primary' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t bg-background/80 backdrop-blur-sm shadow-lg dark:shadow-primary-glow">
      <div className="mx-auto flex h-20 items-center justify-around px-2">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
}
