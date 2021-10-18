const fs = require('fs');
const path = require('path');
const { PROJECT_ROOT } = require('../constrants');

const PAGES_PATH = path.resolve(PROJECT_ROOT, './src/pages');

const pages = (() => {
  return fs.readdirSync(PAGES_PATH);
})();

const getHtmlWebpackPluginConfigs = () => {
  return pages.map(page => {
    let tmpPath;
    try {
      const pagePath = `${PAGES_PATH}/${page}/index.html`;
      tmpPath = fs.existsSync(pagePath) ?
          pagePath :
          path.resolve(PROJECT_ROOT, `./src/default_tmp.html`);
    } catch (e) {
      console.error('Error during resolve template path: ', e);
    }
    return {
      filename: `${page}.html`,
      template: tmpPath,
      chunks: [page],
      templateParameters: {
        title: page
      }
    }
  })
}

const getEntries = () => {
  let result = {};
  pages.forEach(item => {
    result = {...result, [item]: path.resolve(PAGES_PATH, `./${item}/index.ts`)}
  })
  return result;
}

module.exports = {
  getHtmlWebpackPluginConfigs,
  getEntries
}