import React, { useState } from 'react'
import { User, Lock, Zap, Globe, Terminal, Code, Cpu, ShieldCheck, Activity, FileText, Check, Loader, Download } from 'lucide-react'
import { generatePaperFigures, getPaperMetricsSummary } from '../services/api'
import { motion } from 'framer-motion'

function Settings() {
  const [activeTab, setActiveTab] = useState('ENGINE_TUNING')
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState(null)

  const TabItem = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        width: '100%',
        background: activeTab === id ? '#27272a' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: activeTab === id ? '#ffffff' : '#9ca3af',
        fontWeight: activeTab === id ? 600 : 500,
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => { if (activeTab !== id) e.currentTarget.style.background = '#18181b' }}
      onMouseLeave={(e) => { if (activeTab !== id) e.currentTarget.style.background = 'transparent' }}
    >
      <Icon size={18} color={activeTab === id ? '#3b82f6' : '#9ca3af'} />
      {label}
    </button>
  )

  const SettingToggle = ({ label, enabled, desc }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid #27272a' }}>
      <div style={{ flex: 1, paddingRight: '2rem' }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: 'white' }}>{label}</p>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <div style={{ 
        width: '44px', 
        height: '24px', 
        background: enabled ? '#3b82f6' : '#27272a', 
        borderRadius: '12px', 
        position: 'relative', 
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}>
        <motion.div 
          animate={{ x: enabled ? 22 : 2 }}
          style={{ width: '20px', height: '20px', background: 'white', position: 'absolute', top: '2px', borderRadius: '50%' }} 
        />
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 600, color: 'white' }}>System Settings</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#9ca3af', fontSize: '1.1rem' }}>Configure the GuardAI engine and export research artifacts.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', padding: '0.5rem 1rem', display: 'block' }}>Configuration</span>
          <TabItem id="AUTH_IDENT" label="Identity & Access" icon={User} />
          <TabItem id="ENGINE_TUNING" label="Engine Tuning" icon={Zap} />
          <TabItem id="CORE_SHIELD" label="Security Protocols" icon={Lock} />
          <TabItem id="GLOBAL_BLUEPRINT" label="Network Topology" icon={Globe} />
          <TabItem id="ROOT_SHELL" label="Advanced Logs" icon={Terminal} />
        </div>

        {/* Main Settings Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
               <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={28} color="#3b82f6" />
               </div>
               <div>
                 <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Engine Tuning</h3>
                 <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#9ca3af' }}>Manage inference thresholds and neural pathways.</p>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SettingToggle label="Neural Link Stabilization" desc="Force architectural fingerprinting for every operational mission cycle." enabled={true} />
              <SettingToggle label="Gradient Descent Recalibration" desc="Engage real-time weight re-sync on every heartbeat." enabled={false} />
              <SettingToggle label="Core Cryptographic Dissolution" desc="Deep packet decryption of all high-security neural ingestion nodes." enabled={true} />
              <SettingToggle label="Neural Debug Protocol" desc="Allow raw tensor access for low-level feature-engineering forensics mode." enabled={false} />
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
              <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Save Changes</button>
              <button style={{ background: '#27272a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Reset to Defaults</button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code size={28} color="#10b981" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Audit Log Export</h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#9ca3af' }}>Full audit logs available for forensic download.</p>
              </div>
              <button style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={18} /> Export Logs
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={28} color="#8b5cf6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Export Paper Package</h4>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#9ca3af' }}>Generate IEEE-format PDF figures and metrics JSON for publication submission.</p>
                  </div>
                  <button
                    onClick={async () => {
                      setExporting(true); setExportResult(null)
                      try {
                        const figRes = await generatePaperFigures()
                        const metricsRes = await getPaperMetricsSummary()
                        setExportResult({ figures: figRes.figures, outputDir: figRes.output_dir, metricsReady: !!metricsRes?.main_models })
                      } catch (e) { setExportResult({ error: e.message }) }
                      finally { setExporting(false) }
                    }}
                    disabled={exporting}
                    style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {exporting ? <><Loader size={16} className="animate-spin" /> Generating...</> : 'Export Package'}
                  </button>
                </div>

                {exportResult && !exportResult.error && (
                  <div style={{ background: '#18181b', borderRadius: '8px', padding: '1.25rem', border: '1px solid #27272a' }}>
                    {exportResult.figures?.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Check size={16} color={f.generated ? '#22c55e' : '#ef4444'} />
                        <span style={{ color: f.generated ? '#22c55e' : '#ef4444', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {f.file} {f.generated ? 'generated' : 'missing'}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Check size={16} color={exportResult.metricsReady ? '#22c55e' : '#ef4444'} />
                      <span style={{ color: exportResult.metricsReady ? '#22c55e' : '#ef4444', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        All metrics JSON ready
                      </span>
                    </div>
                    <p style={{ margin: '1rem 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                      Package saved to: <code style={{ color: '#8b5cf6', background: '#27272a', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{exportResult.outputDir}</code>
                    </p>
                  </div>
                )}
                {exportResult?.error && (
                  <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>Error: {exportResult.error}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default Settings
