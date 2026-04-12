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
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Icon size={20} color={color} />
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{value}</h2>
        {unit && <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{unit}</span>}
      </div>
    </div>
  )

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Operations Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Overview of system security</p>
        </div>
        <button onClick={handleTrain} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
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
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Volume Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <LiveFeed />
      </div>

      {/* Phase 4a: Model Performance Section */}
      {models.length > 0 && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem' }}>
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
