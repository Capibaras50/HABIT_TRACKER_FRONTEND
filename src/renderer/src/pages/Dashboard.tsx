import React, { useEffect, useState } from 'react'
import { RiFlashlightFill, RiFireFill, RiBrainLine, RiPlayFill, RiCheckboxBlankCircleLine, RiTimeLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../services/api'
import { Habit } from '../types'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(): React.JSX.Element {
    const [loading, setLoading] = useState(true)
    const [habits, setHabits] = useState<Habit[]>([])
    const [streak, setStreak] = useState(0)
    const [focusPercent, setFocusPercent] = useState(0)
    const navigate = useNavigate()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 18) return 'Good Afternoon'
        return 'Good Night'
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]

                // Fetch basic data
                const [habitsData, userProfile] = await Promise.all([
                    api.getHabits(),
                    api.getUserProfile().catch(() => ({ streak: 0 }))
                ])
                setHabits(habitsData)
                if (userProfile) setStreak(userProfile.streak)

                // Fetch Focus Day (might 404 if no data yet)
                try {
                    const focusDayData = await api.getFocusDay(today)
                    if (focusDayData && focusDayData.focusDay) {
                        setFocusPercent(Math.round(focusDayData.focusDay.focus_percentage) || 0)
                    }
                } catch (e) {
                    setFocusPercent(0)
                }

            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        loadDashboardData()
    }, [])

    if (loading) {
        return <div style={{ padding: '2rem' }}>Cargando dashboard...</div>
    }

    const pendingHabits = habits.filter(h => h.status === 'pending')
    const nextHabit = pendingHabits[0]

    const formatDuration = (timeStr: string) => {
        const minutes = parseInt(timeStr)
        if (isNaN(minutes)) return timeStr
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const remainingMins = minutes % 60
        if (remainingMins === 0) return `${hours}h`
        return `${hours}h ${remainingMins}m`
    }

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {new Intl.DateTimeFormat('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    }).format(new Date())}
                </h2>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{getGreeting()}</h1>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>MENTAL SCORE</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>N/A</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-dim)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px' }}>Coming Soon</span>
                            </div>
                        </div>
                        <RiFlashlightFill size={24} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>DAILY STREAK</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{streak} Days</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#92400e40', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Keep it up!</span>
                            </div>
                        </div>
                        <RiFireFill size={24} style={{ color: '#f59e0b' }} />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>FOCUS PERCENTAGE</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{focusPercent}%</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#3b82f620', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px' }}>Today</span>
                            </div>
                        </div>
                        <RiBrainLine size={24} style={{ color: '#3b82f6' }} />
                    </div>
                </Card>
            </div>

            {/* Main Focus Section */}
            <div style={{ marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%', justifyContent: 'space-between', padding: '0 1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> WAITING TO START
                            </span>
                            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Ready to Focus?</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                {nextHabit ? (
                                    <>Your next scheduled activity is <strong style={{ color: 'var(--text-primary)' }}>{nextHabit.title}</strong>.</>
                                ) : (
                                    "No pending activities for today!"
                                )}
                            </p>
                            <Button
                                variant="primary"
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                                onClick={() => {
                                    if (nextHabit) {
                                        navigate('/focus', { state: { habitId: nextHabit.id, habitTitle: nextHabit.title } })
                                    } else {
                                        navigate('/focus')
                                    }
                                }}
                            >
                                <RiPlayFill size={20} /> Start Session
                            </Button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>25:00</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MINUTES</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Mandatory Activities */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Pending Activities</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pendingHabits.length === 0 && (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No pending habits. Great job!</div>
                    )}

                    {pendingHabits.slice(0, 5).map(habit => (
                        <Card key={habit.id} style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <RiCheckboxBlankCircleLine size={24} style={{ color: 'var(--text-muted)' }} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{habit.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <RiTimeLine size={14} />
                                            <span>{formatDuration(habit.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
