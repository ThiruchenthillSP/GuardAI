import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictFraud = async (transactionData) => {
  try {
    const response = await api.post('/predict', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error predicting fraud:', error);
    throw error;
  }
};

export const trainModel = async () => {
  try {
    const response = await api.post('/train');
    return response.data;
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
};

export const getMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

export const getGraphData = async () => {
  try {
    const response = await api.get('/graph-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw error;
  }
};

export const getModelComparison = async () => {
  try {
    const response = await api.get('/model-comparison');
    return response.data;
  } catch (error) {
    console.error('Error fetching model comparison data:', error);
    throw error;
  }
};

export default api;
