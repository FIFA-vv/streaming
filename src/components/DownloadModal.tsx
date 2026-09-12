import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Video } from '../data/videosData';
import { Download, Lock, CheckCircle2, AlertCircle, X, ShieldAlert, Sparkles, FileVideo } from 'lucide-react';

interface DownloadModalProps {
    video: Video;
    isOpen: boolean;
    onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ video, isOpen, onClose }) => {
    const { canDownloadVideo, recordDownload, subscription, activePlanDetails, openCheckout } = useSubscription();
    const [selectedRes, setSelectedRes] = useState<'480p' | '720p' | '1080p' | '4K'>('720p');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);

    if (!isOpen) return null;

    const quotaCheck = canDownloadVideo(selectedRes);
    const maxDownloadRes = activePlanDetails.limits.maxDownloadResolution;

    const handleStartDownload = () => {
        if (!quotaCheck.allowed) return;

        setIsDownloading(true);
        setDownloadProgress(10);

        const interval = setInterval(() => {
            setDownloadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsDownloading(false);
                    setDownloadComplete(true);
                    recordDownload();
                    return 100;
                }
                return prev + 25;
            });
        }, 400);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">

                {/* Header */}
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold text-white text-base">Download Video</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Video Info Card */}
                <div className="p-4 space-y-4">
                    <div className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-white line-clamp-2">{video.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{video.creator} • {video.duration}</p>
                        </div>
                    </div>

                    {/* Download Quota Indicator */}
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-400">Daily Downloads Quota:</span>
                        <span className="font-bold text-amber-400">
                            {activePlanDetails.limits.dailyDownloadLimit === null
                                ? 'Unlimited (Gold VIP)'
                                : `${subscription.dailyDownloadsUsed} / ${activePlanDetails.limits.dailyDownloadLimit} used today`}
                        </span>
                    </div>

                    {/* Resolution Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Select Download Quality</label>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { res: '480p', label: 'Standard SD (480p)', size: '~45 MB' },
                                { res: '720p', label: 'High Definition (720p)', size: '~110 MB' },
                                { res: '1080p', label: 'Full HD (1080p)', size: '~280 MB' },
                                { res: '4K', label: 'Ultra HD (4K)', size: '~850 MB' },
                            ].map((item) => {
                                const check = canDownloadVideo(item.res);
                                const isSelected = selectedRes === item.res;
                                const isLocked = !check.allowed;

                                return (
                                    <button
                                        key={item.res}
                                        disabled={isLocked}
                                        onClick={() => setSelectedRes(item.res as any)}
                                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${isLocked
                                                ? 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-xs">{item.res}</span>
                                            {isLocked ? (
                                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                            ) : isSelected ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                                            ) : null}
                                        </div>
                                        <span className="text-[10px] text-slate-400">{item.size}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Locked quality warning banner */}
                    {!quotaCheck.allowed && (
                        <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-300 text-xs space-y-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p>{quotaCheck.reason}</p>
                            </div>
                            <button
                                onClick={() => {
                                    onClose();
                                    openCheckout(quotaCheck.requiredPlan || 'Silver');
                                }}
                                className="w-full py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                            >
                                Upgrade to {quotaCheck.requiredPlan || 'Higher Tier'}
                            </button>
                        </div>
                    )}

                    {/* Download progress */}
                    {isDownloading && (
                        <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Downloading MP4 file...</span>
                                <span>{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-300"
                                    style={{ width: `${downloadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {downloadComplete && (
                        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>Download completed! Saved to offline storage.</span>
                        </div>
                    )}

                    {/* Action button */}
                    <div className="pt-2">
                        {!downloadComplete ? (
                            <button
                                disabled={!quotaCheck.allowed || isDownloading}
                                onClick={handleStartDownload}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <FileVideo className="w-4 h-4" />
                                {isDownloading ? 'Downloading...' : `Download ${selectedRes} MP4`}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};
