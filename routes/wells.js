const express = require('express');
const router = express.Router();
const {WellController} = require('../controllers');
const {isLogged, isAdmin, newWellValidation, readingValidation} = require("./middlewares");
/**
 * GET
 */

router.get('/', isLogged, WellController.getAllWells);
router.get('/:id', isLogged, WellController.getWellById);
router.get('/:id/readings', isLogged, WellController.getWellReadingsById);

/**
 * POST
 */

router.post('/', isAdmin, newWellValidation, WellController.createWell);
router.post('/:id/readings', isLogged, readingValidation, WellController.createWellReading);

/**
 * PUT
 */

router.put('/:id', isAdmin, WellController.updateWellById);

/**
 * DELETE
 */

router.delete('/:id', isAdmin, WellController.softDeleteWellById);

module.exports = router;
