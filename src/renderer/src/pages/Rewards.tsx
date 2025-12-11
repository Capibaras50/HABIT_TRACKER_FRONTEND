import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { RiWallet3Line, RiLock2Line, RiShoppingCartLine, RiCupLine, RiMusicLine, RiGamepadLine, RiMovieLine } from 'react-icons/ri'
import { api } from '../services/api'
import { Reward, UserMetrics } from '../types'

export default function Rewards(): React.JSX.Element {
    const [rewards, setRewards] = useState<Reward[]>([])
    const [metrics, setMetrics] = useState<UserMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [rewardsData, metricsData] = await Promise.all([
                api.getRewards(),
                api.getUserMetrics()
            ])
            setRewards(rewardsData)
            setMetrics(metricsData)
        } catch (error) {
            console.error('Failed to load rewards data', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRedeem = async (id: number | string) => {
        try {
            const result = await api.redeemReward(id)
            if (result.success) {
                // Refresh balance
                const updatedMetrics = await api.getUserMetrics()
                setMetrics(updatedMetrics)
                alert('¡Recompensa canjeada!')
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Failed to redeem reward', error)
        }
    }

    const getIcon = (iconName: string) => {
        const icons = {
            RiCupLine,
            RiMovieLine,
            RiGamepadLine,
            RiWallet3Line
        }
        return icons[iconName] || RiWallet3Line
    }

    if (loading) return <div style={{ padding: '2rem' }}>Cargando tienda...</div>

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>★</span> MARKETPLACE
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Tienda de Recompensas</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Canjea el fruto de tu esfuerzo por tiempo libre sin culpa.</p>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                        <RiWallet3Line size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Tu Cartera</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics?.points || 0} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>pts</span></div>
                    </div>
                </div>
            </header>

            {/* Battle Pass / Tier Progress */}
            <Card style={{ padding: '2rem', marginBottom: '3rem', backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                            <RiLock2Line size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Desbloqueo de Tier {metrics?.tier || 1}</h3>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.25rem' }}>{metrics?.tierProgress || 0}%</span>
                </div>

                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', marginBottom: '1rem' }}>
                    <div style={{ width: `${metrics?.tierProgress || 0}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                        Completa 1 tarea obligatoria más para desbloquear recompensas premium.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Racha</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{metrics?.streak || 0} Días 🔥</div>
                        </div>
                        <Button variant="secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Ver Tareas</Button>
                    </div>
                </div>
            </Card>

            {/* Rewards Grid */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Recompensas Disponibles</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Todo</button>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Ocio</button>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Snacks</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    {rewards.map(item => {
                        const IconComponent = getIcon(item.iconName)
                        return (
                            <Card key={item.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {/* Image Placeholder */}
                                <div style={{ height: '140px', backgroundColor: item.imageColor, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Gradient overlay */}
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                                    <IconComponent size={48} style={{ color: 'white', opacity: 0.8 }} />
                                    <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {item.duration}
                                    </span>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', lineHeight: 1.4, flex: 1 }}>
                                        {item.description}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Costo</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.cost} pts</div>
                                        </div>
                                        <button
                                            disabled={item.locked || (metrics?.points || 0) < item.cost}
                                            onClick={() => handleRedeem(item.id)}
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                                backgroundColor: (item.locked || (metrics?.points || 0) < item.cost) ? 'var(--bg-input)' : '#10b981',
                                                color: (item.locked || (metrics?.points || 0) < item.cost) ? 'var(--text-secondary)' : 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: (item.locked || (metrics?.points || 0) < item.cost) ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s hover'
                                            }}
                                        >
                                            {item.locked ? <RiLock2Line size={20} /> : <RiShoppingCartLine size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Recent History */}
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Canjes Recientes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Card style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RiCupLine size={20} />
                            </div>
                            <span style={{ fontWeight: 600 }}>Coffee Break (15m)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hace 2 horas</span>
                            <span style={{ color: '#ef4444', fontWeight: 700 }}>-250 pts</span>
                        </div>
                    </Card>
                    <Card style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RiMusicLine size={20} />
                            </div>
                            <span style={{ fontWeight: 600 }}>Música (1h)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ayer</span>
                            <span style={{ color: '#ef4444', fontWeight: 700 }}>-100 pts</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
