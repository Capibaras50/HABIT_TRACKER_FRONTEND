import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { RiAlertFill } from 'react-icons/ri'

interface CancellationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
}

export function CancellationModal({ isOpen, onClose, onConfirm }: CancellationModalProps): React.JSX.Element | null {
    const [reason, setReason] = useState('')
    const reasons = [
        'Distracción Interna (Pensamientos, hambre...)',
        'Distracción Externa (Ruido, interrupción...)',
        'Emergencia / Urgencia',
        'Falso Inicio / Error Técnico',
        'Otro'
    ]

    if (!isOpen) return null

    const handleSubmit = () => {
        if (reason) {
            onConfirm(reason)
            setReason('')
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <Card style={{ width: '400px', padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                    }}>
                        <RiAlertFill size={24} />
                    </div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>¿Por qué cancelas?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Registrar la causa te ayuda a mejorar tu enfoque futuro.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {reasons.map((r) => (
                        <button
                            key={r}
                            onClick={() => setReason(r)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: reason === r ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                                backgroundColor: reason === r ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-input)',
                                color: reason === r ? '#ef4444' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                fontWeight: reason === r ? 600 : 400
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>
                        Volver
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        style={{
                            flex: 1,
                            backgroundColor: !reason ? 'var(--bg-input)' : '#ef4444',
                            opacity: reason ? 1 : 0.5,
                            cursor: reason ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!reason}
                    >
                        Confirmar
                    </Button>
                </div>
            </Card>
        </div>
    )
}
