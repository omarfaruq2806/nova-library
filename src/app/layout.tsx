import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LibrarianFab from '../components/LibrarianFab';
import FetchInterceptor from '../components/FetchInterceptor';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nova Library | AI Digital Library',
  description: 'A community digital library powered by state-of-the-art Gemini AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 font-sans">
        <FetchInterceptor />
        <QueryProvider>
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <LibrarianFab />
            <Footer />
          </div>
          <Toaster position="top-center" theme="dark" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
