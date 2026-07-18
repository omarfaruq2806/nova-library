'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, User, Lock, Link as LinkIcon, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { signUp, signIn } from '../../../lib/auth-client';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL format').or(z.literal('')).optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .refine((val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val), {
      message: 'Password must contain both letters and numbers',
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      image: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      // If no image is provided, generate initials avatar or pass empty
      const imageToSend = values.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(values.name)}`;

      const { data, error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        image: imageToSend,
      });

      if (error) {
        toast.error(error.message || 'Registration failed.');
      } else {
        toast.success('Registration successful! Welcome to Nova Library.');
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err: any) {
      toast.error('Google sign-in initiation failed.');
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-md z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-lg shadow-primary/20 mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
          <p className="mt-1.5 text-xs text-zinc-400">
            Join Nova Library to discover and interact with books.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Image URL Field (Optional) */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Avatar Image URL <span className="text-zinc-600 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                {...register('image')}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>
            {errors.image && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.image.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="At least 6 characters with letters & numbers"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Register Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-all active:scale-98"
        >
          <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer link */}
        <div className="text-center text-xs text-zinc-500 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
