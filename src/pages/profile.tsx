import React, { useState } from 'react';
import Head from 'next/head';
import { useSubscription } from '../context/SubscriptionContext';
import { Navbar } from '../components/Navbar';
import { PricingModal } from '../components/PricingModal';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmailConfirmationModal } from '../components/EmailConfirmationModal';
import { User, CreditCard, Shield, Download, FileText, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Clock } from 'lucide-react';
import { Invoice } from '../types/subscription';

export default function ProfilePage() {
    const {
        subscription,
        activePlanDetails,
        cancelSubscription,
        downloadInvoicePDF,
        setActiveInvoice,
        setIsInvoiceModalOpen,
        setIsPricingModalOpen,
        isPricingModalOpen,
        pendingUpgradePlan,
        setPendingUpgradePlan,
        activeInvoice,
        isInvoiceModalOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
    } = useSubscription();

    const [activeTab, setActiveTab] = useState<'subscription' | 'billing' | 'account'>('subscription');

    return (
        <>
            <Head>
                <title>User Profile & Subscription Billing - WeTube Premium</title>
            </Head>

            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">

                    {/* Top Profile Hero Card */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-1 shadow-lg">
                                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-black">
                                        {subscription.userName.charAt(0)}
                                    </div>
                                </div>
                                <span className={`absolute bottom-0 right-0 px-2 py-0.5 text-[10px] font-black rounded-full border shadow ${activePlanDetails.color.badge}`}>
                                    {subscription.plan}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {subscription.userName}
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                        Pro Member
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400 mt-1">{subscription.userEmail}</p>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Active Subscription: <span className={`font-bold ${activePlanDetails.color.text}`}>{activePlanDetails.name}</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPricingModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-black" />
                            Upgrade Subscription
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-800 text-sm font-semibold gap-6">
                        <button
                            onClick={() => setActiveTab('subscription')}
                            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'subscription'
                                    ? 'border-amber-400 text-amber-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            My Subscription
                        </button>

                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'billing'
                                    ? 'border-amber-400 text-amber-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <CreditCard className="w-4 h-4" />
                            Billing & Invoices ({subscription.invoiceHistory.length})
                        </button>
                    </div>

                    {/* TAB 1: SUBSCRIPTION DETAILS */}
                    {activeTab === 'subscription' && (
                        <div className="space-y-6">

                            {/* Active Plan Card */}
                            <div className={`p-6 rounded-3xl border ${activePlanDetails.color.border} ${activePlanDetails.color.bg} space-y-6 shadow-xl`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                                    <div>
                                        <span className={`text-xs uppercase font-extrabold tracking-wider ${activePlanDetails.color.text}`}>
                                            CURRENT PLAN
                                        </span>
                                        <h2 className="text-3xl font-black text-white mt-1">{activePlanDetails.name}</h2>
                                        <p className="text-xs text-slate-400">{activePlanDetails.tagline}</p>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs text-slate-400 block uppercase tracking-wider">Status</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {subscription.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Quota & Limit Usage Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-slate-400 block mb-1">Max Streaming Resolution</span>
                                        <span className="text-lg font-bold text-white">{activePlanDetails.limits.maxResolution}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-slate-400 block mb-1">Daily Watch Time Quota</span>
                                        <span className="text-lg font-bold text-amber-400">
                                            {activePlanDetails.limits.dailyWatchLimitMinutes === null
                                                ? 'Unlimited Watch Time'
                                                : `${subscription.dailyWatchTimeUsed} / ${activePlanDetails.limits.dailyWatchLimitMinutes} mins`}
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-slate-400 block mb-1">Daily Downloads Quota</span>
                                        <span className="text-lg font-bold text-sky-400">
                                            {activePlanDetails.limits.dailyDownloadLimit === null
                                                ? 'Unlimited Downloads'
                                                : `${subscription.dailyDownloadsUsed} / ${activePlanDetails.limits.dailyDownloadLimit} videos`}
                                        </span>
                                    </div>
                                </div>

                                {/* Plan Metadata & Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-800/80 gap-4 text-xs">
                                    <div>
                                        <p className="text-slate-400">
                                            Billing Period: <span className="text-white font-semibold uppercase">{subscription.billingCycle}</span>
                                        </p>
                                        <p className="text-slate-400 mt-0.5">
                                            Next Renewal / Expiry: <span className="text-slate-200 font-semibold">{subscription.expiryDate}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {subscription.plan !== 'Free' && (
                                            <button
                                                onClick={cancelSubscription}
                                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 font-bold border border-slate-700 transition-colors"
                                            >
                                                Cancel Plan
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsPricingModalOpen(true)}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-md hover:brightness-110 transition-all"
                                        >
                                            Change Plan Tier
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* TAB 2: BILLING & INVOICES */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Payment & Invoice History</h3>
                                    <p className="text-xs text-slate-400">Download past tax invoices or view Razorpay transaction records.</p>
                                </div>
                            </div>

                            {subscription.invoiceHistory.length === 0 ? (
                                <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                                    <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                                    <p className="text-slate-400 font-medium text-sm">No transaction records found yet.</p>
                                    <button
                                        onClick={() => setIsPricingModalOpen(true)}
                                        className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
                                    >
                                        Upgrade Plan Now
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                                            <tr>
                                                <th className="p-4">Invoice ID</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Plan Name</th>
                                                <th className="p-4">Amount</th>
                                                <th className="p-4">Razorpay ID</th>
                                                <th className="p-4 text-center">Status</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800 text-slate-300">
                                            {subscription.invoiceHistory.map((inv: Invoice) => (
                                                <tr key={inv.invoiceId} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 font-mono font-bold text-white">{inv.invoiceId}</td>
                                                    <td className="p-4 text-slate-400">{inv.createdAt}</td>
                                                    <td className="p-4 font-semibold text-amber-400">{inv.planName}</td>
                                                    <td className="p-4 font-mono font-bold text-white">{inv.currency}{inv.totalAmount}</td>
                                                    <td className="p-4 font-mono text-blue-400">{inv.paymentId}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                            {inv.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setActiveInvoice(inv);
                                                                    setIsInvoiceModalOpen(true);
                                                                }}
                                                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => downloadInvoicePDF(inv)}
                                                                className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium text-[11px] border border-blue-500/30 flex items-center gap-1 transition-colors"
                                                            >
                                                                <Download className="w-3 h-3" />
                                                                PDF
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </main>

                {/* Global Modals */}
                <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
                <RazorpayCheckoutModal planId={pendingUpgradePlan} onClose={() => setPendingUpgradePlan(null)} />
                <InvoiceModal invoice={activeInvoice} onClose={() => setIsInvoiceModalOpen(false)} />
                <EmailConfirmationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

            </div>
        </>
    );
}
