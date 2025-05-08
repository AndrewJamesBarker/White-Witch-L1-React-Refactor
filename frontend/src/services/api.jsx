import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Matches with Vite env variable
  withCredentials: true, // Send cookies with requests
});

export default api;
