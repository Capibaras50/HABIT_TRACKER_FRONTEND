import { Habit, FocusSession, UserMetrics, User } from '../types';
import { apiInstance } from './api.config';

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<{ user: User }> => {
        const response = await apiInstance.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData: any): Promise<{ user: User }> => {
        const response = await apiInstance.post('/auth/register', userData);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiInstance.delete('/auth/logout');
    },

    getUserProfile: async (): Promise<any> => {
        const response = await apiInstance.get('/users'); // Corrected: router.get('/') mounted on /users
        return response.data;
    },

    updateUserName: async (name: string): Promise<any> => {
        const response = await apiInstance.patch('/users', { name });
        return response.data;
    },

    changeEmail: async (email: string): Promise<any> => {
        const response = await apiInstance.patch('/auth/change-email', { email });
        return response.data;
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<any> => {
        const response = await apiInstance.patch('/auth/change-password', { oldPassword, newPassword });
        return response.data;
    },

    uploadUserImage: async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('image-profile', file);
        const response = await apiInstance.post('/users/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Habits
    getHabits: async (type?: 'weekday' | 'weekend'): Promise<Habit[]> => {
        // Map type to isInWeek (true/false)
        // Default to weekday if not specified, or handle logic as needed
        const params: any = {}
        if (type === 'weekday') params.isInWeek = true
        if (type === 'weekend') params.isInWeek = false
        
        const response = await apiInstance.get('/habits', { params });
        // Backend now returns habits with completions array and parsed days
        // We need to map backend helper fields if necessary, but response should be close to Habit type
        // Backend keys: name, importance, days, time, is_in_week, user_id, need_deep_work, completions
        // Frontend Habit type: id, title (name), subtitle (need generic?), time, importance, type (computed?), reward (mock?), requiresDeepWork, completions
        
        return response.data.map((h: any) => ({
            id: h.id,
            title: h.name,
            subtitle: h.description || '', // Backend doesn't seem to have description/subtitle yet, use empty or generic
            time: h.time,
            importance: h.importance,
            type: h.is_in_week ? 'weekday' : 'weekend',
            reward: 10, // Mock reward as backend doesn't store it yet
            requiresDeepWork: h.need_deep_work,
            deepWorkWithScreen: h.deep_work_with_screen,
            completions: h.completions || [],
            days: h.days,
            status: 'pending' // Default status, as backend doesn't track active/archived state explicitly in the way frontend expects yet
        }));
    },

    createHabit: async (habit: Omit<Habit, 'id'>): Promise<Habit> => {
        // Map frontend model to backend schema
        const payload = {
            name: habit.title,
            importance: habit.importance,
            days: (habit.days || []).map(d => {
                const map: {[key: string]: string} = {
                    'L': 'Lunes', 'M': 'Martes', 'X': 'Miercoles', 'J': 'Jueves', 'V': 'Viernes',
                    'S': 'Sabado', 'D': 'Domingo'
                }
                return map[d] || d
            }),
            time: parseInt(habit.time as unknown as string), // Ensure int
            isInWeek: habit.type === 'weekday',
            needDeepWork: habit.requiresDeepWork,
            deepWorkWithScreen: habit.deepWorkWithScreen || false
        };
        const response = await apiInstance.post('/habits', payload);
        const h = response.data.habit;
        return {
            id: h.id,
            title: h.name,
            subtitle: '',
            time: h.time,
            importance: h.importance,
            type: h.is_in_week ? 'weekday' : 'weekend',
            reward: 10,
            requiresDeepWork: h.need_deep_work,
            completions: h.completions || [],
            days: h.days,
            status: 'pending'
        };
    },

    deleteHabit: async (id: number | string): Promise<void> => {
        await apiInstance.delete(`/habits/${id}`);
    },

    updateHabit: async (id: number | string, habit: Partial<Habit>): Promise<Habit> => {
        // Map frontend model to backend schema
        const payload: any = {};
        
        if (habit.title !== undefined) payload.name = habit.title;
        if (habit.importance !== undefined) payload.importance = habit.importance;
        if (habit.time !== undefined) payload.time = parseInt(habit.time as unknown as string);
        if (habit.requiresDeepWork !== undefined) payload.needDeepWork = habit.requiresDeepWork;
        if (habit.deepWorkWithScreen !== undefined) payload.deepWorkWithScreen = habit.deepWorkWithScreen;
        if (habit.type !== undefined) payload.isInWeek = habit.type === 'weekday';
        if (habit.days !== undefined) {
            payload.days = habit.days.map(d => {
                const map: {[key: string]: string} = {
                    'L': 'Lunes', 'M': 'Martes', 'X': 'Miercoles', 'J': 'Jueves', 'V': 'Viernes',
                    'S': 'Sabado', 'D': 'Domingo'
                };
                return map[d] || d;
            });
        }
        
        const response = await apiInstance.patch(`/habits/${id}`, payload);
        const h = response.data.habit || response.data;
        return {
            id: h.id,
            title: h.name,
            subtitle: '',
            time: h.time,
            importance: h.importance,
            type: h.is_in_week ? 'weekday' : 'weekend',
            reward: 10,
            requiresDeepWork: h.need_deep_work,
            deepWorkWithScreen: h.deep_work_with_screen,
            completions: h.completions || [],
            days: h.days,
            status: 'pending'
        };
    },

    updateHabitStatus: async (id: number | string, status: 'completed' | 'pending', difficulty: number = 3): Promise<any> => {
        if (status === 'completed') {
             const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
             const todayName = days[new Date().getDay()];
             
             return await apiInstance.post(`/habits/complete-habit/${id}`, { 
                 dayCompleted: todayName,
                 difficulty: difficulty
             });
        } else {
             // "Undo" completion. Backend doesn't support generic undo yet or removal from Habits_Completed via ID easily exposed?
             // Actually, we can't easily undo with current backend. 
             // We will throw error or just do nothing and let frontend stay optimistic (but it will revert on reload).
             // Better: Log warning.
             console.warn("Undo completion not fully supported by backend yet.");
             // Try valid update if strictly needed, or just return mock success to satisfy UI for session
             return { message: "Undo simulated" };
        }
    },

    // Rewards


    redeemReward: async (_id: number | string): Promise<{ success: boolean; message: string }> => {
        // Mock
        return { success: true, message: 'Redeemed (Mock)' };
    },

    // Focus & Deep Work
    createDeepWork: async (habitId: string | number, sessionData: any): Promise<any> => {
        // sessionData should match backend schema
        const response = await apiInstance.post(`/deep-work/create/${habitId}`, sessionData);
        return response.data;
    },

    cancelHabit: async (habitId: string | number, cancelData: {
        cancelReason: string,
        focusPercent?: number,
        mentalHealthPercent?: number,
        difficulty: number
    }): Promise<any> => {
        const response = await apiInstance.post(`/habits/cancel-habit/${habitId}`, cancelData);
        return response.data;
    },

    // Focus Router
    getFocusSummary: async (period?: string): Promise<any> => {
        const response = await apiInstance.get('/focus/summary', { params: { period } });
        return response.data;
    },

    getFocusDay: async (date: string): Promise<any> => {
        const response = await apiInstance.get(`/focus/day/${date}`);
        return response.data;
    },
    
    // Metrics & Focus (Frontend abstractions)
    getUserMetrics: async (): Promise<UserMetrics> => {
        try {
            // Mapping backend response to UserMetrics
            // Assuming getFocusSummary returns something relevant or we have a specific user/stats endpoint
            const summary = await apiInstance.get('/focus/summary');
            // Mock transformation if backend structure is different
            return {
                 focusScore: summary.data.score || 85,
                 totalFocusTime: summary.data.totalTime || '0h 0m',
                 interruptionCount: summary.data.interruptions || 0,
                 points: summary.data.points || 0,
                 streak: summary.data.streak || 0,
                 tier: summary.data.tier || 1,
                 tierProgress: summary.data.tierProgress || 0
            };
        } catch (e) {
            console.error(e);
            return {
                focusScore: 0,
                totalFocusTime: '0h 0m',
                interruptionCount: 0,
                points: 0,
                streak: 0,
                tier: 1,
                tierProgress: 0
            };
        }
    },

    getFocusHistory: async (): Promise<FocusSession[]> => {
        try {
            const response = await apiInstance.get('/focus/range', { 
                params: { 
                    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
                    endDate: new Date().toISOString()
                }
            }); 
            return response.data.map((item: any) => ({
                id: item._id || item.id,
                activityName: item.title || 'Focus Session',
                category: 'Work',
                startTime: item.date || item.createdAt,
                durationMinutes: item.duration || 0,
                effectiveness: item.score || 100
            }));
        } catch (e) {
            return [];
        }
    },

    logCancellation: async (reason: string): Promise<void> => {
         console.log(`[API] Logged cancellation: ${reason}`);
    }
};
