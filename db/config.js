const knex = require('knex');
const knexFile = require('../knexfile');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const knexConfig = knex(knexFile[env]);

knexConfig.migrate.latest().then(() => {
    return knexConfig.seed.run();
});

module.exports = knexConfig;