import React from 'react'
import { RiFlashlightFill, RiFireFill, RiBrainLine, RiPlayFill, RiCheckLine, RiCheckboxBlankCircleLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Dashboard(): React.JSX.Element {
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
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Good morning, Alex</h1>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>TOTAL POINTS</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>2,450</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-dim)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px' }}>+150 today</span>
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
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>5 Days</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#92400e40', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Keep it up!</span>
                            </div>
                        </div>
                        <RiFireFill size={24} style={{ color: '#f59e0b' }} />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>MENTAL STATE</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>High Energy</h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#3b82f620', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px' }}>Stable</span>
                            </div>
                        </div>
                        <RiBrainLine size={24} style={{ color: '#3b82f6' }} />
                    </div>
                </Card>
            </div>

            {/* Main Focus Section */}
            <div style={{ marginBottom: '2rem' }}>
                {/* Focus Widget */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%', justifyContent: 'space-between', padding: '0 1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> WAITING TO START
                            </span>
                            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Ready to Focus?</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Your next scheduled activity is <strong style={{ color: 'var(--text-primary)' }}>Math Study</strong>.
                            </p>
                            <Button variant="primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                                <RiPlayFill size={20} /> Start Session
                            </Button>
                        </div>
                        {/* Simple CSS Circle representation */}
                        <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', border: '8px solid var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', top: '-8px', right: '-8px', bottom: '-8px', left: '-8px', borderRadius: '50%', border: '8px solid var(--accent-primary)', borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(45deg)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>45:00</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MINUTES</div>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Mandatory Activities */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Mandatory Activities</h3>
                    <button style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>View Calendar</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Card style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <RiCheckboxBlankCircleLine size={24} style={{ color: 'var(--text-muted)' }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>Math Study: Calculus Chapter 4</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        <span style={{ marginRight: '0.5rem' }}>30 min</span>
                                        <span style={{ color: '#f59e0b' }}>High Priority</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>To Do</Button>
                        </div>
                    </Card>

                    <Card style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <RiCheckLine size={24} style={{ color: 'var(--accent-primary)' }} />
                                <div style={{ opacity: 0.6 }}>
                                    <div style={{ fontWeight: 600, textDecoration: 'line-through' }}>Morning Meditation</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        <span style={{ marginRight: '0.5rem' }}>10 min</span>
                                    </div>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, padding: '0.5rem 1rem' }}>Completed</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
