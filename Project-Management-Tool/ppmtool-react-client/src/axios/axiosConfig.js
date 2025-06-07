import axios from "axios";

// Set default base URL for API requests
axios.defaults.baseURL = "http://localhost:8081";

// Log request details
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response error logging
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.log("Response error: ", error.response);
      console.log("Error data:", error.response.data);
      console.log("Error status:", error.response.status);
      console.log("Request URL that failed:", error.config.url);
    } else if (error.request) {
      console.log("Request error - no response received:", error.request);
    } else {
      console.log("Error during request setup:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axios; 