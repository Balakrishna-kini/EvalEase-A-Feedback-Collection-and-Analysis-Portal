import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_SERVER_PORT}/api/analytics`;

export const getForms = () => axios.get(`${BASE_URL}/forms`);

export const getQuestions = (formId: number | string) =>
  axios.get(`${BASE_URL}/forms/${formId}/questions`);

export const getSessionAnalytics = (formId: number | string) =>
  axios.get(`${BASE_URL}/forms/${formId}/session-analytics`);

export const getAverageSentiment = (formId: number | string) =>
  axios.get(`${BASE_URL}/forms/${formId}/sentiment/average`);

export const getResponseCount = (formId: number | string) =>
  axios.get(`${BASE_URL}/forms/${formId}/responses/count`);

export const getAllFormSentiments = () =>
  axios.get(`${BASE_URL}/forms/sentiment/average`);

export const getResponseCounts = () =>
  axios.get(`${BASE_URL}/forms/responses/count`);
