const express = require('express');

const router = express.Router();
const { WellController } = require('../controllers');
const {
    isLogged,
    isLoggedOrHashSent,
    isAdmin,
    newWellValidation,
    readingValidation,
    idParamNumeric,
    checkValidationErrors,
    errorHandler
} = require('./middlewares');
/**
 * GET
 */

router.get('/', isLogged, WellController.getAllWells);
router.get('/:id', isLogged, idParamNumeric, checkValidationErrors, WellController.getWellById);
router.get(
    '/:id/readings',
    isLogged,
    idParamNumeric,
    checkValidationErrors,
    WellController.getWellReadingsById
);

/**
 * POST
 */

router.post('/', isAdmin, newWellValidation, checkValidationErrors, WellController.createWell);
router.post(
    '/:id/readings',
    isLoggedOrHashSent,
    idParamNumeric,
    readingValidation,
    checkValidationErrors,
    WellController.createWellReading
);

/**
 * PUT
 */

router.put('/:id', isAdmin, idParamNumeric, checkValidationErrors, WellController.updateWellById);

/**
 * DELETE
 */

router.delete(
    '/:id',
    isAdmin,
    idParamNumeric,
    checkValidationErrors,
    WellController.softDeleteWellById
);

/**
 * Router Middlewares
 */
router.use(errorHandler);

module.exports = router;
