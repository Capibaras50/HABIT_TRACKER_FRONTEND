export interface Habit {
    id: number | string;
    title: string;
    subtitle?: string;
    days?: string[]; // Kept for reference of "scheduled days" if needed, but UI uses implied
    completions: string[]; // Array of ISO date strings (YYYY-MM-DD)
    completedAt?: string; // Deprecated in favor of completions, but kept for compatibility
    status: 'completed' | 'pending'; // Computed status for "today"
    time: string; // Duration string now, e.g. "30 min"
    importance?: 'Alta' | 'Media' | 'Baja';
    reward: number;
    type: 'weekday' | 'weekend';
    image?: string;
    requiresDeepWork?: boolean;
    deepWorkWithScreen?: boolean;
}

export interface Reward {
    id: number | string;
    title: string;
    description: string;
    cost: number;
    imageColor: string; // Hex color for placeholder
    iconName: string; // Identifier for getting the icon component
    duration: string; // e.g. '30 min', '1h'
    locked: boolean;
}

export interface FocusSession {
    id: number | string;
    activityName: string;
    category: string;
    startTime: string; // ISO String
    durationMinutes: number;
    effectiveness: number; // 0-100
}

export interface UserMetrics {
    focusScore: number;
    totalFocusTime: string; // e.g. "4h 12m"
    interruptionCount: number;
    points: number;
    streak: number;
    tier: number;
    tierProgress: number; // 0-100
}

export interface User {
    id: number | string;
    name: string;
    email: string;
    image_profile?: string;
    // Add other fields from backend if needed
}
