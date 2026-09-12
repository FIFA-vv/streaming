import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { email, invoice } = req.body;

        if (!email || !invoice) {
            return res.status(400).json({ success: false, message: 'Missing recipient email or invoice details' });
        }

        // Simulate sending email via SMTP/Nodemailer or SendGrid
        console.log(`[EMAIL SENT] Confirmation email sent to ${email} for Invoice ${invoice.invoiceId}`);

        return res.status(200).json({
            success: true,
            message: `Subscription confirmation email & invoice sent to ${email}`,
            sentAt: new Date().toISOString(),
            emailSummary: {
                to: email,
                subject: `🎉 Order Confirmation & Tax Invoice - WeTube ${invoice.planName}`,
                invoiceId: invoice.invoiceId,
                totalPaid: `${invoice.currency}${invoice.totalAmount}`,
            },
        });
    } catch (error) {
        console.error('Failed to dispatch email:', error);
        return res.status(500).json({ success: false, message: 'Email dispatch failed' });
    }
}
