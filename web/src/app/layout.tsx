import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { QueryProvider } from '@/components/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AOS - Agent Operating System',
  description: 'AI Engineering Team Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex antialiased`}>
        <QueryProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col pl-60">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}