const tableName = 'users';

exports.up = knex => {
    return knex.schema.hasTable(tableName).then(exists => {
        if (exists) {
            return knex.schema.alterTable(tableName, table =>
                table
                    .string('role')
                    .notNullable()
                    .defaultTo('user')
            );
        }
    });
};

exports.down = knex => {
    return knex.schema.hasTable(tableName).then(exists => {
        if (exists) {
            return knex.schema.alterTable(tableName, table => table.dropColumn('role'));
        }
    });
};
