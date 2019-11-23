const express = require('express');
const router = express.Router();
const {WellController} = require('../controllers');
const {isLogged, newWellValidation, readingValidation} = require("./middlewares");
/**
 * GET
 */

router.get('/', isLogged, WellController.getAllWells);
router.get('/:id', isLogged, WellController.getWellById);
router.get('/:id/readings', isLogged, WellController.getWellReadingsById);

/**
 * POST
 */

router.post('/', isLogged, newWellValidation, WellController.createWell);
router.post('/:id/readings', isLogged, readingValidation, WellController.createWellReading);

/**
 * PUT
 */

router.put('/:id', isLogged, WellController.updateWellById);

/**
 * DELETE
 */

router.delete('/:id', isLogged, WellController.softDeleteWellById);

module.exports = router;
