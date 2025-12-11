import React, { ButtonHTMLAttributes, CSSProperties } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    fullWidth?: boolean
}

export function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    style,
    ...props
}: ButtonProps): React.JSX.Element {
    const baseStyles: CSSProperties = {
        padding: '0.75rem 1.5rem',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '0.95rem',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        border: 'none',
        outline: 'none'
    }

    const variants: Record<string, CSSProperties> = {
        primary: {
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
        },
        secondary: {
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)'
        }
    }

    return (
        <button
            className={className}
            style={{ ...baseStyles, ...variants[variant], ...style }}
            {...props}
            onMouseEnter={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
            }}
        >
            {children}
        </button>
    )
}
