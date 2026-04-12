import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShieldAlert, Settings, LogOut, Shield, Share2, FlaskConical } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to
    return (
      <Link 
        to={to} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '1rem', 
          color: active ? '#38bdf8' : '#94a3b8',
          textDecoration: 'none',
          background: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
          borderRadius: '8px',
          marginBottom: '0.5rem'
        }}
      >
        <Icon size={20} />
        <span style={{ fontWeight: 500 }}>{label}</span>
      </Link>
    )
  }

  return (
    <div style={{ width: '260px', height: '100vh', padding: '1.5rem', borderRight: '1px solid #334155', background: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0.5rem' }}>
        <Shield color="#38bdf8" size={28} />
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>GuardAI</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/network" icon={Share2} label="Network Analysis" />
        <NavItem to="/prediction" icon={ShieldAlert} label="Predict Fraud" />
        <NavItem to="/research" icon={FlaskConical} label="Research Metrics" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem' }}>
          <LogOut size={20} />
          <span style={{ fontWeight: 500, color: '#ef4444' }}>Log Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
