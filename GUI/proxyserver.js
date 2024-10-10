const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api_key'],
    credentials: true
}));

// Proxy configuration
app.use('/api', createProxyMiddleware({
    target: 'http://10.160.3.20:32500/api', // Replace with your API URL
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to the target
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add custom headers if needed
        proxyReq.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        proxyReq.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, api_key, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers");
    },
    onProxyRes: (proxyRes, req, res) => {
        // Modify the response headers to include CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3000';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, api_key';
    }
}));

// Start the server
const PORT = 3001; // You can use any available port
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
