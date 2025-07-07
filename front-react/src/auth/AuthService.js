// src/auth/authService.js
import axios from 'axios';

// Configuración de URL base según el entorno
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'http://ec2-18-224-7-201.us-east-2.compute.amazonaws.com:8080/api/auth'
  : 'http://localhost:8080/api/auth';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data; 
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken'); // Cambiado de 'token' a 'jwtToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});