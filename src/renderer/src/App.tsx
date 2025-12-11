import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Weekends from './pages/Weekends'
import Settings from './pages/Settings'
import FocusTimer from './pages/FocusTimer'
import FocusTracker from './pages/FocusTracker'
import Rewards from './pages/Rewards'

function App(): React.JSX.Element {
  return (
    <Router>
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
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/weekends" element={<Weekends />} />
            <Route path="/focus" element={<FocusTimer />} />
            <Route path="/tracker" element={<FocusTracker />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
