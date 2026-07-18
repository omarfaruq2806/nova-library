import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-650">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Nova Library. [Footer Placeholder]
      </div>
    </footer>
  );
}
