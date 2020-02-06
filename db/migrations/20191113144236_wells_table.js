const tableName = 'wells';

exports.up = knex => {
    return knex.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return knex.schema.createTable(tableName, table => {
                table
                    .increments('id')
                    .primary()
                    .notNullable();
                table.string('name').notNullable();
                table.float('depth', 4).notNullable();
                table.integer('volume', 6).notNullable();
                table
                    .dateTime('created_at')
                    .notNullable()
                    .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
                table.boolean('is_active').defaultTo(true);
            });
        }
    });
};

exports.down = knex => {
    return knex.schema.dropTableIfExists(tableName);
};
