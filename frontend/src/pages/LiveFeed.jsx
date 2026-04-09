import React, { useEffect, useState } from 'react'
import { Terminal, ShieldAlert, Zap, Globe, Activity } from 'lucide-react'

const LiveFeed = () => {
  const [logs, setLogs] = useState([])

  const events = [
    { type: 'info', msg: 'System security check passed.', icon: Zap },
    { type: 'warn', msg: 'New transaction from unknown IP.', icon: ShieldAlert },
    { type: 'success', msg: 'AI dataset synced successfully.', icon: Activity },
    { type: 'info', msg: 'Active scan pool updated.', icon: Globe }
  ]

  useEffect(() => {
    const int = setInterval(() => {
      const e = events[Math.floor(Math.random() * events.length)]
      setLogs(prev => [{ ...e, id: Date.now(), time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50))
    }, 4500)
    return () => clearInterval(int)
  }, [])

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal size={20} color="#3b82f6" />
          <h3 style={{ margin: 0, color: 'white' }}>System Logs</h3>
        </div>
        <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>LIVE STATUS</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {logs.map((log) => (
          <div key={log.id} style={{ padding: '0.75rem', borderBottom: '1px solid #334155', display: 'flex', gap: '1rem', alignItems: 'start' }}>
            <log.icon size={16} color={log.type === 'warn' ? '#ef4444' : '#3b82f6'} style={{ marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'white' }}>{log.msg}</p>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{log.time}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Initializing activity stream...</p>}
      </div>
    </div>
  )
}

export default LiveFeed
