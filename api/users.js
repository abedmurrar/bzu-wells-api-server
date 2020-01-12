/* eslint-disable no-useless-escape */
const express = require('express');

const router = express.Router();
const {UserController} = require('../controllers');
const {isLogged, isAdmin, isNotLogged, isSameUser, newUserValidation} = require('./middlewares');

/**
 * GET
 */

router.get('/', isLogged, UserController.getAllUsers);
router.get('/:id', isLogged, UserController.getUserById);
router.get('/logout', isLogged, UserController.logout);
/**
 * POST
 */

router.post('/', isAdmin, newUserValidation, UserController.createUser);
router.post('/login', /* isNotLogged, */ UserController.login);

/**
 * PUT
 */

router.put('/:id(\d+)', isLogged, isSameUser, UserController.updateUserById);

/**
 * DELETE
 */

router.delete('/:id(\d+)', isAdmin, UserController.softDeleteUserById);

module.exports = router;
