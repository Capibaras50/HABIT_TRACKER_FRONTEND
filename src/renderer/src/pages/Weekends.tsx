import React, { useState, useEffect } from 'react'
import { RiAddLine, RiTimeLine, RiFlashlightFill, RiCheckboxBlankCircleLine, RiCheckLine, RiMoreFill, RiFocus3Line } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { CreateHabitModal } from '../components/CreateHabitModal'
import { api } from '../services/api'
import { Habit } from '../types'
import { useNavigate } from 'react-router-dom'

export default function Weekends(): React.JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [habits, setHabits] = useState<Habit[]>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('Todos')
    const navigate = useNavigate()

    useEffect(() => {
        loadHabits()
    }, [])

    const loadHabits = async () => {
        try {
            const data = await api.getHabits('weekend')
            setHabits(data)
        } catch (error) {
            console.error('Failed to load weekend habits', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddHabit = async (newHabitData: any) => {
        try {
            const habitToCreate: Omit<Habit, 'id'> = {
                ...newHabitData,
                status: 'pending',
                type: 'weekend',
                completions: []
            }
            const createdHabit = await api.createHabit(habitToCreate)
            setHabits([...habits, createdHabit])
        } catch (error) {
            console.error('Failed to create habit', error)
        }
    }

    const getTodayISO = () => {
        return new Date().toISOString().split('T')[0]
    }

    // Map JS day index (0=Sun, 1=Mon...) to our letter format
    const getTodayLetter = () => {
        const day = new Date().getDay() // 0-6
        // 0=D, 1=L, 2=M, 3=X, 4=J, 5=V, 6=S
        const map = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
        return map[day]
    }

    const isCompletedToday = (habit: Habit) => {
        const today = getTodayISO()
        return habit.completions?.includes(today)
    }

    const toggleHabitCompletion = async (habit: Habit) => {
        const today = getTodayISO()
        const isCompleted = isCompletedToday(habit)

        if (!isCompleted && habit.requiresDeepWork) {
            const confirm = window.confirm(`"${habit.title}" requiere Deep Work. ¿Ir al timer?`)
            if (confirm) {
                navigate('/focus', { state: { habitId: habit.id, habitTitle: habit.title } })
            }
            return
        }

        // Toggle logic
        let newCompletions = [...(habit.completions || [])]
        if (isCompleted) {
            newCompletions = newCompletions.filter(date => date !== today)
        } else {
            newCompletions.push(today)
        }

        const newStatus = !isCompleted ? 'completed' : 'pending'

        // Optimistic Update
        setHabits(habits.map(h =>
            h.id === habit.id ? { ...h, completions: newCompletions, status: newStatus } : h
        ))

        try {
            await api.updateHabitStatus(habit.id, newStatus, newCompletions)
        } catch (error) {
            console.error("Failed to update completions", error)
            setHabits(habits.map(h => h.id === habit.id ? habit : h))
        }
    }

    // Filter Logic
    const filteredHabits = habits.filter(habit => {
        const completed = isCompletedToday(habit)
        if (activeFilter === 'Todos') return true
        if (activeFilter === 'Pendientes') return !completed
        if (activeFilter === 'Completados') return completed
        return true
    })

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Cargando hábitos de fin de semana...</div>
    }

    const weekendDays = ['S', 'D']
    const todayLetter = getTodayLetter()

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Rutina de Fin de Semana</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>Objetivos y relax para Sábado y Domingo.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <RiAddLine size={20} /> Nuevo Hábito
                </Button>
            </header>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#3b82f620', borderRadius: '8px', color: '#3b82f6' }}>
                            <span style={{ fontSize: '1.25rem' }}>↗</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completados Finde</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>85%</h3>
                </Card>

                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#a855f720', borderRadius: '8px', color: '#a855f7' }}>
                            <span style={{ fontSize: '1.25rem' }}>★</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Racha Fines de Semana</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>3 Semanas</h3>
                </Card>

                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f9731620', borderRadius: '8px', color: '#f97316' }}>
                            <RiTimeLine size={20} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tiempo Libre</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>8h</h3>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {['Todos', 'Pendientes', 'Completados'].map((filter, index) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            backgroundColor: activeFilter === filter ? 'var(--text-primary)' : 'var(--bg-input)',
                            color: activeFilter === filter ? 'var(--bg-app)' : 'var(--text-secondary)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Habits Table */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hábito</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frecuencia (Hoy: {todayLetter})</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Importancia</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deep Work</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tiempo</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recompensa</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHabits.map((habit) => {
                            const completed = isCompletedToday(habit)
                            return (
                                <tr key={habit.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <RiMoreFill size={20} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{habit.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{habit.subtitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Interactive Frequency Pills */}
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                            {weekendDays.map(day => {
                                                const isToday = day === todayLetter
                                                return (
                                                    <button
                                                        key={day}
                                                        disabled={!isToday}
                                                        onClick={() => isToday && toggleHabitCompletion(habit)}
                                                        style={{
                                                            width: '24px', height: '24px', borderRadius: '50%',
                                                            border: '1px solid',
                                                            borderColor: (isToday && completed) ? '#10b981' : (isToday ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                                                            backgroundColor: (isToday && completed) ? '#10b981' : 'transparent',
                                                            color: (isToday && completed) ? 'white' : (isToday ? 'var(--text-primary)' : 'var(--text-secondary)'),
                                                            fontSize: '0.65rem', fontWeight: 600,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: isToday ? 'pointer' : 'default',
                                                            opacity: isToday ? 1 : 0.5
                                                        }}
                                                        title={isToday ? "Haz clic para completar hoy" : "Solo puedes completar el día actual"}
                                                    >
                                                        {day}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-subtle)',
                                            backgroundColor: habit.importance === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : habit.importance === 'Media' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: habit.importance === 'Alta' ? '#ef4444' : habit.importance === 'Media' ? '#f59e0b' : '#10b981',
                                            borderColor: habit.importance === 'Alta' ? '#ef4444' : habit.importance === 'Media' ? '#f59e0b' : '#10b981'
                                        }}>
                                            {habit.importance || 'Media'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {habit.requiresDeepWork ? (
                                            <div style={{ color: '#a855f7', display: 'flex', justifyContent: 'center' }} title="Requiere Deep Work">
                                                <RiFocus3Line size={20} />
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <RiTimeLine /> {habit.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                                            <RiFlashlightFill /> +{habit.reward} XP
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => toggleHabitCompletion(habit)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                                        >
                                            {completed ? (
                                                <span style={{ color: 'var(--accent-primary)' }}><RiCheckLine size={24} /></span>
                                            ) : (
                                                <RiCheckboxBlankCircleLine size={24} style={{ color: habit.requiresDeepWork ? 'var(--text-secondary)' : 'var(--text-muted)', cursor: 'pointer' }} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <Button variant="ghost" style={{ fontSize: '0.9rem' }}>+ Añadir fila rápida</Button>
                </div>
            </Card>

            <CreateHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddHabit}
                type="weekend"
            />
        </div>
    )
}
