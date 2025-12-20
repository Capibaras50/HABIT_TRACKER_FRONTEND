import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../services/api'
import { RiLockPasswordLine, RiUser3Line, RiMailLine } from 'react-icons/ri'

export default function Register(): React.JSX.Element {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await api.register({ name, email, password })
            // Auto login or redirect to login? 
            // Usually register returns token or we ask user to login.
            // api.ts register returns { user } or similar now
            await api.login(email, password)
            navigate('/')
        } catch (err: any) {
            console.error('Register failed', err)
            setError(err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Card style={{ width: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Crear Cuenta</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Únete para mejorar tus hábitos</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nombre</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <RiUser3Line style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--bg-input)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Tu Nombre"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <RiMailLine style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--bg-input)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contraseña</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <RiLockPasswordLine style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--bg-input)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button variant="primary" type="submit" style={{ justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        ¿Ya tienes cuenta? <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Inicia Sesión</span>
                    </div>
                </form>
            </Card>
        </div>
    )
}
