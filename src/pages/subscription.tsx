import React from 'react';
import Head from 'next/head';
import { PricingModal } from '../components/PricingModal';
import { Navbar } from '../components/Navbar';
import { useSubscription } from '../context/SubscriptionContext';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmailConfirmationModal } from '../components/EmailConfirmationModal';

export default function SubscriptionPage() {
    const { pendingUpgradePlan, setPendingUpgradePlan, activeInvoice, setIsInvoiceModalOpen, isEmailModalOpen, setIsEmailModalOpen } = useSubscription();

    return (
        <>
            <Head>
                <title>Subscription Plans - Free, Bronze, Silver, Gold | WeTube</title>
            </Head>

            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 py-8">
                    <PricingModal isStandalonePage />
                </main>

                <RazorpayCheckoutModal planId={pendingUpgradePlan} onClose={() => setPendingUpgradePlan(null)} />
                <InvoiceModal invoice={activeInvoice} onClose={() => setIsInvoiceModalOpen(false)} />
                <EmailConfirmationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
            </div>
        </>
    );
}
