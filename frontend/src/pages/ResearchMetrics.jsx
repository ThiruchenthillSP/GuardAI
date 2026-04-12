import React, { useEffect, useState } from 'react'
import { getModelComparison } from '../services/api'
import { FlaskConical, AlertTriangle, TrendingUp, Clock, BarChart3 } from 'lucide-react'

const ResearchMetrics = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    getModelComparison().then(setData).catch(console.error)
  }, [])

  const models = data?.models || []
  const ablation = data?.ablation_5step || []
  const ieee = data?.ieee_cis || []
  const latency = data?.latency_ms || {}
  const gnn = data?.gnn_comparison || []
  const note = data?.dataset_note || ''

  const benchmarks = [
    { name: 'Louvain-only (Cao et al., IJECE 2024)', Avg_Precision: 0.089, AUC_ROC: 0.872 },
    { name: 'GNN-CL (Liu et al., AAAI 2024)', Avg_Precision: 0.28, AUC_ROC: 0.931 },
    { name: 'XGBoost-only (Alarfaj et al., IEEE 2022)', Avg_Precision: 0.31, AUC_ROC: 0.959 },
  ]

  const Section = ({ icon: Icon, title, color, children }) => (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Icon size={20} color={color} />
        <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{title}</h3>
      </div>
      {children}
    </div>
  )

  const Table = ({ headers, rows, headerColors }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '0.6rem 0.75rem', color: headerColors?.[i] || '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ textAlign: ci === 0 ? 'left' : 'right', padding: '0.6rem 0.75rem', color: ci === 0 ? 'white' : '#94a3b8', fontFamily: ci > 0 ? 'monospace' : 'inherit', fontSize: '0.9rem' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div style={{ maxWidth: '1100px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FlaskConical size={24} color="#8b5cf6" />
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Research Metrics</h1>
        </div>
        <p style={{ color: '#94a3b8', margin: 0 }}>Publication-ready results for GuardAI paper</p>
      </header>

      {/* Dataset Disclaimer */}
      {note && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: '#f59e0b', fontWeight: 600, fontSize: '0.9rem' }}>Dataset Note</p>
            <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{note}</p>
          </div>
        </div>
      )}

      {/* 5-Step Ablation */}
      {ablation.length > 0 && (
        <Section icon={TrendingUp} title="5-Step Ablation Study (XGBoost)" color="#10b981">
          <Table
            headers={['Config', 'Avg-PR', 'AUC-ROC', 'F1@opt', 'Threshold']}
            headerColors={['#94a3b8', '#10b981', '#3b82f6', '#f59e0b', '#94a3b8']}
            rows={ablation.map(a => [a.name, a.Avg_Precision?.toFixed(4), a.AUC_ROC?.toFixed(4), a.f1_optimal?.toFixed(4), a.optimal_threshold?.toFixed(4)])}
          />
          <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: '6px' }}>
            <span style={{ color: '#10b981', fontSize: '0.85rem' }}>
              Delta (a to e): +{(ablation[ablation.length-1]?.AUC_ROC - ablation[0]?.AUC_ROC)?.toFixed(4)} AUC-ROC | +{(ablation[ablation.length-1]?.Avg_Precision - ablation[0]?.Avg_Precision)?.toFixed(4)} Avg-PR
            </span>
          </div>
        </Section>
      )}

      {/* Main Model Comparison */}
      {models.length > 0 && (
        <Section icon={BarChart3} title="Main Model Comparison (PaySim dataset)" color="#3b82f6">
          <Table
            headers={['Model', 'Avg-PR', 'AUC-ROC', 'F1@opt', 'Precision', 'Recall']}
            headerColors={['#94a3b8', '#10b981', '#3b82f6', '#f59e0b', '#94a3b8', '#94a3b8']}
            rows={models.map(m => [m.name, m.Avg_Precision?.toFixed(4), m.AUC_ROC?.toFixed(4), m.f1_optimal?.toFixed(4), m.Precision?.toFixed(4), m.Recall?.toFixed(4)])}
          />
        </Section>
      )}

      {/* GNN Comparison */}
      {gnn.length > 0 && (
        <Section icon={BarChart3} title="GNN Architecture Comparison" color="#8b5cf6">
          <Table
            headers={['Architecture', 'Avg-PR', 'AUC-ROC']}
            headerColors={['#94a3b8', '#10b981', '#3b82f6']}
            rows={gnn.map(g => [g.name, g.Avg_Precision?.toFixed(4), g.AUC_ROC?.toFixed(4)])}
          />
        </Section>
      )}

      {/* Benchmark Comparison */}
      <Section icon={BarChart3} title="Published Benchmark Comparison (Table 1)" color="#9333ea">
        <Table
          headers={['Method', 'Avg-PR', 'AUC-ROC']}
          headerColors={['#94a3b8', '#10b981', '#3b82f6']}
          rows={[
            ...benchmarks.map(b => [b.name, b.Avg_Precision.toFixed(4), b.AUC_ROC.toFixed(4)]),
            ...models.map(m => [`GuardAI ${m.name} (ours)`, m.Avg_Precision?.toFixed(4), m.AUC_ROC?.toFixed(4)]),
            ...gnn.map(g => [`GuardAI ${g.name} (ours)`, g.Avg_Precision?.toFixed(4), g.AUC_ROC?.toFixed(4)]),
          ]}
        />
      </Section>

      {/* IEEE-CIS Cross-Dataset */}
      {ieee.length > 0 && (
        <Section icon={BarChart3} title="IEEE-CIS Cross-Dataset Validation" color="#ef4444">
          <Table
            headers={['Model', 'Avg-PR', 'AUC-ROC', 'F1@opt', 'Precision', 'Recall']}
            headerColors={['#94a3b8', '#10b981', '#3b82f6', '#f59e0b', '#94a3b8', '#94a3b8']}
            rows={ieee.map(m => [m.name, m.Avg_Precision?.toFixed(4), m.AUC_ROC?.toFixed(4), m.f1_optimal?.toFixed(4), m.Precision?.toFixed(4), m.Recall?.toFixed(4)])}
          />
        </Section>
      )}

      {/* Latency */}
      {latency?.xgboost && (
        <Section icon={Clock} title="Inference Latency Benchmark" color="#f59e0b">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '1.25rem' }}>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem' }}>XGBoost</p>
              <p style={{ color: 'white', margin: '0.5rem 0 0', fontSize: '1.5rem', fontFamily: 'monospace' }}>{latency.xgboost.mean}ms <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>mean</span></p>
              <p style={{ color: '#f59e0b', margin: '0.25rem 0 0', fontSize: '0.9rem', fontFamily: 'monospace' }}>{latency.xgboost.p95}ms p95</p>
            </div>
            {latency.gnn && (
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '1.25rem' }}>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem' }}>GNN (best)</p>
                <p style={{ color: 'white', margin: '0.5rem 0 0', fontSize: '1.5rem', fontFamily: 'monospace' }}>{latency.gnn.mean}ms <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>mean</span></p>
                <p style={{ color: '#f59e0b', margin: '0.25rem 0 0', fontSize: '0.9rem', fontFamily: 'monospace' }}>{latency.gnn.p95}ms p95</p>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  )
}

export default ResearchMetrics
