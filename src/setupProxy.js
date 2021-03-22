const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app)=>{
    app.use('/api',createProxyMiddleware({
        target: 'https://172.16.4.207:5002',
        // target: "https://221.213.41.28:3001",
        changeOrigin:true,
        secure:false,
        // pathRewrite: {
        //     '^/api' : '/api/app',     // 重写请求
        // },
        // router: function(req) {
        //     return {
        //         protocol: 'https:', // The : is required
        //         host: '172.16.4.207',
        //         port: 5002
        //     };
        // },
    }));
};
