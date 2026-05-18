import React, { useState } from 'react'
import { ShieldAlert, ShieldCheck, Loader2, Search, Network, FlaskConical, Zap } from 'lucide-react'
import { predictFraud } from '../services/api'

// ── Test Presets ─────────────────────────────────────────────
const NORMAL_PRESET = {
  transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}`,
  sender_account: 'ACC-78234',
  receiver_account: 'ACC-55123',
  amount: 45.0,
  transaction_type: 'purchase',
  merchant_category: 'grocery',
  location: 'New York',
  device_used: 'mobile',
  ip_address: '192.168.1.10',
  device_hash: 'HASH-A1B2C3',
  payment_channel: 'app',
  spending_deviation_score: 0.1,
  velocity_score: 2.0,
  geo_anomaly_score: 0.01,
  time_since_last_transaction: 3600.0,
}

const FRAUD_PRESET = {
  transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}`,
  sender_account: 'ACC-99101',
  receiver_account: 'ACC-00777',
  amount: 14999.99,
  transaction_type: 'wire_transfer',
  merchant_category: 'electronics',
  location: 'Unknown',
  device_used: 'desktop',
  ip_address: '45.33.32.156',
  device_hash: 'HASH-XXXXXX',
  payment_channel: 'web',
  spending_deviation_score: 2.5,
  velocity_score: 18.0,
  geo_anomaly_score: 0.95,
  time_since_last_transaction: 15.0,
}

// ── Styles ───────────────────────────────────────────────────
// ── Styles ───────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '0.75rem', background: '#0a0a0a',
  border: '1px solid #27272a', borderRadius: '6px', color: 'white',
  fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none',
  transition: 'border-color 0.2s'
}
const labelStyle = { color: '#9ca3af', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }
const sectionTitle = { color: '#ffffff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }

function Prediction() {
  const [formData, setFormData] = useState({ ...NORMAL_PRESET })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) || 0 : value })
  }

  const applyPreset = (preset) => {
    setFormData({ ...preset, transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}` })
    setResult(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await predictFraud(formData)
      setResult(data)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert("Prediction Failed: " + err.response.data.detail);
      } else {
        alert("Verification Failed. Please ensure you have Initialized the AI Brain on the Dashboard.");
      }
    } finally {
      setLoading(false)
    }
  }

  const probPercent = result ? (result.probability * 100) : 0

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '2rem', fontWeight: 600 }}>Real-Time Fraud Scanner</h1>
        <p style={{ color: '#9ca3af', margin: '0.5rem 0 0', fontSize: '1rem' }}>Enter transaction details or use presets</p>
      </header>

      {/* ── Test Preset Buttons ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button type="button" onClick={() => setFormData(NORMAL_PRESET)} style={{ flex: 1, background: '#111111', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#10b98115'} onMouseLeave={(e)=>e.currentTarget.style.background='#111111'}>
          Test: Safe Transaction
        </button>
        <button type="button" onClick={() => setFormData(FRAUD_PRESET)} style={{ flex: 1, background: '#111111', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#ef444415'} onMouseLeave={(e)=>e.currentTarget.style.background='#111111'}>
          Test: Suspicious Transaction
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Side: Input Form */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1rem' }}>Transaction Details</h3>
          <form onSubmit={handleSubmit}>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Transaction ID</label>
                <input name="transaction_id" value={formData.transaction_id} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Amount ($)</label>
                <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sender Account</label>
                <input name="sender_account" value={formData.sender_account} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Receiver Account</label>
                <input name="receiver_account" value={formData.receiver_account} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Transaction Metadata */}
            <div style={sectionTitle}>
              <Network size={14} color="#8b5cf6" /> Transaction Metadata
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Transaction Type</label>
                <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} style={inputStyle}>
                  <option value="purchase">Purchase</option>
                  <option value="transfer">Transfer</option>
                  <option value="wire_transfer">Wire Transfer</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="deposit">Deposit</option>
                  <option value="payment">Payment</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Merchant Category</label>
                <select name="merchant_category" value={formData.merchant_category} onChange={handleChange} style={inputStyle}>
                  <option value="grocery">Grocery</option>
                  <option value="electronics">Electronics</option>
                  <option value="travel">Travel</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="general">General</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Device Used</label>
                <select name="device_used" value={formData.device_used} onChange={handleChange} style={inputStyle}>
                  <option value="mobile">Mobile Device</option>
                  <option value="desktop">Desktop Terminal</option>
                  <option value="tablet">Tablet Slate</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payment Channel</label>
                <select name="payment_channel" value={formData.payment_channel} onChange={handleChange} style={inputStyle}>
                  <option value="app">Mobile App</option>
                  <option value="web">Web Browser</option>
                  <option value="pos">POS Terminal</option>
                  <option value="atm">ATM</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>IP Address</label>
                <input name="ip_address" value={formData.ip_address} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Risk Signals */}
            <div style={sectionTitle}>
              <Zap size={14} color="#f59e0b" /> Risk Signals (0.0 = safe, 1.0 = max risk)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Velocity Score (1-20)</label>
                <input name="velocity_score" type="number" step="0.1" min="1" max="20" value={formData.velocity_score} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Spending Deviation (-3 to 3)</label>
                <input name="spending_deviation_score" type="number" step="0.1" min="-3" max="3" value={formData.spending_deviation_score} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Geo Anomaly Score (0-1)</label>
                <input name="geo_anomaly_score" type="number" step="0.01" min="0" max="1" value={formData.geo_anomaly_score} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Time Since Last TX (sec)</label>
                <input name="time_since_last_transaction" type="number" step="1" value={formData.time_since_last_transaction} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              style={{ 
                marginTop: '2rem', 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                padding: '0.85rem', 
                borderRadius: '6px', 
                fontSize: '1rem', 
                fontWeight: 500, 
                cursor: loading ? 'wait' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? 'Scanning Neural Network...' : 'Run Prediction Scan'}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Results ── */}
        <div>
          {result ? (
            <div>
              {/* Main verdict card */}
              <div style={{
                background: '#1e293b', padding: '2rem', borderRadius: '12px',
                border: `2px solid ${result.is_fraud ? '#ef4444' : '#22c55e'}`,
                textAlign: 'center', marginBottom: '1.25rem',
                boxShadow: result.is_fraud ? '0 0 30px rgba(239,68,68,0.15)' : '0 0 30px rgba(34,197,94,0.15)',
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  {result.is_fraud ? <ShieldAlert color="#ef4444" size={70} /> : <ShieldCheck color="#22c55e" size={70} />}
                </div>
                <h2 style={{ color: result.is_fraud ? '#ef4444' : '#22c55e', margin: '0 0 0.75rem 0', fontSize: '1.3rem' }}>
                  {result.is_fraud ? 'FRAUD SUSPECTED' : 'TRANSACTION SECURE'}
                </h2>
                <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                  {probPercent.toFixed(1)}%
                </div>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Neural Risk Confidence Level</p>

                {/* Risk level badge */}
                <div style={{
                  marginTop: '1rem', display: 'inline-block',
                  padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                  background: result.risk_level === 'HIGH' ? 'rgba(239,68,68,0.15)' :
                    result.risk_level === 'MEDIUM' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                  color: result.risk_level === 'HIGH' ? '#ef4444' :
                    result.risk_level === 'MEDIUM' ? '#f59e0b' : '#22c55e',
                  border: `1px solid ${result.risk_level === 'HIGH' ? '#ef4444' :
                    result.risk_level === 'MEDIUM' ? '#f59e0b' : '#22c55e'}40`,
                }}>
                  Risk Level: {result.risk_level}
                </div>
              </div>

              {/* SHAP Explanation */}
              {result.explanation && Object.keys(result.explanation).length > 0 && (
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
                  <h4 style={{ color: 'white', margin: '0 0 0.75rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FlaskConical size={15} color="#a78bfa" /> SHAP Feature Contributions
                  </h4>
                  {Object.entries(result.explanation).map(([feat, val], i) => {
                    const maxAbs = Math.max(...Object.values(result.explanation).map(v => Math.abs(v)), 0.001)
                    const barWidth = Math.min(Math.abs(val) / maxAbs * 100, 100)
                    return (
                      <div key={i} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{feat}</span>
                          <span style={{ color: val > 0 ? '#ef4444' : '#22c55e', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                            {val > 0 ? '+' : ''}{val.toFixed(4)}
                          </span>
                        </div>
                        <div style={{ height: '4px', background: '#0f172a', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${barWidth}%`, borderRadius: '2px',
                            background: val > 0 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #22c55e, #4ade80)',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Network Context */}
              <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <h4 style={{ color: 'white', margin: '0 0 0.75rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Network size={15} color="#8b5cf6" /> Network Context
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem' }}>Degree Centrality</p>
                    <p style={{ color: 'white', margin: '0.2rem 0 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {result.explanation?.degree_centrality !== undefined ? result.explanation.degree_centrality.toFixed(4) : '—'}
                    </p>
                  </div>
                  <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem' }}>Cluster Size</p>
                    <p style={{ color: 'white', margin: '0.2rem 0 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {result.explanation?.cluster_size !== undefined ? Math.round(result.explanation.cluster_size) : '—'}
                    </p>
                  </div>
                </div>
                {(() => {
                  const riskLevel = result.probability > 0.7 ? 'High' : result.probability > 0.3 ? 'Medium' : 'Low'
                  const riskColor = riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f59e0b' : '#22c55e'
                  return (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: riskColor }} />
                        <span style={{ color: riskColor, fontWeight: 600, fontSize: '0.85rem' }}>
                          Fraud Ring Risk: {riskLevel}
                        </span>
                      </div>
                      {result.probability > 0.7 && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.6rem', marginTop: '0.4rem' }}>
                          <p style={{ color: '#ef4444', margin: 0, fontSize: '0.8rem' }}>
                            ⚠ This transaction shares network connections with known fraud patterns
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div style={{ background: '#1e293b', padding: '3rem', borderRadius: '12px', border: '1px dashed #334155', textAlign: 'center', color: '#94a3b8' }}>
              <FlaskConical size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>Use the test presets above or enter custom values, then click <strong>Run Prediction Scan</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Prediction
