const path = require('path');

module.exports = {
    entry: './bin/www.js',
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve('dist'),
        filename: 'server.production.js'
    },
    externals: {
        knex: 'commonjs knex'
    }
};
