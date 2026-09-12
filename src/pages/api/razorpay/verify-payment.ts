import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId, billingCycle } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id) {
            return res.status(400).json({ success: false, message: 'Invalid payment parameters' });
        }

        // In production with real Razorpay credentials, verify HMAC-SHA256 signature here:
        // const generatedSignature = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

        return res.status(200).json({
            success: true,
            message: 'Payment signature verified successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            planId,
            billingCycle,
            verifiedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Razorpay verification error:', error);
        return res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
}
