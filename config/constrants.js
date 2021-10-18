const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const TS_CONFIG_PATH = path.resolve(PROJECT_ROOT, 'tsconfig.json');
const TS_CONFIG_PROD_PATH = path.resolve(PROJECT_ROOT, 'tsconfig.prod.json');

module.exports = {
    PROJECT_ROOT,
    TS_CONFIG_PATH,
    TS_CONFIG_PROD_PATH
}