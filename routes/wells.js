const express = require('express');
const router = express.Router();
const {WellController} = require('../controllers');

/**
 * GET
 */

router.get('/', WellController.getAllWells);
router.get('/:id', WellController.getWellById);
router.get('/:id/readings', WellController.getWellReadingsById);

/**
 * POST
 */

router.post('/', WellController.createWell);
router.post('/:id/readings', WellController.createWellReading);

/**
 * PUT
 */

router.put('/:id', WellController.updateWellById);

/**
 * DELETE
 */

router.delete('/:id', WellController.softDeleteWellById);

module.exports = router;
