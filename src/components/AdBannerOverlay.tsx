import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Sparkles, X, ShieldAlert, Zap } from 'lucide-react';

interface AdBannerOverlayProps {
    onDismiss?: () => void;
}

export const AdBannerOverlay: React.FC<AdBannerOverlayProps> = ({ onDismiss }) => {
    const { subscription, activePlanDetails, setIsPricingModalOpen } = useSubscription();
    const [isVisible, setIsVisible] = useState(true);

    if (activePlanDetails.limits.adFree || !isVisible) return null;

    return (
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/60 p-4 shadow-xl text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 my-4 animate-in fade-in">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">SPONSORED AD</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {subscription.plan} Tier Ads Active
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                        Tired of sponsor ads? Go 100% Ad-Free with Silver or Gold!
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={() => setIsPricingModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                    <Sparkles className="w-4 h-4 text-black" />
                    Remove Ads Now
                </button>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        if (onDismiss) onDismiss();
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
