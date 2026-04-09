import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import TransactionNetwork from './pages/TransactionNetwork'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '2rem', color: 'white' }}>
          <Navbar />
          <div style={{ marginTop: '2rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/network" element={<TransactionNetwork />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
