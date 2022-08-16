var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue?$/,
                exclude: /(node_modules)/,
                use: 'vue-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],
    devServer: {
        // historyApiFallback: true
        // proxy: {
        //     '/api_hh': {
        //         target: 'http://127.0.0.1:8081',
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/api_hh': "",
        //         }
        //     }
        // }
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://34.105.255.229:8081'
        })
    }
}