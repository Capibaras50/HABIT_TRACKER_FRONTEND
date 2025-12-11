import React, { useState, useEffect } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { RiCloseLine, RiFocus3Line } from 'react-icons/ri'

interface CreateHabitModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (habit: any) => void
    type: 'weekday' | 'weekend'
}

export function CreateHabitModal({ isOpen, onClose, onSave, type }: CreateHabitModalProps): React.JSX.Element | null {
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [time, setTime] = useState('') // Now a simple string for duration
    const [importance, setImportance] = useState('Media')
    const [reward, setReward] = useState('10')
    const [requiresDeepWork, setRequiresDeepWork] = useState(false)

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle('')
            setSubtitle('')
            setTime('')
            setImportance('Media')
            setReward('10')
            setRequiresDeepWork(false)
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            title,
            subtitle,
            time,
            importance,
            reward: parseInt(reward),
            requiresDeepWork,
            completions: [],
            days: type === 'weekday' ? ['L', 'M', 'X', 'J', 'V'] : ['S', 'D'] // Default all days for type
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(5px)'
        }}>
            <Card style={{ width: '100%', maxWidth: '500px', padding: '0', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Nuevo Hábito ({type === 'weekday' ? 'Semana' : 'Finde'})</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <RiCloseLine size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Title Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Título</label>
                        <input
                            type="text"
                            placeholder="Ej. Estudiar Matemáticas"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    {/* Subtitle Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subtítulo (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ej. Capitulo 3"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Time (Duration) & Reward Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tiempo / Duración</label>
                            <input
                                type="text"
                                placeholder="Ej. 30 min"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Recompensa (XP)</label>
                            <input
                                type="number"
                                placeholder="10"
                                value={reward}
                                onChange={(e) => setReward(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Importance Selection - Kept same */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Importancia</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['Alta', 'Media', 'Baja'].map((imp) => (
                                <button
                                    key={imp}
                                    type="button"
                                    onClick={() => setImportance(imp)}
                                    style={{
                                        flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid',
                                        borderColor: importance === imp ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                        backgroundColor: importance === imp ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        color: importance === imp ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
                                    }}
                                >
                                    {imp}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '8px',
                            backgroundColor: requiresDeepWork ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-app)',
                            color: requiresDeepWork ? '#10b981' : 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <RiFocus3Line size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Requiere Deep Work</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Te redirigirá al Focus Timer al iniciar</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                            <input
                                type="checkbox"
                                checked={requiresDeepWork}
                                onChange={(e) => setRequiresDeepWork(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: requiresDeepWork ? 'var(--accent-primary)' : '#ccc',
                                transition: '.4s', borderRadius: '34px'
                            }}></span>
                            <span style={{
                                position: 'absolute', content: '""', height: '16px', width: '16px', left: '4px', bottom: '4px',
                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                transform: requiresDeepWork ? 'translateX(16px)' : 'translateX(0)'
                            }}></span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button type="button" variant="ghost" onClick={onClose} style={{ flex: 1 }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" style={{ flex: 1 }}>
                            Crear Hábito
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
