const BaseModel = require('./BaseModel');

class User extends BaseModel {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'first_name', 'last_name', 'password', 'salt'],
            properties: {
                id: { type: 'integer' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                username: { type: 'string', maxLength: '20' },
                password: { type: 'string' },
                salt: { type: 'string' },
            },
            additionalProperties: false
        };
    }
}

module.exports = User;