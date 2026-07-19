'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UploadCloud, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
      {/* Dynamic Background Glow circles */}
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Large CTA Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-5xl mx-auto rounded-3xl border border-zinc-900 bg-zinc-950 p-8 sm:p-16 text-center shadow-2xl overflow-hidden"
      >
        {/* Glow boarder & radial overlay */}
        <div className="absolute inset-0 bg-radial from-zinc-900/20 via-transparent to-transparent opacity-100 pointer-events-none" />
        
        {/* Background card accent lines */}
        <div className="absolute -top-px -left-px -right-px h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-secondary/50 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Ready to Start Reading?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
              Dive into our AI-curated digital shelf. Upload books, extract insights, and discuss concepts directly with our conversational agents.
            </p>
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
            {/* Explore Library Button */}
            <Link
              href="/books"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Explore Library</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Upload Book Button */}
            <Link
              href="/books/upload"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/60 px-6 py-4 text-xs sm:text-sm font-bold text-zinc-200 hover:text-white active:scale-95 transition-all"
            >
              <UploadCloud className="h-4 w-4 text-zinc-450" />
              <span>Upload Book</span>
            </Link>

            {/* Chat with AI Button */}
            <Link
              href="/chat"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/60 px-6 py-4 text-xs sm:text-sm font-bold text-zinc-200 hover:text-white active:scale-95 transition-all"
            >
              <Bot className="h-4 w-4 text-zinc-450 animate-bounce" />
              <span>Chat with AI</span>
            </Link>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
