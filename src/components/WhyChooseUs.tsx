'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldQuestion, HelpCircle } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  traditional: string;
  nova: string;
  traditionalDetail: string;
  novaDetail: string;
}

export default function WhyChooseUs() {
  const comparisonData: ComparisonRow[] = [
    {
      feature: 'Search Experience',
      traditional: 'Manual Search',
      traditionalDetail: 'Scroll through lists, browse by alphabet, or search only exact keywords.',
      nova: 'AI Semantic Search',
      novaDetail: 'Find books based on conceptual meanings, questions, and contextual descriptions.',
    },
    {
      feature: 'Content Digestion',
      traditional: 'Read Everything',
      traditionalDetail: 'Spend hours reading entire chapters just to find out if the book covers what you need.',
      nova: 'Instant AI Summary',
      novaDetail: 'Get a 3-sentence summary and core key points generated instantly by Gemini upon upload.',
    },
    {
      feature: 'Reading Assistance',
      traditional: 'No Assistant',
      traditionalDetail: 'No help with difficult terms, complex arguments, or custom explanations.',
      nova: 'Interactive AI Chat',
      novaDetail: 'Chat directly with any book. Ask questions, clarify definitions, and get explanations.',
    },
    {
      feature: 'Book Discovery',
      traditional: 'Static Library',
      traditionalDetail: 'Rely on standard category clicks and chronological lists without customization.',
      nova: 'Smart Recommendation',
      novaDetail: 'Receive tailormade book suggestions based on reading levels and preference histories.',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 text-xs font-black uppercase text-secondary tracking-widest">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Value Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Choose NovaLibrary
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            See how NovaLibrary redefines digital reading by comparing key differences with traditional library portals.
          </p>
        </div>

        {/* Comparison Layout */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
          {/* Header Row - Desktop Only */}
          <div className="hidden md:grid grid-cols-12 border-b border-zinc-900 bg-zinc-900/20 px-6 py-5 text-sm font-bold tracking-wider text-zinc-400 uppercase">
            <div className="col-span-4">Key Value</div>
            <div className="col-span-4 pl-4 flex items-center gap-2">
              <ShieldQuestion className="h-4 w-4 text-zinc-550" />
              Traditional Library
            </div>
            <div className="col-span-4 pl-4 text-primary flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              NovaLibrary
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-900">
            {comparisonData.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 px-6 py-6 items-start gap-4 md:gap-0"
              >
                {/* Feature Name Column */}
                <div className="col-span-1 md:col-span-4 space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">{row.feature}</h3>
                  <div className="h-0.5 w-6 bg-zinc-800 rounded sm:hidden" />
                </div>

                {/* Traditional Library Column */}
                <div className="col-span-1 md:col-span-4 pl-0 md:pl-4 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-350 font-extrabold text-sm sm:text-base">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-500 shrink-0">
                      <X className="h-3 w-3" />
                    </div>
                    <span>{row.traditional}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium pl-7">
                    {row.traditionalDetail}
                  </p>
                </div>

                {/* NovaLibrary Column */}
                <div className="col-span-1 md:col-span-4 pl-0 md:pl-4 space-y-2 relative">
                  {/* Decorative ambient subtle background highlight for NovaLibrary column */}
                  <div className="absolute -inset-y-6 -inset-x-4 bg-gradient-to-r from-primary/2 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

                  <div className="flex items-center gap-2 text-white font-extrabold text-sm sm:text-base">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-primary shrink-0 animate-pulse">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent group-hover:text-primary transition-colors">
                      {row.nova}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium pl-7">
                    {row.novaDetail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
