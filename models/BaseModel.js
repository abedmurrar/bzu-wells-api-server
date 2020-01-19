const { Model } = require('objection');
const { DBErrors } = require('objection-db-errors');
const moment = require('moment');
const { DATETIME_FORMAT } = require('../helpers/constants');

class BaseModel extends DBErrors(Model) {
    $beforeInsert() {
        this.created_at = moment().format(DATETIME_FORMAT);
    }
    //
    // $beforeUpdate() {
    //     this.updated_at = moment().format(DATETIME_FORMAT);
    // }

    $afterGet() {
        if (this.created_at) {
            this.created_at = moment(this.created_at).format(DATETIME_FORMAT);
        }
        if (this.updated_at) {
            this.updated_at = moment(this.updated_at).format(DATETIME_FORMAT);
        }
    }

    static get idColumn() {
        return 'id';
    }

    static get modelPaths() {
        return [__dirname];
    }

    static get useLimitInFirst() {
        return true;
    }
}

module.exports = BaseModel;
