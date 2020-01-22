/* eslint-disable security/detect-object-injection */
const knex = require('knex');
const knexOptions = require('../knexfile');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const knexConfig = knex(knexOptions[env]);

knexConfig.migrate.latest().then(() => {
    return knexConfig.seed.run();
});

module.exports = knexConfig;
