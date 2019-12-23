/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
const express = require('express');

const router = express.Router();
const { WellController } = require('../controllers');
const { isLogged,isLoggedOrHashSent, isAdmin, newWellValidation, readingValidation } = require('./middlewares');
/**
 * GET
 */

router.get('/', isLogged, WellController.getAllWells);
router.get('/:id(\d+)', isLogged, WellController.getWellById);
router.get('/:id/readings', isLogged, WellController.getWellReadingsById);

/**
 * POST
 */

router.post('/', isAdmin, newWellValidation, WellController.createWell);
router.post('/:id(\d+)/readings', isLoggedOrHashSent, readingValidation, WellController.createWellReading);

/**
 * PUT
 */

router.put('/:id(\d+)', isAdmin, WellController.updateWellById);

/**
 * DELETE
 */

router.delete('/:id(\d+)', isAdmin, WellController.softDeleteWellById);

module.exports = router;
