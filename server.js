const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Web Proxy is running! Use /proxy?url=https://example.com');
});

app.use('/proxy', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Please provide a target URL using ?url=... query parameter.');
    }

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            [`^/proxy`]: '',
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        },
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
