import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { X, Mail, CheckCircle2, ShieldCheck, Play, ArrowRight } from 'lucide-react';

interface EmailConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ isOpen, onClose }) => {
    const { activeInvoice, subscription } = useSubscription();

    if (!isOpen || !activeInvoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">

                {/* Email Client Top Bar */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs font-semibold text-slate-400">Inbox • WeTube Confirmation Mail</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Email Mail Header Info */}
                <div className="p-4 bg-slate-900 border-b border-slate-800 text-xs space-y-1">
                    <p><span className="text-slate-400 font-medium">From:</span> <span className="text-white font-semibold">billing@wetube.com</span></p>
                    <p><span className="text-slate-400 font-medium">To:</span> <span className="text-blue-300 font-semibold">{subscription.userEmail}</span></p>
                    <p><span className="text-slate-400 font-medium">Subject:</span> <span className="text-amber-300 font-semibold">🎉 Order Confirmation & Invoice: WeTube {activeInvoice.planName} Plan</span></p>
                </div>

                {/* Rendered HTML Email Body */}
                <div className="p-6 bg-slate-950 text-slate-200 space-y-6">

                    {/* Email Logo Header */}
                    <div className="text-center pb-4 border-b border-slate-800">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-lg">
                                ▶
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">WeTube <span className="text-red-500">Premium</span></span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Welcome to {activeInvoice.planName}!</h2>
                        <p className="text-xs text-slate-400">Your upgrade payment has been confirmed.</p>
                    </div>

                    {/* Email Greeting */}
                    <div className="text-sm space-y-2">
                        <p>Hi <span className="font-bold text-white">{activeInvoice.userName}</span>,</p>
                        <p className="text-slate-300 leading-relaxed">
                            Thank you for subscribing to <span className="text-amber-400 font-semibold">WeTube {activeInvoice.planName} ({activeInvoice.billingCycle})</span>! Your subscription is now active across all your devices.
                        </p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                        <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400">SUBSCRIPTION SUMMARY</h4>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span className="text-slate-400">Plan Tier</span>
                            <span className="font-bold text-amber-400">{activeInvoice.planName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span className="text-slate-400">Billing Cycle</span>
                            <span className="font-semibold text-slate-200 uppercase">{activeInvoice.billingCycle}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span className="text-slate-400">Invoice ID</span>
                            <span className="font-mono text-slate-300">{activeInvoice.invoiceId}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span className="text-slate-400">Razorpay Payment ID</span>
                            <span className="font-mono text-blue-400">{activeInvoice.paymentId}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-sm text-white pt-1">
                            <span>Total Amount Paid</span>
                            <span className="text-emerald-400 text-base">{activeInvoice.currency}{activeInvoice.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Benefits Bullet List */}
                    <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                        <h4 className="font-bold text-white mb-2">Unlocked Benefits:</h4>
                        <ul className="space-y-1.5 text-slate-300">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-Definition Video Streaming</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Increased Download Quotas & Resolution</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ad-Free Uninterrupted Viewing</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exclusive VIP Content Access</li>
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center pt-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm shadow-lg shadow-red-600/30 inline-flex items-center gap-2 transition-all"
                        >
                            Start Watching WeTube Now
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};
