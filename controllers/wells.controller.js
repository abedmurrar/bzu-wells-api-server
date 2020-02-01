const moment = require('moment');
const createError = require('http-errors');
const { Well, Reading } = require('../models');
const { OK, CREATED, NO_CONTENT, NOT_ACCEPTABLE } = require('../helpers/http-status-codes');
const { DATETIME_FORMAT } = require('../helpers/constants');

/**
 * Well Controller for handling requests
 * /wells
 */
class WellController {
    /**
     * Get All Wells with their top 100 reading for each well
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
                .eagerAlgorithm(Well.NaiveEagerAlgorithm)
                .eager('readings')
                .modifyEager('readings', builder => {
                    const builderCloneQuery = builder
                        .clone()
                        .select()
                        .from('readings')
                        .orderBy('created_at', 'desc')
                        .limit(100)
                        .as('readings');
                    return builder
                        .select()
                        .from(builderCloneQuery)
                        .orderBy('created_at', 'asc');
                })
                .throwIfNotFound();
            res.status(OK).json(wells);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get a well's readings with date filtering
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getWellById(req, res, next) {
        try {
            let {
                params: { id },
                query: { from = null, to = null, limit = 100 }
            } = req;
            if (from && to) {
                from = moment(from).format(DATETIME_FORMAT);
                to = moment(to).format(DATETIME_FORMAT);
                if (moment(from).isAfter(to)) {
                    return next(createError(NOT_ACCEPTABLE, 'From date must be before To date'));
                }
            } else {
                from = moment()
                    .subtract(7, 'd')
                    .format(DATETIME_FORMAT);
                to = moment().format(DATETIME_FORMAT);
            }
            const wellWithReadings = await Well.query()
                .findById(id)
                .where('is_active', true)
                .eager('readings')
                .modifyEager('readings', builder =>
                    builder
                        .limit(limit)
                        .orderBy('created_at', 'asc')
                        .whereBetween('created_at', [from, to])
                        .skipUndefined()
                )
                .throwIfNotFound();
            res.status(OK).json(wellWithReadings);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create a new well
     * with request body containing
     * {
     *      "name":string,
     *      "depth":number,
     *      "volume":number
     * }
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createWell(req, res, next) {
        try {
            const createdWell = await Well.query().insertGraphAndFetch(req.body);
            res.status(CREATED).json(createdWell);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create a reading for an existing well
     * with request body containing
     * {
     *      "reading":number
     * }
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createWellReading(req, res, next) {
        try {
            const {
                body: { reading },
                params: { id }
            } = req;
            const createdReading = await Reading.query()
                .insertGraph({ reading, well_id: id })
                .eager('well')
                .throwIfNotFound();
            res.status(CREATED).json(createdReading);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update an existing well by id
     * with request body containing at least one of the following
     * {
     *      "name":string,
     *      "depth":number,
     *      "volume":number
     * }
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
            res.status(OK).json(updatedWell);
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
                .patch({ is_active: false })
                .findById(req.params.id)
                .throwIfNotFound();
            res.status(NO_CONTENT).json(null);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = WellController;
