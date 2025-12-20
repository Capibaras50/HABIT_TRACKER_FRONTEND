import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import {
    RiDashboardLine,
    RiCalendarLine,
    RiFocus3Line,
    RiTrophyLine,
    RiSettings4Line,
    RiLogoutBoxLine
} from 'react-icons/ri'
import { api } from '../services/api'

export function Sidebar(): React.JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            await api.logout();
            navigate('/login');
        } catch (e) {
            console.error(e);
            navigate('/login');
        }
    }

    const menuItems = [
        { label: 'Dashboard', icon: RiDashboardLine, path: '/' },
        { label: 'Hábitos', icon: RiCalendarLine, path: '/habits' },
        { label: 'Fines de Semana', icon: RiTrophyLine, path: '/weekends' },
        { label: 'Focus Tracker', icon: RiFocus3Line, path: '/tracker' }, // New Analysis Page
        { label: 'Deep Work', icon: RiFocus3Line, path: '/focus' },       // The Timer Page

        { label: 'Configuración', icon: RiSettings4Line, path: '/settings' }
    ]

    return (
        <div
            style={{
                width: '260px',
                height: '100vh',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                position: 'fixed',
                left: 0,
                top: 0
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    F
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>FocusFlow</h1>
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                                transition: 'all 0.2s',
                                width: '100%',
                                justifyContent: 'flex-start',
                                textAlign: 'left'
                            }}
                        >
                            <item.icon size={20} />
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--text-muted)',
                        padding: '0.5rem',
                        width: '100%',
                        cursor: 'pointer',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1rem'
                    }}
                >
                    <RiLogoutBoxLine size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
