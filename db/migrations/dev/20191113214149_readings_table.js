const tableName = 'readings';

exports.up = knex => {
    return knex.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return knex.schema.createTable(tableName, table => {
                table
                    .increments('id')
                    .primary()
                    .notNullable();
                table.float('reading').notNullable();
                table.integer('height').notNullable();
                table.float('volume', 6).notNullable();
                table
                    .integer('well_id', 11)
                    .nullable()
                    .unsigned();
                table
                    .dateTime('created_at')
                    .notNullable()
                    .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
                table.boolean('is_active').defaultTo(true);

                table
                    .foreign('well_id', 'idwells_idx')
                    .references('id')
                    .inTable('wells')
                    .onDelete('SET NULL')
                    .onUpdate('NO ACTION');
            });
        }
    });
};

exports.down = knex => {
    return knex.schema.dropTableIfExists(tableName);
};
