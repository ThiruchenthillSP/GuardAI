import React, { useState } from 'react'
import { ShieldAlert, ShieldCheck, Loader2, Search } from 'lucide-react'
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
            <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: `2px solid ${result.is_fraud ? '#ef4444' : '#22c55e'}`, textAlign: 'center' }}>
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
