import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { RiNotificationOffLine, RiBatteryChargeLine, RiCloseLine, RiArrowDownLine } from 'react-icons/ri'
import { api } from '../services/api'
import { FocusSession, UserMetrics } from '../types'

export default function FocusTracker(): React.JSX.Element {
    const [history, setHistory] = useState<FocusSession[]>([])
    const [metrics, setMetrics] = useState<UserMetrics | null>(null)
    const [loading, setLoading] = useState(true)
    const [activePeriod, setActivePeriod] = useState('Diario')

    useEffect(() => {
        const loadData = async () => {
            try {
                const [historyData, metricsData] = await Promise.all([
                    api.getFocusHistory(),
                    api.getUserMetrics()
                ])
                setHistory(historyData)
                setMetrics(metricsData)
            } catch (error) {
                console.error("Failed to load focus tracker data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return <div style={{ padding: '2rem' }}>Cargando tracker...</div>
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Tu Foco de Hoy</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {new Intl.DateTimeFormat('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        }).format(new Date())}
                    </p>
                </div>
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-input)', borderRadius: '8px', overflow: 'hidden' }}>
                    {['Diario', 'Semanal', 'Mensual'].map((period, index) => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: activePeriod === period ? 'var(--accent-primary)' : 'transparent',
                                color: activePeriod === period ? '#ffffff' : 'var(--text-secondary)',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>{period}</button>
                    ))}
                </div>
            </header>

            {/* Recommendations Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10b981' }}>
                                <RiBatteryChargeLine size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#10b981' }}>Tip de Ritmo</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                    Mantén tu racha de {metrics?.streak || 0} días. ¡Estás haciendo un excelente trabajo!
                                </p>
                            </div>
                        </div>
                        <RiCloseLine style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                    </div>
                </Card>

                <Card style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: '#3b82f6' }}>
                                <RiNotificationOffLine size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#3b82f6' }}>Distracciones</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                    Interrupciones hoy: {metrics?.interruptionCount || 0}. Considera sesiones más cortas si te cuesta mantener el foco.
                                </p>
                            </div>
                        </div>
                        <RiCloseLine style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                    </div>
                </Card>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Puntuación de Foco</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{metrics?.focusScore || 0}/100</h2>
                        <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600 }}>Level {metrics?.tier || 1}</span>
                    </div>
                </Card>
                <Card>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tiempo Total Enfocado</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{metrics?.totalFocusTime || '0h'}</h2>
                    </div>
                </Card>
                <Card>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Sesiones Completadas</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{history.length}</h2>
                        <span style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <RiArrowDownLine /> Sessions
                        </span>
                    </div>
                </Card>
            </div>

            {/* Session History Table */}
            <Card style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Historial de Sesiones</h3>
                    <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Ver todo</a>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sesión</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoría</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hora</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duración</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eficacia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay sesiones registradas.</td></tr>
                        ) : (
                            history.map(session => (
                                <tr key={session.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{session.activityName}</span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{session.category}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{session.durationMinutes}m</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            backgroundColor: session.effectiveness > 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: session.effectiveness > 80 ? '#10b981' : '#f59e0b',
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                                        }}>
                                            {session.effectiveness}%
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
