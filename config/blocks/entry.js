const { getEntries } = require('../utils/pages');

module.exports = function() {
    const entry = getEntries();
    return {
        entry: getEntries()
    }
}
