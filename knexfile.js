const path = require('path');

module.exports = {
    development: {
        client: 'sqlite3',
        debug: true,
        connection: {
            filename: './dev.sqlite3'
        },
        log: {
            debug(message) {
                if (Array.isArray(message)) {
                    message.forEach(object => {
                        console.log(
                            '\x1b[36m',
                            '\x1b[40m',
                            object.sql,
                            ' \x1b[32m',
                            object.bindings,
                            '\x1b[0m'
                        );
                    });
                } else {
                    console.log(
                        '\x1b[36m',
                        '\x1b[40m',
                        message.sql,
                        ' \x1b[32m',
                        message.bindings,
                        '\x1b[0m'
                    );
                }
            }
        },
        migrations: {
            directory: path.join(__dirname, '/db/migrations/dev/'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(__dirname, '/db/seeds')
        }
    },
    production: {
        client: 'sqlite3',
        debug: false,
        connection: {
            filename: './production.sqlite3'
        },
        migrations: {
            directory: path.join(__dirname, '/db/migrations/production/'),
            tableName: 'knex_migrations_production'
        },
        seeds: {
            directory: path.join(__dirname, '/db/seeds')
        }
    }
};
