const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware("/ws/listen",{
            target: 'http://localhost:8080',
            ws: true,
            changeOrigin: true
        })
    );
    app.use(
        createProxyMiddleware("/api",{
            target: 'http://localhost:8080',
            changeOrigin: true
        })
    );

};