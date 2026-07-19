'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Users, UserCheck, FolderHeart, Sparkles, BarChart3 } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

const AnimatedCounter = ({ value, suffix = '' }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds animation

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out function: cubic out
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOutProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  glowColor: string;
  delay: number;
}

const StatCard = ({ icon, value, suffix, label, glowColor, delay }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-zinc-900 bg-zinc-950 p-6 flex flex-col justify-between overflow-hidden cursor-default shadow-xl min-h-[160px]"
    >
      {/* Background Hover Glow */}
      <div 
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}15, transparent 60%)`
        }}
      />
      <div 
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-solid pointer-events-none"
        style={{ borderColor: glowColor }}
      />

      <div className="flex justify-between items-start">
        {/* Icon circle */}
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 transition-colors duration-300"
          style={{ color: glowColor }}
        >
          {icon}
        </div>
        
        {/* Step indicator dot */}
        <span 
          className="h-2 w-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
          style={{ backgroundColor: glowColor }}
        />
      </div>

      <div className="mt-4 space-y-1">
        {/* Animated Counter */}
        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          <AnimatedCounter value={value} suffix={suffix} />
        </div>
        
        {/* Label */}
        <p className="text-xs text-zinc-550 font-bold uppercase tracking-wider group-hover:text-zinc-400 transition-colors duration-300">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default function LibraryStats() {
  const stats = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      value: 1500,
      suffix: "+",
      label: "Books Hosted",
      glowColor: "#a855f7", // Purple Accent
    },
    {
      icon: <Users className="h-5 w-5" />,
      value: 300,
      suffix: "+",
      label: "Authors Cataloged",
      glowColor: "#06b6d4", // Cyan Accent
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      value: 200,
      suffix: "+",
      label: "Active Readers",
      glowColor: "#10b981", // Emerald Accent
    },
    {
      icon: <FolderHeart className="h-5 w-5" />,
      value: 50,
      suffix: "+",
      label: "Book Categories",
      glowColor: "#f59e0b", // Amber Accent
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      value: 500,
      suffix: "+",
      label: "AI Summaries",
      glowColor: "#ec4899", // Pink Accent
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 text-xs font-black uppercase text-secondary tracking-widest">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Platform Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Community & Library Statistics
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            See the scale of our AI-driven community resource hub growing dynamically every day.
          </p>
        </div>

        {/* Stats Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className={`${
                idx === 4 ? 'col-span-2 md:col-span-1 md:col-start-2 lg:col-start-auto' : ''
              }`}
            >
              <StatCard
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                glowColor={stat.glowColor}
                delay={0.05 * (idx + 1)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
