function getLoaders() {
    switch (process.env.NODE_ENV) {
        // todo separate dev & prod scss configs
        default:
            return [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
    }
}

module.exports = function() {
    return {
        test: /\.s[ac]ss$/i,
        use: getLoaders()
    }
}