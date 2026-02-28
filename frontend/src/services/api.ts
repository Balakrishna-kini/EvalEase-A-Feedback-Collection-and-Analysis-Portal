import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_PORT;
if (!apiBaseUrl) {
  console.error("Neither VITE_API_URL nor VITE_SERVER_PORT is defined");
}

const BASE_URL = `${apiBaseUrl}/api/analytics`;

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getForms = () => axios.get(`${BASE_URL}/forms`, { headers: getAuthHeaders() });
export const getQuestionAnalytics = (formId: number) => axios.get(`${BASE_URL}/forms/${formId}/questions`, { headers: getAuthHeaders() });
export const getSessionAnalytics = (formId: number) => axios.get(`${BASE_URL}/forms/${formId}/session-analytics`, { headers: getAuthHeaders() });
export const getAverageSentimentByForm = (formId: number) => axios.get(`${BASE_URL}/forms/${formId}/sentiment/average`, { headers: getAuthHeaders() });
export const getResponseCountByForm = (formId: number) => axios.get(`${BASE_URL}/forms/${formId}/responses/count`, { headers: getAuthHeaders() });
export const getAverageSentimentAllForms = () => axios.get(`${BASE_URL}/forms/sentiment/average`, { headers: getAuthHeaders() });
export const getResponseCountPerForm = () => axios.get(`${BASE_URL}/forms/responses/count`, { headers: getAuthHeaders() });
export const getSuggestions = (formId: number) => axios.get(`${apiBaseUrl}/api/suggestions/${formId}`, { headers: getAuthHeaders() });
export const getTopPerformersSummary = () => axios.get(`${BASE_URL}/summary/top-performers`, { headers: getAuthHeaders() });
