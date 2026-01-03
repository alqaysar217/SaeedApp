import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import MobileLayout from '@/components/MobileLayout';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AudioProvider } from '@/context/AudioPlayerContext';
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer';

const font = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Saeed | سعيد',
  description: 'تطبيق إسلامي - صدقة جارية عن روح محمد سعيد عبدالله الاشولي',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cn("font-body antialiased", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            <MobileLayout>
              <main className="flex-grow pb-8">{children}</main>
              <GlobalAudioPlayer />
            </MobileLayout>
            <Toaster />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
