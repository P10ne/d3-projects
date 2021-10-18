const { getHtmlWebpackPluginConfigs } = require("../../utils/pages");

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'dev':
            return getHtmlWebpackPluginConfigs().map(config => new HtmlWebpackPlugin(config))
        case 'prod':
            return getHtmlWebpackPluginConfigs().map(config => {
                return new HtmlWebpackPlugin({
                    ...config,
                    minify: {
                        collapseWhitespace: true,
                        removeComments: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                    }
                })
            })
    }
}