import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { getMetrics, trainModel, getModelComparison } from '../services/api'
import { RefreshCw, ShieldAlert, Zap, Globe, Cpu, Activity } from 'lucide-react'
import LiveFeed from '../components/LiveFeed'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ total_transactions: 0, fraud_detected: 0, fraud_ratio: 0 })
  const [loading, setLoading] = useState(false)
  const [modelMetrics, setModelMetrics] = useState([])

  useEffect(() => {
    fetchMetrics()
    const int = setInterval(fetchMetrics, 10000)
    return () => clearInterval(int)
  }, [])

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics()
      setMetrics(data)
      const compData = await getModelComparison()
      setModelMetrics(compData)
    } catch (err) {
      console.error("Failed to fetch metrics", err)
    }
  }

  const handleTrain = async () => {
    setLoading(true)
    try {
      await trainModel()
      fetchMetrics()
      alert("Success: AI Brain Initialized!")
    } catch (err) {
      alert("Initialization Failed.")
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: '00:00', volume: 400 },
    { name: '04:00', volume: 300 },
    { name: '08:00', volume: 600 },
    { name: '12:00', volume: 800 },
    { name: '16:00', volume: 500 },
    { name: '20:00', volume: 900 },
    { name: 'Now', volume: metrics.total_transactions || 1000 },
  ]

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
        <button 
          onClick={handleTrain} 
          disabled={loading} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
          {loading ? 'Initializing...' : 'Initialize AI Brain'}
        </button>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricCard icon={Activity} color="#3b82f6" label="Total Transactions" value={metrics.total_transactions.toLocaleString()} />
        <MetricCard icon={ShieldAlert} color="#ef4444" label="Fraud Detected" value={metrics.fraud_detected} />
        <MetricCard icon={Globe} color="#22c55e" label="Safe Ratio" value={((1 - metrics.fraud_ratio) * 100).toFixed(1)} unit="%" />
        <MetricCard icon={Cpu} color="#f59e0b" label="System Load" value="1.2" unit="MS" />
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

      {modelMetrics && modelMetrics.length > 0 && (
      <>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Algorithm Performance Comparison</h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 1]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} cursor={{fill: '#334155', opacity: 0.4}} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {modelMetrics.map((m, idx) => (
            <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #334155' }}>
                {m.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Accuracy</span>
                  <span style={{ fontSize: '1.35rem', color: '#3b82f6', fontWeight: 'bold' }}>{(m.Accuracy * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Precision</span>
                  <span style={{ fontSize: '1.35rem', color: '#10b981', fontWeight: 'bold' }}>{(m.Precision * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Recall</span>
                  <span style={{ fontSize: '1.35rem', color: '#f59e0b', fontWeight: 'bold' }}>{(m.Recall * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>F1 Score</span>
                  <span style={{ fontSize: '1.35rem', color: '#8b5cf6', fontWeight: 'bold' }}>{(m.F1 * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
      )}
    </div>
  )
}

export default Dashboard
