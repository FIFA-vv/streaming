import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSubscription } from '../../context/SubscriptionContext';
import { SAMPLE_VIDEOS, Video } from '../../data/videosData';
import { Navbar } from '../../components/Navbar';
import { PricingModal } from '../../components/PricingModal';
import { RazorpayCheckoutModal } from '../../components/RazorpayCheckoutModal';
import { InvoiceModal } from '../../components/InvoiceModal';
import { EmailConfirmationModal } from '../../components/EmailConfirmationModal';
import { DownloadModal } from '../../components/DownloadModal';
import { AdBannerOverlay } from '../../components/AdBannerOverlay';
import { Lock, Download, Sparkles, Play, Pause, Settings, ShieldAlert, CheckCircle2, Clock, ThumbsUp, Share2, CornerDownRight } from 'lucide-react';
import { PlanTier } from '../../types/subscription';

export default function WatchPage() {
    const router = useRouter();
    const { id } = router.query;
    const {
        canWatchVideo,
        recordWatchTime,
        subscription,
        activePlanDetails,
        setIsPricingModalOpen,
        isPricingModalOpen,
        pendingUpgradePlan,
        setPendingUpgradePlan,
        activeInvoice,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
        openCheckout,
    } = useSubscription();

    const [video, setVideo] = useState<Video | null>(null);
    const [selectedResolution, setSelectedResolution] = useState<'480p' | '720p' | '1080p' | '1440p' | '4K'>('720p');
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isResMenuOpen, setIsResMenuOpen] = useState(false);
    const [watchLimitReached, setWatchLimitReached] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (id) {
            const found = SAMPLE_VIDEOS.find((v) => v.id === id) || SAMPLE_VIDEOS[0];
            setVideo(found);
        }
    }, [id]);

    // Track watch time every 30 seconds
    useEffect(() => {
        if (!video) return;

        const interval = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
                const canWatch = canWatchVideo(video.requiredTier);
                if (!canWatch.allowed && canWatch.reason?.includes('daily watch limit')) {
                    videoRef.current.pause();
                    setWatchLimitReached(true);
                } else {
                    recordWatchTime(1); // increment 1 minute
                }
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [video, canWatchVideo, recordWatchTime]);

    if (!video) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading video player...
            </div>
        );
    }

    const accessCheck = canWatchVideo(video.requiredTier);
    const maxAllowedRes = activePlanDetails.limits.maxResolution;

    const handleResolutionChange = (res: '480p' | '720p' | '1080p' | '1440p' | '4K') => {
        const resRank: Record<string, number> = { '480p': 0, '720p': 1, '1080p': 2, '1440p': 3, '4K': 4 };
        if (resRank[res] > resRank[maxAllowedRes]) {
            alert(`Streaming in ${res} requires ${res === '4K' ? 'Gold' : res === '1440p' ? 'Silver' : 'Bronze'} plan. Current plan max: ${maxAllowedRes}`);
            setIsPricingModalOpen(true);
            return;
        }
        setSelectedResolution(res);
        setIsResMenuOpen(false);
    };

    return (
        <>
            <Head>
                <title>{video.title} - WeTube Watch</title>
            </Head>

            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid lg:grid-cols-3 gap-8">

                    {/* Main Video & Details Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Video Player Container */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl group">

                            {!accessCheck.allowed && !watchLimitReached ? (
                                /* Locked Video Overlay */
                                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/90 p-8 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                                        <Lock className="w-8 h-8" />
                                    </div>

                                    <div className="max-w-md space-y-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                                            {video.requiredTier} EXCLUSIVE CONTENT
                                        </span>
                                        <h3 className="text-xl font-bold text-white">This video is locked</h3>
                                        <p className="text-xs text-slate-300">{accessCheck.reason}</p>
                                    </div>

                                    <button
                                        onClick={() => openCheckout(accessCheck.requiredPlan || 'Gold')}
                                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4 text-black" />
                                        Upgrade to {accessCheck.requiredPlan || 'Gold'} (Razorpay)
                                    </button>
                                </div>
                            ) : watchLimitReached ? (
                                /* Daily Watch Limit Overlay */
                                <div className="absolute inset-0 z-20 bg-slate-950/95 p-8 flex flex-col items-center justify-center text-center space-y-4">
                                    <Clock className="w-12 h-12 text-amber-400" />
                                    <h3 className="text-xl font-bold text-white">Daily Watch Limit Reached</h3>
                                    <p className="text-xs text-slate-300 max-w-md">
                                        You have reached your daily watch limit of {activePlanDetails.limits.dailyWatchLimitMinutes} minutes on the {subscription.plan} plan. Upgrade to Silver or Gold for unlimited viewing!
                                    </p>
                                    <button
                                        onClick={() => setIsPricingModalOpen(true)}
                                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-extrabold text-sm shadow-xl"
                                    >
                                        Upgrade for Unlimited Watch Time
                                    </button>
                                </div>
                            ) : (
                                /* HTML5 Video Player */
                                <>
                                    <video
                                        ref={videoRef}
                                        src={video.videoUrl}
                                        poster={video.thumbnail}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Top Quality Badge Bar */}
                                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                                            Streaming at {selectedResolution}
                                        </span>
                                        {video.isExclusive && (
                                            <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-[11px] font-black text-black">
                                                {video.requiredTier} EXCLUSIVE
                                            </span>
                                        )}
                                    </div>

                                    {/* Resolution Selector Dropdown */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => setIsResMenuOpen(!isResMenuOpen)}
                                            className="p-2 rounded-xl bg-black/70 backdrop-blur-md text-slate-200 border border-white/20 hover:bg-black/90 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                                        >
                                            <Settings className="w-4 h-4 text-amber-400" />
                                            <span>{selectedResolution}</span>
                                        </button>

                                        {isResMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-30 text-xs space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Resolution Quality</p>
                                                {['480p', '720p', '1080p', '1440p', '4K'].map((res) => {
                                                    const resRank: Record<string, number> = { '480p': 0, '720p': 1, '1080p': 2, '1440p': 3, '4K': 4 };
                                                    const isLocked = resRank[res] > resRank[maxAllowedRes];

                                                    return (
                                                        <button
                                                            key={res}
                                                            onClick={() => handleResolutionChange(res as any)}
                                                            className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${isLocked
                                                                    ? 'text-slate-500 hover:bg-slate-800/50'
                                                                    : selectedResolution === res
                                                                        ? 'bg-blue-600/30 text-blue-300 font-bold'
                                                                        : 'text-slate-200 hover:bg-slate-800'
                                                                }`}
                                                        >
                                                            <span>{res}</span>
                                                            {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : selectedResolution === res ? '✓' : ''}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>

                        {/* Ad Banner for Free/Bronze Tiers */}
                        <AdBannerOverlay />

                        {/* Video Meta Info */}
                        <div className="space-y-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{video.title}</h1>

                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs">
                                <div className="flex items-center gap-3">
                                    <img src={video.creatorAvatar} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{video.creator}</h4>
                                        <p className="text-slate-400">{video.views} • {video.uploadedAt}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold hover:bg-slate-800 flex items-center gap-1.5">
                                        <ThumbsUp className="w-4 h-4 text-slate-400" />
                                        Like
                                    </button>
                                    <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold hover:bg-slate-800 flex items-center gap-1.5">
                                        <Share2 className="w-4 h-4 text-slate-400" />
                                        Share
                                    </button>
                                    <button
                                        onClick={() => setIsDownloadModalOpen(true)}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-md"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            {/* Description Card */}
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                                <p>{video.description}</p>
                            </div>
                        </div>

                    </div>

                    {/* Up Next / Sidebar Recommendations */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-base text-white">Up Next & Recommended</h3>

                        <div className="space-y-3">
                            {SAMPLE_VIDEOS.map((v) => (
                                <Link
                                    key={v.id}
                                    href={`/watch/${v.id}`}
                                    className={`flex gap-3 p-2 rounded-2xl border transition-all ${v.id === video.id
                                            ? 'bg-slate-800/80 border-slate-700'
                                            : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900'
                                        }`}
                                >
                                    <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-950">
                                        <img src={v.thumbnail} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1 rounded text-slate-200">
                                            {v.duration}
                                        </span>
                                        {v.isExclusive && (
                                            <span className="absolute top-1 left-1 bg-amber-500 text-black text-[9px] font-extrabold px-1 rounded">
                                                {v.requiredTier}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-xs text-white line-clamp-2">{v.title}</h4>
                                        <p className="text-[11px] text-slate-400 mt-1">{v.creator}</p>
                                        <p className="text-[10px] text-slate-400">{v.views}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </main>

                {/* Download Modal */}
                <DownloadModal video={video} isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

                {/* Global Modals */}
                <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
                <RazorpayCheckoutModal planId={pendingUpgradePlan} onClose={() => setPendingUpgradePlan(null)} />
                <InvoiceModal invoice={activeInvoice} onClose={() => setIsInvoiceModalOpen(false)} />
                <EmailConfirmationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

            </div>
        </>
    );
}
