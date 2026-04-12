import React, { useState } from 'react'
import { ShieldAlert, ShieldCheck, Loader2, Search, Network } from 'lucide-react'
import { predictFraud } from '../services/api'

function Prediction() {
  const [formData, setFormData] = useState({
    transaction_id: `TXN-${Math.floor(Math.random() * 1000000)}`,
    sender_account: 'ACC-12345',
    receiver_account: 'ACC-98765',
    amount: 100.5,
    transaction_type: 'transfer',
    location: 'New York',
    device_used: 'mobile',
    ip_address: '192.168.1.1',
    device_hash: 'HASH-ABCDEF'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white' }}>Fraud Prediction</h1>
        <p style={{ color: '#94a3b8' }}>Analyze transactions for risk factors</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Transaction Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Transaction ID</label>
                <input name="transaction_id" value={formData.transaction_id} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Amount ($)</label>
                <input name="amount" type="number" value={formData.amount} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Sender Account</label>
              <input name="sender_account" value={formData.sender_account} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Device Type</label>
              <select name="device_used" value={formData.device_used} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}>
                <option value="mobile">Mobile Device</option>
                <option value="desktop">Desktop Terminal</option>
                <option value="tablet">Tablet Slate</option>
              </select>
            </div>

            <button disabled={loading} style={{ width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              {loading ? 'Analyzing...' : 'Run Prediction Scan'}
            </button>
          </form>
        </div>

        <div>
          {result ? (
            <div>
              <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: `2px solid ${result.is_fraud ? '#ef4444' : '#22c55e'}`, textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  {result.is_fraud ? <ShieldAlert color="#ef4444" size={80} /> : <ShieldCheck color="#22c55e" size={80} />}
                </div>
                <h2 style={{ color: result.is_fraud ? '#ef4444' : '#22c55e', margin: '0 0 1rem 0' }}>
                  {result.is_fraud ? 'FRAUD SUSPECTED' : 'TRANSACTION SECURE'}
                </h2>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                  {(result.probability * 100).toFixed(0)}%
                </div>
                <p style={{ color: '#94a3b8' }}>Neural Risk Confidence Level</p>
              </div>

              {/* SHAP Explanation */}
              {result.explanation && Object.keys(result.explanation).length > 0 && (
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>SHAP Feature Contributions</h4>
                  {Object.entries(result.explanation).map(([feat, val], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #0f172a' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{feat}</span>
                      <span style={{ color: val > 0 ? '#ef4444' : '#22c55e', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {val > 0 ? '+' : ''}{val.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Phase 4b: Network Context */}
              <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Network size={16} color="#8b5cf6" /> Network Context
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.75rem' }}>Degree Centrality</p>
                    <p style={{ color: 'white', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>
                      {result.explanation?.degree_centrality !== undefined ? result.explanation.degree_centrality.toFixed(4) : '—'}
                    </p>
                  </div>
                  <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.75rem' }}>Cluster Size</p>
                    <p style={{ color: 'white', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>
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
                        <span style={{ color: riskColor, fontWeight: 600, fontSize: '0.9rem' }}>
                          Fraud Ring Risk: {riskLevel}
                        </span>
                      </div>
                      {result.probability > 0.7 && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.75rem', marginTop: '0.5rem' }}>
                          <p style={{ color: '#ef4444', margin: 0, fontSize: '0.85rem' }}>
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
              <p>Awaiting transaction input for analysis...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Prediction
