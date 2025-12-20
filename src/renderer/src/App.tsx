import React, { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Weekends from './pages/Weekends'
import Settings from './pages/Settings'
import FocusTimer from './pages/FocusTimer'
import FocusTracker from './pages/FocusTracker'

import Login from './pages/Login'
import Register from './pages/Register'
import { api } from './services/api'

function RequireAuth(): React.JSX.Element {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.getUserProfile()
        setAuthenticated(true)
      } catch (error) {
        setAuthenticated(false)
        navigate('/login', { replace: true, state: { from: location } })
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate, location])

  if (loading) return <div></div> // Loading state, maybe a spinner?

  if (!authenticated) return <></>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
          height: '100vh',
          boxSizing: 'border-box'
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/weekends" element={<Weekends />} />
          <Route path="/focus" element={<FocusTimer />} />
          <Route path="/tracker" element={<FocusTracker />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
