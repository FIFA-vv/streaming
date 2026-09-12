import { PlanTier } from '../types/subscription';

export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
    views: string;
    uploadedAt: string;
    creator: string;
    creatorAvatar: string;
    requiredTier: PlanTier;
    maxResolutionAvailable: '720p' | '1080p' | '1440p' | '4K';
    isExclusive?: boolean;
    category: string;
}

export const SAMPLE_VIDEOS: Video[] = [
    {
        id: 'v1',
        title: '4K Ultra HD Nature Exploration: Swiss Alps & Fjords in 60FPS',
        description: 'Breathtaking 4K cinematography showcasing pristine glaciers, alpine lakes, and dramatic mountain peaks. Recorded in Dolby Atmos.',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '14:20',
        views: '1.4M views',
        uploadedAt: '2 days ago',
        creator: 'Cinematic Earth 4K',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        requiredTier: 'Gold',
        maxResolutionAvailable: '4K',
        isExclusive: true,
        category: 'Documentary',
    },
    {
        id: 'v2',
        title: 'Building a Fullstack Next.js App with AI & Razorpay Integration',
        description: 'Learn step-by-step how to build high-scale SaaS web apps with React 19, TypeScript, and live payment gateways.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '42:15',
        views: '850K views',
        uploadedAt: '5 days ago',
        creator: 'CodeCraft Masterclass',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        requiredTier: 'Silver',
        maxResolutionAvailable: '1440p',
        isExclusive: true,
        category: 'Education',
    },
    {
        id: 'v3',
        title: 'Cyberpunk City Night Ambient Lo-Fi Beats to Chill & Study To',
        description: 'Relaxing synthwave lo-fi hip hop tracks featuring neon rain ambient soundscapes.',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '01:10:00',
        views: '3.2M views',
        uploadedAt: '1 week ago',
        creator: 'Neon Beats Station',
        creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        requiredTier: 'Bronze',
        maxResolutionAvailable: '1080p',
        isExclusive: false,
        category: 'Music',
    },
    {
        id: 'v4',
        title: 'Top 10 Quantum Computing Breakthroughs of the Decade',
        description: 'An in-depth review of quantum supremacy, QPU advancements, and supercomputing frontiers.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '18:45',
        views: '420K views',
        uploadedAt: '3 days ago',
        creator: 'Tech Horizon',
        creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        requiredTier: 'Free',
        maxResolutionAvailable: '720p',
        isExclusive: false,
        category: 'Science',
    },
    {
        id: 'v5',
        title: 'Masterclass: High-Speed Sports Car Aerodynamics & Telemetry',
        description: 'Formula 1 telemetry breakdown, wind tunnel testing, and supercar chassis dynamics.',
        thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: '26:10',
        views: '990K views',
        uploadedAt: '4 days ago',
        creator: 'Apex Motorsports',
        creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80',
        requiredTier: 'Bronze',
        maxResolutionAvailable: '1080p',
        isExclusive: false,
        category: 'Sports',
    },
    {
        id: 'v6',
        title: 'Extreme Mountain Biking Downhill World Championship 2026',
        description: 'Adrenaline-packed POV mountain bike downhill trail footage through steep alpine passes.',
        thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylines.mp4',
        duration: '12:30',
        views: '2.1M views',
        uploadedAt: '6 days ago',
        creator: 'Adrenaline Rush',
        creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
        requiredTier: 'Gold',
        maxResolutionAvailable: '4K',
        isExclusive: true,
        category: 'Action',
    },
];
