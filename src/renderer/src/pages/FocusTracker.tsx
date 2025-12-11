import React from 'react'
import { Card } from '../components/Card'
import { RiNotificationOffLine, RiBatteryChargeLine, RiCloseLine, RiArrowDownLine } from 'react-icons/ri'

export default function FocusTracker(): React.JSX.Element {
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Tu Foco de Hoy</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Martes, 24 de Octubre</p>
                </div>
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-input)', borderRadius: '8px', overflow: 'hidden' }}>
                    {['Diario', 'Semanal', 'Mensual'].map((period, index) => (
                        <button key={period} style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: index === 0 ? 'var(--accent-primary)' : 'transparent',
                            color: index === 0 ? '#ffffff' : 'var(--text-secondary)',
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
                                    Tu concentración suele caer un 20% a las 3 PM. Programa una tarea ligera o un descanso activo para ese momento.
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
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#3b82f6' }}>Patrón de Distracción</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                    Slack es tu mayor interrupción hoy (12 veces). ¿Consideras activar el modo "No molestar" por 1 hora?
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
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>85/100</h2>
                        <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600 }}>+5%</span>
                    </div>
                </Card>
                <Card>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tiempo Total Enfocado</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>4h 12m</h2>
                        <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600 }}>+12m vs ayer</span>
                    </div>
                </Card>
                <Card>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Cambios de Ventana</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>12</h2>
                        <span style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <RiArrowDownLine /> Mejorando
                        </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Menos cambios = Mayor profundidad</p>
                </Card>
            </div>

            {/* Chart & Breakdown Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Intensidad de Foco (24h)</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-input)', border: 'none', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>Hoy</button>
                            <button style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Ayer</button>
                        </div>
                    </div>
                    {/* Placeholder for Chart */}
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px' }}>
                        {/* Drawing a fake SVG path to mimic the wave */}
                        <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,100 C50,20 80,120 120,80 S180,40 220,100 S280,140 320,60 S380,0 420,80 S480,40 500,60" fill="none" stroke="#10b981" strokeWidth="4" />
                            <path d="M0,100 C50,20 80,120 120,80 S180,40 220,100 S280,140 320,60 S380,0 420,80 S480,40 500,60 V150 H0 Z" fill="url(#gradient)" opacity="0.2" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                        <span>09:00</span>
                        <span>12:00</span>
                        <span>15:00</span>
                        <span>18:00</span>
                        <span>21:00</span>
                    </div>
                </Card>

                <Card>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 2rem 0' }}>Desglose de Actividad</h3>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>70% <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>Deep Work</span></h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Trabajo Profundo</span>
                                <span>4h 12m</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px' }}>
                                <div style={{ width: '70%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Reuniones</span>
                                <span>1h 30m</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px' }}>
                                <div style={{ width: '25%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Distracciones / Ocio</span>
                                <span>45m</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px' }}>
                                <div style={{ width: '15%', height: '100%', backgroundColor: '#f97316', borderRadius: '4px' }}></div>
                            </div>
                        </div>
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
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <span style={{ fontWeight: 600 }}>Desarrollo Frontend</span>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Programación</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>09:30 AM</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>50m</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Alta (95%)</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <span style={{ fontWeight: 600 }}>Lectura de Documentación</span>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Estudio</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>11:00 AM</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>30m</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Media (70%)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
