const crypto = require('crypto');
const BaseModel = require('./BaseModel');

class User extends BaseModel {

    $beforeInsert() {
        super.$beforeInsert();
        this.salt = crypto.randomBytes(10).toString('hex');
        this.password = crypto.pbkdf2Sync(this.password, this.salt, 100, 32, 'sha256').toString('hex');
    }

    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'first_name', 'last_name', 'password'],
            properties: {
                id: {type: 'integer'},
                first_name: {type: 'string'},
                last_name: {type: 'string'},
                username: {type: 'string', maxLength: '20'},
                password: {type: 'string'},
                salt: {type: 'string'},
            },
            additionalProperties: false
        };
    }
}

module.exports = User;