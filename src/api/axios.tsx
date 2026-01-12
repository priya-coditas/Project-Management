import axios from "axios";

const api = axios.create({
  baseURL: "https://l3-interview-be.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login if it's a 401 on auth endpoints or token is truly invalid
    // Don't redirect for permission errors on other endpoints
    if (err.response?.status === 401) {
      const isAuthEndpoint = err.config?.url?.includes('/auth/');
      const errorMessage = err.response?.data?.message?.toLowerCase() || '';
      const isTokenInvalid = errorMessage.includes('token') || 
                            errorMessage.includes('unauthorized') ||
                            errorMessage.includes('expired');

      // Only redirect if it's an auth endpoint or token is invalid/expired
      if (isAuthEndpoint || isTokenInvalid) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default api;