const moment = require('moment');
const createError = require('http-errors');
const {Well, Reading} = require('../models');
const {NOT_ACCEPTABLE} = require('../helpers/http-status-codes');
const DATETIME_FORMAT = 'YYYY-MM-DD hh:mm:ss';

/**
 * Well Controller for handling requests
 */
class WellController {
    /**
     * Get All Wells
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getAllWells(req, res, next) {
        try {
            const wells = await Well.query()
                .select()
                .column(['id', 'name', 'depth', 'volume'])
                .where('is_active', true)
                .eager('readings')
                .throwIfNotFound();
            res.json(wells);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get one well by id
     * with optionnal date filtering
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getWellById(req, res, next) {
        try {
            const well = await Well.query()
                .findById(req.params.id)
                .where('is_active', true)
                .modifyEager('readings',
                    builder => builder.limit(100)
                        .orderBy('created_at','asc')
                        .skipUndefined()
                )
                .throwIfNotFound();
            return res.json(well);
        } catch (err) {
            return next(err);
        }
    }

    /**
     * Get a well's readings
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getWellReadingsById(req, res, next) {
        try {
            let {
                params: {id},
                query: {
                    from = null,
                    to = null,
                    limit = 100
                }
            } = req;
            if (from && to) {
                from = moment(from).format(DATETIME_FORMAT);
                to = moment(to).format(DATETIME_FORMAT);
                if (moment(from).isAfter(to)) {
                    return next(createError(NOT_ACCEPTABLE, 'From date must be before To date'));
                }
            } else {
                from = moment().subtract(7, 'd').format(DATETIME_FORMAT);
                to = moment().format(DATETIME_FORMAT);
            }
            const wellWithReadings = await Well.query()
                .findById(id)
                .where('is_active', true)
                .eager('readings')
                .modifyEager('readings',
                    builder => builder.limit(limit)
                        .andWhereBetween('created_at', [from, to])
                        .skipUndefined()
                )
                .throwIfNotFound();
            res.json(wellWithReadings);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create a new well
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createWell(req, res, next) {
        try {
            const createdWell = await Well.query().insertGraphAndFetch(req.body);
            res.json(createdWell);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create a reading for an existing well
     * POST
     * for example:
     * {
     *     "reading":3.5
     * }
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createWellReading(req, res, next) {
        try {
            const {reading} = req.body;
            const wellId = parseInt(req.params.id, 10);
            const createdReading = await Reading.query()
                .insertGraph({reading: reading / 100 /* cm to m */, well_id: wellId})
                .eager('well')
                .throwIfNotFound();
            res.json(createdReading);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update an existing well by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async updateWellById(req, res, next) {
        try {
            const updatedWell = await Well.query()
                .patchAndFetchById(req.params.id, req.body)
                .where('is_active', true)
                .throwIfNotFound();
            res.json(updatedWell);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Soft Delete an existing Well by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async softDeleteWellById(req, res, next) {
        try {
            await Well.query()
                .patch({is_active: false})
                .findById(req.params.id)
                .throwIfNotFound();
            res.json(null);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = WellController;
