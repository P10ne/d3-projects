const path = require('path');
const { PROJECT_ROOT } = require('../constrants');

module.exports = function() {
    return {
        output: {
            filename: 'main-[hash].js',
            path: path.resolve(PROJECT_ROOT, './dist')
        }
    }
}
