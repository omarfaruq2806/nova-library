'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LibrarianFab() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Auto-hide the FAB if the user is already on the AI Librarian page
  if (pathname === '/ai-librarian') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/ai-librarian">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 border border-primary/30 hover:border-primary text-primary hover:text-white shadow-2xl cursor-pointer"
        >
          {/* Radar Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-70 pointer-events-none" />
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-sm pointer-events-none -z-10" />

          {/* Icon */}
          <div className="relative flex items-center justify-center">
            <Bot className="h-6.5 w-6.5 shrink-0" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-secondary animate-pulse" />
          </div>

          {/* Tooltip Popup on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-16 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary whitespace-nowrap shadow-lg select-none pointer-events-none"
              >
                Ask AI Librarian
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </div>
  );
}
