'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, LogOut, User, Loader2, Menu, X, Search, ChevronDown, Shield, UploadCloud, FolderHeart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from '../lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully.');
      setIsDropdownOpen(false);
      setIsOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err: any) {
      toast.error('Failed to log out.');
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Menu items config based on authentication state
  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Books', href: '/books' },
    { label: 'AI Assistant', href: '/chat' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const userLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Books', href: '/books' },
    { label: 'Upload Book', href: '/books/upload' },
    { label: 'My Books', href: '/books/manage' },
    { label: 'AI Assistant', href: '/chat' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const activeLinks = session?.user ? userLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo & Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white select-none">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Nova<span className="font-extrabold text-primary">Library</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5">
              {activeLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-wider uppercase transition-colors ${pathname === link.href ? 'text-primary' : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Panel (Search, Avatar/Dropdown, Login Buttons) */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Sleek Search Icon linking to books page */}

            {isPending ? (
              <div className="flex h-8 w-8 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-550" />
              </div>
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>

                {/* Avatar trigger button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950 p-1.5 cursor-pointer text-left focus:outline-none select-none transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-7 w-7 rounded-lg object-cover border border-zinc-900"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary border border-primary/20">
                      {getInitials(session.user.name)}
                    </div>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 text-zinc-550 transition-transform duration-350 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-zinc-900 bg-zinc-950 p-2 shadow-2xl text-xs font-bold text-zinc-400"
                    >
                      {/* User Identity Banner */}
                      <div className="px-3.5 py-2.5 border-b border-zinc-900 mb-1.5">
                        <p className="text-white font-black truncate">{session.user.name}</p>
                        <p className="text-[10px] text-zinc-550 font-medium truncate mt-0.5">{session.user.email}</p>
                      </div>

                      {/* Dropdown Action Links */}
                      <div className="space-y-0.5">

                        {/* Dashboard (Admin extra) */}
                        {session.user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
                          >
                            <Shield className="h-4 w-4 text-purple-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        {/* Upload Book */}
                        <Link
                          href="/books/upload"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <UploadCloud className="h-4 w-4 text-primary" />
                          <span>Upload Book</span>
                        </Link>

                        {/* My Books */}
                        <Link
                          href="/books/manage"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <FolderHeart className="h-4 w-4 text-secondary" />
                          <span>My Books</span>
                        </Link>

                        {/* Profile placeholder info */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl opacity-60 cursor-default select-none">
                          <User className="h-4 w-4" />
                          <span>Role: {session.user.role || 'Member'}</span>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-zinc-900 my-1" />

                        {/* Logout button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left font-bold cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>

                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-white hover:bg-zinc-200 px-4 py-2.5 text-xs font-black text-black transition-all active:scale-95 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-450 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 space-y-2.5 overflow-hidden"
          >
            {/* Search Input for Mobile */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search library..."
                onFocus={() => {
                  setIsOpen(false);
                  router.push('/books');
                }}
                className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-2.5 pl-9 text-xs text-white placeholder-zinc-700 focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-700" />
            </div>

            {/* Navigation links */}
            {activeLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${pathname === link.href ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Admin panel dash */}
            {session?.user && session.user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={`block text-xs font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-colors ${pathname === '/admin' ? 'bg-zinc-900 text-primary' : 'text-zinc-450 hover:text-white'
                  }`}
              >
                Admin Dashboard
              </Link>
            )}

            {/* User details & logout on mobile */}
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
                        className="h-8 w-8 rounded-full object-cover border border-zinc-900"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border border-primary/20">
                        {getInitials(session.user.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black text-white leading-tight">{session.user.name}</p>
                      <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">{session.user.role || 'Member'}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 px-4 py-2.5 text-xs font-bold hover:bg-red-900/20 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-zinc-900 py-2.5 text-xs font-semibold text-zinc-350 hover:text-white"
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

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
