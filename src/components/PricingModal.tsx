import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS, COMPARISON_MATRIX } from '../data/plansData';
import { PlanTier, BillingCycle } from '../types/subscription';
import { Check, Sparkles, X, Shield, Zap, Flame, Crown, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface PricingModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    isStandalonePage?: boolean;
}

export const PricingModal: React.FC<PricingModalProps> = ({
    isOpen = true,
    onClose,
    isStandalonePage = false,
}) => {
    const { subscription, billingCycle, setBillingCycle, openCheckout } = useSubscription();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    if (!isOpen && !isStandalonePage) return null;

    const faqs = [
        {
            q: 'How does the Razorpay test payment integration work?',
            a: 'When you click "Upgrade Plan", the Razorpay Checkout modal launches. You can use test card details or the instant test approval buttons to verify your plan upgrade without spending real money.',
        },
        {
            q: 'Can I upgrade or downgrade my plan at any time?',
            a: 'Yes! You can switch between Free, Bronze, Silver, and Gold plans anytime. When upgrading, your benefits and new quotas apply immediately.',
        },
        {
            q: 'Do I get a tax invoice after payment?',
            a: 'Absolutely! Immediately after payment, an itemized Tax Invoice (with 18% GST breakdown) is generated. You can download it as a PDF or send a copy to your email.',
        },
        {
            q: 'What happens when I hit my daily watch time limit on Free or Bronze?',
            a: 'On Free (30 mins) and Bronze (3 hours), a friendly prompt lets you know your daily quota is used. You can upgrade to Silver or Gold for unlimited watch time.',
        },
    ];

    const content = (
        <div className="w-full space-y-10 text-slate-100">

            {/* Top Banner Header */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-red-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Flexible Plans for Every Video Enthusiast</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    Upgrade Your <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">WeTube Experience</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                    Unlock 4K Ultra HD streaming, ad-free watching, unlimited daily downloads, and exclusive creator content.
                </p>

                {/* Monthly / Yearly Toggle */}
                <div className="pt-4 flex items-center justify-center gap-3">
                    <span className={`text-xs sm:text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                        Monthly Billing
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-14 h-7 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors focus:outline-none"
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                                }`}
                        />
                    </button>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                            Yearly Billing
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                            SAVE UP TO 25%
                        </span>
                    </div>
                </div>
            </div>

            {/* 4 Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {(Object.keys(SUBSCRIPTION_PLANS) as PlanTier[]).map((planKey) => {
                    const plan = SUBSCRIPTION_PLANS[planKey];
                    const isCurrent = subscription.plan === plan.id;
                    const isGold = plan.id === 'Gold';
                    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

                    return (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${isGold
                                    ? 'bg-gradient-to-b from-slate-900 via-yellow-950/40 to-slate-900 border-2 border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.25)] scale-[1.02]'
                                    : `bg-slate-900/80 backdrop-blur-md border ${plan.color.border} hover:border-slate-600`
                                }`}
                        >
                            {/* Badge banner */}
                            {plan.badgeText && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider shadow-lg ${plan.color.badge}`}>
                                        {plan.badgeText}
                                    </span>
                                </div>
                            )}

                            <div>
                                {/* Header info */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-black uppercase tracking-wider ${plan.color.text}`}>
                                        {plan.id} Tier
                                    </span>
                                    {isGold && <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />}
                                    {plan.id === 'Silver' && <Zap className="w-5 h-5 text-sky-400" />}
                                    {plan.id === 'Bronze' && <Flame className="w-5 h-5 text-amber-500" />}
                                    {plan.id === 'Free' && <Shield className="w-5 h-5 text-slate-400" />}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                <p className="text-xs text-slate-400 min-h-[32px] mb-4">{plan.tagline}</p>

                                {/* Price Display */}
                                <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-white">
                                            {plan.currency}{price.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            /{billingCycle === 'yearly' ? 'yr' : 'mo'}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                                        <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                                            Equivalent to {plan.currency}{Math.round(plan.priceYearly / 12)}/mo
                                        </p>
                                    )}
                                </div>

                                {/* Features List */}
                                <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                                    {plan.features.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${isGold ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-800 text-emerald-400'}`}>
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div>
                                {isCurrent ? (
                                    <button
                                        disabled
                                        className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700 cursor-default flex items-center justify-center gap-2"
                                    >
                                        Current Active Plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openCheckout(plan.id)}
                                        className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold shadow-lg transition-all active:scale-[0.98] ${isGold
                                                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black hover:brightness-110 shadow-yellow-500/30'
                                                : plan.id === 'Silver'
                                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-110 shadow-sky-500/30'
                                                    : plan.id === 'Bronze'
                                                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-110'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                                            }`}
                                    >
                                        {plan.id === 'Free' ? 'Downgrade to Free' : `Upgrade to ${plan.id} (Razorpay)`}
                                    </button>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Feature Comparison Matrix */}
            <div className="max-w-6xl mx-auto space-y-4 pt-6">
                <h3 className="text-xl font-bold text-center text-white">Full Feature Comparison</h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="p-4">Feature & Perks</th>
                                <th className="p-4 text-center">Free</th>
                                <th className="p-4 text-center text-amber-400 font-bold">Bronze</th>
                                <th className="p-4 text-center text-sky-400 font-bold">Silver</th>
                                <th className="p-4 text-center text-yellow-400 font-bold">Gold VIP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {COMPARISON_MATRIX.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="p-4 font-semibold text-white">{row.feature}</td>
                                    <td className="p-4 text-center text-slate-400">{row.free}</td>
                                    <td className="p-4 text-center text-amber-300">{row.bronze}</td>
                                    <td className="p-4 text-center text-sky-300">{row.silver}</td>
                                    <td className="p-4 text-center font-bold text-yellow-300">{row.gold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQs Section */}
            <div className="max-w-3xl mx-auto space-y-4 pt-6">
                <h3 className="text-xl font-bold text-center text-white flex items-center justify-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    Frequently Asked Questions
                </h3>

                <div className="space-y-3">
                    {faqs.map((faq, i) => {
                        const isOpenFaq = activeFaq === i;
                        return (
                            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                                <button
                                    onClick={() => setActiveFaq(isOpenFaq ? null : i)}
                                    className="w-full p-4 text-left font-semibold text-sm text-slate-200 flex items-center justify-between hover:bg-slate-800/50"
                                >
                                    <span>{faq.q}</span>
                                    {isOpenFaq ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>
                                {isOpenFaq && (
                                    <div className="p-4 pt-0 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );

    if (isStandalonePage) {
        return <div className="min-h-screen bg-slate-950 p-4 sm:p-8">{content}</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-7xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-6 sm:p-10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                {content}
            </div>
        </div>
    );
};
