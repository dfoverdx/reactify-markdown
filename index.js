if (process.env === 'developmemt') {
    module.exports = require('./dev-dist');
} else {
    module.exports = require('./dist');
}