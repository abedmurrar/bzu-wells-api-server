const crypto = require('crypto');
const BaseModel = require('./BaseModel');

class User extends BaseModel {
    async $beforeInsert() {
        await super.$beforeInsert();
        this.salt = crypto.randomBytes(10).toString('hex');
        this.password = crypto
            .pbkdf2Sync(this.password, this.salt, 100, 32, 'sha256')
            .toString('hex');
    }

    async $beforeUpdate() {
        await super.$beforeUpdate();
    }

    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'first_name', 'last_name', 'password', 'role'],
            properties: {
                id: { type: 'integer' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                username: { type: 'string', maxLength: '20' },
                password: { type: 'string' },
                salt: { type: 'string' },
                role: { type: 'string' },
                is_active: { type: 'boolean' }
            },
            additionalProperties: false
        };
    }
}

module.exports = User;
