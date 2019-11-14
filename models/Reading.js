const BaseModel = require('./BaseModel');

class Reading extends BaseModel {

    static get tableName() {
        return 'readings';
    }

    $beforeInsert() {
        this.volume = this.reading * 2;
        this.height = this.reading * 3;
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['reading', 'well_id'],
            properties: {
                id: {type: 'integer'},
                reading: {type: 'number'},
                height: {type: 'integer'},
                volume: {type: 'number'},
                well_id: {type: 'integer'}
            },
            additionalProperties: false
        };
    }

    static get relationMappings() {
        const {BelongsToOneRelation} = BaseModel;
        return {
            well: {
                relation: BelongsToOneRelation,
                modelClass: 'Well',
                join: {
                    from: 'readings.well_id',
                    to: 'wells.id'
                }
            }
        }
    }
}

module.exports = Reading;
