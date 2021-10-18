module.exports = function() {
    return {
        devServer: {
            contentBase: 'dist',
            compress: true,
            port: 3000,
        },
    }
}