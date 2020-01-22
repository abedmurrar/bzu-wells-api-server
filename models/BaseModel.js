const { Model } = require('objection');
const { DBErrors } = require('objection-db-errors');
const moment = require('moment');
const { DATETIME_FORMAT } = require('../helpers/constants');

class BaseModel extends DBErrors(Model) {
    /**
     * Automatically insert a current date-time value
     * for any model when a new row is inserted into database
     */
    $beforeInsert() {
        this.created_at = moment().format(DATETIME_FORMAT);
    }

    /**
     * Reformat DATETIME SQL string value
     * into Date object in JavaScript
     */
    $afterGet() {
        if (this.created_at) {
            this.created_at = moment(this.created_at).format(DATETIME_FORMAT);
        }
        if (this.updated_at) {
            this.updated_at = moment(this.updated_at).format(DATETIME_FORMAT);
        }
    }

    /**
     * Set ID column to be named as 'id'
     * for every model
     */
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
