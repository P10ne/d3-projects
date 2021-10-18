const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const devServer = require('./blocks/devServer');

module.exports = merge([
    common(),
    {mode: 'development'},
    {devtool: 'source-map'},
    devServer()
]);
