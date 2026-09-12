import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSubscription } from '../context/SubscriptionContext';
import { SAMPLE_VIDEOS, Video } from '../data/videosData';
import { Navbar } from '../components/Navbar';
import { PricingModal } from '../components/PricingModal';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmailConfirmationModal } from '../components/EmailConfirmationModal';
import { Sparkles, Crown, Zap, Flame, Shield, Lock, Play, Download, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { PlanTier } from '../types/subscription';

export default function Home() {
  const {
    subscription,
    activePlanDetails,
    canWatchVideo,
    setIsPricingModalOpen,
    isPricingModalOpen,
    pendingUpgradePlan,
    setPendingUpgradePlan,
    activeInvoice,
    setIsInvoiceModalOpen,
    isEmailModalOpen,
    setIsEmailModalOpen,
    openCheckout,
  } = useSubscription();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Free Tier', 'Bronze Tier', 'Silver Tier', 'Gold Exclusive', 'Documentary', 'Education', 'Science'];

  const filteredVideos = SAMPLE_VIDEOS.filter((v) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Free Tier') return v.requiredTier === 'Free';
    if (selectedCategory === 'Bronze Tier') return v.requiredTier === 'Bronze';
    if (selectedCategory === 'Silver Tier') return v.requiredTier === 'Silver';
    if (selectedCategory === 'Gold Exclusive') return v.requiredTier === 'Gold';
    return v.category === selectedCategory;
  });

  return (
    <>
      <Head>
        <title>WeTube Premium - Free, Bronze, Silver & Gold Subscriptions</title>
        <meta name="description" content="Watch high definition video streams with Razorpay test subscription upgrades." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />

        {/* Hero & Subscription Banner */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-4 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">

            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>Next-Gen Subscription Platform • Free, Bronze, Silver, Gold</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Stream Unlimited 4K Videos & Unlock <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">VIP Perks</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Choose from Free, Bronze, Silver, and Gold plans. Upgrade effortlessly using Razorpay test integration and receive instant tax invoices.
              </p>

              {/* Active Plan Status Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-black text-xs border ${activePlanDetails.color.badge}`}>
                    ACTIVE: {subscription.plan} PLAN
                  </span>
                  <span className="text-slate-400">
                    Daily Watch: <span className="text-amber-400 font-bold">
                      {activePlanDetails.limits.dailyWatchLimitMinutes === null ? 'Unlimited' : `${subscription.dailyWatchTimeUsed}/${activePlanDetails.limits.dailyWatchLimitMinutes}m`}
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  Upgrade Plan (Razorpay)
                </button>
              </div>

            </div>

            {/* Right Card Grid Teaser */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { tier: 'Free', price: '₹0', badge: 'SD 720p', desc: 'Standard catalog, 30m watch limit', border: 'border-slate-700' },
                { tier: 'Bronze', price: '₹199/mo', badge: '1080p Full HD', desc: '50% ad reduction, 5 downloads', border: 'border-amber-500/50' },
                { tier: 'Silver', price: '₹499/mo', badge: '2K 1440p', desc: '100% Ad-Free, unlimited watch', border: 'border-sky-400/50' },
                { tier: 'Gold', price: '₹999/mo', badge: '4K Cinema', desc: 'Unlimited downloads, Gold VIP badge', border: 'border-yellow-400 shadow-yellow-500/20' },
              ].map((card) => (
                <div
                  key={card.tier}
                  onClick={() => openCheckout(card.tier as PlanTier)}
                  className={`p-4 rounded-2xl bg-slate-900/80 border ${card.border} hover:scale-[1.02] cursor-pointer transition-all space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white">{card.tier} Plan</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{card.price}</span>
                  </div>
                  <p className="text-xs font-bold text-amber-400">{card.badge}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Category Pills & Filters */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const access = canWatchVideo(video.requiredTier);
              const isLocked = !access.allowed;

              return (
                <div
                  key={video.id}
                  className="group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Tier Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${video.requiredTier === 'Gold'
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                              : video.requiredTier === 'Silver'
                                ? 'bg-sky-500 text-white'
                                : video.requiredTier === 'Bronze'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                        >
                          {video.requiredTier}
                        </span>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-slate-200 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md">
                        {video.duration}
                      </span>

                      {/* Locked Overlay Icon */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                          <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                            <Lock className="w-4 h-4 text-amber-400" />
                            <span>Unlock with {video.requiredTier}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="p-5 space-y-3">
                      <div className="flex gap-3 items-start">
                        <img
                          src={video.creatorAvatar}
                          alt={video.creator}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">{video.creator}</p>
                          <p className="text-[11px] text-slate-400">{video.views} • {video.uploadedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card Actions */}
                  <div className="p-4 pt-0">
                    {isLocked ? (
                      <button
                        onClick={() => openCheckout(video.requiredTier)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Upgrade to {video.requiredTier} (Razorpay)
                      </button>
                    ) : (
                      <Link
                        href={`/watch/${video.id}`}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        Watch Now ({video.maxResolutionAvailable})
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 WeTube Entertainment Inc. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-slate-300 font-semibold">
            <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-amber-400">Subscription Plans</button>
            <Link href="/profile" className="hover:text-amber-400">Billing & Invoices</Link>
            <span className="text-slate-400">Razorpay Test Integration Verified ✓</span>
          </div>
        </footer>

        {/* Global Modals */}
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
        <RazorpayCheckoutModal planId={pendingUpgradePlan} onClose={() => setPendingUpgradePlan(null)} />
        <InvoiceModal invoice={activeInvoice} onClose={() => setIsInvoiceModalOpen(false)} />
        <EmailConfirmationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

      </div>
    </>
  );
}
