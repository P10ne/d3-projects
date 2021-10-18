const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function() {
    const COMMON_CONFIG = {
        template: "./src/index.html"
    };
    switch (process.env.NODE_ENV) {
        case 'dev':
            return new HtmlWebpackPlugin({
                ...COMMON_CONFIG
            })
        case 'prod':
            return new HtmlWebpackPlugin({
                ...COMMON_CONFIG,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                },
            })
    }
}