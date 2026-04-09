import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock login
    if (username && password) {
      onLogin()
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <div className="card" style={{ width: '400px', padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>FraudShield Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            Login to Dashboard
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
