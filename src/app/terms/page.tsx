'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative py-12 sm:py-20 overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/2 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-450 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-black uppercase text-secondary tracking-widest">
            <FileText className="h-3.5 w-3.5" />
            <span>Usage Agreement</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Terms of Service</h1>
          <p className="text-zinc-550 text-xs font-bold">Last Updated: July 2026</p>
        </div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-sm space-y-6 text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed"
        >
          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">1. Acceptance of Terms</h2>
            <p>
              By accessing or using NovaLibrary, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">2. Upload Policy & Copyright</h2>
            <p>
              Users are solely responsible for the digital books (PDFs) they upload. You must only upload books that are in the public domain or those for which you hold distribution rights. Copyright infringement will lead to content deletion and account suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">3. Content Moderation</h2>
            <p>
              To maintain the database quality, all uploaded items go through administrator review before public listing. NovaLibrary reserves the right to reject, hide, or delete any content that is incomplete, inappropriate, or copyrighted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">4. AI Disclaimer</h2>
            <p>
              AI-generated book summaries, metadata tagging, and interactive chat assistant responses are produced automatically using LLMs. These tools are meant for reference and educational help; we do not guarantee absolute factual accuracy.
            </p>
          </section>
        </motion.div>

      </div>
    </div>
  );
}
