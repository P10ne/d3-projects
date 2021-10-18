const { TS_CONFIG_PATH, TS_CONFIG_PROD_PATH } = require('../../../constrants');

function getLoaders() {
  switch (process.env.NODE_ENV) {

    case 'prod':
      return [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              configFile: TS_CONFIG_PROD_PATH
            }
          }
      ];
    case 'dev':
    default:
      return [
        {
          loader: 'ts-loader',
          options: {
            configFile: TS_CONFIG_PATH
          }
        }
      ];
  }
}

module.exports = function() {
  return {
    test: /\.tsx?$/,
    use: getLoaders(),
    exclude: /node_modules/
  }
}