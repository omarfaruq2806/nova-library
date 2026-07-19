'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative py-12 sm:py-20 overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] pointer-events-none -z-10" />

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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-black uppercase text-primary tracking-widest">
            <Shield className="h-3.5 w-3.5" />
            <span>Legal Policy</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Privacy Policy</h1>
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
            <h2 className="text-sm font-black text-white uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              We only collect basic account profile data (such as your name, email address, and profile picture) provided through Google OAuth. We also collect and store the digital book files (PDFs) and metadata you explicitly upload to the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">2. How We Use Data</h2>
            <p>
              Your uploaded PDFs are processed locally and securely using Google Gemini API to extract key highlights and generate summaries. We do not sell, rent, or distribute your books or personal information to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">3. Storage & Security</h2>
            <p>
              All digital assets are safely housed in secure cloud storage buckets (Supabase Storage), and authentication is securely managed by Better Auth. We implement standard encryption protocols to protect your login tokens and uploaded content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">4. Policy Updates</h2>
            <p>
              We reserve the right to modify this Privacy Policy. Any updates will be published directly on this page. By continuing to use NovaLibrary, you agree to the terms listed here.
            </p>
          </section>
        </motion.div>

      </div>
    </div>
  );
}
