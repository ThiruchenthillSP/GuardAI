import React, { useState } from 'react'
import { User, Lock, Zap, Globe, Terminal, Code, Cpu, ShieldCheck, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../components/AnimatedCard'

function Settings() {
  const [activeTab, setActiveTab] = useState('ENGINE_TUNING')

  const TabHUD = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.75rem 2.5rem',
        width: '100%',
        background: activeTab === id ? 'hsla(var(--primary), 0.1)' : 'transparent',
        border: 'none',
        borderRight: activeTab === id ? '4px solid hsl(var(--primary))' : '4px solid transparent',
        color: activeTab === id ? 'hsl(var(--primary))' : 'hsla(var(--text), 0.3)',
        fontWeight: 900,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        textAlign: 'left',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        position: 'relative'
      }}
    >
      {activeTab === id && <motion.div layoutId="tabPulse" style={{ position: 'absolute', inset: 0, background: 'hsla(var(--primary), 0.05)', zIndex: -1 }} />}
      <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 1.5} />
      {label}
    </button>
  )

  const HUDToggle = ({ label, enabled, desc }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem 0', borderBottom: '1px solid hsla(var(--text), 0.05)', position: 'relative' }}>
      <div style={{ flex: 1 }}>
        <p className="mono" style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '3px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'hsl(var(--text-dim))', marginTop: '0.6rem', fontWeight: 300, maxWidth: '500px' }}>{desc}</p>
      </div>
      <div style={{ 
        width: '64px', 
        height: '32px', 
        background: enabled ? 'hsl(var(--primary))' : 'hsla(var(--text), 0.08)', 
        borderRadius: 0, 
        position: 'relative', 
        cursor: 'pointer',
        transition: 'all 0.4s',
        boxShadow: enabled ? '0 0 25px hsla(var(--primary), 0.5)' : 'none',
        border: '1px solid hsla(var(--text), 0.1)'
      }}>
        <motion.div 
          animate={{ x: enabled ? 36 : 4 }}
          style={{ width: '22px', height: '22px', background: 'white', position: 'absolute', top: '4px', left: 0, borderRadius: 0, boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} 
        />
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <header style={{ marginBottom: '6.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
           <Terminal size={18} color="hsl(var(--primary))" />
           <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsla(var(--primary), 0.6)', textTransform: 'uppercase', letterSpacing: '4px' }}>
             CORE_CONFIGURATION_SUITE_v6.1
           </span>
        </div>
        <h1 className="text-hud-gradient" style={{ fontSize: '6rem', margin: 0, fontWeight: 1000, letterSpacing: '-6px', textTransform: 'uppercase', lineHeight: 0.9 }}>
          Module <span style={{ opacity: 0.1 }}>Settings</span>
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '6rem', alignItems: 'start' }}>
        <div className="card-hud" style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
          <TabHUD id="AUTH_IDENT" label="AUTH_IDENTITY" icon={User} />
          <TabHUD id="ENGINE_TUNING" label="ENGINE_TUNING" icon={Zap} />
          <TabHUD id="CORE_SHIELD" label="CORE_SHIELD" icon={Lock} />
          <TabHUD id="GLOBAL_BLUEPRINT" label="GLOBAL_BLUEPRINT" icon={Globe} />
          <TabHUD id="ROOT_SHELL" label="ROOT_LOG_DECRYPT" icon={Terminal} />
        </div>

        <AnimatedCard delay={0.1} className="card-hud" style={{ padding: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '5rem' }}>
             <div style={{ width: '64px', height: '64px', background: 'hsla(var(--primary), 0.08)', border: '1px solid hsla(var(--primary), 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px hsla(var(--primary), 0.2)' }}>
                <Cpu size={32} color="hsl(var(--primary))" />
             </div>
             <div>
               <h3 className="mono" style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '4px' }}>CONFIG::{activeTab}</h3>
               <p className="mono" style={{ margin: 0, fontSize: '0.85rem', color: 'hsl(var(--primary))', fontWeight: 900, opacity: 0.8 }}>SYSTEM_PARAMETER_OVERRIDE_VERIFIED</p>
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <HUDToggle label="Neural Link Stabilization" desc="Forced architectural architectural architectural fingerprinting for every administrative operational mission cycle." enabled={true} />
            <HUDToggle label="Gradient Descent Recalibration" desc="Engage real-time weight re-sync on every 4.5ms mission mission mission heartbeat." enabled={false} />
            <HUDToggle label="Core Cryptographic Dissolution" desc="Deep packet packet packet packet packet decryption of all high-security high-security high-security neural ingestion ingestion ingestion nodes." enabled={true} />
            <HUDToggle label="Darknet Exit-Node Isolation" desc="Automatically flag and quarantine quarantine quarantine requests requests requests originating from known onion-clusters." enabled={true} />
            <HUDToggle label="Neural Debug Protocol" desc="Allow raw tensor tensor tensor access for low-level feature-engineering feature-engineering feature-engineering forensics forensics forensics forensics mode." enabled={false} />
          </div>

          <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <button className="btn-hud" style={{ width: '100%', fontSize: '1.1rem' }}>COMMIT_TO_KERNEL</button>
            <button className="btn-hud" style={{ border: '1px solid hsla(var(--text), 0.1)', color: 'hsla(var(--text), 0.3)', width: '100%', fontSize: '1.1rem' }}>REVERT_FACTORY</button>
          </div>
        </AnimatedCard>

        <div style={{ gridColumn: 'span 2', marginTop: '3rem' }}>
          <div className="card-hud" style={{ display: 'flex', alignItems: 'center', gap: '4rem', padding: '3rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'hsla(var(--primary), 0.1)', border: '1px solid hsla(var(--primary), 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={42} color="hsl(var(--primary))" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 className="mono" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'white', letterSpacing: '4px' }}>ROOT_AUDIT_LOG_EXPORT</h4>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'hsl(var(--text-dim))', fontWeight: 300, marginTop: '0.5rem' }}>Full cryptographic traceability and neural weight audit audit audit audit logs available for forensic forensic forensic forensic mission download.</p>
            </div>
            <button className="btn-hud" style={{ border: '1px solid hsl(var(--primary))', color: 'hsl(var(--primary))', padding: '1rem 3rem' }}>EXPORT_LOGS</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings
