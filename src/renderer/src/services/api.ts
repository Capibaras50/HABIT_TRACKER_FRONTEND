import { Habit, Reward, FocusSession, UserMetrics } from '../types';

// --- MOCK DATA ---

let habits: Habit[] = [
    {
        id: 1,
        title: 'Revisión Diaria',
        subtitle: 'Planificar objetivos del día',
        status: 'pending',
        time: '09:00 AM',
        reward: 10,
        type: 'weekday'
    },
    {
        id: 2,
        title: 'Deep Work (Bloque 1)',
        subtitle: 'Sin distracciones',
        status: 'completed',
        time: '10:00 AM - 11:30 AM',
        reward: 50,
        type: 'weekday'
    },
    {
        id: 3,
        title: 'Ejercicio',
        subtitle: 'Caminata o Gimnasio',
        status: 'pending',
        time: '06:00 PM',
        reward: 30,
        type: 'weekday'
    },
    {
        id: 4,
        title: 'Lectura',
        subtitle: '30 min de libro técnico',
        status: 'pending',
        time: 'Before Bed',
        reward: 20,
        type: 'weekday'
    },
    // Weekend Habits
    {
        id: 5,
        title: 'Repaso de Matemáticas',
        subtitle: 'Cálculo Integral - Cap 4',
        status: 'pending',
        importance: 'Alta',
        time: '1h 30m',
        reward: 50,
        type: 'weekend',
        days: ['S', 'D']
    },
    {
        id: 6,
        title: 'Lectura Técnica',
        subtitle: 'Documentación de proyecto',
        status: 'completed',
        importance: 'Media',
        time: '45m',
        reward: 30,
        type: 'weekend',
        days: ['S']
    },
    {
        id: 7,
        title: 'Organización Semanal',
        subtitle: 'Planificar agenda',
        status: 'completed',
        importance: 'Baja',
        time: '15m',
        reward: 10,
        type: 'weekend',
        days: ['D']
    },
    {
        id: 8,
        title: 'Ejercicio Físico',
        subtitle: 'Correr 5km',
        status: 'pending',
        importance: 'Alta',
        time: '1h',
        reward: 100,
        type: 'weekend',
        days: ['S', 'D']
    }
];

const rewards: Reward[] = [
    {
        id: 1,
        title: 'Descanso Corto',
        description: 'Recarga energía con una siesta o caminata.',
        cost: 500,
        imageColor: '#0ea5e9',
        iconName: 'RiCupLine',
        duration: '30 min',
        locked: false
    },
    {
        id: 2,
        title: 'Episodio de Serie',
        description: 'Disfruta un capítulo sin distracciones.',
        cost: 900,
        imageColor: '#ef4444',
        iconName: 'RiMovieLine',
        duration: '1h',
        locked: false
    },
    {
        id: 3,
        title: 'Sesión de Gaming',
        description: 'Tiempo libre para jugar en PC o Consola.',
        cost: 1200,
        imageColor: '#6366f1',
        iconName: 'RiGamepadLine',
        duration: '1.5h',
        locked: true
    },
    {
        id: 4,
        title: 'Día Libre (Parcial)',
        description: 'Tómate la tarde libre. Te lo mereces.',
        cost: 3000,
        imageColor: '#14b8a6',
        iconName: 'RiWallet3Line',
        duration: 'Medio Día',
        locked: true
    }
];

const userMetrics: UserMetrics = {
    focusScore: 85,
    totalFocusTime: '4h 12m',
    interruptionCount: 12,
    points: 1250,
    streak: 5,
    tier: 3,
    tierProgress: 66
};

const focusHistory: FocusSession[] = [
    {
        id: 1,
        activityName: 'Desarrollo Frontend',
        category: 'Programación',
        startTime: new Date().toISOString(), // Mock, fix earlier today
        durationMinutes: 50,
        effectiveness: 95
    },
    {
        id: 2,
        activityName: 'Lectura de Documentación',
        category: 'Estudio',
        startTime: new Date().toISOString(),
        durationMinutes: 30,
        effectiveness: 70
    }
];

// --- SERVICE FUNCTIONS ---

// NOTE: All functions return Promises to simulate network latency

export const api = {
    // Habits
    getHabits: async (type: 'weekday' | 'weekend'): Promise<Habit[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(habits.filter((h) => h.type === type))
            }, 500)
        })
    },

    createHabit: async (habit: Omit<Habit, 'id'>): Promise<Habit> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newHabit = { ...habit, id: Date.now() }
                habits.push(newHabit)
                resolve(newHabit)
            }, 500)
        })
    },

    updateHabitStatus: async (id: number | string, status: 'completed' | 'pending', completions?: string[]): Promise<Habit> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const habitIndex = habits.findIndex((h) => h.id === id)
                if (habitIndex > -1) {
                    habits[habitIndex].status = status
                    if (completions) {
                        habits[habitIndex].completions = completions
                    }
                    resolve(habits[habitIndex])
                } else {
                    reject(new Error('Habit not found'))
                }
            }, 200)
        })
    },

    // Rewards
    getRewards: async (): Promise<Reward[]> => {
        return new Promise((resolve) => resolve(rewards));
    },

    redeemReward: async (id: number | string): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const reward = rewards.find(r => r.id === id);
                if (!reward) {
                    resolve({ success: false, message: 'Reward not found' });
                    return;
                }
                if (userMetrics.points >= reward.cost) {
                    userMetrics.points -= reward.cost;
                    resolve({ success: true, message: 'Redeemed successfully' });
                } else {
                    resolve({ success: false, message: 'Insufficient points' });
                }
            }, 400);
        });
    },

    // Metrics & Focus
    getUserMetrics: async (): Promise<UserMetrics> => {
        return new Promise((resolve) => resolve(userMetrics));
    },

    getFocusHistory: async (): Promise<FocusSession[]> => {
        return new Promise((resolve) => resolve(focusHistory));
    },

    logCancellation: async (reason: string): Promise<void> => {
         console.log(`[API] Logged cancellation: ${reason}`);
         return Promise.resolve();
    }
};
