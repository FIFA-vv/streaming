import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanTier, BillingCycle, UserSubscriptionState, Invoice, SubscriptionPlan } from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../data/plansData';
import { generateInvoice, exportInvoicePDF } from '../lib/invoiceGenerator';
import confetti from 'canvas-confetti';

interface SubscriptionContextType {
    subscription: UserSubscriptionState;
    plans: Record<PlanTier, SubscriptionPlan>;
    activePlanDetails: SubscriptionPlan;
    billingCycle: BillingCycle;
    setBillingCycle: (cycle: BillingCycle) => void;
    upgradePlan: (planId: PlanTier, paymentId?: string, orderId?: string, paymentMethod?: string) => void;
    cancelSubscription: () => void;
    canWatchVideo: (videoTier?: PlanTier) => { allowed: boolean; reason?: string; requiredPlan?: PlanTier };
    canDownloadVideo: (resolution?: string) => { allowed: boolean; reason?: string; requiredPlan?: PlanTier };
    recordWatchTime: (minutes: number) => boolean;
    recordDownload: () => boolean;
    activeInvoice: Invoice | null;
    setActiveInvoice: (invoice: Invoice | null) => void;
    isPricingModalOpen: boolean;
    setIsPricingModalOpen: (open: boolean) => void;
    isInvoiceModalOpen: boolean;
    setIsInvoiceModalOpen: (open: boolean) => void;
    isEmailModalOpen: boolean;
    setIsEmailModalOpen: (open: boolean) => void;
    pendingUpgradePlan: PlanTier | null;
    setPendingUpgradePlan: (plan: PlanTier | null) => void;
    openCheckout: (plan: PlanTier) => void;
    downloadInvoicePDF: (invoice: Invoice) => void;
}

const DEFAULT_SUBSCRIPTION: UserSubscriptionState = {
    plan: 'Free',
    billingCycle: 'monthly',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: 'Lifetime',
    autoRenew: true,
    dailyWatchTimeUsed: 0,
    dailyDownloadsUsed: 0,
    lastWatchTimeReset: new Date().toISOString().split('T')[0],
    lastDownloadReset: new Date().toISOString().split('T')[0],
    userName: 'Alex Johnson',
    userEmail: 'alex.johnson@wetube.com',
    invoiceHistory: [],
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [subscription, setSubscription] = useState<UserSubscriptionState>(DEFAULT_SUBSCRIPTION);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [pendingUpgradePlan, setPendingUpgradePlan] = useState<PlanTier | null>(null);

    // Load subscription from localStorage on mount & sync with DB API
    useEffect(() => {
        try {
            const stored = localStorage.getItem('wetube_user_subscription');
            if (stored) {
                const parsed = JSON.parse(stored);

                // Reset daily limits if new date
                const today = new Date().toISOString().split('T')[0];
                if (parsed.lastWatchTimeReset !== today) {
                    parsed.dailyWatchTimeUsed = 0;
                    parsed.lastWatchTimeReset = today;
                }
                if (parsed.lastDownloadReset !== today) {
                    parsed.dailyDownloadsUsed = 0;
                    parsed.lastDownloadReset = today;
                }

                setSubscription(parsed);
            }
        } catch (e) {
            console.error('Failed to load subscription state', e);
        }
    }, []);

    // Save to localStorage whenever state changes & post to sync API
    const saveSubscription = (newState: UserSubscriptionState) => {
        setSubscription(newState);
        try {
            localStorage.setItem('wetube_user_subscription', JSON.stringify(newState));

            // Also send background update to server API
            fetch('/api/subscription/user-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newState),
            }).catch((err) => console.log('API Sync Notice:', err));
        } catch (e) {
            console.error('Failed to save subscription', e);
        }
    };

    const activePlanDetails = SUBSCRIPTION_PLANS[subscription.plan];

    const openCheckout = (planId: PlanTier) => {
        if (planId === subscription.plan) {
            alert(`You are currently on the ${planId} plan!`);
            return;
        }
        setPendingUpgradePlan(planId);
    };

    const upgradePlan = (
        planId: PlanTier,
        paymentId?: string,
        orderId?: string,
        paymentMethod: string = 'Razorpay Test Payment'
    ) => {
        const newInvoice = generateInvoice(
            planId,
            billingCycle,
            subscription.userEmail,
            subscription.userName,
            paymentId,
            orderId,
            paymentMethod
        );

        const updatedState: UserSubscriptionState = {
            ...subscription,
            plan: planId,
            billingCycle,
            status: 'active',
            startDate: newInvoice.createdAt,
            expiryDate: newInvoice.expiryDate,
            lastPaymentId: newInvoice.paymentId,
            lastOrderId: newInvoice.orderId,
            dailyWatchTimeUsed: 0, // Fresh quota on upgrade
            dailyDownloadsUsed: 0,
            invoiceHistory: [newInvoice, ...subscription.invoiceHistory],
        };

        saveSubscription(updatedState);
        setActiveInvoice(newInvoice);
        setPendingUpgradePlan(null);

        // Fire festive celebration confetti!
        try {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#EAB308', '#38BDF8', '#D97706', '#EF4444', '#10B981'],
            });
        } catch (err) {
            console.log('Confetti effect fired');
        }

        // Open Invoice Modal immediately
        setIsInvoiceModalOpen(true);
    };

    const cancelSubscription = () => {
        const updatedState: UserSubscriptionState = {
            ...subscription,
            status: 'cancelled',
            autoRenew: false,
        };
        saveSubscription(updatedState);
    };

    const canWatchVideo = (videoTier: PlanTier = 'Free') => {
        const tierHierarchy: Record<PlanTier, number> = { Free: 0, Bronze: 1, Silver: 2, Gold: 3 };
        const userRank = tierHierarchy[subscription.plan];
        const videoRank = tierHierarchy[videoTier];

        if (userRank < videoRank) {
            return {
                allowed: false,
                reason: `This video is exclusive to ${videoTier} tier and above. Please upgrade to unlock.`,
                requiredPlan: videoTier,
            };
        }

        // Check watch time limit
        const dailyLimit = activePlanDetails.limits.dailyWatchLimitMinutes;
        if (dailyLimit !== null && subscription.dailyWatchTimeUsed >= dailyLimit) {
            return {
                allowed: false,
                reason: `You have reached your daily watch limit of ${dailyLimit} minutes on the ${subscription.plan} plan. Upgrade to Silver or Gold for unlimited watch time!`,
                requiredPlan: 'Silver' as PlanTier,
            };
        }

        return { allowed: true };
    };

    const canDownloadVideo = (resolution: string = '720p') => {
        const resRank: Record<string, number> = { '480p': 0, '720p': 1, '1080p': 2, '1440p': 3, '4K': 4 };
        const maxAllowedRes = activePlanDetails.limits.maxDownloadResolution;

        if (resRank[resolution] > resRank[maxAllowedRes]) {
            return {
                allowed: false,
                reason: `${resolution} downloads are not supported on ${subscription.plan} plan. (Max: ${maxAllowedRes}). Upgrade to Gold for 4K downloads!`,
                requiredPlan: 'Gold' as PlanTier,
            };
        }

        const dailyLimit = activePlanDetails.limits.dailyDownloadLimit;
        if (dailyLimit !== null && subscription.dailyDownloadsUsed >= dailyLimit) {
            const nextPlan: PlanTier = subscription.plan === 'Free' ? 'Bronze' : subscription.plan === 'Bronze' ? 'Silver' : 'Gold';
            return {
                allowed: false,
                reason: `Daily download limit reached (${subscription.dailyDownloadsUsed}/${dailyLimit} downloads used). Upgrade your plan for higher limits!`,
                requiredPlan: nextPlan,
            };
        }

        return { allowed: true };
    };

    const recordWatchTime = (minutes: number) => {
        const updated = {
            ...subscription,
            dailyWatchTimeUsed: subscription.dailyWatchTimeUsed + minutes,
        };
        saveSubscription(updated);
        return true;
    };

    const recordDownload = () => {
        const updated = {
            ...subscription,
            dailyDownloadsUsed: subscription.dailyDownloadsUsed + 1,
        };
        saveSubscription(updated);
        return true;
    };

    const downloadInvoicePDF = (invoice: Invoice) => {
        exportInvoicePDF(invoice);
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                plans: SUBSCRIPTION_PLANS,
                activePlanDetails,
                billingCycle,
                setBillingCycle,
                upgradePlan,
                cancelSubscription,
                canWatchVideo,
                canDownloadVideo,
                recordWatchTime,
                recordDownload,
                activeInvoice,
                setActiveInvoice,
                isPricingModalOpen,
                setIsPricingModalOpen,
                isInvoiceModalOpen,
                setIsInvoiceModalOpen,
                isEmailModalOpen,
                setIsEmailModalOpen,
                pendingUpgradePlan,
                setPendingUpgradePlan,
                openCheckout,
                downloadInvoicePDF,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
