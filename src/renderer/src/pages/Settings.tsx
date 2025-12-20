import React from 'react'
import { RiUser3Line, RiNotification3Line, RiLockPasswordLine, RiPaletteLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../services/api'

export default function Settings(): React.JSX.Element {
    const [loading, setLoading] = React.useState(true)
    const [user, setUser] = React.useState<any>(null)
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        oldPassword: '',
        newPassword: ''
    })
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Track original data to know what changed
    const [initialData, setInitialData] = React.useState({ name: '', email: '' })

    React.useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const profile = await api.getUserProfile()
            console.log('User Profile Loaded:', profile)
            setUser(profile)
            const loadedData = {
                name: profile.name || '',
                email: profile.email || ''
            }
            setInitialData(loadedData)
            setFormData({
                ...loadedData,
                oldPassword: '',
                newPassword: ''
            })
        } catch (e) {
            console.error("Failed to load profile", e)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        try {
            const updates: Promise<any>[] = []
            const messages: string[] = []

            // 1. Check Name Change
            if (formData.name !== initialData.name) {
                updates.push(api.updateUserName(formData.name).then(() => messages.push('Nombre actualizado')))
            }

            // 2. Check Email Change
            if (formData.email !== initialData.email) {
                updates.push(api.changeEmail(formData.email).then(() => messages.push('Email actualizado (posible logout)')))
            }

            // 3. Check Password Change
            if (formData.newPassword) {
                if (!formData.oldPassword) {
                    alert('Debes ingresar tu contraseña actual para cambiarla.')
                    return
                }
                updates.push(api.changePassword(formData.oldPassword, formData.newPassword).then(() => messages.push('Contraseña actualizada')))
            }

            if (updates.length === 0) {
                alert('No hay cambios para guardar.')
                return
            }

            await Promise.all(updates)

            alert(messages.join('\n'))

            // Reload profile/reset form state
            loadProfile()

        } catch (e: any) {
            console.error(e)
            const errorMsg = e.response?.data?.message || 'Error al actualizar perfil'
            alert(errorMsg)
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const response = await api.uploadUserImage(e.target.files[0])
                console.log('Upload Response:', response)
                if (response.linkImage) {
                    // Update user state immediately with new image
                    setUser(prev => ({ ...prev, image_profile: response.linkImage }))
                } else {
                    // Fallback to reload if no link returned
                    loadProfile()
                }
            } catch (error) {
                console.error('Error uploading image', error)
                alert('Error al subir imagen')
            }
        }
    }

    if (loading) return <div style={{ padding: '2rem' }}>Cargando configuración...</div>

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
                            <div
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    backgroundColor: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', color: 'white',
                                    overflow: 'hidden',
                                    backgroundImage: user?.image_profile ? `url(${user.image_profile})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!user?.image_profile && (user?.name?.[0] || 'U')}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{user?.name}</h3>
                                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>{user?.email}</p>
                                <Button
                                    variant="secondary"
                                    style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    onClick={handleAvatarClick}
                                >
                                    Cambiar Avatar
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nombre Visible</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
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
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contraseña Actual (Requerida para cambiar clave)</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    placeholder="Solo si deseas cambiarla"
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
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Nueva contraseña"
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
                        </div>
                    </Card>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button variant="ghost" onClick={() => loadProfile()}>Cancelar</Button>
                        <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
