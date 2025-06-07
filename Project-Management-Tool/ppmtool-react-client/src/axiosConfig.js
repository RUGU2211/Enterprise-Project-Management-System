// Add response interceptor for error handling
axios.interceptors.response.use(
  response => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log('Response headers:', response.headers);
    
    // Log successful API calls for debugging
    const url = response.config.url;
    const method = response.config.method.toUpperCase();
    console.log(`API call successful: ${method} ${url}`);
    
    return response;
  },
  error => {
    console.error('Response error:', error.response);
    
    if (error.response) {
      console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
      console.log('Request URL that failed:', error.config.url);
      
      // Add specific handling for 404 errors
      if (error.response.status === 404) {
        console.error('API endpoint not found. Please check the URL path and make sure the backend service is running.');
      }
      
      // Add specific handling for 403 errors
      if (error.response.status === 403) {
        console.error('Access denied. You may not have permission to access this resource.');
      }
    } else if (error.request) {
      console.error('Request was made but no response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
); 