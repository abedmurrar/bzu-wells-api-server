const tableName = 'users';

exports.up = knex => {
    return knex.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return knex.schema.createTable(tableName, table => {
                table
                    .increments('id')
                    .primary()
                    .notNullable();
                table
                    .string('username')
                    .notNullable()
                    .unique();
                table.string('first_name').notNullable();
                table.string('last_name').notNullable();
                table.string('password').notNullable();
                table.string('salt').notNullable();
                table
                    .string('role')
                    .notNullable()
                    .defaultTo('user');
                table
                    .dateTime('created_at')
                    .notNullable()
                    .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
                // table
                //     .dateTime('updated_at')
                //     .notNullable()
                //     .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
                table.boolean('is_active').defaultTo(true);
            });
        }
    });
};

exports.down = knex => knex.schema.dropTableIfExists(tableName);
