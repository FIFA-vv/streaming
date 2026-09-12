import React from 'react';
import Link from 'next/link';
import { useSubscription } from '../context/SubscriptionContext';
import { Sparkles, Crown, Zap, Flame, Shield, User, Search, Video, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { subscription, activePlanDetails, setIsPricingModalOpen } = useSubscription();

    const getBadgeIcon = () => {
        switch (subscription.plan) {
            case 'Gold':
                return <Crown className="w-3.5 h-3.5 text-yellow-400" />;
            case 'Silver':
                return <Zap className="w-3.5 h-3.5 text-sky-400" />;
            case 'Bronze':
                return <Flame className="w-3.5 h-3.5 text-amber-500" />;
            default:
                return <Shield className="w-3.5 h-3.5 text-slate-400" />;
        }
    };

    const dailyWatchLimit = activePlanDetails.limits.dailyWatchLimitMinutes;

    return (
        <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                        ▶
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                            WeTube <span className="text-red-500 text-xs px-1.5 py-0.5 rounded bg-red-950 border border-red-800">PLUS</span>
                        </span>
                    </div>
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search premium videos, 4K documentaries, courses..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                </div>

                {/* User Stats & Plan Controls */}
                <div className="flex items-center gap-3">

                    {/* Daily Watch Time Widget */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400 font-medium">Daily Limit:</span>
                        <span className="font-bold text-white">
                            {dailyWatchLimit === null ? (
                                <span className="text-emerald-400">Unlimited</span>
                            ) : (
                                `${subscription.dailyWatchTimeUsed}/${dailyWatchLimit}m`
                            )}
                        </span>
                    </div>

                    {/* Active Plan Pill */}
                    <button
                        onClick={() => setIsPricingModalOpen(true)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black border flex items-center gap-1.5 transition-all shadow-md ${activePlanDetails.color.badge}`}
                    >
                        {getBadgeIcon()}
                        <span>{subscription.plan} Plan</span>
                    </button>

                    {/* Upgrade Plan CTA Button */}
                    <button
                        onClick={() => setIsPricingModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span className="hidden sm:inline">Upgrade Plan</span>
                    </button>

                    {/* Profile Avatar Link */}
                    <Link
                        href="/profile"
                        className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                        <User className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </header>
    );
};
