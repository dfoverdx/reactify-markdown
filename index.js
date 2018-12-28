if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    module.exports = require('./dev-dist');
} else {
    module.exports = require('./dist');
}