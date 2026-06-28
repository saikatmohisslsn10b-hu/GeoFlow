import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || 'An error occurred during processing.';
    return Promise.reject(new Error(message));
  }
);

export const generateSoilMap = (formData) =>
  api.post('/soil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

export const generateLULCMap = (formData) =>
  api.post('/lulc', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

export const generateCurveNumberMap = (formData) =>
  api.post('/curve-number', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

export const generateCurveNumberSheds = (formData) =>
  api.post('/sheds-map', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

export const generateContourMap = (formData) =>
  api.post('/contour-map', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

export const generateHydrograph = (formData) =>
  api.post('/hydrograph', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  });

export default api;