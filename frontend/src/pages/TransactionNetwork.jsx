import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getGraphData } from '../services/api';
import { Shield, ShieldAlert, Info, RefreshCw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const TransactionNetwork = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);
    const graphRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getGraphData();
            setGraphData(data);
        } catch (err) {
            console.error("Failed to fetch graph data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        // Center on node
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 1000);
    };

    const getNodeColor = (node) => {
        if (node.isFraud) return '#ef4444'; // Red
        if (node.probability > 0.5) return '#f59e0b'; // Amber
        return '#22c55e'; // Green
    };

    return (
        <div style={{ height: 'calc(100vh - 120px)', position: 'relative', background: '#0f172a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b' }}>
            {/* Header / Controls */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, display: 'flex', gap: '10px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '12px', border: '1px solid #334155', color: 'white' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Maximize size={20} color="#3b82f6" />
                        Neural Transaction Network
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                        Visualizing GNN-learned connections between suspect transfers
                    </p>
                </div>
                
                <button 
                    onClick={fetchData} 
                    style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Legend */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 10, background: 'rgba(30, 41, 59, 0.8)', padding: '15px', borderRadius: '12px', border: '1px solid #334155', color: 'white', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <span>Confirmed Fraud</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <span>High Risk (GNN Probability)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                    <span>Legitimate Transaction</span>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedNode && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, width: '300px', background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(12px)', padding: '20px', borderRadius: '16px', border: '1px solid #334155', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Transaction Details</h3>
                            <code style={{ fontSize: '0.75rem', color: '#3b82f6' }}>{selectedNode.id}</code>
                        </div>
                        <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Risk Probability</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                <div style={{ flex: 1, height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${selectedNode.probability * 100}%`, height: '100%', background: getNodeColor(selectedNode) }}></div>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>{(selectedNode.probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Amount</span>
                                <span style={{ fontWeight: 'bold' }}>${selectedNode.val.toLocaleString()}</span>
                            </div>
                            <div style={{ flex: 1, padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Risk Level</span>
                                <span style={{ fontWeight: 'bold', color: getNodeColor(selectedNode) }}>{selectedNode.risk}</span>
                            </div>
                        </div>
                        
                        <div style={{ padding: '10px', background: selectedNode.isFraud ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: `1px solid ${selectedNode.isFraud ? '#ef444433' : '#22c55e33'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {selectedNode.isFraud ? <ShieldAlert size={18} color="#ef4444" /> : <Shield size={18} color="#22c55e" />}
                            <span style={{ fontSize: '0.85rem' }}>{selectedNode.isFraud ? "Identified as Fraudulent Pattern" : "No malicious patterns detected"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Graph Rendering */}
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="label"
                nodeColor={getNodeColor}
                nodeRelSize={6}
                nodeVal={node => Math.sqrt(node.val) * 2 + 2}
                linkColor={() => '#334155'}
                linkWidth={1.5}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="#0f172a"
                onNodeClick={handleNodeClick}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.label;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

                    ctx.fillStyle = getNodeColor(node);
                    ctx.beginPath(); 
                    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); 
                    ctx.fill();

                    if (globalScale > 1.5) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillText(label, node.x - textWidth/2, node.y + 10);
                    }
                    
                    if (selectedNode && node.id === selectedNode.id) {
                        ctx.strokeStyle = '#3b82f6';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                        ctx.stroke();
                    }
                }}
            />
        </div>
    );
};

export default TransactionNetwork;
