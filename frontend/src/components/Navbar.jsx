import React from 'react'
import { Bell, Search, User } from 'lucide-react'

const Navbar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ position: 'relative', width: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input 
          placeholder="Search transactions..." 
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#94a3b8" />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem 1rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}>
          <div style={{ width: 32, height: 32, background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="white" />
          </div>
          <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'white' }}>Admin</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
