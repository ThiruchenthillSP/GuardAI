import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

export const predictFraud = async (d) => { const r = await api.post('/predict', d); return r.data; };
export const trainModel = async () => { const r = await api.post('/train'); return r.data; };
export const getMetrics = async () => { const r = await api.get('/metrics'); return r.data; };
export const getGraphData = async () => { const r = await api.get('/graph-data'); return r.data; };
export const getModelComparison = async () => { const r = await api.get('/model-comparison'); return r.data; };
export const getGnnExplanations = async () => { const r = await api.get('/gnn-explanations'); return r.data; };
export const generatePaperFigures = async () => { const r = await api.post('/generate-paper-figures'); return r.data; };
export const getPaperMetricsSummary = async () => { const r = await api.get('/paper-metrics-summary'); return r.data; };

export default api;
