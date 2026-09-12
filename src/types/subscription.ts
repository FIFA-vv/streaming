export type PlanTier = 'Free' | 'Bronze' | 'Silver' | 'Gold';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number; // In INR
  priceYearly: number;  // In INR per year
  currency: string;
  badgeText?: string;
  popular?: boolean;
  color: {
    primary: string;
    gradient: string;
    border: string;
    text: string;
    bg: string;
    badge: string;
  };
  limits: {
    maxResolution: '480p' | '720p' | '1080p' | '1440p' | '4K';
    dailyWatchLimitMinutes: number | null; // null = unlimited
    dailyDownloadLimit: number | null;     // null = unlimited
    maxDownloadResolution: '480p' | '720p' | '1080p' | '4K';
    adFree: boolean;
    reducedAdsPercent?: number;
    exclusiveContentAccess: PlanTier[];
    earlyAccess: boolean;
    offlineViewing: boolean;
    hdrAudio: boolean;
    prioritySupport: boolean;
  };
  features: string[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  invoiceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: PlanTier;
  planName: string;
  billingCycle: BillingCycle;
  baseAmount: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number; // 18% GST
  totalAmount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  paymentMethod: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
  createdAt: string;
  expiryDate: string;
  items: InvoiceItem[];
}

export interface UserSubscriptionState {
  plan: PlanTier;
  billingCycle: BillingCycle;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  expiryDate: string;
  lastPaymentId?: string;
  lastOrderId?: string;
  autoRenew: boolean;
  dailyWatchTimeUsed: number; // in minutes
  dailyDownloadsUsed: number;
  lastWatchTimeReset: string; // YYYY-MM-DD
  lastDownloadReset: string;  // YYYY-MM-DD
  userName: string;
  userEmail: string;
  invoiceHistory: Invoice[];
}
