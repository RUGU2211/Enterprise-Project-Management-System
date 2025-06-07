const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("Setting up proxy to http://localhost:8081");
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      logLevel: 'debug',
      secure: false,
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${req.method} ${req.path}`);
        
        // Log headers for debugging
        console.log('Request headers:', req.headers);
        
        // Make sure authorization header is forwarded
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
          console.log('Authorization header set on proxy request');
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response from: ${req.method} ${req.path} with status: ${proxyRes.statusCode}`);
        
        // Add Access-Control-Allow-Origin header to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, X-Requested-With, Accept';
      },
      onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
      }
    })
  );
}; 