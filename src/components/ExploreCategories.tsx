'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Cpu, Atom, TrendingUp, Sparkles, User, Hourglass, FolderOpen } from 'lucide-react';
import Link from 'next/link';

interface Book {
  _id: string;
  genre: string;
}

interface CategoryConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
}

export default function ExploreCategories() {
  // Fetch book list to count categories dynamically
  const { data } = useQuery<{ books: Book[] }>({
    queryKey: ['category-books-count'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books?limit=100`);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

  const books = data?.books || [];

  // Count books per genre
  const categoryCounts = books.reduce((acc, book) => {
    const genre = book.genre;
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories: CategoryConfig[] = [
    {
      name: 'Technology',
      icon: <Cpu className="h-6 w-6" />,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/50',
      bgGlow: 'from-cyan-500/10 to-transparent',
    },
    {
      name: 'Science',
      icon: <Atom className="h-6 w-6" />,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/50',
      bgGlow: 'from-emerald-500/10 to-transparent',
    },
    {
      name: 'Finance',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/50',
      bgGlow: 'from-purple-500/10 to-transparent',
    },
    {
      name: 'Fiction',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-pink-400 border-pink-500/20 bg-pink-500/5 hover:border-pink-500/50',
      bgGlow: 'from-pink-500/10 to-transparent',
    },
    {
      name: 'Biography',
      icon: <User className="h-6 w-6" />,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50',
      bgGlow: 'from-amber-500/10 to-transparent',
    },
    {
      name: 'History',
      icon: <Hourglass className="h-6 w-6" />,
      color: 'text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/50',
      bgGlow: 'from-red-500/10 to-transparent',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase text-primary tracking-widest">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Structured Knowledge</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore Knowledge by Category
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Browse through our taxonomy of disciplines. Find summaries and resources tailored to your field of interest.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, idx) => {
            const count = categoryCounts[cat.name] || 0;
            return (
              <Link 
                key={cat.name}
                href={`/books?genre=${cat.name}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ 
                    y: -6, 
                    transition: { duration: 0.2 } 
                  }}
                  className={`group relative rounded-2xl border ${cat.color} p-6 flex flex-col items-center text-center cursor-pointer overflow-hidden transition-all duration-300`}
                >
                  {/* Hover Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${cat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Icon circle */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-900 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>

                  {/* Category Details */}
                  <div className="mt-5 space-y-1 relative z-10">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-zinc-550 font-bold uppercase tracking-wider">
                      {count} {count === 1 ? 'Book' : 'Books'}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
