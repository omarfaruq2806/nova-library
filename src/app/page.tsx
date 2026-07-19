'use client';

import React from 'react';
import AiFeatures from '../components/AiFeatures';
import DiscoverBooks from '../components/DiscoverBooks';
import ExploreCategories from '../components/ExploreCategories';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import LibraryStats from '../components/LibraryStats';
import FaqSection from '../components/FaqSection';
import FinalCta from '../components/FinalCta';
import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-zinc-950 text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Hero Section Component */}
      <HeroSection />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* AI Features Section */}
      <AiFeatures />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Discover Books Section */}
      <DiscoverBooks />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Explore Categories Section */}
      <ExploreCategories />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Library Stats Section */}
      <LibraryStats />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* FAQ Section */}
      <FaqSection />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Final CTA Section */}
      <FinalCta />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
    </div>
  );
}
