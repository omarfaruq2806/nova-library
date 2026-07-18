'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-xs mt-2 font-medium">Loading content...</span>
    </div>
  );
}
