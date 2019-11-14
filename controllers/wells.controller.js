const {Well, Reading} = require('../models');

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
                .where('is_active', true)
                .throwIfNotFound();
            res.json(wells)
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get one well by id
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
                .throwIfNotFound();
            res.json(well)
        } catch (err) {
            next(err);
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
            const wellWithReadings = await Well.query()
                .findById(req.params.id)
                .where('is_active', true)
                .eager('readings')
                .modifyEager('readings', builder => builder.limit(100))
                .throwIfNotFound();
            res.json(wellWithReadings)
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
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createWellReading(req, res, next) {
        try {
            const reading = req.body;
            reading.well_id = req.params.id;
            const createdReading = await Reading.query().insertGraphAndFetch(reading);
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
            const updatedWell = await Well
                .query()
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
            await Well
                .query()
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