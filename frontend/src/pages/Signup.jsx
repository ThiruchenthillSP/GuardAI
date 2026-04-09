import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock Signup logic
    if (formData.password === formData.confirmPassword) {
      alert("Registration Successful! You can now login.")
      navigate('/login')
    } else {
      alert("Passwords do not match.")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <div className="card" style={{ width: '450px', padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" required />
          
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" required />
          
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
          
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            Register Now
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
