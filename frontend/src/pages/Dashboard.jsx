import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getMetrics, trainModel, getModelComparison } from '../services/api'
import { RefreshCw, ShieldAlert, Zap, Globe, Cpu, Activity, TrendingUp } from 'lucide-react'
import LiveFeed from '../components/LiveFeed'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ total_transactions: 0, fraud_detected: 0, fraud_ratio: 0 })
  const [loading, setLoading] = useState(false)
  const [modelData, setModelData] = useState(null)

  useEffect(() => {
    fetchMetrics()
    const int = setInterval(fetchMetrics, 10000)
    return () => clearInterval(int)
  }, [])

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics()
      setMetrics(data)
      const comp = await getModelComparison()
      setModelData(comp)
    } catch (err) { console.error(err) }
  }

  const handleTrain = async () => {
    setLoading(true)
    try {
      await trainModel()
      fetchMetrics()
      alert("Success: AI Brain Initialized!")
    } catch { alert("Initialization Failed.") }
    finally { setLoading(false) }
  }

  const chartData = [
    { name: '00:00', volume: 400 }, { name: '04:00', volume: 300 },
    { name: '08:00', volume: 600 }, { name: '12:00', volume: 800 },
    { name: '16:00', volume: 500 }, { name: '20:00', volume: 900 },
    { name: 'Now', volume: metrics.total_transactions || 1000 },
  ]

  const models = modelData?.models || []
  const ablation = modelData?.ablation_5step || []
  const latency = modelData?.latency_ms || {}

  const MetricCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>{label}</span>
        <Icon size={20} color={color} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: 'auto' }}>
        <span style={{ fontSize: '2rem', fontWeight: 600, color: 'white', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600, color: 'white' }}>System Overview</h1>
          <p style={{ color: '#9ca3af', margin: '0.5rem 0 0', fontSize: '1rem' }}>Real-time fraud analytics engine</p>
        </div>
        <button 
          onClick={handleTrain} 
          disabled={loading}
          style={{ 
            background: '#2563eb', 
            border: 'none', 
            color: 'white', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '6px', 
            cursor: loading ? 'wait' : 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontWeight: 500,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
          {loading ? 'Initializing...' : 'Initialize AI Brain'}
        </button>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricCard icon={Activity} color="#3b82f6" label="Total Transactions" value={metrics.total_transactions.toLocaleString()} />
        <MetricCard icon={ShieldAlert} color="#ef4444" label="Fraud Detected" value={metrics.fraud_detected} />
        <MetricCard icon={Globe} color="#22c55e" label="Safe Ratio" value={((1 - metrics.fraud_ratio) * 100).toFixed(1)} unit="%" />
        <MetricCard icon={Cpu} color="#f59e0b" label="XGB Latency" value={latency?.xgboost?.mean?.toFixed(1) || '—'} unit="ms" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Activity color="#3b82f6" size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: 500 }}>Volume Trend</h3>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }} />
                <Area type="monotone" dataKey="volume" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'white' }}>Live Network Feed</h3>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <LiveFeed />
          </div>
        </div>
      </div>

      {/* Phase 4a: Model Performance Section */}
      {models.length > 0 && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={20} color="#10b981" />
            <h3 style={{ margin: 0, color: 'white' }}>Model Performance</h3>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              Primary: Avg-PR (imbalanced dataset, 0.34% fraud)
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>Model</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#10b981', fontSize: '0.85rem' }}>Avg-PR</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#3b82f6', fontSize: '0.85rem' }}>AUC-ROC</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#f59e0b', fontSize: '0.85rem' }}>F1@optimal</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#94a3b8', fontSize: '0.85rem' }}>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '0.75rem', color: 'white', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', color: '#10b981', fontFamily: 'monospace' }}>{m.Avg_Precision?.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', color: '#3b82f6', fontFamily: 'monospace' }}>{m.AUC_ROC?.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', color: '#f59e0b', fontFamily: 'monospace' }}>{m.f1_optimal?.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{m.optimal_threshold?.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {ablation.length >= 2 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="#10b981" />
              <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
                Ablation: +{(ablation[ablation.length-1]?.Avg_Precision - ablation[0]?.Avg_Precision)?.toFixed(4)} Avg-PR from graph layer
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
