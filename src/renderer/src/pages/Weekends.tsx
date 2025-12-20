import React, { useState, useEffect } from 'react'
import { RiAddLine, RiTimeLine, RiCheckboxBlankCircleLine, RiCheckLine, RiMoreFill, RiFocus3Line, RiCloseLine, RiSave3Line, RiPencilLine } from 'react-icons/ri'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { CreateHabitModal } from '../components/CreateHabitModal'
import { DifficultyModal } from '../components/DifficultyModal'
import { api } from '../services/api'
import { Habit } from '../types'
import { useNavigate } from 'react-router-dom'

export default function Weekends(): React.JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false)
    const [pendingHabit, setPendingHabit] = useState<Habit | null>(null)
    const [habits, setHabits] = useState<Habit[]>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('Todos')
    // Quick Add State
    const [isAddingRow, setIsAddingRow] = useState(false)
    const [newRowData, setNewRowData] = useState({
        title: '',
        days: ['S', 'D'], // Default weekend days
        importance: 'Media',
        requiresDeepWork: false,
        deepWorkWithScreen: false,
        time: ''
    })
    // Edit State
    const [editingHabitId, setEditingHabitId] = useState<number | string | null>(null)
    const [originalHabit, setOriginalHabit] = useState<Habit | null>(null)
    const [editRowData, setEditRowData] = useState({
        title: '',
        days: ['S', 'D'],
        importance: 'Media',
        requiresDeepWork: false,
        deepWorkWithScreen: false,
        time: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        loadHabits()
    }, [])

    const loadHabits = async () => {
        try {
            const data = await api.getHabits('weekend')
            setHabits(data)
        } catch (error) {
            console.error('Failed to load weekend habits', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddHabit = async (newHabitData: any) => {
        try {
            const habitToCreate: Omit<Habit, 'id'> = {
                ...newHabitData,
                status: 'pending',
                type: 'weekend',
                completions: []
            }
            const createdHabit = await api.createHabit(habitToCreate)
            setHabits([...habits, createdHabit])
        } catch (error) {
            console.error('Failed to create habit', error)
            alert('Error al crear el hábito. Por favor revisa los datos.')
        }
    }

    const handleSaveQuickRow = async () => {
        if (!newRowData.title || !newRowData.time) {
            alert("Por favor completa título y tiempo")
            return
        }
        await handleAddHabit(newRowData)
        setIsAddingRow(false)
        setNewRowData({
            title: '',
            days: ['S', 'D'],
            importance: 'Media',
            requiresDeepWork: false,
            deepWorkWithScreen: false,
            time: ''
        })
    }

    const getTodayISO = () => {
        return new Date().toISOString().split('T')[0]
    }

    // Map JS day index (0=Sun, 1=Mon...) to our letter format
    const getTodayLetter = () => {
        const day = new Date().getDay() // 0-6
        // 0=D, 1=L, 2=M, 3=X, 4=J, 5=V, 6=S
        const map = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
        return map[day]
    }

    const isCompletedToday = (habit: Habit) => {
        const today = getTodayISO()
        return habit.completions?.includes(today)
    }

    const formatDuration = (timeStr: string) => {
        const minutes = parseInt(timeStr)
        if (isNaN(minutes)) return timeStr
        if (minutes < 60) {
            return `${minutes} min`
        } else {
            const hours = Math.floor(minutes / 60)
            const remainingMins = minutes % 60
            if (remainingMins === 0) return `${hours}h`
            return `${hours}h ${remainingMins}m`
        }
    }

    const toggleHabitCompletion = async (habit: Habit) => {
        const todayLetter = getTodayLetter()
        const isCompleted = isCompletedToday(habit)

        // Check if habit is scheduled for today
        // Handle both formats: short codes (S, D) and full names (Sabado, Domingo)
        const todayFullName = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()]
        const isScheduledToday = habit.days?.some(d => d === todayLetter || d === todayFullName)
        if (!isScheduledToday) {
            alert("Este hábito no se puede completar hoy")
            return
        }

        if (!isCompleted && habit.requiresDeepWork) {
            const confirm = window.confirm(`"${habit.title}" requiere Deep Work. ¿Ir al timer?`)
            if (confirm) {
                navigate('/focus', { state: { habitId: habit.id, habitTitle: habit.title, habitTime: parseInt(String(habit.time)), deepWorkWithScreen: habit.deepWorkWithScreen } })
            }
            return
        }

        // Block undo - habit already completed today
        if (isCompleted) {
            alert("Este hábito ya se completó hoy")
            return
        }

        // Open difficulty modal
        setPendingHabit(habit)
        setIsDifficultyModalOpen(true)
    }

    const handleConfirmDifficulty = async (difficulty: number) => {
        if (!pendingHabit) return
        const today = getTodayISO()
        const newCompletions = [...(pendingHabit.completions || []), today]

        // Optimistic Update
        setHabits(habits.map(h =>
            h.id === pendingHabit.id ? { ...h, completions: newCompletions, status: 'completed' } : h
        ))

        try {
            await api.updateHabitStatus(pendingHabit.id, 'completed', difficulty)
        } catch (error: any) {
            console.error("Failed to update completions", error)
            alert(`Error confirmando hábito: ${error.response?.data?.message || 'Error desconocido'}`)
            setHabits(habits.map(h => h.id === pendingHabit.id ? pendingHabit : h))
        }
        setPendingHabit(null)
    }

    const handleDeleteHabit = async (id: number | string) => {
        if (!window.confirm("¿Seguro que quieres eliminar este hábito?")) return;
        try {
            await api.deleteHabit(id)
            setHabits(habits.filter(h => h.id !== id))
        } catch (error) {
            console.error("Failed to delete habit", error)
        }
    }

    // Helper to convert full day names to short codes
    const dayToShortCode = (day: string): string => {
        const map: { [key: string]: string } = {
            'Lunes': 'L', 'Martes': 'M', 'Miercoles': 'X', 'Jueves': 'J', 'Viernes': 'V',
            'Sabado': 'S', 'Domingo': 'D'
        }
        return map[day] || day
    }

    const handleStartEdit = (habit: Habit) => {
        setEditingHabitId(habit.id!)
        setOriginalHabit(habit)
        // Convert days from full names to short codes for edit form
        const shortDays = (habit.days || []).map(d => dayToShortCode(d))
        setEditRowData({
            title: habit.title,
            days: shortDays,
            importance: habit.importance || 'Media',
            requiresDeepWork: habit.requiresDeepWork || false,
            deepWorkWithScreen: habit.deepWorkWithScreen || false,
            time: String(habit.time)
        })
        setIsAddingRow(false)
    }

    const handleCancelEdit = () => {
        setEditingHabitId(null)
        setOriginalHabit(null)
        setEditRowData({
            title: '',
            days: ['S', 'D'],
            importance: 'Media',
            requiresDeepWork: false,
            deepWorkWithScreen: false,
            time: ''
        })
    }

    const handleSaveEdit = async () => {
        if (!editingHabitId || !editRowData.title || !editRowData.time || !originalHabit) {
            alert("Por favor completa título y tiempo")
            return
        }

        // Build payload with only changed fields
        const changes: Partial<Habit> = {}
        if (editRowData.title !== originalHabit.title) changes.title = editRowData.title
        // Compare days by converting original to short codes first
        const originalShortDays = (originalHabit.days || []).map(d => dayToShortCode(d))
        if (JSON.stringify(editRowData.days.sort()) !== JSON.stringify(originalShortDays.sort())) {
            changes.days = editRowData.days
        }
        if (editRowData.importance !== originalHabit.importance) changes.importance = editRowData.importance as 'Alta' | 'Media' | 'Baja'
        if (editRowData.requiresDeepWork !== originalHabit.requiresDeepWork) changes.requiresDeepWork = editRowData.requiresDeepWork
        if (editRowData.deepWorkWithScreen !== originalHabit.deepWorkWithScreen) changes.deepWorkWithScreen = editRowData.deepWorkWithScreen
        if (editRowData.time !== String(originalHabit.time)) changes.time = editRowData.time

        // If nothing changed, just close
        if (Object.keys(changes).length === 0) {
            handleCancelEdit()
            return
        }

        try {
            // Always include type so backend knows isInWeek
            // Always include days as per user request, even if unchanged
            await api.updateHabit(editingHabitId, { ...changes, type: 'weekend', days: editRowData.days })
            // Update local state with edited values directly
            const updatedHabit: Habit = {
                ...originalHabit,
                title: editRowData.title,
                days: editRowData.days,
                importance: editRowData.importance as 'Alta' | 'Media' | 'Baja',
                requiresDeepWork: editRowData.requiresDeepWork,
                deepWorkWithScreen: editRowData.deepWorkWithScreen,
                time: editRowData.time
            }
            setHabits(habits.map(h => h.id === editingHabitId ? updatedHabit : h))
            handleCancelEdit()
        } catch (error) {
            console.error("Failed to update habit", error)
            alert("Error al actualizar el hábito")
        }
    }

    // Filter Logic
    const filteredHabits = habits.filter(habit => {
        const completed = isCompletedToday(habit)
        if (activeFilter === 'Todos') return true
        if (activeFilter === 'Pendientes') return !completed
        if (activeFilter === 'Completados') return completed
        return true
    })

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Cargando hábitos de fin de semana...</div>
    }

    const weekendDays = ['S', 'D']
    const todayLetter = getTodayLetter()

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Rutina de Fin de Semana</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>Objetivos y relax para Sábado y Domingo.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <RiAddLine size={20} /> Nuevo Hábito
                </Button>
            </header>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#3b82f620', borderRadius: '8px', color: '#3b82f6' }}>
                            <span style={{ fontSize: '1.25rem' }}>↗</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completados Finde</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>85%</h3>
                </Card>

                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#a855f720', borderRadius: '8px', color: '#a855f7' }}>
                            <span style={{ fontSize: '1.25rem' }}>★</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Racha Fines de Semana</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>3 Semanas</h3>
                </Card>

                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f9731620', borderRadius: '8px', color: '#f97316' }}>
                            <RiTimeLine size={20} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tiempo Libre</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>8h</h3>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {['Todos', 'Pendientes', 'Completados'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            backgroundColor: activeFilter === filter ? 'var(--text-primary)' : 'var(--bg-input)',
                            color: activeFilter === filter ? 'var(--bg-app)' : 'var(--text-secondary)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Habits Table */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hábito</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frecuencia (Hoy: {todayLetter})</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Importancia</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deep Work</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tiempo</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHabits.map((habit) => {
                            const completed = isCompletedToday(habit)
                            const isEditing = editingHabitId === habit.id

                            // Edit Mode Row
                            if (isEditing) {
                                return (
                                    <tr key={habit.id} className="animate-slide-in quick-add-row" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <input
                                                autoFocus
                                                className="input-minimal"
                                                placeholder="Nombre del hábito..."
                                                value={editRowData.title}
                                                onChange={e => setEditRowData({ ...editRowData, title: e.target.value })}
                                                style={{ fontSize: '1rem', fontWeight: 500 }}
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                                {weekendDays.map(day => {
                                                    const isSelected = editRowData.days.includes(day)
                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => {
                                                                const newDays = isSelected
                                                                    ? editRowData.days.filter(d => d !== day)
                                                                    : [...editRowData.days, day]
                                                                setEditRowData({ ...editRowData, days: newDays })
                                                            }}
                                                            style={{
                                                                width: '24px', height: '24px', borderRadius: '50%',
                                                                border: '1px solid',
                                                                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                                                backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                                                                color: isSelected ? 'white' : 'var(--text-secondary)',
                                                                fontSize: '0.65rem', fontWeight: 600,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {day}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <select
                                                value={editRowData.importance}
                                                onChange={e => setEditRowData({ ...editRowData, importance: e.target.value as 'Alta' | 'Media' | 'Baja' })}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: editRowData.importance === 'Alta' ? '#ef4444' : editRowData.importance === 'Media' ? '#f59e0b' : '#10b981',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="Alta" style={{ color: 'black' }}>Alta</option>
                                                <option value="Media" style={{ color: 'black' }}>Media</option>
                                                <option value="Baja" style={{ color: 'black' }}>Baja</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                                <div
                                                    onClick={() => setEditRowData({ ...editRowData, requiresDeepWork: !editRowData.requiresDeepWork })}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: editRowData.requiresDeepWork ? '#a855f7' : 'var(--text-muted)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                    title="Toggle Deep Work"
                                                >
                                                    <RiFocus3Line size={20} />
                                                </div>
                                                {editRowData.requiresDeepWork && (
                                                    <label style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={editRowData.deepWorkWithScreen}
                                                            onChange={e => setEditRowData({ ...editRowData, deepWorkWithScreen: e.target.checked })}
                                                        /> Pantalla?
                                                    </label>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <RiTimeLine />
                                                <input
                                                    type="number"
                                                    className="input-minimal"
                                                    placeholder="30"
                                                    value={editRowData.time}
                                                    onChange={e => setEditRowData({ ...editRowData, time: e.target.value })}
                                                    style={{ width: '60px', textAlign: 'center' }}
                                                />
                                                <span style={{ fontSize: '0.8rem' }}>min</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    title="Cancelar"
                                                >
                                                    <RiCloseLine size={22} />
                                                </button>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    style={{
                                                        background: 'var(--accent-primary)', border: 'none', cursor: 'pointer', color: 'white',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    title="Guardar"
                                                >
                                                    <RiSave3Line size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            // Normal Display Row
                            return (
                                <tr key={habit.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => handleDeleteHabit(habit.id!)}>
                                                <RiMoreFill size={20} title="Eliminar" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{habit.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{habit.subtitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Interactive Frequency Pills */}
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                            {weekendDays.map(day => {
                                                const isToday = day === todayLetter
                                                return (
                                                    <button
                                                        key={day}
                                                        disabled={!isToday}
                                                        onClick={() => isToday && toggleHabitCompletion(habit)}
                                                        style={{
                                                            width: '24px', height: '24px', borderRadius: '50%',
                                                            border: '1px solid',
                                                            borderColor: (isToday && completed) ? '#10b981' : (isToday ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                                                            backgroundColor: (isToday && completed) ? '#10b981' : 'transparent',
                                                            color: (isToday && completed) ? 'white' : (isToday ? 'var(--text-primary)' : 'var(--text-secondary)'),
                                                            fontSize: '0.65rem', fontWeight: 600,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: isToday ? 'pointer' : 'default',
                                                            opacity: isToday ? 1 : 0.5
                                                        }}
                                                        title={isToday ? "Haz clic para completar hoy" : "Solo puedes completar el día actual"}
                                                    >
                                                        {day}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-subtle)',
                                            backgroundColor: habit.importance === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : habit.importance === 'Media' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: habit.importance === 'Alta' ? '#ef4444' : habit.importance === 'Media' ? '#f59e0b' : '#10b981',
                                            borderColor: habit.importance === 'Alta' ? '#ef4444' : habit.importance === 'Media' ? '#f59e0b' : '#10b981'
                                        }}>
                                            {habit.importance || 'Media'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {habit.requiresDeepWork ? (
                                            <div style={{ color: '#a855f7', display: 'flex', justifyContent: 'center' }} title="Requiere Deep Work">
                                                <RiFocus3Line size={20} />
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <RiTimeLine /> {formatDuration(habit.time)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleStartEdit(habit)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                                                title="Editar"
                                            >
                                                <RiPencilLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => toggleHabitCompletion(habit)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                                            >
                                                {completed ? (
                                                    <span style={{ color: 'var(--accent-primary)' }}><RiCheckLine size={24} /></span>
                                                ) : (
                                                    <RiCheckboxBlankCircleLine size={24} style={{ color: habit.requiresDeepWork ? 'var(--text-secondary)' : 'var(--text-muted)', cursor: 'pointer' }} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {/* Quick Add Row */}
                        {isAddingRow && (
                            <tr className="animate-slide-in quick-add-row" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            autoFocus
                                            className="input-minimal"
                                            placeholder="Nombre del hábito..."
                                            value={newRowData.title}
                                            onChange={e => setNewRowData({ ...newRowData, title: e.target.value })}
                                            style={{ fontSize: '1rem', fontWeight: 500 }}
                                        />
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                        {weekendDays.map(day => {
                                            const isSelected = newRowData.days.includes(day)
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => {
                                                        const newDays = isSelected
                                                            ? newRowData.days.filter(d => d !== day)
                                                            : [...newRowData.days, day]
                                                        setNewRowData({ ...newRowData, days: newDays })
                                                    }}
                                                    style={{
                                                        width: '24px', height: '24px', borderRadius: '50%',
                                                        border: '1px solid',
                                                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                                        backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                                                        color: isSelected ? 'white' : 'var(--text-secondary)',
                                                        fontSize: '0.65rem', fontWeight: 600,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <select
                                        value={newRowData.importance}
                                        onChange={e => setNewRowData({ ...newRowData, importance: e.target.value })}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: newRowData.importance === 'Alta' ? '#ef4444' : newRowData.importance === 'Media' ? '#f59e0b' : '#10b981',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <option value="Alta" style={{ color: 'black' }}>Alta</option>
                                        <option value="Media" style={{ color: 'black' }}>Media</option>
                                        <option value="Baja" style={{ color: 'black' }}>Baja</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                        <div
                                            onClick={() => setNewRowData({ ...newRowData, requiresDeepWork: !newRowData.requiresDeepWork })}
                                            style={{
                                                cursor: 'pointer',
                                                color: newRowData.requiresDeepWork ? '#a855f7' : 'var(--text-muted)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Toggle Deep Work"
                                        >
                                            <RiFocus3Line size={20} />
                                        </div>
                                        {newRowData.requiresDeepWork && (
                                            <label style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={newRowData.deepWorkWithScreen}
                                                    onChange={e => setNewRowData({ ...newRowData, deepWorkWithScreen: e.target.checked })}
                                                /> Pantalla?
                                            </label>
                                        )}
                                    </div>
                                </td>

                                <td style={{ padding: '1rem' }}>


                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <RiTimeLine />
                                        <input
                                            type="number"
                                            className="input-minimal"
                                            placeholder="30"
                                            value={newRowData.time}
                                            onChange={e => setNewRowData({ ...newRowData, time: e.target.value })}
                                            style={{ width: '60px', textAlign: 'center' }}
                                        />
                                        <span style={{ fontSize: '0.8rem' }}>min</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => setIsAddingRow(false)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="Cancelar"
                                        >
                                            <RiCloseLine size={22} />
                                        </button>
                                        <button
                                            onClick={handleSaveQuickRow}
                                            style={{
                                                background: 'var(--accent-primary)', border: 'none', cursor: 'pointer', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            title="Guardar Hábito"
                                        >
                                            <RiSave3Line size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    {!isAddingRow ? (
                        <Button variant="ghost" style={{ fontSize: '0.9rem' }} onClick={() => setIsAddingRow(true)}>+ Añadir fila rápida</Button>
                    ) : null}
                </div>
            </Card>

            <CreateHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddHabit}
                type="weekend"
            />

            <DifficultyModal
                isOpen={isDifficultyModalOpen}
                onClose={() => setIsDifficultyModalOpen(false)}
                onConfirm={handleConfirmDifficulty}
            />
        </div>
    )
}
