const { merge } = require('webpack-merge');
const entry = require('./blocks/entry');
const output = require('./blocks/output');
const resolve = require('./blocks/resolve');
const ts = require('./blocks/module/rules/ts');
const cleanWebpackPlugin = require('./blocks/plugins/cleanWebpackPlugin');
const htmlWebpackPlugin = require('./blocks/plugins/htmlWebpackPlugin');

function getModule() {
    return {
        module: {
            rules: [
                ts()
            ]
        }
    }
}

function plugins() {
    return {
        plugins: [
            cleanWebpackPlugin(),
            htmlWebpackPlugin()
        ]
    }
}


module.exports = function() {
    return merge([
        entry(),
        output(),
        resolve(),
        getModule(),
        plugins()
    ]);
}

