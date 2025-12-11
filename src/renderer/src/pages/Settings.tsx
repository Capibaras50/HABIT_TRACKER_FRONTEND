import React from 'react'
import { RiUser3Line, RiNotification3Line, RiLockPasswordLine, RiPaletteLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

export default function Settings(): React.JSX.Element {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Configuración</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
                {/* Settings Sidebar */}
                <div>
                    <Card style={{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <Button variant="ghost" style={{ justifyContent: 'flex-start', color: 'var(--text-primary)', backgroundColor: 'var(--bg-input)' }}>
                                <RiUser3Line size={20} /> Perfil
                            </Button>
                            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                                <RiNotification3Line size={20} /> Notificaciones
                            </Button>
                            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                                <RiPaletteLine size={20} /> Apariencia
                            </Button>
                            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>
                                <RiLockPasswordLine size={20} /> Privacidad
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Settings Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card title="Perfil de Usuario">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
                                A
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Alex Morgan</h3>
                                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>alex.morgan@example.com</p>
                                <Button variant="secondary" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cambiar Avatar</Button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nombre Visible</label>
                                <input
                                    type="text"
                                    defaultValue="Alex Morgan"
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nivel</label>
                                <input
                                    type="text"
                                    defaultValue="Level 12 User"
                                    disabled
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-muted)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Preferencias">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Modo Oscuro Automático</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sincronizar con el sistema operativo</div>
                                </div>
                                <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--accent-primary)', borderRadius: '10px', position: 'relative' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Sonidos de Notificación</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reproducir sonido al completar hábitos</div>
                                </div>
                                <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--bg-input)', borderRadius: '10px', position: 'relative' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button variant="ghost">Cancelar</Button>
                        <Button variant="primary">Guardar Cambios</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
