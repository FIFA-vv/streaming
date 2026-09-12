import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory / persistent server-side mock database
let userDatabase: Record<string, any> = {
    usr_wetube_1001: {
        userId: 'usr_wetube_1001',
        plan: 'Free',
        status: 'active',
        updatedAt: new Date().toISOString(),
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = (req.query.userId as string) || 'usr_wetube_1001';
        const user = userDatabase[userId] || { userId, plan: 'Free', status: 'active' };
        return res.status(200).json(user);
    }

    if (req.method === 'POST') {
        const subscriptionData = req.body;
        const userId = subscriptionData.userId || 'usr_wetube_1001';

        userDatabase[userId] = {
            ...userDatabase[userId],
            ...subscriptionData,
            updatedAt: new Date().toISOString(),
        };

        console.log(`[DATABASE UPDATED] Plan updated for ${userId}: ${subscriptionData.plan}`);

        return res.status(200).json({
            success: true,
            message: `User plan successfully updated in database to ${subscriptionData.plan}`,
            user: userDatabase[userId],
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
