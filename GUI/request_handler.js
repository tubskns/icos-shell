// Not needed anymore
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const app = express();

// Access the environment variables
const GUI_ADDRESS = process.env.NEXT_PUBLIC_GUI_ADDRESS;
const CONTROLLER_ADDRESS = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;
const LIGHTHOUSE_ADDRESS = process.env.NEXT_PUBLIC_LIGHTHOUSE_ADDRESS; // New variable

// CORS configuration
app.use(cors({
    origin: GUI_ADDRESS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api_key'],
    credentials: true
}));

// Proxy configuration for /api requests
app.use('/api', createProxyMiddleware({
    target: CONTROLLER_ADDRESS + '/api',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to the target
    },
    onProxyReq: (proxyReq, req, res) => {

        proxyReq.setHeader('Access-Control-Allow-Origin', GUI_ADDRESS);
        proxyReq.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, api_key, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers");
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = GUI_ADDRESS;
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, api_key';
    }
}));

// Proxy configuration for /light_house requests
app.use('/light_house', createProxyMiddleware({
    target: LIGHTHOUSE_ADDRESS,
    changeOrigin: true,
    pathRewrite: {
        '^/light_house': '', // Remove /light_house prefix when forwarding to the target
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', GUI_ADDRESS);
        proxyReq.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, api_key, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers");
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = GUI_ADDRESS;
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, api_key';
    }
}));

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Request handler is running on port ${PORT}`);
});
