import axios from 'axios';

// Set base URL for all requests
axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Add request interceptor for logging and URL cleanup
axios.interceptors.request.use(
  config => {
    // Clean up any double slashes in URL (except for http://)
    if (config.url && !config.url.startsWith('http')) {
      config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
    }
    
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    console.log('Request headers:', config.headers);
    
    // Ensure proper headers for different request types
    if (config.method === 'patch') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    if (config.method === 'delete') {
      // Make sure delete requests have proper content type
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Add auth token to all requests
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = token;
      console.log("Added JWT token to request headers");
    } else {
      console.log("No JWT token found in localStorage");
    }
    
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error('Response error:', error.response);
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Request URL that failed:', error.config?.url);
      return Promise.reject(error);
    } else {
      console.error('Network error:', error.message);
      console.error('Request config:', error.config);
      
      // Try to fix CORS issues by making a second attempt with different headers
      if (error.message === 'Network Error' && error.config && !error.config.__isRetryRequest) {
        console.log('Retrying request with modified headers');
        const originalRequest = error.config;
        originalRequest.__isRetryRequest = true;
        originalRequest.headers['Access-Control-Allow-Origin'] = '*';
        return axios(originalRequest);
      }
      
      return Promise.reject({
        response: {
          data: {
            networkError: "Network Error. Please check your connection or the server might be down."
          }
        }
      });
    }
  }
);

export default axios; 