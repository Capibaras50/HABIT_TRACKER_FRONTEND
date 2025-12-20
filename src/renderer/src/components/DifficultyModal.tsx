import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { RiCloseLine } from 'react-icons/ri'

interface DifficultyModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (difficulty: number) => void
}

export function DifficultyModal({ isOpen, onClose, onConfirm }: DifficultyModalProps): React.JSX.Element | null {
    const [selectedDifficulty, setSelectedDifficulty] = useState(3)

    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm(selectedDifficulty)
        onClose()
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(5px)'
        }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Completar Hábito</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <RiCloseLine size={24} />
                    </button>
                </div>

                <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        ¿Qué tan difícil fue completar este hábito hoy?
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => setSelectedDifficulty(num)}
                                style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    border: '2px solid',
                                    borderColor: selectedDifficulty === num ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                    backgroundColor: selectedDifficulty === num ? 'var(--accent-primary)' : 'transparent',
                                    color: selectedDifficulty === num ? 'white' : 'var(--text-primary)',
                                    fontSize: '1.25rem', fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Muy Fácil</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Muy Difícil</span>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem' }}>
                    <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirm} style={{ flex: 1 }}>
                        Confirmar
                    </Button>
                </div>
            </Card>
        </div>
    )
}
