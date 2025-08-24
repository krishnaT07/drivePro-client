// client/lib/api.ts
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Add token to every request
api.interceptors.request.use((config) => {
  // Check if it's running on the client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to the headers
    }
  }
  return config;
});

// Optional: You can add interceptors for handling error responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized error (e.g., log out user)
      console.error("Unauthorized access - Token may have expired");
      // Optionally, you can clear the token and redirect to login page:
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login"; // Or use Next.js Router to redirect
    }
    return Promise.reject(error);
  }
);

export default api;
