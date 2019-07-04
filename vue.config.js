module.exports = {
    productionSourceMap: false,
    devServer: {
        open: process.platform === "darwin",
        disableHostCheck: false,
        host: "0.0.0.0",
        port: 80,
        https: false,
        //hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy:  {
            '/api': {
                target: 'http://127.0.0.1:9527/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        } // string | Object
        // before: app => {}
    },
};
