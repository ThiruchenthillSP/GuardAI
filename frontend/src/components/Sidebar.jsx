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
          background: active ? '#1d4ed8' : 'transparent',
          borderRadius: '8px',
          marginBottom: '0.5rem',
          border: '1px solid transparent',
          color: active ? '#ffffff' : '#9ca3af',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
      >
        <Icon size={20} />
        <span style={{ fontWeight: 500 }}>{label}</span>
      </Link>
    )
  }

  return (
    <div className="glass-panel" style={{ width: '260px', height: 'calc(100vh - 2rem)', margin: '1rem 0 1rem 1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0.5rem' }}>
        <Shield color="#3b82f6" size={28} />
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>GuardAI</h2>
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
