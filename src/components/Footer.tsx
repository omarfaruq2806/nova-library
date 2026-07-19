'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 pt-16 pb-8 text-zinc-450 relative">
      {/* Footer glow backdrop */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Main Grid: Logo & Links */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8 pb-12 border-b border-zinc-900">

          {/* Logo & Description Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Nova<span className="font-extrabold text-primary">Library</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed font-medium max-w-sm">
              An AI-powered digital library that helps readers discover, understand, and learn from books smarter.
            </p>
          </div>

          {/* Explore Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary transition-colors">Bookshelf</Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-primary transition-colors">AI Chat</Link>
              </li>
              <li>
                <Link href="/ai-librarian" className="hover:text-primary transition-colors">AI Librarian</Link>
              </li>
            </ul>
          </div>


          {/* Resources Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Connect</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span>Portfolio</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Meta Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

          {/* Tech Stack Banner */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-[10px] sm:text-xs font-bold text-zinc-550">
            <span>Built with</span>
            <span>using</span>
            <span className="text-zinc-400">Next.js</span>
            <span>•</span>
            <span className="text-zinc-400">TypeScript</span>
            <span>•</span>
            <span className="text-zinc-400">Express</span>
            <span>•</span>
            <span className="text-zinc-400">MongoDB</span>
            <span>•</span>
            <span className="text-zinc-400">LangChain</span>
            <span>•</span>
            <span className="text-zinc-400">Gemini</span>
          </div>

          {/* Copyrights */}
          <p className="text-[10px] sm:text-xs font-bold text-zinc-550">
            &copy; 2026 NovaLibrary. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}
