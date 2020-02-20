const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy('/api', {
        target: 'http://47.103.220.76:80/api/',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/rjwl": "/rjwl"
        }
    }))
}