'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, LogOut, User, Loader2, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from '../lib/auth-client';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully.');
      router.push('/login');
      router.refresh();
    } catch (err: any) {
      toast.error('Failed to log out.');
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Nova<span className="font-extrabold text-primary">Library</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/books"
                className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                  pathname === '/books' ? 'text-primary' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Bookshelf
              </Link>
              <Link
                href="/chat"
                className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                  pathname === '/chat' ? 'text-primary' : 'text-zinc-400 hover:text-white'
                }`}
              >
                AI Chat
              </Link>
              <Link
                href="/ai-librarian"
                className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                  pathname === '/ai-librarian' ? 'text-primary' : 'text-zinc-400 hover:text-white'
                }`}
              >
                AI Librarian
              </Link>

              {session?.user && (
                <>
                  <Link
                    href="/books/manage"
                    className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                      pathname === '/books/manage' ? 'text-primary' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Manage Books
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                        pathname === '/admin' ? 'text-primary' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="flex h-8 w-8 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-6 w-6 rounded-full object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border border-primary/20">
                      {getInitials(session.user.name)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-zinc-300">{session.user.name}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] uppercase font-bold text-zinc-500">
                    {session.user.role || 'user'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-450 hover:text-red-400 hover:border-red-950/30 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-white hover:bg-zinc-200 px-4 py-2 text-xs font-bold text-black transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 space-y-2.5">
          <Link
            href="/books"
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${
              pathname === '/books' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
            }`}
          >
            Bookshelf
          </Link>
          <Link
            href="/chat"
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${
              pathname === '/chat' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
            }`}
          >
            AI Chat
          </Link>
          <Link
            href="/ai-librarian"
            onClick={() => setIsOpen(false)}
            className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${
              pathname === '/ai-librarian' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
            }`}
          >
            AI Librarian
          </Link>

          {session?.user && (
            <>
              <Link
                href="/books/manage"
                onClick={() => setIsOpen(false)}
                className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${
                  pathname === '/books/manage' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
                }`}
              >
                Manage Books
              </Link>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/admin' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          {/* Mobile User Section */}
          <div className="pt-4 border-t border-zinc-900">
            {isPending ? (
              <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-550" />
              </div>
            ) : session?.user ? (
              <div className="space-y-3.5 px-3">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border border-primary/20">
                      {getInitials(session.user.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{session.user.name}</p>
                    <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">{session.user.role || 'user'}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 px-4 py-2.5 text-xs font-bold hover:bg-red-900/20 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-350 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
