const express = require('express');
const router = express.Router();
const {UserController} = require('../controllers');
const {newUserValidation} = require('./middlewares');
/**
 * GET
 */

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

/**
 * POST
 */

router.post('/', newUserValidation, UserController.createUser);
router.post('/login', UserController.login);

/**
 * PUT
 */

router.put('/:id', UserController.updateUserById);

/**
 * DELETE
 */

router.delete('/:id', UserController.softDeleteUserById);

module.exports = router;
