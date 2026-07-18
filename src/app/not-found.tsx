'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 mb-4 animate-pulse">
        <BookOpen className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Page Not Found</h2>
      <p className="mt-2 text-sm text-zinc-550 max-w-xs leading-relaxed">
        The link you followed may be broken or the page does not exist yet.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
