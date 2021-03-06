const { Well, Reading } = require('../models');

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
            res.json(well);
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
            const { reading } = req.body;
            const wellId = parseInt(req.params.id, 10);
            const createdReading = await Reading.query()
                .insertGraph({ reading: reading / 100 /* cm to m */, well_id: wellId })
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
                .patch({ is_active: false })
                .findById(req.params.id)
                .throwIfNotFound();
            res.json(null);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = WellController;
