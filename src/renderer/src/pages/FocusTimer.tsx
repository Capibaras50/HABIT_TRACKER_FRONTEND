import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { RiPlayFill, RiPauseFill, RiCloseLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { CancellationModal } from '../components/CancellationModal'
import { api } from '../services/api'

export default function FocusTimer(): React.JSX.Element {
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
    const [isActive, setIsActive] = useState(false)
    const [isWorkMode, setIsWorkMode] = useState(true)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [currentActivity, setCurrentActivity] = useState<string>('')
    const location = useLocation()
    const { habitId, habitTitle } = (location.state as { habitId?: string | number, habitTitle?: string }) || {}

    useEffect(() => {
        if (isActive && isWorkMode) {
            window.api.startTracking()
            const handleUpdate = (data: any) => {
                setCurrentActivity(`${data.app} - ${data.title}`)
            }
            window.api.onActivityUpdate(handleUpdate)
            return () => {
                window.api.removeActivityListener()
                window.api.stopTracking().then(stats => {
                    console.log('Session Stats:', stats) // TODO: Save this
                })
            }
        }
        return undefined
    }, [isActive, isWorkMode])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            // Timer Finished Successfully
            if (isWorkMode && habitId) {
                api.updateHabitStatus(habitId, 'completed').then(() => {
                    alert(`¡Excelente! Hábito "${habitTitle}" completado.`)
                    // Optionally navigate back or stay
                }).catch(err => console.error("Could not complete habit", err))
            }
            // TODO: Play notification sound
            if (isWorkMode) {
                // Auto-switch to break? Or wait for user?
                // For now, stop.
            }
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(isWorkMode ? 25 * 60 : 5 * 60)
    }

    const handleCancelClick = () => {
        // If working on a habit, warn user that habit won't be completed
        // But for now, just show cancellation modal
        setShowCancelModal(true)
    }

    const handleCancelConfirm = async (reason: string) => {
        try {
            await api.logCancellation(reason)
        } catch (error) {
            console.error('Failed to log cancellation', error)
        }
        setShowCancelModal(false)
        resetTimer()
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((isWorkMode ? 25 * 60 : 5 * 60) - timeLeft) / (isWorkMode ? 25 * 60 : 5 * 60) * 100

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Card style={{ padding: '3rem', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
                {habitTitle && isWorkMode && (
                    <div style={{
                        marginBottom: '1rem', padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                        borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600
                    }}>
                        Deep Work para: {habitTitle}
                    </div>
                )}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => { setIsWorkMode(true); setTimeLeft(25 * 60); setIsActive(false); }}
                        style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', border: 'none', backgroundColor: isWorkMode ? 'var(--accent-primary)' : 'transparent', color: isWorkMode ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Deep Work
                    </button>
                    <button
                        onClick={() => { setIsWorkMode(false); setTimeLeft(5 * 60); setIsActive(false); }}
                        style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', border: 'none', backgroundColor: !isWorkMode ? 'var(--accent-primary)' : 'transparent', color: !isWorkMode ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Descanso
                    </button>
                </div>

                <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                    {/* Ring implementation would go here (svg) - Simplified for now */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '10px solid var(--bg-input)' }}></div>
                    <div style={{ fontSize: '5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={{ width: '100%', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Focus Progress</span>
                        <span style={{ color: 'var(--accent-primary)' }}>{Math.round(progress)}%</span>
                    </div>
                    {isActive && isWorkMode && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Tracking:</span> {currentActivity || 'Waiting for activity...'}
                        </div>
                    )}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '4px', transition: 'width 1s linear' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Button variant="secondary" style={{ padding: '0.75rem 2rem', borderRadius: '2rem', border: '1px solid var(--border-subtle)' }} onClick={handleCancelClick}>
                        <RiCloseLine size={20} /> Cancelar
                    </Button>
                    <button
                        onClick={toggleTimer}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%', border: 'none',
                            backgroundColor: 'var(--accent-primary)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
                        }}
                    >
                        {isActive ? <RiPauseFill size={40} /> : <RiPlayFill size={40} />}
                    </button>
                    {/* Placeholder for settings or reset if needed */}
                </div>
            </Card>

            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelConfirm}
            />
        </div>
    )
}
