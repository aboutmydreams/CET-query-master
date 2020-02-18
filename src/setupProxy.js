const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy('/code', {
        target: 'https://www.chsi.com.cn/cet/ValidatorIMG.JPG?ID=3341.068026493503',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
            "^/rjwl": "/rjwl"
        }
    }))
}