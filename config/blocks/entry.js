const path = require('path');
const { PROJECT_ROOT } = require('../constrants');

module.exports = function() {
    return {
        entry: path.resolve(PROJECT_ROOT, './src/main.ts')
    }
}