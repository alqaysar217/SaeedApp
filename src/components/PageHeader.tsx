"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header 
      className={cn(
        "sticky top-0 z-10 flex items-center gap-4 bg-background/80 p-4 backdrop-blur-sm shadow-sm dark:shadow-primary-glow",
      )}
    >
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowRight className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-bold font-headline">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </header>
  );
}
