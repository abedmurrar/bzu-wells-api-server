const BaseModel = require('./BaseModel');
const Well = require('./Well');

class Reading extends BaseModel {
    static get idColumn() {
        return 'id';
    }

    static get tableName() {
        return 'readings';
    }

    async $beforeInsert() {
        await super.$beforeInsert();
        const well = await Well.query()
            .select()
            .first()
            .where('id', this.well_id);
        this.volume = Math.round((well.depth / this.reading) * well.volume);
        this.height = well.depth - this.reading;
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['reading', 'well_id'],
            properties: {
                id: { type: 'integer' },
                reading: { type: 'number' },
                height: { type: 'integer' },
                volume: { type: 'number' },
                well_id: { type: 'integer' }
            },
            additionalProperties: false
        };
    }

    static get relationMappings() {
        const { BelongsToOneRelation } = BaseModel;
        return {
            well: {
                relation: BelongsToOneRelation,
                modelClass: 'Well',
                join: {
                    from: 'readings.well_id',
                    to: 'wells.id'
                }
            }
        };
    }
}

module.exports = Reading;
