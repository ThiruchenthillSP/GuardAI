import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { getGraphData, getGnnExplanations } from '../services/api';
import { Shield, ShieldAlert, RefreshCw, Maximize } from 'lucide-react';

const TransactionNetwork = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);
    const [gnnExplanations, setGnnExplanations] = useState([]);
    const graphRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getGraphData();
            setGraphData(data);
            try {
                const exp = await getGnnExplanations();
                if (Array.isArray(exp)) setGnnExplanations(exp);
            } catch {}
        } catch (err) {
            console.error("Failed to fetch graph data", err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-orbit camera for cinematic feel
    useEffect(() => {
        if (graphRef.current && !loading && graphData.nodes.length > 0) {
            let angle = 0;
            const distance = 400; // Radius of orbit
            const interval = setInterval(() => {
                if (graphRef.current) {
                    graphRef.current.cameraPosition({
                        x: distance * Math.sin(angle),
                        z: distance * Math.cos(angle),
                        y: distance * Math.sin(angle * 0.5) // Slight bob
                    });
                    angle += 0.002;
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [loading, graphData]);

    const handleNodeClick = useCallback(node => {
        setSelectedNode(node);
        const distance = 80;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        graphRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, 
            node, 
            2000  
        );
    }, [graphRef]);

    const getNodeColor = (node) => {
        if (node.isFraud) return '#ef4444'; // Red
        if (node.probability > 0.5) return '#f59e0b'; // Amber
        return '#22c55e'; // Green
    };

    return (
        <div style={{ height: 'calc(100vh - 120px)', position: 'relative', background: '#020617', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 0 30px rgba(0,0,0,0.5) inset' }}>
            {/* Header / Controls */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, display: 'flex', gap: '10px' }}>
                <div style={{ background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'white' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}>
                        <Maximize size={20} color="#60a5fa" />
                        Neural 3D Transaction Network
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                        Live WebGL cluster synthesis and relationship vectors
                    </p>
                </div>
                
                <button 
                    onClick={fetchData} 
                    style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(2, 6, 23, 0.7)'}
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} color="#60a5fa" />
                    Reset Vector
                </button>
            </div>

            {/* Cinematic Legend */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 10, background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 15px #ef4444' }}></div>
                    <span style={{fontWeight: 'bold', textShadow: '0 0 5px #ef4444'}}>Confirmed Fraud Node</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 15px #f59e0b' }}></div>
                    <span style={{fontWeight: 'bold', textShadow: '0 0 5px #f59e0b'}}>High Risk Probability</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e', opacity: 0.8 }}></div>
                    <span style={{color: '#94a3b8'}}>Legitimate Transfer</span>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedNode && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, width: '320px', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(15px)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.4)', color: 'white', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>Target Locked</h3>
                            <code style={{ fontSize: '0.8rem', color: '#60a5fa', textShadow: '0 0 5px #60a5fa' }}>ID: {selectedNode.id}</code>
                        </div>
                        <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ padding: '15px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Confidence Matrix</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ width: `${selectedNode.probability * 100}%`, height: '100%', background: getNodeColor(selectedNode), boxShadow: `0 0 10px ${getNodeColor(selectedNode)}` }}></div>
                                </div>
                                <span style={{ fontWeight: 'bold', textShadow: `0 0 8px ${getNodeColor(selectedNode)}` }}>{(selectedNode.probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, padding: '15px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Value Escrow (USD)</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 5px rgba(255,255,255,0.5)' }}>${selectedNode.val.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div style={{ padding: '15px', background: selectedNode.isFraud ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', borderRadius: '10px', border: `1px solid ${selectedNode.isFraud ? '#ef444466' : '#22c55e66'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {selectedNode.isFraud ? <ShieldAlert size={24} color="#ef4444" /> : <Shield size={24} color="#22c55e" />}
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: selectedNode.isFraud ? '#fca5a5' : '#86efac' }}>
                                {selectedNode.isFraud ? "CRITICAL: Fraud Vector Detected" : "SYSTEM: Traffic Appears Organic"}
                            </span>
                        </div>

                        {/* Phase 4d: GNN explanation flag */}
                        {gnnExplanations.some(e => e.node_id === selectedNode.id || String(e.node_id) === String(selectedNode.id)) && (
                            <div style={{ padding: '12px', background: 'rgba(245,158,11,0.12)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
                                    GNN flagged this node as suspicious — top-3 edges highlighted in orange
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 3D WebGL Graph Rendering */}
            {!loading && (
                <ForceGraph3D
                    ref={graphRef}
                    graphData={graphData}
                    nodeLabel="label"
                    nodeRelSize={4}
                    nodeVal={node => Math.sqrt(node.val) * 1.5}
                    // Cinematic Emissive Materials for Nodes
                    nodeThreeObject={node => {
                        const size = Math.sqrt(node.val) * 1.5 + 2;
                        const color = getNodeColor(node);
                        // Make Fraud nodes glow brightly using MeshPhongMaterial
                        const material = new THREE.MeshPhongMaterial({ 
                            color: color,
                            emissive: color,
                            emissiveIntensity: node.isFraud ? 1.5 : (node.probability > 0.5 ? 0.8 : 0.2),
                            transparent: true,
                            opacity: 0.95
                        });
                        const geometry = new THREE.SphereGeometry(size, 32, 32); // High resolution balls
                        return new THREE.Mesh(geometry, material);
                    }}
                    backgroundColor="#020617"
                    showNavInfo={false}
                    linkColor={link => {
                        const explainedEdges = gnnExplanations.flatMap(e => e.top_edges || []);
                        const isExplained = explainedEdges.some(ed => {
                            const src = typeof link.source === 'object' ? link.source.id : link.source;
                            const tgt = typeof link.target === 'object' ? link.target.id : link.target;
                            return (ed.from == src && ed.to == tgt) || (ed.from == tgt && ed.to == src);
                        });
                        return isExplained ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)';
                    }}
                    linkOpacity={0.4}
                    linkWidth={1}
                    linkDirectionalParticles={node => (node.isFraud || node.probability > 0.5) ? 4 : 1}
                    linkDirectionalParticleWidth={2}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleColor={link => {
                        const sourceNode = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
                        return sourceNode && (sourceNode.isFraud || sourceNode.probability > 0.5) ? '#ef4444' : '#60a5fa';
                    }}
                    onNodeClick={handleNodeClick}
                />
            )}
            
            {/* Ambient Lighting Override for ForceGraph3D */}
            <div style={{display: 'none'}}>
                {graphRef.current?.scene().add(new THREE.AmbientLight(0x404040, 2))}
            </div>
        </div>
    );
};

export default TransactionNetwork;
