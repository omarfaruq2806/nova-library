'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Flame, Star, BookOpen, ArrowRight, BookMarked, User } from 'lucide-react';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  fileUrl: string;
  coverUrl?: string;
  language: string;
  readingLevel: string;
  createdAt: string;
}

type TabType = 'recent' | 'editors';

export default function DiscoverBooks() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  // Fetch books from the API
  const { data, isLoading } = useQuery<{ books: Book[] }>({
    queryKey: ['discover-books-list'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books?limit=20`);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

  const books = data?.books || [];

  // Categorize books dynamically based on criteria
  const getTabBooks = (): Book[] => {
    if (books.length === 0) return [];

    switch (activeTab) {
      case 'recent':
        // Sort by createdAt descending (already default from server, but sliced)
        return [...books]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);

      case 'editors':
        // Custom criteria: Science or Technology books, or specific indices
        const techSci = books.filter((b) => b.genre === 'Technology' || b.genre === 'Science');
        return techSci.length > 0 ? techSci.slice(0, 4) : books.slice(1, 5);

      default:
        return books.slice(0, 4);
    }
  };

  const activeBooks = getTabBooks();

  const tabsConfig = [
    { id: 'recent', label: 'Recently Added', icon: <Clock className="h-4 w-4" /> },
    { id: 'editors', label: "Editor's Choice", icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pb-6 border-b border-zinc-900">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 text-xs font-black uppercase text-secondary tracking-widest">
            <BookMarked className="h-3.5 w-3.5" />
            <span>Catalog Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Discover Books
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Explore curated lists, trending uploads, and staff picks from our AI-powered library ecosystem.
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 bg-zinc-900/30 p-1.5 rounded-2xl border border-zinc-900 backdrop-blur-md">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-48 rounded-2xl border border-zinc-900 bg-zinc-900/10 animate-pulse" />
            ))}
          </div>
        ) : activeBooks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-3xl p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-550 border border-zinc-850">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No books found in this tab</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-normal">
                Upload some books in the Library Shelf to populate this section.
              </p>
            </div>
            <Link
              href="/books/upload"
              className="rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-4 py-2 text-xs font-bold text-white transition-all active:scale-95"
            >
              Upload Book
            </Link>
          </div>
        ) : (
          /* Books Grid - Horizontal Cards */
          <motion.div 
            layout
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {activeBooks.map((book, idx) => (
                <motion.div
                  key={book._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group flex flex-col sm:flex-row gap-5 rounded-2xl border border-zinc-900/80 bg-zinc-900/10 hover:border-zinc-850 hover:bg-zinc-900/20 p-4 transition-all duration-300 backdrop-blur-sm overflow-hidden h-auto sm:h-52 justify-between"
                >
                  {/* Book 3D-effect Cover Container */}
                  <div className="w-full sm:w-32 h-44 sm:h-full relative rounded-xl bg-zinc-950 border border-zinc-900/80 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/5 to-zinc-950 flex flex-col justify-between p-3">
                        <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[8px] font-bold text-primary w-fit">
                          {book.genre}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-extrabold text-white line-clamp-2 leading-tight">{book.title}</h4>
                          <p className="text-[9px] text-zinc-550">By {book.author}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 h-full">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center text-[9px] font-extrabold tracking-wider uppercase">
                        <span className="text-zinc-550 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full">{book.genre}</span>
                        <span className="text-secondary bg-secondary/5 px-2 py-0.5 rounded-full border border-secondary/10">
                          {book.readingLevel}
                        </span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-zinc-450 italic flex items-center gap-1.5">
                          <User className="h-3 w-3 text-zinc-550" />
                          <span>{book.author}</span>
                        </p>
                      </div>

                      <p className="text-[11px] text-zinc-450 line-clamp-2 leading-relaxed">
                        {book.description || 'No description available for this book catalog item.'}
                      </p>
                    </div>

                    {/* Link Button */}
                    <Link
                      href={`/books/${book._id}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 py-2.5 text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer mt-auto"
                    >
                      <span>Get Summary & Read</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {books.length > 0 && (
          <div className="flex justify-center pt-6">
            <Link
              href="/books"
              className="group flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 px-6 py-3 text-xs font-bold text-white hover:text-primary transition-all active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              <span>View Full Library</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform animate-pulse" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
