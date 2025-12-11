import React, { useEffect, useState } from 'react'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'

export function ThemeToggle(): React.JSX.Element {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = (): void => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <button
            onClick={toggleTheme}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'flex-start'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px'
                }}
            >
                {theme === 'dark' ? <RiMoonLine size={20} /> : <RiSunLine size={20} />}
            </div>
            <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
        </button>
    )
}
