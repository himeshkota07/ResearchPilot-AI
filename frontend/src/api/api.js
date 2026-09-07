import axios from "axios";

// Read API URL from environment in production, fall back to local dev server
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL,
});

export default api;