import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this matches your Vite environment variable
  withCredentials: true, // Send cookies with requests
});

export default api;
