const express = require('express');
const router = express.Router();
const {UserController} = require('../controllers');

/**
 * GET
 */

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

/**
 * POST
 */

router.post('/', UserController.createUser);
router.post('/login', (req, res, next) => {

});

/**
 * PUT
 */

router.put('/:id', UserController.updateUserById);

/**
 * DELETE
 */

router.delete('/:id', UserController.softDeleteUserById);

module.exports = router;
