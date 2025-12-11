import React, { ReactNode, CSSProperties } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    title?: string
    style?: CSSProperties
}

export function Card({ children, className = '', title, style }: CardProps): React.JSX.Element {
    return (
        <div
            className={`card ${className}`}
            style={{
                backgroundColor: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                ...style
            }}
        >
            {title && (
                <h3
                    style={{
                        margin: '0 0 1.25rem 0',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}
                >
                    {title}
                </h3>
            )}
            {children}
        </div>
    )
}
