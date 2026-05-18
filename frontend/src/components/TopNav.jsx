import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShieldAlert, Settings, Shield, Share2, FlaskConical } from 'lucide-react'

const TopNav = () => {
  const location = useLocation()

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to
    return (
      <Link 
        to={to} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem', 
          background: active ? '#1d4ed8' : 'transparent',
          borderRadius: '6px',
          border: '1px solid transparent',
          color: active ? '#ffffff' : '#9ca3af',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          fontSize: '0.9rem',
          fontWeight: 500
        }}
        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#ffffff'; } }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; } }}
      >
        <Icon size={16} />
        {label}
      </Link>
    )
  }

  return (
    <div style={{ width: '100%', background: '#111111', borderBottom: '1px solid #27272a', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield color="#3b82f6" size={24} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>GuardAI</h2>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/network" icon={Share2} label="Network" />
          <NavItem to="/prediction" icon={ShieldAlert} label="Scanner" />
          <NavItem to="/research" icon={FlaskConical} label="Metrics" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

      </div>
    </div>
  )
}

export default TopNav
