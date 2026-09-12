import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Invoice } from '../types/subscription';
import { Download, Mail, Printer, CheckCircle2, X, ShieldCheck, FileText, Sparkles, Building } from 'lucide-react';

interface InvoiceModalProps {
    invoice: Invoice | null;
    onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
    const { downloadInvoicePDF, setIsEmailModalOpen } = useSubscription();
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    if (!invoice) return null;

    const handleSendEmail = async () => {
        setEmailStatus('sending');
        try {
            const res = await fetch('/api/subscription/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: invoice.userEmail,
                    invoice,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setEmailStatus('sent');
                setTimeout(() => setEmailStatus('idle'), 4000);
            } else {
                alert(data.message || 'Failed to send email');
                setEmailStatus('idle');
            }
        } catch (err) {
            console.error(err);
            setEmailStatus('idle');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
            <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">

                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-extrabold text-white">Payment Successful!</h3>
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    {invoice.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Your subscription has been activated immediately.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Printable Tax Invoice Content */}
                <div className="p-6 space-y-6 bg-slate-900 text-slate-200" id="printable-invoice">

                    {/* Brand & Invoice Top Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm">
                                    ▶
                                </div>
                                <span className="text-xl font-black tracking-tight text-white">WeTube <span className="text-red-500">Premium</span></span>
                            </div>
                            <p className="text-xs text-slate-400">WeTube Entertainment Inc.</p>
                            <p className="text-[11px] text-slate-500">GSTIN: 27AAAAA0000A1Z5</p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">TAX INVOICE</p>
                            <p className="text-lg font-bold text-white">{invoice.invoiceId}</p>
                            <p className="text-xs text-slate-400">Date: {invoice.createdAt}</p>
                            <p className="text-xs text-slate-400">Valid Until: {invoice.expiryDate}</p>
                        </div>
                    </div>

                    {/* User & Payment Meta Details */}
                    <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                        <div>
                            <p className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">BILLED TO</p>
                            <p className="font-bold text-white text-sm">{invoice.userName}</p>
                            <p className="text-slate-300">{invoice.userEmail}</p>
                            <p className="text-slate-400 mt-1">Plan: <span className="text-amber-400 font-semibold">{invoice.planName}</span></p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">TRANSACTION DETAILS</p>
                            <p className="text-slate-300"><span className="text-slate-400">Payment ID:</span> <span className="font-mono text-blue-300">{invoice.paymentId}</span></p>
                            <p className="text-slate-300"><span className="text-slate-400">Order ID:</span> <span className="font-mono text-slate-300">{invoice.orderId}</span></p>
                            <p className="text-slate-300"><span className="text-slate-400">Gateway:</span> {invoice.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Line Item Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 text-center">Cycle</th>
                                    <th className="p-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {invoice.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/40">
                                        <td className="p-3 font-medium text-white">{item.description}</td>
                                        <td className="p-3 text-center uppercase font-semibold text-slate-400">{invoice.billingCycle}</td>
                                        <td className="p-3 text-right font-mono">{invoice.currency}{item.amount.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pricing Totals & GST breakdown */}
                    <div className="flex justify-end pt-2">
                        <div className="w-full sm:w-64 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-400">
                                <span>Base Price:</span>
                                <span className="font-mono text-slate-200">{invoice.currency}{invoice.baseAmount.toLocaleString('en-IN')}</span>
                            </div>
                            {invoice.discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                    <span>Yearly Discount:</span>
                                    <span className="font-mono">- {invoice.currency}{invoice.discountAmount.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-400">
                                <span>GST (18%):</span>
                                <span className="font-mono text-slate-200">{invoice.currency}{invoice.taxAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-white">
                                <span>Total Paid:</span>
                                <span className="font-mono text-emerald-400 text-base">{invoice.currency}{invoice.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verified Tax Invoice</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => downloadInvoicePDF(invoice)}
                            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <Download className="w-4 h-4 text-blue-400" />
                            Download PDF
                        </button>
                        <button
                            onClick={handleSendEmail}
                            disabled={emailStatus === 'sending'}
                            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <Mail className="w-4 h-4 text-amber-400" />
                            {emailStatus === 'sending' ? 'Sending Email...' : emailStatus === 'sent' ? 'Email Sent! ✓' : 'Send Email Invoice'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                        >
                            Start Watching
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
