import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { planId, billingCycle, amount } = req.body;

        if (!planId || !amount) {
            return res.status(400).json({ message: 'Missing plan details or amount' });
        }

        const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
        const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_wetube123';

        return res.status(200).json({
            id: orderId,
            amount: amount * 100, // amount in paise
            currency: 'INR',
            keyId,
            notes: {
                planId,
                billingCycle: billingCycle || 'monthly',
                appName: 'WeTube Platform',
            },
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }
}
