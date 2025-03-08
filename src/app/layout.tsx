import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/app/NavBar/NavBar';
import { SessionProvider } from '@/lib/providers/SessionProvider';
import { validateRequest } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import Script from 'next/script';

const jbmono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Echospace',
  description: 'User feedback for developers.',
  other: {
    'darkreader-lock': 'asdf',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();
  return (
    <html lang="en">
      {process.env.NODE_ENV === 'production' && (
        <Script
          defer
          src="https://analytics.srizan.dev/ua.js"
          data-website-id="4564fc34-12f7-4656-9635-9315a48b9339"
        />
      )}
      <body className={jbmono.className}>
        <SessionProvider value={sessionData}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
