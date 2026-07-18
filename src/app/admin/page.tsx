'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Loader2, Check, X, Eye, FileText, ArrowLeft, RefreshCw, 
  LayoutDashboard, ShieldAlert, CheckCircle, XCircle, Users, User, LogOut,
  TrendingUp, Calendar, Mail, Shield, BookOpen, Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from '../../lib/auth-client';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  uploadedBy?: string;
  uploadedByName?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  coverUrl?: string;
  language?: string;
  readingLevel?: string;
}

interface Stats {
  totalBooks: number;
  pendingBooks: number;
  acceptedBooks: number;
  rejectedBooks: number;
  totalUsers: number;
  genres: { name: string; count: number }[];
}

interface SystemUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  image?: string;
}

// Custom Premium SVG Bar Chart Component
function SVGBarChart({ data }: { data: { name: string; count: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        No statistics data available.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const graphHeight = chartHeight - paddingTop - paddingBottom;
  const graphWidth = chartWidth - paddingLeft - paddingRight;

  const barWidth = Math.max(12, Math.min(45, (graphWidth / data.length) * 0.6));
  const spacing = (graphWidth - barWidth * data.length) / (data.length + 1);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full min-w-[450px] overflow-visible text-xs font-semibold text-zinc-400"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const y = paddingTop + graphHeight * (1 - p);
          const val = Math.round(maxVal * p);
          return (
            <g key={idx} className="opacity-15">
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text x={paddingLeft - 10} y={y + 4} textAnchor="end" className="fill-zinc-400 font-medium">
                {val}
              </text>
            </g>
          );
        })}

        {/* X Axis line */}
        <line
          x1={paddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingRight}
          y2={chartHeight - paddingBottom}
          stroke="currentColor"
          className="opacity-20"
          strokeWidth="1.5"
        />

        {/* Bars */}
        {data.map((d, idx) => {
          const x = paddingLeft + spacing + idx * (barWidth + spacing);
          const barHeight = (d.count / maxVal) * graphHeight;
          const y = chartHeight - paddingBottom - barHeight;

          return (
            <g key={idx} className="group cursor-pointer">
              {/* Actual bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 4)}
                rx="4"
                fill="url(#barGrad)"
                className="transition-all duration-300 hover:opacity-80"
              />
              
              <title>{`${d.name}: ${d.count} books`}</title>

              {/* Text label underneath */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - paddingBottom + 18}
                textAnchor="middle"
                className="fill-zinc-400 font-semibold select-none"
                style={{ fontSize: '9px' }}
              >
                {d.name.length > 8 ? `${d.name.substring(0, 7)}...` : d.name}
              </text>

              {/* Count above bar */}
              {d.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-zinc-200 font-bold"
                  style={{ fontSize: '9px' }}
                >
                  {d.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useSession();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'approved' | 'rejected' | 'users' | 'profile'>('dashboard');

  const isAdmin = session?.user?.role === 'admin';

  // Redirection checks for non-admins
  React.useEffect(() => {
    if (!isSessionPending) {
      if (!session) {
        toast.error('Authentication required.');
        router.push('/login');
      } else if (!isAdmin) {
        toast.error('Forbidden. Access denied.');
        router.push('/books');
      }
    }
  }, [session, isSessionPending, isAdmin, router]);

  // Query Stats
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/admin/stats`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to retrieve dashboard statistics.');
      return res.json();
    },
    enabled: !!session && isAdmin,
  });

  // Query Books list by Active Tab status
  const { data: booksList = [], isLoading: isBooksLoading, refetch: refetchBooks } = useQuery<Book[]>({
    queryKey: ['admin-books', activeTab],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      let statusQuery = '';
      if (activeTab === 'pending') statusQuery = '?status=pending';
      else if (activeTab === 'approved') statusQuery = '?status=accepted';
      else if (activeTab === 'rejected') statusQuery = '?status=rejected';

      const res = await fetch(`${apiUrl}/books/admin/list${statusQuery}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to retrieve book records.');
      return res.json();
    },
    enabled: !!session && isAdmin && ['pending', 'approved', 'rejected'].includes(activeTab),
  });

  // Query Users List
  const { data: usersList = [], isLoading: isUsersLoading, refetch: refetchUsers } = useQuery<SystemUser[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/admin/users`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to retrieve users directory.');
      return res.json();
    },
    enabled: !!session && isAdmin && activeTab === 'users',
  });

  // Status mutation (Approve/Reject)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'rejected' | 'pending' }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update book approval status.');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Book status marked as ${variables.status} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update book status.');
    },
  });

  const handleUpdateStatus = (id: string, status: 'accepted' | 'rejected' | 'pending') => {
    statusMutation.mutate({ id, status });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out.');
      router.push('/login');
    } catch {
      toast.error('Logout failed.');
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'dashboard') refetchStats();
    else if (['pending', 'approved', 'rejected'].includes(activeTab)) refetchBooks();
    else if (activeTab === 'users') refetchUsers();
  };

  const isDataLoading = isStatsLoading || isBooksLoading || isUsersLoading;

  if (isSessionPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-zinc-400 font-medium">Authorizing admin credentials...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-red-500 mb-2">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-zinc-500 max-w-xs">
          This portal requires administrator privileges. Access has been monitored and blocked.
        </p>
        <Link
          href="/books"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          Return to Shelf
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col md:flex-row text-zinc-150 relative">
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

      {/* 📊 LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-900/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-zinc-900 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider uppercase">Nova Admin</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Library Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4" />
                <span>Pending Books</span>
              </div>
              {stats && stats.pendingBooks > 0 && (
                <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                  {stats.pendingBooks}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approved Books</span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rejected'
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <XCircle className="h-4 w-4" />
              <span>Rejected Books</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-900/50 space-y-4">
          <Link
            href="/books"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors px-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Shelf</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT PANEL */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-6xl">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white capitalize flex items-center gap-3">
              <span>{activeTab === 'dashboard' ? 'Overview Statistics' : `${activeTab} Management`}</span>
              {isDataLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </h1>
            <p className="text-xs text-zinc-500">
              {activeTab === 'dashboard' && 'Core metrics, metadata counts, and genre distribution analyses.'}
              {activeTab === 'pending' && 'Review and moderation queues for pending community uploads.'}
              {activeTab === 'approved' && 'Audit log of active approved catalog entries.'}
              {activeTab === 'rejected' && 'Review pool of rejected items. Restore if appropriate.'}
              {activeTab === 'users' && 'Complete record index of authorized system participants.'}
              {activeTab === 'profile' && 'Administrative authorization credentials and scope details.'}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isDataLoading}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 px-4 py-2.5 text-xs font-bold text-zinc-350 hover:text-white cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isDataLoading ? 'animate-spin' : ''}`} />
            <span>Sync Records</span>
          </button>
        </div>

        {/* 📑 TAB LAYOUT CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* 📊 TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-8">
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Total Books */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-3 opacity-5 text-white">
                      <BookOpen className="h-20 w-20" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Catalog Books</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{stats.totalBooks}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mt-2">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span>Aggregated library documents</span>
                    </div>
                  </div>

                  {/* Card 2: Pending Books */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-3 opacity-5 text-amber-500">
                      <ShieldAlert className="h-20 w-20" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Awaiting Verification</p>
                    <h3 className="text-3xl font-extrabold text-amber-500 mt-2">{stats.pendingBooks}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500/80 mt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Pending admin approval</span>
                    </div>
                  </div>

                  {/* Card 3: Approved Books */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-3 opacity-5 text-green-500">
                      <CheckCircle className="h-20 w-20" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Accepted Library Books</p>
                    <h3 className="text-3xl font-extrabold text-green-500 mt-2">{stats.acceptedBooks}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 mt-2">
                      <Check className="h-3 w-3" />
                      <span>Visible in public shell</span>
                    </div>
                  </div>

                  {/* Card 4: Total Users */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-3 opacity-5 text-primary">
                      <Users className="h-20 w-20" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Registered Users</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{stats.totalUsers}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mt-2">
                      <Calendar className="h-3 w-3 text-secondary" />
                      <span>Unified users index</span>
                    </div>
                  </div>
                </div>

                {/* Genre Bar Chart Card */}
                <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-md space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Visual Distribution by Category</h3>
                    <p className="text-xs text-zinc-500">Breakdown of uploaded digital resources categorized by genre.</p>
                  </div>
                  <div className="pt-2 bg-zinc-950/20 rounded-xl p-4 border border-zinc-900">
                    <SVGBarChart data={stats.genres} />
                  </div>
                </div>
              </div>
            )}

            {/* 📚 TABS: PENDING, APPROVED, REJECTED BOOKS */}
            {['pending', 'approved', 'rejected'].includes(activeTab) && (
              <div className="space-y-4">
                {booksList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border border-dashed border-zinc-900 bg-zinc-900/5 rounded-2xl p-16 text-center space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">No record entries found</h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        No books with the status &apos;{activeTab === 'approved' ? 'accepted' : activeTab}&apos; exist in the library.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 bg-zinc-900/30 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          <th className="p-4 sm:p-5">Cover</th>
                          <th className="p-4 sm:p-5">Book Details</th>
                          <th className="p-4 sm:p-5">Genre</th>
                          <th className="p-4 sm:p-5">Uploaded By</th>
                          <th className="p-4 sm:p-5">Upload Date</th>
                          <th className="p-4 sm:p-5 text-right">Moderation Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
                        {booksList.map((book) => (
                          <tr key={book._id} className="hover:bg-zinc-900/10 transition-colors">
                            {/* Cover column */}
                            <td className="p-4 sm:p-5 w-20">
                              <div className="h-14 w-10 bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden flex items-center justify-center shadow">
                                {book.coverUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="object-cover h-full w-full"
                                  />
                                ) : (
                                  <FileText className="h-5 w-5 text-zinc-600" />
                                )}
                              </div>
                            </td>
                            {/* Title/Author column */}
                            <td className="p-4 sm:p-5">
                              <div className="font-bold text-white truncate max-w-xs">{book.title}</div>
                              <div className="text-xs text-zinc-500 italic mt-0.5">By {book.author}</div>
                            </td>
                            {/* Genre column */}
                            <td className="p-4 sm:p-5 text-xs font-medium text-zinc-400">
                              {book.genre}
                            </td>
                            {/* Uploader column */}
                            <td className="p-4 sm:p-5 text-xs text-zinc-400">
                              {book.uploadedByName || 'User'}
                            </td>
                            {/* Upload Date column */}
                            <td className="p-4 sm:p-5 text-xs text-zinc-500">
                              {new Date(book.createdAt).toLocaleDateString()}
                            </td>
                            {/* Action column */}
                            <td className="p-4 sm:p-5 text-right space-x-2 whitespace-nowrap">
                              <Link
                                href={`/books/${book._id}`}
                                className="inline-flex p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white transition-colors"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              
                              {/* Approve Button (show if pending or rejected) */}
                              {book.status !== 'accepted' && (
                                <button
                                  onClick={() => handleUpdateStatus(book._id, 'accepted')}
                                  disabled={statusMutation.isPending}
                                  className="inline-flex p-2 rounded-lg bg-green-500/10 border border-green-500/25 hover:bg-green-500/20 text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  title="Approve book"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}

                              {/* Reject Button (show if pending or approved) */}
                              {book.status !== 'rejected' && (
                                <button
                                  onClick={() => handleUpdateStatus(book._id, 'rejected')}
                                  disabled={statusMutation.isPending}
                                  className="inline-flex p-2 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  title="Reject/Unapprove book"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}

                              {/* Revert to Pending Button (show if approved or rejected) */}
                              {book.status !== 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(book._id, 'pending')}
                                  disabled={statusMutation.isPending}
                                  className="inline-flex p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                  title="Revert to Pending"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 👥 TAB 5: USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {usersList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border border-dashed border-zinc-900 bg-zinc-900/5 rounded-2xl p-16 text-center space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-500">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">No users registered</h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        No user account metadata exists.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 bg-zinc-900/30 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          <th className="p-4 sm:p-5">User Profile</th>
                          <th className="p-4 sm:p-5">Email Address</th>
                          <th className="p-4 sm:p-5">System Role</th>
                          <th className="p-4 sm:p-5">Account Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
                        {usersList.map((usr) => (
                          <tr key={usr._id} className="hover:bg-zinc-900/10 transition-colors">
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center font-bold text-xs text-primary uppercase">
                                {usr.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={usr.image} alt={usr.name} className="object-cover h-full w-full" />
                                ) : (
                                  usr.name.substring(0, 2)
                                )}
                              </div>
                              <span className="font-bold text-white">{usr.name}</span>
                            </td>
                            <td className="p-4 sm:p-5 text-xs text-zinc-400">
                              {usr.email}
                            </td>
                            <td className="p-4 sm:p-5 text-xs font-semibold">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                usr.role === 'admin' 
                                  ? 'bg-primary/10 text-primary border-primary/20' 
                                  : 'bg-zinc-805/40 text-zinc-400 border-zinc-800'
                              }`}>
                                {usr.role === 'admin' ? (
                                  <>
                                    <Shield className="h-2.5 w-2.5" />
                                    <span>Admin</span>
                                  </>
                                ) : (
                                  <span>User</span>
                                )}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-xs text-zinc-500">
                              {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 👤 TAB 6: MY PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl bg-zinc-900/15 border border-zinc-900 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-zinc-900 pb-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shrink-0">
                    <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-3xl font-extrabold text-white uppercase overflow-hidden border border-zinc-900">
                      {session.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={session.user.image} alt={session.user.name} className="object-cover h-full w-full" />
                      ) : (
                        session.user.name.substring(0, 2)
                      )}
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <h3 className="text-xl font-bold text-white">{session.user.name}</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold uppercase">
                        <Shield className="h-2.5 w-2.5" />
                        <span>Administrator</span>
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">Nova Library System Administrator</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span>Full Name</span>
                    </span>
                    <p className="text-sm font-semibold text-zinc-200">{session.user.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      <span>Email Address</span>
                    </span>
                    <p className="text-sm font-semibold text-zinc-200">{session.user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      <span>Authorized Role</span>
                    </span>
                    <p className="text-sm font-semibold text-zinc-200 capitalize">{session.user.role}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-3 w-3" />
                      <span>System Privileges</span>
                    </span>
                    <p className="text-sm font-semibold text-zinc-200">Full Access Moderation</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
