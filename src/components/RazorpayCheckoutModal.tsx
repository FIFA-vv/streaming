import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { loadRazorpayScript } from '../lib/razorpay';
import { SUBSCRIPTION_PLANS } from '../data/plansData';
import { PlanTier } from '../types/subscription';
import { ShieldCheck, CreditCard, Smartphone, Building2, Wallet, CheckCircle2, X, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

interface RazorpayCheckoutModalProps {
    planId: PlanTier | null;
    onClose: () => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({ planId, onClose }) => {
    const { billingCycle, upgradePlan, subscription } = useSubscription();
    const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
    const [upiId, setUpiId] = useState('user@razorpay');
    const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvv, setCardCvv] = useState('123');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [useOfficialSDK, setUseOfficialSDK] = useState(true);

    if (!planId) return null;

    const plan = SUBSCRIPTION_PLANS[planId];
    const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const rawPriceInPaise = price * 100;

    const handleOfficialSDKCheckout = async () => {
        setIsProcessing(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    billingCycle,
                    amount: price,
                }),
            });

            const orderData = await res.json();
            if (!res.ok) throw new Error(orderData.message || 'Failed to create order');

            const isLoaded = await loadRazorpayScript();

            if (isLoaded && (window as any).Razorpay) {
                const options = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'WeTube Premium',
                    description: `${plan.name} (${billingCycle.toUpperCase()})`,
                    order_id: orderData.id,
                    image: '/wetube-logo.png', // Fallback brand icon
                    prefill: {
                        name: subscription.userName,
                        email: subscription.userEmail,
                        contact: '9999999999',
                    },
                    theme: {
                        color: plan.color.primary || '#3B82F6',
                    },
                    handler: async function (response: any) {
                        // Verify payment
                        const verifyRes = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                planId,
                                billingCycle,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        setIsProcessing(false);

                        if (verifyData.success) {
                            upgradePlan(planId, response.razorpay_payment_id, response.razorpay_order_id, 'Razorpay SDK (Test Mode)');
                            onClose();
                        } else {
                            setErrorMessage('Payment verification failed');
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        },
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    setIsProcessing(false);
                    setErrorMessage(`Payment Failed: ${response.error.description}`);
                });
                rzp.open();
            } else {
                // Fallback to embedded simulator if Razorpay script is blocked
                setUseOfficialSDK(false);
                setIsProcessing(false);
            }
        } catch (err: any) {
            console.warn('Official SDK launch skipped, using built-in Razorpay Test dialog', err);
            setUseOfficialSDK(false);
            setIsProcessing(false);
        }
    };

    const handleSimulatedPayment = (success: boolean) => {
        setIsProcessing(true);
        setErrorMessage('');

        setTimeout(() => {
            setIsProcessing(false);
            if (success) {
                const mockPayId = `pay_${Math.random().toString(36).substring(2, 12)}`;
                const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
                upgradePlan(planId, mockPayId, mockOrderId, `Razorpay Test (${selectedMethod.toUpperCase()})`);
                onClose();
            } else {
                setErrorMessage('Transaction declined by issuing bank (Test Mode Simulation)');
            }
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100">

                {/* Top Header / Razorpay Branding */}
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shadow-inner">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-white">Razorpay</span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    TEST MODE
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Secure Payment Gateway for WeTube</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Plan Summary Banner */}
                <div className="p-4 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Subscribing To</p>
                        <h4 className={`text-lg font-bold ${plan.color.text} flex items-center gap-1.5`}>
                            {plan.name}
                            <span className="text-xs text-slate-400 font-normal">({billingCycle})</span>
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-extrabold text-white">
                            {plan.currency}{price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-slate-400">Inclusive of 18% GST</p>
                    </div>
                </div>

                {/* Payment Body */}
                <div className="p-6 space-y-6">

                    {/* Quick Choice SDK vs Direct Simulation */}
                    <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <button
                            onClick={() => handleOfficialSDKCheckout()}
                            disabled={isProcessing}
                            className="flex-1 py-2 rounded-lg font-medium bg-blue-600 text-white shadow hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            Launch Razorpay Popup SDK
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-800 w-full"></div>
                        <span className="absolute bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                            OR TEST IN-APP GATEWAY
                        </span>
                    </div>

                    {/* Error display */}
                    {errorMessage && (
                        <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                            { id: 'card', label: 'Cards', icon: CreditCard },
                            { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                            { id: 'wallet', label: 'Wallets', icon: Wallet },
                        ].map((method) => {
                            const Icon = method.icon;
                            const isSelected = selectedMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id as any)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${isSelected
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                                    {method.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Method Specific Controls */}
                    {selectedMethod === 'upi' && (
                        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                            <label className="text-xs font-semibold text-slate-300 block">Enter Test VPA / UPI ID</label>
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="success@razorpay"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[11px] text-slate-400">
                                Use <code className="text-amber-300 bg-amber-950/60 px-1 rounded">success@razorpay</code> for instant test approval.
                            </p>
                        </div>
                    )}

                    {selectedMethod === 'card' && (
                        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                            <div>
                                <label className="text-xs font-semibold text-slate-300 block mb-1">Test Card Number</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">Expiry</label>
                                    <input
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center font-mono focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">CVV</label>
                                    <input
                                        type="password"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value)}
                                        maxLength={3}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center font-mono focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'netbanking' && (
                        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                            <p className="font-medium text-slate-300">Select Test Bank:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank, i) => (
                                    <div key={bank} className="p-2.5 bg-slate-900 rounded-lg border border-slate-700/80 text-slate-200 text-center cursor-pointer hover:border-blue-500">
                                        {bank}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'wallet' && (
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                            <p className="font-medium mb-1">Supported Test Wallets:</p>
                            <p className="text-slate-400">Paytm, Mobikwik, PhonePe Wallet, Amazon Pay Test</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleSimulatedPayment(false)}
                            className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
                        >
                            Simulate Failure
                        </button>
                        <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleSimulatedPayment(true)}
                            className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying Payment...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                                    Pay {plan.currency}{price.toLocaleString('en-IN')} (Test Mode)
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>256-Bit SSL Secured • Razorpay Sandbox Integration</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
