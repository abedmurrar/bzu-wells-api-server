const BaseModel = require('./BaseModel');

class Well extends BaseModel {
    static get tableName() {
        return 'wells';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'depth', 'volume'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                depth: { type: 'number' },
                volume: { type: 'integer' }
            },
            additionalProperties: false
        };
    }

    static get relationMappings() {
        const { HasManyRelation } = BaseModel;
        return {
            readings: {
                relation: HasManyRelation,
                modelClass: 'Reading',
                join: {
                    from: 'wells.id',
                    to: 'readings.well_id'
                }
            }
        };
    }
}

module.exports = Well;
