import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import TransactionNetwork from './pages/TransactionNetwork'
import ResearchMetrics from './pages/ResearchMetrics'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
        <TopNav />
        <main style={{ flexGrow: 1, padding: '2.5rem 2rem', color: 'white', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/network" element={<TransactionNetwork />} />
            <Route path="/research" element={<ResearchMetrics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
