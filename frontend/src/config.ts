const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_PORT || "http://localhost:8080";

if (!import.meta.env.VITE_API_URL && !import.meta.env.VITE_SERVER_PORT) {
  console.warn("Neither VITE_API_URL nor VITE_SERVER_PORT is defined. Falling back to http://localhost:8080");
}

export const API_BASE_URL = apiBaseUrl;
